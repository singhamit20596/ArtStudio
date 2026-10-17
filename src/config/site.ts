/**
 * Business settings. Change values here; every page reads from this file.
 * Items still marked TODO are listed in TODO.md.
 */
export const site = {
  name: "Art Studio",
  tagline: "Art with Soul",
  bio: "Art that tells a story. Handcrafted with love.",
  description:
    "Handmade resin décor, pooja thalis, personalised gifts and IAF, Army & Navy retirement frames. Made by hand, shipped across India.",
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
    freeShippingThreshold: 3000,
    flatFee: 100,
    panIndia: true,
  },

  payments: {
    cashOnDelivery: true,
    orderOnWhatsApp: true,
    /** Razorpay is wired in Phase 3 but stays off until the account is ready. */
    razorpayEnabled: false,
    onlineComingSoonLabel: "Online payments coming soon",
  },

  /** Rotating messages in the black announcement bar (keep exactly four). */
  announcements: [
    "Free shipping on orders above ₹3,000",
    "Cash on Delivery across India",
    "Handcrafted with love ✨",
    "🚚 Pan India shipping",
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
