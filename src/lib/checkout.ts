import { site } from "@/config/site";
import { INDIAN_STATES, isPincode, normaliseMobile } from "./india";
import type { CartLine, PaymentMethod } from "./pricing";

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
  if (!["cod", "online", "whatsapp"].includes(input.payment)) e.payment = "Please choose how to pay.";
  if (!Array.isArray(input.lines) || input.lines.length === 0) e.lines = "Your cart is empty.";
  return e;
}

export interface OrderItem {
  slug: string;
  name: string;
  variant?: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type OrderStatus = "placed" | "awaiting_payment" | "paid" | "awaiting_whatsapp";

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  payment: {
    method: PaymentMethod;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
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
};
