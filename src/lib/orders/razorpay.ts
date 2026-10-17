import { createHmac, timingSafeEqual } from "node:crypto";
import type { Order } from "@/lib/checkout";

/*
 * Razorpay, wired but switched off (site.payments.razorpayEnabled = false).
 * Flow: POST /api/orders creates a Razorpay order on the server → the browser opens
 * Razorpay Checkout → POST /api/orders/verify checks the payment signature →
 * /api/razorpay/webhook confirms it again from Razorpay's side.
 *
 * Env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET.
 */

const API = "https://api.razorpay.com/v1";

export function razorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && secret ? { keyId, secret } : null;
}

export interface RazorpayCheckout {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

/** Server-side order creation, so the amount can't be changed in the browser. */
export async function createRazorpayOrder(order: Order): Promise<RazorpayCheckout> {
  const keys = razorpayKeys();
  if (!keys) throw new Error("Razorpay keys are not set");
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keys.keyId}:${keys.secret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: order.totals.total * 100, currency: "INR", receipt: order.id, notes: { orderId: order.id } }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Razorpay order failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { id: string; amount: number; currency: string };
  return { keyId: keys.keyId, orderId: data.id, amount: data.amount, currency: data.currency };
}

function sameHex(expected: string, given: string | null | undefined) {
  if (!given) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(given, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Checkout success: signature = HMAC-SHA256(order_id + "|" + payment_id, key secret). */
export function verifyPaymentSignature(razorpayOrderId: string, paymentId: string, signature: string) {
  const keys = razorpayKeys();
  if (!keys) return false;
  const expected = createHmac("sha256", keys.secret).update(`${razorpayOrderId}|${paymentId}`).digest("hex");
  return sameHex(expected, signature);
}

/** Webhooks: X-Razorpay-Signature = HMAC-SHA256(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return sameHex(expected, signature);
}
