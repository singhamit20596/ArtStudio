import { site } from "@/config/site";
import { INDIAN_STATES, isPincode, normaliseMobile } from "./india";
import type { CartLine, LineOptions, PaymentMethod } from "./pricing";

/** What the checkout form sends to POST /api/orders. */
export interface CheckoutInput {
  name: string;
  phone: string;
  email: string;
  pincode: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  giftWrap: boolean;
  giftMessage: string;
  payment: PaymentMethod;
  couponCode: string;
  lines: CartLine[];
  /** Honeypot: real visitors never fill this hidden field. */
  website?: string;
}

export type CheckoutField = Exclude<keyof CheckoutInput, "lines" | "website" | "giftWrap" | "couponCode">;
export type CheckoutErrors = Partial<Record<CheckoutField | "lines", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Same rules in the browser (instant feedback) and on the server (the real check). */
export function validateCheckout(input: CheckoutInput): CheckoutErrors {
  const e: CheckoutErrors = {};
  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (text(input.name).length < 2) e.name = "Please enter your full name.";
  if (!normaliseMobile(text(input.phone))) e.phone = "Please enter a 10-digit mobile number.";
  if (text(input.email) && !EMAIL.test(text(input.email))) e.email = "Please check your email address.";
  if (!isPincode(text(input.pincode))) e.pincode = "Please enter a valid 6-digit pincode.";
  if (text(input.line1).length < 3) e.line1 = "Please enter your house or flat number and building.";
  if (text(input.line2).length < 3) e.line2 = "Please enter the street or area.";
  if (text(input.city).length < 2) e.city = "Please enter your city or town.";
  if (!INDIAN_STATES.includes(text(input.state))) e.state = "Please choose your state.";
  if (text(input.giftMessage).length > site.giftWrap.messageMaxLength) e.giftMessage = `Please keep the message under ${site.giftWrap.messageMaxLength} characters.`;
  if (!["cod", "online", "whatsapp", "upi"].includes(input.payment)) e.payment = "Please choose how to pay.";
  if (!Array.isArray(input.lines) || input.lines.length === 0) e.lines = "Your cart is empty.";
  return e;
}

/** Details the customer adds after ordering (template, name plate, photos, colours). */
export interface Personalisation {
  template: string;
  rank: string;
  name: string;
  unit: string | null;
  years: string | null;
  background: string;
  notes: string | null;
  /** Date the piece is needed by (YYYY-MM-DD), if any. */
  neededBy: string | null;
  /** Storage keys of the uploaded photos (bucket "uploads"). */
  files: string[];
  submittedAt: string;
}

export interface OrderItem {
  slug: string;
  name: string;
  /** Product code, e.g. "RTBF2424" (missing on orders placed before codes existed). */
  code?: string | null;
  variant?: string;
  options?: LineOptions;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  /** Filled in after checkout on /personalise for made-to-order pieces. */
  personalisation?: Personalisation | null;
}

/** awaiting_payment: UPI or Razorpay not paid yet. payment_claimed: customer says they paid by UPI. */
export type OrderStatus = "placed" | "awaiting_payment" | "payment_claimed" | "paid" | "awaiting_whatsapp";

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  payment: {
    method: PaymentMethod;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    /** UPI transaction reference the customer entered after paying. */
    upiRef?: string;
    claimedAt?: string;
  };
  /** Secret part of the personalisation and photo links. Never shown to anyone but the buyer and the studio. */
  token?: string;
  customer: { name: string; phone: string; email: string | null };
  address: { line1: string; line2: string; landmark: string | null; city: string; state: string; pincode: string };
  gift: { wrap: boolean; message: string | null };
  items: OrderItem[];
  coupon: { code: string; discount: number } | null;
  totals: { subtotal: number; discount: number; shipping: number; codFee: number; giftWrap: number; total: number };
  /** Estimated delivery window, ISO dates. */
  delivery: { from: string; to: string } | null;
  emailsSent?: boolean;
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  online: "Paid online (Razorpay)",
  whatsapp: "Order on WhatsApp",
  upi: "UPI",
};

/** Items that need personalising after checkout (made-to-order pieces with sizes). */
export const needsPersonalising = (item: Pick<OrderItem, "options">) => Boolean(item.options?.size);
