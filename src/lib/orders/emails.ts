import { promises as fs } from "node:fs";
import path from "node:path";
import { site } from "@/config/site";
import { PAYMENT_LABELS, type Order } from "@/lib/checkout";
import { formatDateRange } from "@/lib/delivery";
import { formatINR } from "@/lib/format";
import { EMAIL_PREVIEW_DIR } from "./store";

/*
 * Order emails, sent with Resend (https://resend.com) when RESEND_API_KEY is set.
 * ORDER_EMAIL_FROM sets the sender, e.g. "Art Studio <orders@yourdomain.in>". Until a domain
 * is verified in Resend, its test sender can only deliver to your own Resend account address.
 * Without a key, on your computer, the emails are saved as HTML files in .data/emails/ instead.
 */

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

function headline(order: Order) {
  if (order.status === "paid") return "Payment received. Thank you!";
  if (order.status === "awaiting_whatsapp") return "We have your order request";
  return "Thank you for your order";
}

function intro(order: Order) {
  if (order.status === "awaiting_whatsapp")
    return "To confirm it, send the order to us on WhatsApp if you haven't already. We will reply with the payment details and timing.";
  return "Every piece is handmade, so we start making or packing yours now. We will let you know when it ships.";
}

function addressLines(o: Order) {
  const a = o.address;
  return [a.line1, a.line2, a.landmark ? `Near ${a.landmark}` : null, `${a.city}, ${a.state} ${a.pincode}`].filter(Boolean) as string[];
}

function render(order: Order, forOwner: boolean) {
  const rows = order.items
    .map(
      (i) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #e8e2d9;font-size:14px;line-height:1.5">${esc(i.name)}${i.variant ? `<br><span style="color:#6b6660;font-size:13px">${esc(i.variant)}</span>` : ""}<br><span style="color:#6b6660;font-size:13px">Qty ${i.quantity} × ${formatINR(i.unitPrice)}</span></td>
  <td style="padding:10px 0;border-bottom:1px solid #e8e2d9;font-size:14px;text-align:right;white-space:nowrap;vertical-align:top">${formatINR(i.lineTotal)}</td>
</tr>`,
    )
    .join("");
  const t = order.totals;
  const money = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:3px 0;font-size:14px;${bold ? "font-weight:600" : "color:#6b6660"}">${label}</td><td style="padding:3px 0;font-size:14px;text-align:right;${bold ? "font-weight:600" : ""}">${value}</td></tr>`;
  const totals = [
    money("Subtotal", formatINR(t.subtotal)),
    t.discount ? money(`Coupon ${esc(order.coupon?.code ?? "")}`, `−${formatINR(t.discount)}`) : "",
    money("Shipping", t.shipping ? formatINR(t.shipping) : "Free"),
    t.giftWrap ? money("Gift wrap", formatINR(t.giftWrap)) : "",
    t.codFee ? money("Cash on Delivery fee", formatINR(t.codFee)) : "",
    money("Total", formatINR(t.total), true),
  ].join("");
  const delivery = order.delivery ? formatDateRange(new Date(order.delivery.from), new Date(order.delivery.to)) : null;
  const contact = forOwner
    ? `<p style="margin:0 0 4px;font-size:14px"><strong>${esc(order.customer.name)}</strong></p>
       <p style="margin:0 0 4px;font-size:14px">Phone: <a href="tel:+91${order.customer.phone}">+91 ${order.customer.phone}</a> · <a href="https://wa.me/91${order.customer.phone}">WhatsApp</a></p>
       ${order.customer.email ? `<p style="margin:0 0 4px;font-size:14px">Email: ${esc(order.customer.email)}</p>` : ""}`
    : "";

  return `<!doctype html><html><body style="margin:0;background:#f8f4ed;font-family:Poppins,Helvetica,Arial,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4ed;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;padding:32px 28px">
<tr><td>
  <p style="margin:0;font-size:13px;letter-spacing:4px;font-weight:600">ART STUDIO</p>
  <p style="margin:2px 0 24px;font-size:10px;letter-spacing:3px;color:#8b6b3e">ART WITH SOUL</p>
  <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3">${forOwner ? `New order ${order.id}` : headline(order)}</h1>
  <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#2b2926">${forOwner ? `${PAYMENT_LABELS[order.payment.method]} · ${formatINR(t.total)}` : intro(order)}</p>
  <p style="margin:0 0 16px;font-size:13px;color:#6b6660">Order <strong style="color:#111">${order.id}</strong> · ${PAYMENT_LABELS[order.payment.method]}</p>
  ${contact}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${rows}</table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">${totals}</table>
  <p style="margin:24px 0 4px;font-size:12px;letter-spacing:2px;font-weight:600">DELIVER TO</p>
  <p style="margin:0;font-size:14px;line-height:1.6">${esc(order.customer.name)}<br>${addressLines(order).map(esc).join("<br>")}</p>
  ${delivery ? `<p style="margin:16px 0 0;font-size:14px">Estimated arrival: <strong>${delivery}</strong></p>` : ""}
  ${order.gift.wrap || order.gift.message ? `<p style="margin:16px 0 0;font-size:14px">${order.gift.wrap ? "Gift wrapped. " : ""}${order.gift.message ? `Gift message: “${esc(order.gift.message)}”` : ""}</p>` : ""}
  ${forOwner ? "" : `<p style="margin:28px 0 0;font-size:14px;line-height:1.6">Questions? Message us on WhatsApp at <a href="https://wa.me/${site.contact.whatsappNumber}" style="color:#111">${site.contact.whatsappDisplay}</a> with your order number.</p>`}
</td></tr></table>
<p style="margin:16px 0 0;font-size:12px;color:#6b6660">${site.name} · ${site.tagline} · Handmade in India</p>
</td></tr></table></body></html>`;
}

function plain(order: Order, forOwner: boolean) {
  const t = order.totals;
  return [
    forOwner ? `New order ${order.id}` : `${headline(order)}`,
    `Order ${order.id} · ${PAYMENT_LABELS[order.payment.method]}`,
    "",
    ...order.items.map((i) => `${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.quantity}: ${formatINR(i.lineTotal)}`),
    "",
    `Total: ${formatINR(t.total)}`,
    "",
    "Deliver to:",
    order.customer.name,
    ...addressLines(order),
    forOwner ? `Phone: +91 ${order.customer.phone}` : `Questions? WhatsApp ${site.contact.whatsappDisplay}`,
  ].join("\n");
}

export function orderEmails(order: Order): Email[] {
  const emails: Email[] = [
    {
      to: site.contact.email,
      subject: `New order ${order.id} · ${formatINR(order.totals.total)} · ${PAYMENT_LABELS[order.payment.method]}`,
      html: render(order, true),
      text: plain(order, true),
      replyTo: order.customer.email ?? undefined,
    },
  ];
  if (order.customer.email) {
    emails.push({
      to: order.customer.email,
      subject: order.status === "paid" ? `Payment received for order ${order.id}` : `Your ${site.name} order ${order.id}`,
      html: render(order, false),
      text: plain(order, false),
      replyTo: site.contact.email,
    });
  }
  return emails;
}

async function send(email: Email) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || `${site.name} <onboarding@resend.dev>`,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

/** Sends the owner and customer emails. Never throws: a failed email must not fail the order. */
export async function sendOrderEmails(order: Order) {
  const emails = orderEmails(order);
  if (!emailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`[order ${order.id}] RESEND_API_KEY is not set, so no emails were sent.`);
      return false;
    }
    await fs.mkdir(EMAIL_PREVIEW_DIR, { recursive: true });
    await Promise.all(
      emails.map((e, i) => fs.writeFile(path.join(EMAIL_PREVIEW_DIR, `${order.id}-${i === 0 ? "owner" : "customer"}.html`), e.html, "utf8")),
    );
    console.info(`[order ${order.id}] Email previews saved in .data/emails/ (set RESEND_API_KEY to send them).`);
    return false;
  }
  const results = await Promise.allSettled(emails.map(send));
  results.forEach((r) => r.status === "rejected" && console.error(`[order ${order.id}] email failed:`, r.reason));
  return results.every((r) => r.status === "fulfilled");
}
