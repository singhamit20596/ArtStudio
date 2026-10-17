/**
 * Coupon codes shown in the Offers drawer and accepted at checkout.
 * Edit this list to add or end an offer (the admin panel takes over in Phase 4).
 *
 * kind "flat": `value` rupees off. kind "percent": `value`% off, capped at `maxDiscount`.
 * `minOrder` is the cart subtotal needed. `expires` is the last valid day (YYYY-MM-DD, India time).
 */
export interface Coupon {
  code: string;
  description: string;
  kind: "flat" | "percent";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  expires?: string;
  /** Sample codes only work in the design preview (`npm run preview`), never on the live site. */
  sample?: boolean;
}

export const coupons: Coupon[] = [
  // TODO (owner): replace these two samples with your real offers. See TODO.md.
  {
    code: "WELCOME10",
    description: "10% off your first order above ₹999, up to ₹300",
    kind: "percent",
    value: 10,
    minOrder: 999,
    maxDiscount: 300,
    sample: true,
  },
  {
    code: "FESTIVE200",
    description: "₹200 off orders above ₹2,499",
    kind: "flat",
    value: 200,
    minOrder: 2499,
    sample: true,
  },
];
