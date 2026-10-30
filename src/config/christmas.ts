import type { ThemedLine } from "./lines";

/**
 * Christmas Décor & Gifts (added 29 Oct 2026): page /christmas, a menu item and a homepage
 * section. Products live in seed.json (category below), prices in src/config/prices.ts.
 * Copy here is a draft for the owner. Photos are other makers' work, used with their approval.
 */
export const christmas: ThemedLine = {
  category: "christmas-decor-gifts",
  path: "/christmas",
  theme: "theme-christmas",
  eyebrow: "Christmas Décor & Gifts",
  title: ["Christmas,", "made by hand."],
  intro:
    "Ornaments for the tree, coasters for the hot chocolate and little gifts for everyone on your list. Each piece is poured in resin and finished by hand in our studio.",
  note: "Every piece is made to order. Order early so it reaches you well before Christmas.",
  bandLine: "Ornaments, coasters and little gifts in resin, made to order for the season.",
  featured: ["holo-christmas-tree", "marble-reindeer-ornament", "stocking-keychain", "christmas-dome-magnet"],
  samplePhotoNote: "Every piece is made by hand to order, so yours may differ a little from the photo.",
  noPhoto: "Photo coming soon",
  taglines: {
    "holo-christmas-tree": "Gold flakes and little rainbows.",
    "marble-reindeer-ornament": "Red marble swirl, gold antlers.",
    "candy-cane-christmas-coaster": "Candy cane and peppermint on sky blue.",
    "stocking-keychain": "A red stocking full of gold stars.",
    "santa-reindeer-plaque": "Santa and his reindeer, on a stand.",
    "christmas-dome-magnet": "A tiny Christmas scene for the fridge.",
    "snowflake-coaster": "Icy blue snowflakes and a little tree.",
    "christmas-disc-ornament": "Glitter, charms and Christmas lettering.",
    "merry-christmas-coaster": "Pearly white, gold and a festive sparkle.",
    "glitter-tree-canvas": "A glitter tree dressed for Christmas.",
    "melted-snowman-coaster": "A snowman melting under your mug.",
    "candy-cane-hexagon-coaster": "Candy canes standing in the snow.",
    "sea-glass-tree-ornament": "A glass-chip tree in clear resin.",
  },
};
