import type { Order } from "@/lib/checkout";
import { sendOrderEmails } from "@/lib/orders/emails";
import { verifyWebhookSignature } from "@/lib/orders/razorpay";
import { getOrder, saveOrder } from "@/lib/orders/store";
import { publicOrigin } from "@/lib/orders/origin";

/**
 * Razorpay → us, for payments the browser didn't report (closed tab, lost signal).
 * Set this URL and RAZORPAY_WEBHOOK_SECRET in the Razorpay dashboard, events "payment.captured" and "order.paid".
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("x-razorpay-signature"))) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    payload?: { payment?: { entity?: { id: string; order_id: string; notes?: { orderId?: string } } } };
  };
  if (event.event !== "payment.captured" && event.event !== "order.paid") return Response.json({ ok: true });

  const payment = event.payload?.payment?.entity;
  const orderId = payment?.notes?.orderId;
  const order = orderId ? await getOrder(orderId) : null;
  if (payment && order && order.status !== "paid" && order.payment.razorpayOrderId === payment.order_id) {
    const paid: Order = { ...order, status: "paid", payment: { ...order.payment, razorpayPaymentId: payment.id } };
    paid.emailsSent = await sendOrderEmails(paid, publicOrigin(request));
    await saveOrder(paid);
  } else if (!order) {
    console.info("[razorpay webhook]", event.event, payment?.id, orderId ?? "(no order id)");
  }
  return Response.json({ ok: true });
}
