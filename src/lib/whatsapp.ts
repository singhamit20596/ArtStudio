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
};
