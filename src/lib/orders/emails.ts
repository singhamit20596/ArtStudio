import { promises as fs } from "node:fs";
import path from "node:path";
import { site } from "@/config/site";
import { backgrounds, templates } from "@/config/tribute";
import { needsPersonalising, PAYMENT_LABELS, type Order } from "@/lib/checkout";
import { fileUrl } from "@/lib/personalise";
import { formatDateRange } from "@/lib/delivery";
import { formatDate, formatINR } from "@/lib/format";
import { EMAIL_PREVIEW_DIR } from "./store";

/*
 * Order emails, sent with Resend (https://resend.com) when RESEND_API_KEY is set.
 * ORDER_EMAIL_FROM sets the sender, e.g. "Art Studio <orders@yourdomain.in>". Until a domain
 * is verified in Resend, its test sender can only deliver to your own Resend account address.
 * Without a key, on your computer, the emails are saved as HTML files in .data/emails/ instead.
 */

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

function headline(order: Order) {
  if (order.status === "paid") return "Payment received. Thank you!";
  if (order.status === "payment_claimed") return "Thank you, we are checking your payment";
  if (order.status === "awaiting_payment" && order.payment.method === "upi") return "Thank you for your order";
  if (order.status === "awaiting_whatsapp") return "We have your order request";
  return "Thank you for your order";
}

function intro(order: Order) {
  if (order.status === "awaiting_payment" && order.payment.method === "upi")
    return "Please finish paying by UPI from the order page if you haven't already. We start making your piece once the payment arrives.";
  if (order.status === "awaiting_whatsapp")
    return "To confirm it, send the order to us on WhatsApp if you haven't already. We will reply with the payment details and timing.";
  return "Every piece is handmade, so we start making or packing yours now. We will let you know when it ships.";
}

function addressLines(o: Order) {
  const a = o.address;
  return [a.line1, a.line2, a.landmark ? `Near ${a.landmark}` : null, `${a.city}, ${a.state} ${a.pincode}`].filter(Boolean) as string[];
}

function render(order: Order, forOwner: boolean, origin: string) {
  const rows = order.items
    .map(
      (i) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #e7ddd1;font-size:14px;line-height:1.5">${esc(i.name)}${i.variant ? `<br><span style="color:#76655a;font-size:13px">${esc(i.variant)}</span>` : ""}<br><span style="color:#76655a;font-size:13px">Qty ${i.quantity} × ${formatINR(i.unitPrice)}</span></td>
  <td style="padding:10px 0;border-bottom:1px solid #e7ddd1;font-size:14px;text-align:right;white-space:nowrap;vertical-align:top">${formatINR(i.lineTotal)}</td>
</tr>`,
    )
    .join("");
  const t = order.totals;
  const money = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:3px 0;font-size:14px;${bold ? "font-weight:600" : "color:#76655a"}">${label}</td><td style="padding:3px 0;font-size:14px;text-align:right;${bold ? "font-weight:600" : ""}">${value}</td></tr>`;
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

  return `<!doctype html><html><body style="margin:0;background:#faf6ef;font-family:Poppins,Helvetica,Arial,sans-serif;color:#33241a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ef;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;padding:32px 28px">
<tr><td>
  <p style="margin:0;font-size:13px;letter-spacing:4px;font-weight:600;color:#5a3e2b">ART STUDIO</p>
  <p style="margin:2px 0 24px;font-size:10px;letter-spacing:3px;color:#9a5b0e">ART WITH SOUL</p>
  <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3">${forOwner ? `New order ${order.id}` : headline(order)}</h1>
  <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#33241a">${forOwner ? `${PAYMENT_LABELS[order.payment.method]} · ${formatINR(t.total)}` : intro(order)}</p>
  <p style="margin:0 0 16px;font-size:13px;color:#76655a">Order <strong style="color:#33241a">${order.id}</strong> · ${PAYMENT_LABELS[order.payment.method]}</p>
  ${contact}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${rows}</table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">${totals}</table>
  <p style="margin:24px 0 4px;font-size:12px;letter-spacing:2px;font-weight:600">DELIVER TO</p>
  <p style="margin:0;font-size:14px;line-height:1.6">${esc(order.customer.name)}<br>${addressLines(order).map(esc).join("<br>")}</p>
  ${delivery ? `<p style="margin:16px 0 0;font-size:14px">Estimated arrival: <strong>${delivery}</strong></p>` : ""}
  ${order.gift.wrap || order.gift.message ? `<p style="margin:16px 0 0;font-size:14px">${order.gift.wrap ? "Gift wrapped. " : ""}${order.gift.message ? `Gift message: “${esc(order.gift.message)}”` : ""}</p>` : ""}
  ${personaliseBlock(order, forOwner, origin)}
  ${forOwner ? "" : `<p style="margin:28px 0 0;font-size:14px;line-height:1.6">Questions? Message us on WhatsApp at <a href="https://wa.me/${site.contact.whatsappNumber}" style="color:#33241a">${site.contact.whatsappDisplay}</a> with your order number.</p>`}
</td></tr></table>
<p style="margin:16px 0 0;font-size:12px;color:#76655a">${site.name} · ${site.tagline} · Handmade in India</p>
</td></tr></table></body></html>`;
}

/** The link where the customer adds the name, rank, photos, template and colours. */
export const personaliseUrl = (order: Order, origin: string) => `${origin}/personalise/${order.id}?t=${order.token}`;

function personaliseBlock(order: Order, forOwner: boolean, origin: string) {
  if (!order.token || !order.items.some(needsPersonalising)) return "";
  const url = personaliseUrl(order, origin);
  if (!forOwner)
    return `<p style="margin:24px 0 0;font-size:14px;line-height:1.6"><strong>Next: personalise your frame.</strong> Add the name, rank, photos, template and background colour here:<br><a href="${url}" style="color:#33241a">${url}</a></p>`;
  const toCustomer = `https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(`Hi ${order.customer.name.split(" ")[0]}! Thank you for your order ${order.id}. Please add the name, rank, photos and colours for your frame here: ${url}`)}`;
  return `<p style="margin:24px 0 0;font-size:14px;line-height:1.6">Personalisation link: <a href="${url}" style="color:#33241a">${url}</a><br><a href="${toCustomer}" style="color:#33241a;font-weight:600">Send it to the customer on WhatsApp</a></p>`;
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

export function orderEmails(order: Order, origin: string): Email[] {
  const emails: Email[] = [
    {
      to: site.contact.email,
      subject: `New order ${order.id} · ${formatINR(order.totals.total)} · ${PAYMENT_LABELS[order.payment.method]}`,
      html: render(order, true, origin),
      text: plain(order, true),
      replyTo: order.customer.email ?? undefined,
    },
  ];
  if (order.customer.email) {
    emails.push({
      to: order.customer.email,
      subject: order.status === "paid" ? `Payment received for order ${order.id}` : `Your ${site.name} order ${order.id}`,
      html: render(order, false, origin),
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

/**
 * Sends a set of emails (owner first, then customer). Never throws: a failed email must not
 * fail the order or request. Without RESEND_API_KEY, on your computer, saves them as HTML files.
 */
export async function deliverEmails(id: string, emails: Email[]) {
  if (!emailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`[${id}] RESEND_API_KEY is not set, so no emails were sent.`);
      return false;
    }
    await fs.mkdir(EMAIL_PREVIEW_DIR, { recursive: true });
    await Promise.all(emails.map((e, i) => fs.writeFile(path.join(EMAIL_PREVIEW_DIR, `${id}-${i === 0 ? "owner" : "customer"}.html`), e.html, "utf8")));
    console.info(`[${id}] Email previews saved in .data/emails/ (set RESEND_API_KEY to send them).`);
    return false;
  }
  const results = await Promise.allSettled(emails.map(send));
  results.forEach((r) => r.status === "rejected" && console.error(`[${id}] email failed:`, r.reason));
  return results.every((r) => r.status === "fulfilled");
}

export const sendOrderEmails = (order: Order, origin: string) => deliverEmails(order.id, orderEmails(order, origin));

/** Tells the studio a customer says they paid by UPI, so it can check the bank app. */
export function paymentClaimEmail(order: Order): Email {
  const ref = order.payment.upiRef ?? "(not given)";
  return {
    to: site.contact.email,
    subject: `UPI payment to check: ${order.id} · ${formatINR(order.totals.total)}`,
    html: `<p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1e140d">${esc(order.customer.name)} says they paid <strong>${formatINR(order.totals.total)}</strong> by UPI for order <strong>${order.id}</strong>.<br>UPI reference: <strong>${esc(ref)}</strong><br>Phone: +91 ${order.customer.phone}<br><br>Please check your bank or UPI app and confirm the payment with the customer.</p>`,
    text: `${order.customer.name} says they paid ${formatINR(order.totals.total)} by UPI for order ${order.id}. UPI reference: ${ref}. Phone: +91 ${order.customer.phone}.`,
    replyTo: order.customer.email ?? undefined,
  };
}

/** Tells the studio a customer has personalised a tribute: details plus links to every photo. */
export function personalisationEmail(order: Order, itemIndex: number, origin: string): Email {
  const item = order.items[itemIndex];
  const p = item.personalisation!;
  const template = templates[item.slug]?.find((t) => t.id === p.template)?.name ?? p.template;
  const colour = backgrounds.find((b) => b.id === p.background)?.label ?? p.background;
  const rows: [string, string | null][] = [
    ["Tribute", `${item.name}${item.variant ? ` (${item.variant})` : ""}`],
    ["Design", template],
    ["Name plate", `${p.rank} ${p.name}`],
    ["Unit", p.unit],
    ["Years of service", p.years],
    ["Background", colour],
    ["Needed by", p.neededBy ? formatDate(p.neededBy) : null],
    ["Notes", p.notes],
  ];
  const links = p.files.map((key, i) => `<a href="${origin}${fileUrl(key, order.token ?? "")}" style="color:#33241a">Photo ${i + 1}</a>`).join(" · ");
  const table = rows
    .filter((r): r is [string, string] => Boolean(r[1]))
    .map(([k, v]) => `<tr><td style="padding:5px 12px 5px 0;color:#76655a;font-size:13px;vertical-align:top">${k}</td><td style="padding:5px 0;font-size:14px">${esc(v)}</td></tr>`)
    .join("");
  return {
    to: site.contact.email,
    subject: `Personalised: ${order.id} · ${p.rank} ${p.name}`,
    html: `<div style="font-family:Helvetica,Arial,sans-serif;color:#1e140d"><p style="font-size:16px;font-weight:600">${esc(order.customer.name)} has personalised order ${order.id}</p><table role="presentation">${table}</table><p style="font-size:14px;margin-top:16px">${p.files.length} photo${p.files.length === 1 ? "" : "s"}: ${links}</p><p style="font-size:13px;color:#76655a">Phone +91 ${order.customer.phone} · <a href="https://wa.me/91${order.customer.phone}" style="color:#33241a">WhatsApp</a></p></div>`,
    text: [`${order.customer.name} has personalised order ${order.id}`, ...rows.filter((r) => r[1]).map(([k, v]) => `${k}: ${v}`), ...p.files.map((key, i) => `Photo ${i + 1}: ${origin}${fileUrl(key, order.token ?? "")}`)].join("\n"),
    replyTo: order.customer.email ?? undefined,
  };
}