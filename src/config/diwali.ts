import type { FestiveLine } from "./festive";

/**
 * Diwali Décor & Gifts (added 29 Oct 2026): page /diwali in the Diwali colours, the "Diwali" menu
 * item (in place of "Shop", owner's choice) and a homepage section below the retirement tributes.
 * Products live in seed.json (category below), prices in src/config/prices.ts (20% below market).
 * Copy here is a draft for the owner. Photos are other makers' work, used with their approval.
 */
export const diwali: FestiveLine = {
  category: "diwali-decor-gifts",
  path: "/diwali",
  theme: "theme-diwali",
  eyebrow: "Diwali Décor & Gifts",
  title: ["Light up Diwali,", "made by hand."],
  intro:
    "Pooja thalis for Lakshmi pooja, Shubh Labh for the door, lotus diyas for every corner and gift boxes for the people you love. Each piece is poured in resin and finished by hand in our studio.",
  note: "Every piece is made to order. Order early so it reaches you before Diwali.",
  bandLine: "Pooja thalis, Shubh Labh, lotus tealight holders and gift boxes in resin, made to order for the festival.",
  featured: ["ganesh-lakshmi-gift-box", "lotus-tealight-holder", "shubh-labh-hangings", "peacock-feather-pooja-thali"],
  samplePhotoNote: "Every piece is made by hand to order, so yours may differ a little from the photo.",
  noPhoto: "Photo coming soon",
  taglines: {
    "pink-pooja-gift-box": "Thali, Shubh Labh, Ganesh plate and a diya.",
    "ganesh-lakshmi-gift-box": "Ganesh and Lakshmi plaques with lotus diyas.",
    "shubh-labh-candle-gift-box": "Shubh Labh, laddoo candles and a flower candle.",
    "pink-shubh-labh-gift-box": "Shubh Labh, a Ganesh plaque and two diyas.",
    "pink-lotus-pooja-set": "A pink lotus thali, diyas and Shubh Labh.",
    "lotus-pearl-pooja-thali": "Painted lotuses, gold leaves and pearls.",
    "peacock-feather-pooja-thali": "Turquoise, gold flakes and a peacock feather.",
    "namokar-mantra-thali": "The Namokar Mantra in gold.",
    "shubh-labh-hangings": "White and gold, with chain tassels.",
    "ganesh-lakshmi-shubh-labh": "Ganesh ji and Lakshmi ji, with flowers.",
    "lotus-tealight-holder": "A resin lotus for your tealight.",
    "krishna-mantra-led-plaque": "The Krishna mantra, lit with LEDs.",
    "ganesha-rose-petal-plaque": "Ganesh ji with real rose petals.",
    "radha-krishna-frame": "Radha Krishna in a gold-flake frame.",
  },
};
