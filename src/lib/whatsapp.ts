import { site } from "@/config/site";
import type { Order } from "./checkout";
import { formatINR } from "./format";

/** wa.me link that opens a chat with the studio, message pre-filled. */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const messages = {
  general: "Hi! I have a question about Art Studio.",
  bulk: "Hi! I'd like to enquire about bulk or corporate gifting.",
  custom: (productName: string, url?: string) =>
    url ? `Hi! I'd like a custom ${productName}. Link: ${url}` : `Hi! I'd like a custom ${productName}.`,
  /** "Hi! I'd like to order Botanical Initial Keychain (Letter: A) × 2, ₹498. Link: …" */
  order: (item: string, quantity: number, total: string | null, url?: string) =>
    `Hi! I'd like to order ${item} × ${quantity}${total ? `, ${total}` : ""}.${url ? ` Link: ${url}` : ""}`,
  /** A whole cart, one line per item. */
  cart: (items: { name: string; variant?: string; code?: string | null; quantity: number; total: string }[], subtotal: string) =>
    [
      "Hi! I'd like to order:",
      ...items.map((i) => `• ${i.name}${i.variant ? ` (${i.variant})` : ""}${i.code ? ` [${i.code}]` : ""} × ${i.quantity}: ${i.total}`),
      `Subtotal: ${subtotal}`,
    ].join("\n"),
  share: (productName: string, url: string) => `${productName}, handmade by ${site.name}: ${url}`,
};

/** The message a checkout "Order on WhatsApp" sends: order number, items, total and address. */
export function orderMessage(order: Order) {
  const a = order.address;
  return [
    `Hi! I'd like to confirm my order ${order.id}:`,
    ...order.items.map((i) => `• ${i.name.split(" | ")[0]}${i.variant ? ` (${i.variant})` : ""}${i.code ? ` [${i.code}]` : ""} × ${i.quantity}: ${formatINR(i.lineTotal)}`),
    `Total: ${formatINR(order.totals.total)}${order.totals.shipping ? ` (incl. ${formatINR(order.totals.shipping)} shipping)` : " (free shipping)"}`,
    order.gift.wrap ? "Gift wrapped, please." : null,
    `Name: ${order.customer.name}`,
    `Deliver to: ${[a.line1, a.line2, a.landmark, a.city, a.state].filter(Boolean).join(", ")} ${a.pincode}`,
  ]
    .filter(Boolean)
    .join("\n");
}
