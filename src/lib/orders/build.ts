import { randomInt } from "node:crypto";
import { site } from "@/config/site";
import { cartCatalog, getProduct } from "@/lib/catalog";
import { validateCheckout, type CheckoutErrors, type CheckoutInput, type Order } from "@/lib/checkout";
import { checkPincode } from "@/lib/delivery";
import { normaliseMobile } from "@/lib/india";
import { priceCart, type CartLine } from "@/lib/pricing";
import { razorpayKeys } from "./razorpay";

export type BuildResult = { ok: true; order: Order } | { ok: false; status: number; message: string; errors?: CheckoutErrors };

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

/** Turns untrusted JSON into a clean CheckoutInput (strings trimmed and capped). */
export function readInput(raw: unknown): CheckoutInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const lines = Array.isArray(r.lines) ? r.lines.slice(0, 50) : [];
  return {
    name: clip(r.name, 80),
    phone: clip(r.phone, 20),
    email: clip(r.email, 120).toLowerCase(),
    pincode: clip(r.pincode, 6),
    line1: clip(r.line1, 120),
    line2: clip(r.line2, 120),
    landmark: clip(r.landmark, 80),
    city: clip(r.city, 60),
    state: clip(r.state, 60),
    giftWrap: r.giftWrap === true,
    giftMessage: typeof r.giftMessage === "string" ? r.giftMessage.trim().slice(0, 400) : "",
    payment: r.payment === "cod" || r.payment === "online" || r.payment === "whatsapp" ? r.payment : ("" as never),
    couponCode: clip(r.couponCode, 30).toUpperCase(),
    lines: lines.map((l: Record<string, unknown>) => ({
      slug: clip(l?.slug, 80),
      quantity: Number.isInteger(l?.quantity) ? (l.quantity as number) : 0,
      variant: clip(l?.variant, 120) || undefined,
    })),
    website: clip(r.website, 200),
  };
}

/** "Letter: M" must name every variant of the product with one of its options. */
function variantOk(slug: string, variant: string | undefined) {
  const product = getProduct(slug);
  if (!product) return false;
  if (product.variants.length === 0) return !variant;
  if (!variant) return false;
  const chosen = Object.fromEntries(variant.split(", ").map((part) => part.split(": ") as [string, string]));
  return product.variants.every((v) => v.options.includes(chosen[v.name]));
}

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** "AS-261017-K7QF": prefix, India date and four random characters. */
export function makeOrderId(now: number, prefix = "AS") {
  const ist = new Date(now + 5.5 * 60 * 60 * 1000).toISOString();
  const date = ist.slice(2, 10).replace(/-/g, "");
  const tail = Array.from({ length: 4 }, () => ID_CHARS[randomInt(ID_CHARS.length)]).join("");
  return `${prefix}-${date}-${tail}`;
}

/** Validates the checkout and prices it from the server's own catalogue. Never trusts browser totals. */
export function buildOrder(input: CheckoutInput, now: number): BuildResult {
  const errors = validateCheckout(input);
  if (Object.keys(errors).length > 0) return { ok: false, status: 400, message: "Please check the highlighted fields.", errors };

  const { payments } = site;
  if (input.payment === "cod" && !payments.cashOnDelivery) return { ok: false, status: 400, message: "Cash on Delivery is not available." };
  if (input.payment === "whatsapp" && !payments.orderOnWhatsApp) return { ok: false, status: 400, message: "Ordering on WhatsApp is not available." };
  if (input.payment === "online" && !(payments.razorpayEnabled && razorpayKeys())) return { ok: false, status: 400, message: `${payments.onlineComingSoonLabel}.` };

  const catalogue = cartCatalog();
  const merged = new Map<string, CartLine>();
  for (const line of input.lines) {
    const product = catalogue.find((p) => p.slug === line.slug);
    if (!product || line.quantity < 1) return { ok: false, status: 409, message: "A piece in your cart is no longer available. Please check your cart." };
    if (!variantOk(line.slug, line.variant)) return { ok: false, status: 409, message: `Please choose the options for ${product.name.split(" | ")[0]} again.` };
    const key = `${line.slug}|${line.variant ?? ""}`;
    merged.set(key, { ...line, quantity: (merged.get(key)?.quantity ?? 0) + line.quantity });
  }
  // Stock is per product, across all its variants.
  const perProduct = new Map<string, number>();
  for (const l of merged.values()) perProduct.set(l.slug, (perProduct.get(l.slug) ?? 0) + l.quantity);
  for (const [slug, qty] of perProduct) {
    const product = catalogue.find((p) => p.slug === slug)!;
    if (qty > product.stock) {
      const name = product.name.split(" | ")[0];
      return { ok: false, status: 409, message: product.stock > 0 ? `Only ${product.stock} of ${name} left. Please lower the quantity.` : `${name} has just sold out.` };
    }
  }

  const totals = priceCart([...merged.values()], catalogue, { couponCode: input.couponCode, giftWrap: input.giftWrap, payment: input.payment, now });
  if (input.couponCode && totals.coupon && !totals.coupon.ok) return { ok: false, status: 409, message: totals.coupon.message };

  const delivery = checkPincode(input.pincode, totals.making, now);
  const email = input.email || null;

  return {
    ok: true,
    order: {
      id: makeOrderId(now),
      createdAt: new Date(now).toISOString(),
      status: input.payment === "online" ? "awaiting_payment" : input.payment === "whatsapp" ? "awaiting_whatsapp" : "placed",
      payment: { method: input.payment },
      customer: { name: input.name, phone: normaliseMobile(input.phone)!, email },
      address: {
        line1: input.line1,
        line2: input.line2,
        landmark: input.landmark || null,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
      },
      gift: { wrap: input.giftWrap && site.giftWrap.enabled, message: input.giftMessage || null },
      items: totals.lines.map((l) => ({
        slug: l.product.slug,
        name: l.product.name,
        variant: l.line.variant,
        image: l.product.image,
        unitPrice: l.product.price,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      })),
      coupon: totals.coupon?.ok ? { code: totals.coupon.code, discount: totals.discount } : null,
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        codFee: totals.codFee,
        giftWrap: totals.giftWrap,
        total: totals.total,
      },
      delivery: delivery.status === "ok" ? { from: delivery.from.toISOString(), to: delivery.to.toISOString() } : null,
    },
  };
}
