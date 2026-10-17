import { site } from "@/config/site";

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
  share: (productName: string, url: string) => `${productName}, handmade by ${site.name}: ${url}`,
};
