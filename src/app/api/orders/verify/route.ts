import { site } from "@/config/site";
import type { Order } from "@/lib/checkout";
import { sendOrderEmails } from "@/lib/orders/emails";
import { verifyPaymentSignature } from "@/lib/orders/razorpay";
import { getOrder, saveOrder } from "@/lib/orders/store";

/** Called by the checkout after Razorpay reports success: checks the signature, marks the order paid. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, string | undefined>;
  const { orderId, razorpay_order_id: rzpOrder, razorpay_payment_id: rzpPayment, razorpay_signature: signature } = body;
  if (!orderId || !rzpOrder || !rzpPayment || !signature || !verifyPaymentSignature(rzpOrder, rzpPayment, signature)) {
    return Response.json({ ok: false, message: "We couldn't confirm the payment. If money was taken, message us with your order number." }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (order && order.payment.razorpayOrderId === rzpOrder && order.status !== "paid") {
    const paid: Order = { ...order, status: "paid", payment: { ...order.payment, razorpayPaymentId: rzpPayment } };
    paid.emailsSent = await sendOrderEmails(paid, site.url || new URL(request.url).origin);
    await saveOrder(paid);
    return Response.json({ ok: true, order: paid });
  }
  return Response.json({ ok: true, order });
}
