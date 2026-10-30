import type { ThemedLine } from "./lines";

/**
 * Resin Car Gifts (added 30 Oct 2026): page /car-gifts in racing colours, the "Car Gifts" menu item
 * (in place of "Custom", owner's choice) and a homepage section below the festive ones. Products live
 * in seed.json (category below), prices in src/config/prices.ts (20% below market). The owner chose
 * to use car brand names; the page says they are handmade fan pieces, not official products.
 * Photos are other makers' work, used with their approval.
 */
export const cars: ThemedLine = {
  category: "car-gifts",
  path: "/car-gifts",
  theme: "theme-racing",
  eyebrow: "Resin Car Gifts",
  title: ["For the car lover,", "built by hand."],
  intro:
    "Their dream car, drifting out of resin smoke, racing down a tyre track or roaring across a canvas. Each piece is set with a diecast model and finished by hand in our studio.",
  note: "Every piece is made to order with a diecast model of the car shown; ask us on WhatsApp for a different car. Brand names and logos belong to their owners: these are handmade fan pieces, not official products.",
  bandLine: "Diecast cars in resin smoke, splashes and racing stripes: frames, canvases and displays, made to order.",
  featured: ["bmw-drift-smoke-canvas", "hot-wheels-smoke-frame", "ferrari-flame-burnout-frame", "tyre-display-shelf"],
  samplePhotoNote: "Every piece is made by hand to order, so yours may differ a little from the photo.",
  noPhoto: "Photo coming soon",
  taglines: {
    "hot-wheels-smoke-frame": "Bursting out of black resin smoke.",
    "bmw-m-smoke-frame": "A white smoke drift on black.",
    "hot-wheels-tyre-track-frame": "Racing down a splattered tyre track.",
    "hot-wheels-twin-drift-frame": "Two cars drifting side by side.",
    "three-cars-spotlight-frame": "Three cars in coloured headlights.",
    "ferrari-flame-burnout-frame": "Red and yellow flames on carbon fibre.",
    "ferrari-racing-stripe-canvas": "Twin red stripes on glossy white.",
    "bmw-drift-smoke-canvas": "A big drift in white smoke.",
    "pagani-ocean-wave-canvas": "Driving out of the waves.",
    "emerald-splash-car-board": "Emerald, gold and a white splash.",
    "vintage-car-wheat-canvas": "A red classic among the wheat.",
    "harley-davidson-plaque": "A Harley on glossy black.",
    "tyre-display-shelf": "A real tyre for their collection.",
  },
};
