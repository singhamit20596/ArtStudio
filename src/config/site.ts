import { extraPrices } from "./prices";
/**
 * Business settings. Change values here; every page reads from this file.
 * Items still marked TODO are listed in TODO.md.
 */
export const site = {
  name: "Art Studio",
  tagline: "Art with Soul",
  bio: "Art that tells a story. Handcrafted with love.",
  description:
    "Handmade tribute frames for retiring defence personnel, built around their own medals, badges and photograph. Delivered across India.",
  /** TODO: set NEXT_PUBLIC_SITE_URL once the domain is bought. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  locale: "en-IN",
  currency: "INR",

  contact: {
    whatsappNumber: "919042918049", // international format, no "+" or spaces
    whatsappDisplay: "+91 90429 18049",
    email: "sandeep698146@gmail.com",
    hours: null as string | null, // TODO: e.g. "Mon–Sat, 10am–7pm IST"
  },

  social: {
    instagramUrl: "https://www.instagram.com/theartstudioo2026/",
    instagramHandle: "@theartstudioo2026",
  },

  shipping: {
    // Prices live in src/config/prices.ts.
    freeShippingThreshold: extraPrices.freeShippingFrom.amount ?? 0,
    flatFee: extraPrices.shippingFee.amount ?? 0,
    panIndia: true,
    /**
     * TODO (placeholder): courier days once a piece is ready, used by the pincode checker
     * on product pages. Replace when the courier partner and delivery times are confirmed.
     */
    courierDays: { min: 3, max: 7 },
  },

  payments: {
    cashOnDelivery: true,
    /** Extra charge for Cash on Delivery (src/config/prices.ts); 0 means no fee. */
    codFee: extraPrices.codFee.amount ?? 0,
    orderOnWhatsApp: true,
    /**
     * Razorpay is wired (src/lib/orders/razorpay.ts) but stays off until the account is ready
     * and the order database (Phase 4) is in place. Turning it on also needs the RAZORPAY_* env vars.
     */
    razorpayEnabled: false,
    onlineComingSoonLabel: "Online payments coming soon",
    /**
     * Pay by UPI link / QR straight to the studio's UPI ID (no gateway; the studio checks the
     * money arrived). TODO (owner): set your UPI ID, e.g. "artstudio@okhdfcbank".
     */
    upi: {
      id: "",
      payeeName: "Art Studio",
    },
  },

  giftWrap: {
    enabled: true,
    /** Gift-wrap charge per order (src/config/prices.ts). */
    price: extraPrices.giftWrap.amount ?? 0,
    messageMaxLength: 200,
  },

  /** Rotating messages in the announcement bar (keep exactly four). */
  announcements: [
    "Tribute frames for retiring defence personnel",
    "Made by hand, around their own medals",
    "Request online, plan it with us on WhatsApp",
    "Pan India delivery",
  ],

  hero: {
    /** Drop a muted, text-free reel at /public/hero/hero.mp4 and set this to "/hero/hero.mp4". */
    video: null as string | null,
    poster: "/products/marble-noir-wall-clock/1.jpg",
    panels: [
      { src: "/products/lal-pooja-thali/1.jpg", alt: "Red resin pooja thali with gold leaf and two gold katoris" },
      { src: "/products/marble-noir-wall-clock/1.jpg", alt: "White marble resin wall clock with a black and gold geode edge" },
      { src: "/products/botanical-initial-keychain/1.jpg", alt: "Clear resin initial keychains with pressed flowers" },
    ],
  },
} as const;

export type Site = typeof site;
