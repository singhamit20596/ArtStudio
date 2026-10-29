/**
 * The price list: every price on the site, in ₹, taxes included, with each product's options.
 * Change prices here and only here. The catalogue (src/lib/catalog.ts) applies them to the
 * products in seed.json, and the order API re-prices every order from them.
 *
 *   placeholder(n)  a made-up price still waiting for the owner (listed in TODO.md)
 *   confirmed(n)    a price the owner has given
 *   n = null        no price shown ("price on request")
 *
 * Product codes: capital letters and numbers only, built in this order:
 *
 *   RT        product line, 2 letters (see productLines below)
 *     BF      product, 2 letters
 *       M     variant, 1–2 letters, only for products with a choice (a letter, a style)
 *       1815  size, 4 digits: width then height in inches, each as 2 digits (12 × 9 = 1209)
 *       L     options: L = with LED lights
 *
 *   RTBF1815 = Retirement Tributes › Box Frame › 18 × 15 in
 *   KAALM    = Keychains & Accessories › Alphabet Letter › letter M
 *
 * Codes are printed on orders, emails and WhatsApp messages. Never reuse an old code for a
 * different piece. The build stops if a code breaks these rules or two codes clash.
 */

export interface PriceEntry {
  amount: number | null;
  confirmed: boolean;
}

const placeholder = (amount: number | null): PriceEntry => ({ amount, confirmed: false });
const confirmed = (amount: number | null): PriceEntry => ({ amount, confirmed: true });

export interface SizePrice {
  /** Stays the same once orders exist; carts and orders refer to it. */
  id: string;
  /** Unique product code for this size, e.g. "RTBF2424". */
  code: string;
  label: string;
  widthIn: number;
  heightIn: number;
  price: PriceEntry;
}

/** Code shared by every product: product line + product, e.g. "RTBF". */
interface Coded {
  code: string;
  /** Variant code for each choice a customer makes (e.g. letter "M" → "M"), added after the product code. */
  variantCodes?: Record<string, string>;
}

export type ProductPrice = Coded &
  (
    /** Made to order in set sizes, with an optional LED lights add-on (shown only while launch.lights is on). */
    | { kind: "sizes"; sizes: SizePrice[]; lights: PriceEntry | null }
    /** One fixed price. `mrp` shows a struck-through price above it. */
    | { kind: "fixed"; price: PriceEntry; mrp?: number | null }
    /** Custom work quoted on WhatsApp: shown as "From ₹…". */
    | { kind: "from"; startingPrice: PriceEntry }
  );

/** First part of every product code: the product line, with the shop category its products belong to. */
export const productLines = {
  RT: { name: "Retirement Tributes", category: "retirement-tribute-frames" },
  PF: { name: "Pooja & Festive", category: "pooja-festive" },
  TC: { name: "Trays & Coasters", category: "trays-coasters" },
  KA: { name: "Keychains & Accessories", category: "keychains-accessories" },
  WD: { name: "Wall Décor", category: "wall-decor" },
  SB: { name: "Personalised Shadow Boxes", category: "shadow-boxes" },
  RP: { name: "Resin Photo Frames", category: "resin-photo-frames" },
  FM: { name: "Fridge Magnets", category: "fridge-magnets" },
  CD: { name: "Christmas Décor & Gifts", category: "christmas-decor-gifts" },
  DD: { name: "Diwali Décor & Gifts", category: "diwali-decor-gifts" },
} as const;

export type ProductLine = keyof typeof productLines;

/** Product line + 2-letter product, e.g. code("RT", "BF") = "RTBF". */
const code = (line: ProductLine, product: string) => `${line}${product}`;

/** Added to a size's code when LED lights are chosen. */
export const LIGHTS_CODE_SUFFIX = "L";

const twoDigits = (n: number) => String(n).padStart(2, "0");

/** A product sold in sizes. Each size is [width in inches, height in inches, price], listed smallest price first. */
const sized = (productCode: string, sizes: [number, number, PriceEntry][], lights: PriceEntry | null): ProductPrice => ({
  kind: "sizes",
  code: productCode,
  lights,
  sizes: sizes.map(([w, h, price]) => ({
    id: `${w}x${h}`,
    code: `${productCode}${twoDigits(w)}${twoDigits(h)}`,
    label: `${w} × ${h} in`,
    widthIn: w,
    heightIn: h,
    price,
  })),
});

/**
 * Diwali prices are 20% below the market price (owner, 29 Oct 2026). The number passed in is our
 * estimate of the market price for a similar handmade resin piece in India; the price shown is 80% of it.
 */
const belowMarket = (market: number) => placeholder(Math.round(market * 0.8));

/** Letters A to Z, each coded as itself. */
const letterCodes = Object.fromEntries("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => [l, l]));

/** Every product, by slug. */
export const productPrices: Record<string, ProductPrice> = {
  // Retirement Tributes
  "newspaper-tribute": sized(
    code("RT", "NT"),
    [
      [12, 16, placeholder(2999)],
      [16, 20, placeholder(3999)],
      [18, 24, placeholder(4999)],
      [20, 30, placeholder(6499)],
    ],
    placeholder(799),
  ),
  "box-frame": sized(
    code("RT", "BF"),
    [
      [18, 15, confirmed(2500)],
      [24, 24, confirmed(3500)],
    ],
    placeholder(799),
  ),
  "resin-frame": sized(
    code("RT", "RF"),
    [
      [12, 9, confirmed(2000)],
      [10, 10, confirmed(2000)],
      [18, 15, confirmed(3000)],
      [24, 24, confirmed(5000)],
    ],
    placeholder(699),
  ),

  // Ready-made
  "shubh-labh-toran": { kind: "fixed", code: code("PF", "TR"), price: placeholder(1299) },
  "blush-agate-resin-tray": { kind: "fixed", code: code("TC", "BA"), price: placeholder(1899) },
  "rose-marble-resin-tray": { kind: "fixed", code: code("TC", "RM"), price: placeholder(2199) }, // hidden until the owner confirms the piece
  "karwa-chauth-chalni-thali-set": { kind: "fixed", code: code("PF", "KC"), price: placeholder(2499) },
  "lal-pooja-thali": { kind: "fixed", code: code("PF", "PT"), price: placeholder(1499) },
  "resin-alphabet-letters": { kind: "fixed", code: code("KA", "AL"), variantCodes: letterCodes, price: placeholder(149) }, // per letter
  "botanical-initial-keychain": { kind: "fixed", code: code("KA", "BK"), variantCodes: letterCodes, price: placeholder(249) },
  "marble-noir-wall-clock": { kind: "fixed", code: code("WD", "MN"), price: placeholder(3499) },

  // Christmas Décor & Gifts: the 13 pieces from the owner's photos (29 Oct 2026). The owner wants
  // every price between ₹300 and ₹500; amounts are placeholders inside that range. Coasters are per coaster.
  "holo-christmas-tree": { kind: "fixed", code: code("CD", "HT"), price: placeholder(449) },
  "marble-reindeer-ornament": { kind: "fixed", code: code("CD", "RO"), price: placeholder(399) },
  "candy-cane-christmas-coaster": { kind: "fixed", code: code("CD", "CC"), price: placeholder(399) }, // per coaster
  "stocking-keychain": { kind: "fixed", code: code("CD", "SK"), price: placeholder(349) },
  "santa-reindeer-plaque": { kind: "fixed", code: code("CD", "SP"), price: placeholder(499) },
  "christmas-dome-magnet": {
    kind: "fixed",
    code: code("CD", "DM"),
    variantCodes: { Santa: "SA", Snowman: "SM", "Christmas tree": "TR", "Red house": "HS" },
    price: placeholder(349),
  },
  "snowflake-coaster": { kind: "fixed", code: code("CD", "SC"), price: placeholder(399) }, // per coaster
  "christmas-disc-ornament": {
    kind: "fixed",
    code: code("CD", "DO"),
    variantCodes: { Red: "RD", Green: "GR", Blue: "BL", Gold: "GD", Silver: "SL" },
    price: placeholder(349),
  },
  "merry-christmas-coaster": { kind: "fixed", code: code("CD", "MC"), price: placeholder(449) }, // per coaster
  "glitter-tree-canvas": { kind: "fixed", code: code("CD", "TC"), price: placeholder(499) },
  "melted-snowman-coaster": { kind: "fixed", code: code("CD", "MS"), price: placeholder(349) }, // per coaster
  "candy-cane-hexagon-coaster": { kind: "fixed", code: code("CD", "CH"), price: placeholder(399) }, // per coaster
  "sea-glass-tree-ornament": { kind: "fixed", code: code("CD", "GT"), price: placeholder(349) },

  // Diwali Décor & Gifts: the 14 pieces from the owner's photos (29 Oct 2026). belowMarket(market estimate).
  // Gift boxes and sets
  "pink-pooja-gift-box": { kind: "fixed", code: code("DD", "PB"), price: belowMarket(2999) }, // ₹2,399
  "ganesh-lakshmi-gift-box": { kind: "fixed", code: code("DD", "GL"), price: belowMarket(1999) }, // ₹1,599
  "shubh-labh-candle-gift-box": { kind: "fixed", code: code("DD", "SC"), price: belowMarket(1499) }, // ₹1,199
  "pink-shubh-labh-gift-box": { kind: "fixed", code: code("DD", "PS"), price: belowMarket(1999) }, // ₹1,599
  "pink-lotus-pooja-set": { kind: "fixed", code: code("DD", "LS"), price: belowMarket(3499) }, // ₹2,799
  // Pooja thalis
  "lotus-pearl-pooja-thali": { kind: "fixed", code: code("DD", "LP"), price: belowMarket(1799) }, // ₹1,439
  "peacock-feather-pooja-thali": { kind: "fixed", code: code("DD", "PF"), price: belowMarket(1499) }, // ₹1,199
  "namokar-mantra-thali": { kind: "fixed", code: code("DD", "NM"), price: belowMarket(1999) }, // ₹1,599
  // Shubh Labh hangings (pairs)
  "shubh-labh-hangings": { kind: "fixed", code: code("DD", "SW"), price: belowMarket(999) }, // ₹799
  "ganesh-lakshmi-shubh-labh": { kind: "fixed", code: code("DD", "GS"), price: belowMarket(1099) }, // ₹879
  // Tealight holders
  "lotus-tealight-holder": {
    kind: "fixed",
    code: code("DD", "LT"),
    variantCodes: { Gold: "GD", Purple: "PU", Pink: "PK", Red: "RD" },
    price: belowMarket(399), // ₹319
  },
  // Plaques and frames
  "krishna-mantra-led-plaque": { kind: "fixed", code: code("DD", "KM"), price: belowMarket(1499) }, // ₹1,199
  "ganesha-rose-petal-plaque": { kind: "fixed", code: code("DD", "GR"), price: belowMarket(1249) }, // ₹999
  "radha-krishna-frame": { kind: "fixed", code: code("DD", "RK"), price: belowMarket(1249) }, // ₹999

  // Made to order (quoted on WhatsApp)
  "birthday-shadow-box-led": { kind: "from", code: code("SB", "BD"), startingPrice: placeholder(2999) },
  "memory-photo-frame-easel": { kind: "from", code: code("RP", "MF"), startingPrice: placeholder(1499) },
  "resin-photo-blocks-magnets": {
    kind: "from",
    code: code("FM", "PB"),
    variantCodes: { "Photo block": "BL", "Fridge magnet": "MG" },
    startingPrice: placeholder(599),
  },
};

/**
 * "From ₹…" on each made-to-order category. Leave a category out to use its lowest product
 * price (Retirement Tributes does this); null means "price on request".
 */
export const customCategoryPrices: Record<string, PriceEntry> = {
  "resin-trays": placeholder(1999),
  "fridge-magnets": placeholder(599),
  "phone-covers": placeholder(null), // coming soon
  "shadow-boxes": placeholder(2999),
  "resin-photo-frames": placeholder(1499),
  "name-plates": placeholder(null),
  "flower-preservation": placeholder(null),
  "initial-keychains": placeholder(249),
  "wall-clocks": placeholder(2999),
  "resin-jewellery": placeholder(null),
  "pet-memorials": placeholder(null),
  "rakhi-festive-customs": placeholder(null),
  "resin-rangoli": placeholder(null),
  "bookmarks-coasters-desk": placeholder(null),
};

/** Charges added at checkout. src/config/site.ts reads these. */
export const extraPrices = {
  /** Orders at or above this subtotal ship free. */
  freeShippingFrom: confirmed(3000),
  /** Delivery charge below that. */
  shippingFee: confirmed(100),
  /** Gift wrap, per order. */
  giftWrap: placeholder(49),
  /** Extra charge for Cash on Delivery; 0 means none. */
  codFee: placeholder(0),
};

/** Every product code in the price list (each size with and without lights, each variant), for the build checks. */
export function allProductCodes(): string[] {
  return Object.values(productPrices).flatMap((p) => {
    if (p.kind === "sizes") return p.sizes.flatMap((s) => (p.lights ? [s.code, s.code + LIGHTS_CODE_SUFFIX] : [s.code]));
    const variants = Object.values(p.variantCodes ?? {});
    return variants.length ? variants.map((v) => p.code + v) : [p.code];
  });
}

/** Problems with the product codes (empty when all is well). catalog.ts stops the build on any. */
export function productCodeProblems(productOf: (slug: string) => { category: string; choices: string[] } | undefined): string[] {
  const problems: string[] = [];
  const bases = new Map<string, string>();
  for (const [slug, p] of Object.entries(productPrices)) {
    if (!/^[A-Z]{4}$/.test(p.code)) problems.push(`${slug}: "${p.code}" must be 2 letters for the line + 2 for the product`);
    const line = productLines[p.code.slice(0, 2) as ProductLine];
    if (!line) problems.push(`${slug}: "${p.code.slice(0, 2)}" is not a product line in productLines`);
    const product = productOf(slug);
    if (line && product && line.category !== product.category) problems.push(`${slug}: "${p.code}" starts with ${p.code.slice(0, 2)} (${line.name}) but the product is in ${product.category}`);
    for (const choice of product?.choices ?? []) if (!p.variantCodes?.[choice]) problems.push(`${slug}: the choice "${choice}" has no variant code`);
    if (bases.has(p.code)) problems.push(`${slug}: "${p.code}" is also used by ${bases.get(p.code)}`);
    bases.set(p.code, slug);
    for (const v of Object.values(p.variantCodes ?? {})) if (!/^[A-Z]{1,2}$/.test(v)) problems.push(`${slug}: variant code "${v}" must be 1–2 letters`);
  }
  const all = allProductCodes();
  for (const c of all) if (!/^[A-Z0-9]+$/.test(c)) problems.push(`"${c}" must be capital letters and numbers only`);
  for (const c of new Set(all.filter((c, i) => all.indexOf(c) !== i))) problems.push(`"${c}" is used twice`);
  return problems;
}
