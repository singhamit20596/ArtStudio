import { buildOrder, readInput } from "@/lib/orders/build";
import { site } from "@/config/site";
import { needsPersonalising } from "@/lib/checkout";
import { emailConfigured, personaliseUrl, sendOrderEmails } from "@/lib/orders/emails";
import { createRazorpayOrder } from "@/lib/orders/razorpay";
import { saveOrder } from "@/lib/orders/store";
import { isPreview } from "@/lib/preview";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";

/** Places an order from the checkout form. Prices, stock and coupons are checked here, not in the browser. */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 400 });
  }

  const input = readInput(raw);
  // Bots fill the hidden "website" field; people never see it.
  if (input.website) return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 400 });

  const result = buildOrder(input, Date.now());
  if (!result.ok) return Response.json(result, { status: result.status });
  const order = result.order;

  // Orders are stored, but until there is an admin page the studio only hears about them by email.
  // The hosted preview accepts test orders anyway; its checkout says so.
  if (process.env.NODE_ENV === "production" && !emailConfigured() && order.payment.method !== "whatsapp" && !isPreview) {
    return Response.json(
      { ok: false, message: "Online ordering isn't switched on yet. Please choose “Order on WhatsApp” instead." },
      { status: 503 },
    );
  }

  if (order.payment.method === "online") {
    try {
      const razorpay = await createRazorpayOrder(order);
      order.payment.razorpayOrderId = razorpay.orderId;
      await saveOrder(order);
      return Response.json({ ok: true, order, razorpay });
    } catch (error) {
      console.error(`[order ${order.id}]`, error);
      return Response.json({ ok: false, message: "Online payment couldn't start. Please try again or choose Cash on Delivery." }, { status: 502 });
    }
  }

  const origin = site.url || new URL(request.url).origin;
  await saveOrder(order);
  order.emailsSent = await sendOrderEmails(order, origin);
  await saveOrder(order);
  return Response.json({
    ok: true,
    order,
    personaliseUrl: order.items.some(needsPersonalising) ? personaliseUrl(order, origin) : undefined,
    whatsappUrl: order.payment.method === "whatsapp" ? whatsappLink(orderMessage(order)) : undefined,
  });
}
