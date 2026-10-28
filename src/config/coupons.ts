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
}

/*
 * No offers are running yet. To add one, copy this shape into the list:
 *   { code: "DIWALI10", description: "10% off orders above ₹1,499, up to ₹300",
 *     kind: "percent", value: 10, minOrder: 1499, maxDiscount: 300, expires: "2026-11-05" },
 */
export const coupons: Coupon[] = [];
