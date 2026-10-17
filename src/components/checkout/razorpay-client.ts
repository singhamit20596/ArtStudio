"use client";

import { site } from "@/config/site";
import type { Order } from "@/lib/checkout";

/* Opens Razorpay Checkout for an order the server already created (only when payments.razorpayEnabled). */

interface RazorpayCheckout {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: () => void) => void };
  }
}

function loadScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function payWithRazorpay(order: Order, rzp: RazorpayCheckout): Promise<{ ok: true; order: Order } | { ok: false; message: string }> {
  if (!(await loadScript()) || !window.Razorpay) return { ok: false, message: "Online payment couldn't load. Please try again or choose Cash on Delivery." };

  return new Promise((resolve) => {
    const checkout = new window.Razorpay!({
      key: rzp.keyId,
      amount: rzp.amount,
      currency: rzp.currency,
      order_id: rzp.orderId,
      name: site.name,
      description: `Order ${order.id}`,
      prefill: { name: order.customer.name, email: order.customer.email ?? undefined, contact: `+91${order.customer.phone}` },
      notes: { orderId: order.id },
      theme: { color: "#111111" },
      handler: async (response: RazorpaySuccess) => {
        try {
          const res = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.id, ...response }),
          });
          const data = await res.json();
          resolve(data.ok ? { ok: true, order: data.order ?? { ...order, status: "paid" } } : { ok: false, message: data.message });
        } catch {
          resolve({ ok: false, message: `We couldn't confirm the payment. If money was taken, message us with order ${order.id}.` });
        }
      },
      modal: { ondismiss: () => resolve({ ok: false, message: "Payment was cancelled. You can try again or choose another way to pay." }) },
    });
    checkout.on("payment.failed", () => resolve({ ok: false, message: "The payment didn't go through. Please try again or choose Cash on Delivery." }));
    checkout.open();
  });
}
