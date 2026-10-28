import { deliverEmails, paymentClaimEmail } from "@/lib/orders/emails";
import { getOrderWithToken, saveOrder } from "@/lib/orders/store";
import { cleanUtr, isUtr } from "@/lib/upi";

/**
 * The customer says they paid by UPI. There is no gateway to confirm it, so the order is
 * marked "payment_claimed" and the studio is emailed to check its bank app.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/orders/[id]/paid">) {
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as { t?: string; ref?: string };
  const order = await getOrderWithToken(id, body.t ?? null);
  if (!order) return Response.json({ ok: false, message: "We couldn't find that order." }, { status: 404 });
  if (order.payment.method !== "upi") return Response.json({ ok: false, message: "This order isn't paid by UPI." }, { status: 400 });

  const ref = typeof body.ref === "string" ? cleanUtr(body.ref) : "";
  if (ref && !isUtr(ref)) return Response.json({ ok: false, message: "The UPI reference is the 12-digit number in your app's payment details." }, { status: 400 });
  if (order.status === "awaiting_payment") {
    order.status = "payment_claimed";
    order.payment.upiRef = ref || undefined;
    order.payment.claimedAt = new Date().toISOString();
    await saveOrder(order);
    await deliverEmails(`${order.id}-paid`, [paymentClaimEmail(order)]);
  }
  return Response.json({ ok: true, order });
}
