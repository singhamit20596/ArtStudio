import { site } from "@/config/site";
import { isPreview } from "./preview";

/*
 * UPI payments without a gateway: a upi:// link (phones) or QR code (computers) that opens
 * GPay, PhonePe, Paytm or any UPI app with the studio's UPI ID and the order amount filled in.
 * The customer then tells us the transaction reference and the studio confirms it.
 */

/** Shown only in the preview when no real UPI ID is set. Not a real UPI handle, so nothing can be paid to it. */
export const PREVIEW_UPI_ID = "set-your-upi-id@placeholder";

export const upiId = () => site.payments.upi.id || (isPreview ? PREVIEW_UPI_ID : "");
export const upiAvailable = () => Boolean(upiId());
export const isPreviewUpi = () => upiId() === PREVIEW_UPI_ID;

/** upi://pay link for one order. */
export function upiLink(amount: number, orderId: string) {
  const params: [string, string][] = [
    ["pa", upiId()],
    ["pn", site.payments.upi.payeeName],
    ["am", amount.toFixed(2)],
    ["cu", "INR"],
    ["tn", `Order ${orderId}`],
    ["tr", orderId],
  ];
  return `upi://pay?${params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")}`;
}

/** UPI reference numbers (UTR / RRN) are 12 digits in every UPI app. Spaces are ignored. */
export function cleanUtr(value: string) {
  return value.replace(/\s/g, "");
}
export const isUtr = (value: string) => /^\d{12}$/.test(cleanUtr(value));
