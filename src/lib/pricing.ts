import { site } from "@/config/site";
import { evaluateCoupon, type CouponResult } from "./coupons";
import type { DayRange } from "./types";

/*
 * Cart maths shared by the cart drawer, the checkout page and the order API.
 * The server always recomputes from its own catalogue; browser totals are a preview.
 */

export interface CartLine {
  slug: string;
  quantity: number;
  /** Chosen options, e.g. "Letter: M". */
  variant?: string;
}

/** What the cart needs to know about a ready-made product. */
export interface CartProduct {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  makingTimeDays: DayRange;
}

export type PaymentMethod = "cod" | "online" | "whatsapp";

export const MAX_QTY = 10;

export const lineKey = (l: Pick<CartLine, "slug" | "variant">) => `${l.slug}|${l.variant ?? ""}`;

/** Highest quantity allowed for a product: its stock, up to MAX_QTY. */
export const maxQuantity = (p: Pick<CartProduct, "stock">) => Math.max(0, Math.min(p.stock, MAX_QTY));

export interface PricedLine {
  key: string;
  line: CartLine;
  product: CartProduct;
  quantity: number;
  lineTotal: number;
}

export interface Totals {
  lines: PricedLine[];
  /** Lines whose product is gone or sold out. */
  unavailable: CartLine[];
  count: number;
  subtotal: number;
  coupon: CouponResult | null;
  discount: number;
  shipping: number;
  codFee: number;
  giftWrap: number;
  total: number;
  /** ₹ still needed for free shipping (0 once reached). */
  freeShippingRemaining: number;
  /** Longest making time in the cart, for delivery estimates. */
  making: DayRange;
}

interface PriceOptions {
  couponCode?: string | null;
  giftWrap?: boolean;
  payment?: PaymentMethod;
  now?: number;
}

export function priceCart(cart: CartLine[], catalogue: CartProduct[], opts: PriceOptions = {}): Totals {
  const bySlug = new Map(catalogue.map((p) => [p.slug, p]));
  const lines: PricedLine[] = [];
  const unavailable: CartLine[] = [];

  for (const line of cart) {
    const product = bySlug.get(line.slug);
    const max = product ? maxQuantity(product) : 0;
    if (!product || max === 0) {
      unavailable.push(line);
      continue;
    }
    const quantity = Math.max(1, Math.min(Math.floor(line.quantity), max));
    lines.push({ key: lineKey(line), line, product, quantity, lineTotal: product.price * quantity });
  }

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const coupon = opts.couponCode && subtotal > 0 ? evaluateCoupon(opts.couponCode, subtotal, opts.now) : null;
  const discount = coupon?.ok ? coupon.discount : 0;

  // Free shipping is judged on the cart value before any coupon.
  const { freeShippingThreshold, flatFee } = site.shipping;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : flatFee;
  const codFee = opts.payment === "cod" && subtotal > 0 ? site.payments.codFee : 0;
  const giftWrap = opts.giftWrap && site.giftWrap.enabled && subtotal > 0 ? site.giftWrap.price : 0;

  const making = lines.reduce<DayRange>(
    (m, l) => ({ min: Math.max(m.min, l.product.makingTimeDays.min), max: Math.max(m.max, l.product.makingTimeDays.max) }),
    { min: 0, max: 0 },
  );

  return {
    lines,
    unavailable,
    count,
    subtotal,
    coupon,
    discount,
    shipping,
    codFee,
    giftWrap,
    total: subtotal - discount + shipping + codFee + giftWrap,
    freeShippingRemaining: subtotal === 0 ? freeShippingThreshold : Math.max(0, freeShippingThreshold - subtotal),
    making,
  };
}
