import { coupons, type Coupon } from "@/config/coupons";
import { formatINR } from "./format";
import { isPreview } from "./preview";

export interface CouponResult {
  code: string;
  ok: boolean;
  discount: number;
  message: string;
}

/** Codes a shopper can use right now (sample codes only in the preview). */
export function availableCoupons(): Coupon[] {
  return coupons.filter((c) => !c.sample || isPreview);
}

/** "2026-10-31" → true once that day is over in India. */
function expired(c: Coupon, now: number) {
  if (!c.expires) return false;
  const endOfDayIST = Date.parse(`${c.expires}T23:59:59+05:30`);
  return Number.isFinite(endOfDayIST) && now > endOfDayIST;
}

/**
 * Checks a code against the cart subtotal. `now` is optional so the browser can
 * preview a code without reading the clock; the server always passes it.
 */
export function evaluateCoupon(rawCode: string, subtotal: number, now?: number): CouponResult {
  const code = rawCode.trim().toUpperCase();
  const coupon = availableCoupons().find((c) => c.code === code);
  if (!coupon) return { code, ok: false, discount: 0, message: "This code isn't valid." };
  if (now != null && expired(coupon, now)) return { code, ok: false, discount: 0, message: "This code has expired." };
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return { code, ok: false, discount: 0, message: `Add ${formatINR(coupon.minOrder - subtotal)} more to use ${code}.` };
  }
  let discount = coupon.kind === "flat" ? coupon.value : Math.round((subtotal * coupon.value) / 100);
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);
  return { code, ok: true, discount, message: `${code} applied. You save ${formatINR(discount)}.` };
}
