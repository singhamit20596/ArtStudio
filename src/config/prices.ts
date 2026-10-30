import storedPrices from "@/data/prices.json";

/**
 * The price list: every product's options (sizes, lights, variants), product codes, and where
 * each price comes from. The catalogue (src/lib/catalog.ts) applies it to the products in
 * seed.json, and the order API re-prices every order from it.
 *
 * The amounts themselves live in src/data/prices.json, in ₹, taxes included. The owner edits them
 * in the price catalogue: `npm run catalogue:export` writes catalogue/Art-Studio-Price-Catalogue.xlsx,
 * and `npm run catalogue:import` checks the edited file and writes prices.json (scripts/catalogue.py).
 * Each price there is { amount, confirmed }:
 *
 *   confirmed: false  a made-up price still waiting for the owner (listed in TODO.md)
 *   confirmed: true   a price the owner has given
 *   amount: null      no price shown ("price on request")
 *   market            Diwali and Car Gifts: our estimate of the market price for a similar handmade
 *                     resin piece in India. The price is 20% below it (owner, 29–30 Oct 2026); the
 *                     import works it out when only the estimate changes.
 *   removed: true     taken off the site because the owner deleted its rows from the catalogue: on a
 *                     whole product (catalog.ts hides it), on one size (no longer offered) or on the
 *                     lights (no lights add-on). The entry stays so its code is never reused; delete
 *                     the marker to bring it back, or delete the product here and in seed.json.
 *
 * A new product needs an entry below and its prices in prices.json. The site stops with a clear
 * message if the two don't match.
 *
 * Product codes: capital letters and numbers only, built in this order:
 *
 *   RT        product line, 2 letters (see productLines below)
 *     BF      product, 2 letters
 *       M     variant, 1–2 letters, only for products with a choice (a letter, a style)
 *       1815  size, 4 digits: width then height in inches, each as 2 digits (12 × 9 = 1209)
 *       L     options: L = with LED lights
 *
 *   RTBF1815 = Retirement Gifts › Box Frame › 18 × 15 in
 *   KAALM    = Keychains & Accessories › Alphabet Letter › letter M
 *
 * Codes are printed on orders, emails and WhatsApp messages. Never reuse an old code for a
 * different piece. The build stops if a code breaks these rules or two codes clash.
 */

export interface PriceEntry {
  amount: number | null;
  confirmed: boolean;
}

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
  RT: { name: "Retirement Gifts", category: "retirement-tribute-frames" },
  PF: { name: "Pooja & Festive", category: "pooja-festive" },
  TC: { name: "Trays & Coasters", category: "trays-coasters" },
  KA: { name: "Keychains & Accessories", category: "keychains-accessories" },
  WD: { name: "Wall Décor", category: "wall-decor" },
  SB: { name: "Personalised Shadow Boxes", category: "shadow-boxes" },
  RP: { name: "Resin Photo Frames", category: "resin-photo-frames" },
  FM: { name: "Fridge Magnets", category: "fridge-magnets" },
  CD: { name: "Christmas Décor & Gifts", category: "christmas-decor-gifts" },
  DD: { name: "Diwali Décor & Gifts", category: "diwali-decor-gifts" },
  RC: { name: "Resin Car Gifts", category: "car-gifts" },
} as const;

export type ProductLine = keyof typeof productLines;

/** Product line + 2-letter product, e.g. code("RT", "BF") = "RTBF". */
const code = (line: ProductLine, product: string) => `${line}${product}`;

/** Added to a size's code when LED lights are chosen. */
export const LIGHTS_CODE_SUFFIX = "L";

const twoDigits = (n: number) => String(n).padStart(2, "0");

/** How a product is sold. Its amounts come from prices.json. */
type ProductShape = Coded & ({ kind: "sizes"; sizes: [number, number][]; lights: boolean } | { kind: "fixed" } | { kind: "from" });

/** Sold in sizes: [width in inches, height in inches], listed smallest price first, with or without the LED lights add-on. */
const sized = (productCode: string, sizes: [number, number][], lights: boolean): ProductShape => ({ kind: "sizes", code: productCode, sizes, lights });
/** One fixed price, the same for every choice in variantCodes. */
const fixed = (productCode: string, variantCodes?: Record<string, string>): ProductShape => ({ kind: "fixed", code: productCode, ...(variantCodes && { variantCodes }) });
/** Made to order and quoted on WhatsApp: "From ₹…". */
const madeToOrder = (productCode: string, variantCodes?: Record<string, string>): ProductShape => ({ kind: "from", code: productCode, ...(variantCodes && { variantCodes }) });

/** Letters A to Z, each coded as itself. */
const letterCodes = Object.fromEntries("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => [l, l]));

/** Every product, by slug. Notes on prices (per coaster, per letter) are in prices.json. */
const productShapes: Record<string, ProductShape> = {
  // Retirement Gifts
  "newspaper-tribute": sized(code("RT", "NT"), [[12, 16], [16, 20], [18, 24], [20, 30]], true),
  "box-frame": sized(code("RT", "BF"), [[18, 15], [24, 24]], true),
  "resin-frame": sized(code("RT", "RF"), [[12, 9], [10, 10], [18, 15], [24, 24]], true),

  // Ready-made
  "shubh-labh-toran": fixed(code("PF", "TR")),
  "blush-agate-resin-tray": fixed(code("TC", "BA")),
  "rose-marble-resin-tray": fixed(code("TC", "RM")), // hidden until the owner confirms the piece
  "karwa-chauth-chalni-thali-set": fixed(code("PF", "KC")),
  "lal-pooja-thali": fixed(code("PF", "PT")),
  "resin-alphabet-letters": fixed(code("KA", "AL"), letterCodes),
  "botanical-initial-keychain": fixed(code("KA", "BK"), letterCodes),
  "marble-noir-wall-clock": fixed(code("WD", "MN")),

  // Christmas Décor & Gifts: the 13 pieces from the owner's photos (29 Oct 2026). The owner wants
  // every price between ₹300 and ₹500.
  "holo-christmas-tree": fixed(code("CD", "HT")),
  "marble-reindeer-ornament": fixed(code("CD", "RO")),
  "candy-cane-christmas-coaster": fixed(code("CD", "CC")),
  "stocking-keychain": fixed(code("CD", "SK")),
  "santa-reindeer-plaque": fixed(code("CD", "SP")),
  "christmas-dome-magnet": fixed(code("CD", "DM"), { Santa: "SA", Snowman: "SM", "Christmas tree": "TR", "Red house": "HS" }),
  "snowflake-coaster": fixed(code("CD", "SC")),
  "christmas-disc-ornament": fixed(code("CD", "DO"), { Red: "RD", Green: "GR", Blue: "BL", Gold: "GD", Silver: "SL" }),
  "merry-christmas-coaster": fixed(code("CD", "MC")),
  "glitter-tree-canvas": fixed(code("CD", "TC")),
  "melted-snowman-coaster": fixed(code("CD", "MS")),
  "candy-cane-hexagon-coaster": fixed(code("CD", "CH")),
  "sea-glass-tree-ornament": fixed(code("CD", "GT")),

  // Diwali Décor & Gifts: 13 pieces from the owner's photos (29 Oct 2026; the pink pooja gift box was removed
  // on 30 Oct 2026). First priced 20% below market; the owner's own prices came in on 30 Oct 2026.
  // Gift boxes and sets
  "ganesh-lakshmi-gift-box": fixed(code("DD", "GL")),
  "shubh-labh-candle-gift-box": fixed(code("DD", "SC")),
  "pink-shubh-labh-gift-box": fixed(code("DD", "PS")),
  "pink-lotus-pooja-set": fixed(code("DD", "LS")),
  // Pooja thalis
  "lotus-pearl-pooja-thali": fixed(code("DD", "LP")),
  "peacock-feather-pooja-thali": fixed(code("DD", "PF")),
  "namokar-mantra-thali": fixed(code("DD", "NM")),
  // Shubh Labh hangings (pairs)
  "shubh-labh-hangings": fixed(code("DD", "SW")),
  "ganesh-lakshmi-shubh-labh": fixed(code("DD", "GS")),
  // Tealight holders
  "lotus-tealight-holder": fixed(code("DD", "LT"), { Gold: "GD", Purple: "PU", Pink: "PK", Red: "RD" }),
  // Plaques and frames
  "krishna-mantra-led-plaque": fixed(code("DD", "KM")),
  "ganesha-rose-petal-plaque": fixed(code("DD", "GR")),
  "radha-krishna-frame": fixed(code("DD", "RK")),

  // Resin Car Gifts: 13 pieces from the owner's photos (30 Oct 2026; the Audi canvas and the wall clock were
  // removed the same day). First priced 20% below market; the owner's own prices came in on 30 Oct 2026.
  // Each includes a standard diecast model of the car shown; rare or large models are quoted on WhatsApp.
  // Frames
  "hot-wheels-smoke-frame": fixed(code("RC", "HS")),
  "bmw-m-smoke-frame": fixed(code("RC", "BS")),
  "hot-wheels-tyre-track-frame": fixed(code("RC", "TT")),
  "hot-wheels-twin-drift-frame": fixed(code("RC", "TD")),
  "three-cars-spotlight-frame": fixed(code("RC", "SF")),
  "ferrari-flame-burnout-frame": fixed(code("RC", "FB")),
  // Canvases
  "ferrari-racing-stripe-canvas": fixed(code("RC", "FS")),
  "bmw-drift-smoke-canvas": fixed(code("RC", "BD")),
  "pagani-ocean-wave-canvas": fixed(code("RC", "PW")),
  "emerald-splash-car-board": fixed(code("RC", "ES")),
  "vintage-car-wheat-canvas": fixed(code("RC", "VW")),
  // Plaques and displays
  "harley-davidson-plaque": fixed(code("RC", "HD")),
  "tyre-display-shelf": fixed(code("RC", "TS")),

  // Made to order (quoted on WhatsApp)
  "birthday-shadow-box-led": madeToOrder(code("SB", "BD")),
  "memory-photo-frame-easel": madeToOrder(code("RP", "MF")),
  "resin-photo-blocks-magnets": madeToOrder(code("FM", "PB"), { "Photo block": "BL", "Fridge magnet": "MG" }),
};

/* ---------- Reading prices.json ---------- */

/** One price as prices.json stores it. */
interface StoredPrice {
  amount: number | null;
  confirmed: boolean;
  /** Market estimate (Diwali, Car Gifts), kept for the catalogue. */
  market?: number;
  /** On a size or the lights: taken off the site (its row was deleted from the catalogue). */
  removed?: boolean;
}

interface StoredProduct {
  price?: StoredPrice;
  mrp?: number | null;
  startingPrice?: StoredPrice;
  sizes?: Record<string, StoredPrice>;
  lights?: StoredPrice;
  /** Shown in the catalogue only. */
  note?: string;
  /** Taken off the site (every row was deleted from the catalogue). */
  removed?: boolean;
}

const stored = storedPrices as unknown as {
  products: Record<string, StoredProduct>;
  customCategories: Record<string, StoredPrice>;
  extras: Record<string, StoredPrice>;
};

/** Everything wrong with prices.json; the site stops on any (see the end of this section). */
const dataProblems: string[] = [];

const isWholeNumber = (n: unknown, min: number): n is number => typeof n === "number" && Number.isInteger(n) && n >= min;

/**
 * A price from prices.json. Product prices are whole rupees above 0, or null for "price on request";
 * checkout extras may be 0 (no charge) but not null.
 */
function readPrice(where: string, value: StoredPrice | undefined, rule: "product" | "extra"): PriceEntry {
  if (!value || typeof value !== "object") {
    dataProblems.push(`${where}: missing`);
    return { amount: null, confirmed: false };
  }
  const { amount, confirmed, market } = value;
  if (value.removed !== undefined) dataProblems.push(`${where}: "removed" only works on a whole product, a size or the lights`);
  const amountOk = rule === "product" ? amount === null || isWholeNumber(amount, 1) : isWholeNumber(amount, 0);
  if (!amountOk) dataProblems.push(`${where}: amount ${JSON.stringify(amount)} must be whole rupees${rule === "product" ? " above 0, or null" : ", 0 or more"}`);
  if (typeof confirmed !== "boolean") dataProblems.push(`${where}: confirmed must be true or false`);
  if (market !== undefined && !isWholeNumber(market, 1)) dataProblems.push(`${where}: market ${JSON.stringify(market)} must be whole rupees above 0`);
  return { amount, confirmed };
}

function unexpectedKeys(where: string, value: object | undefined, allowed: string[]) {
  for (const key of Object.keys(value ?? {})) if (!allowed.includes(key)) dataProblems.push(`${where}: unexpected "${key}"`);
}

/** True when prices.json marks this product, size or lights `"removed": true` (taken off the site in the catalogue). */
function isRemoved(where: string, value: { removed?: unknown } | undefined) {
  if (value?.removed === undefined) return false;
  if (value.removed !== true) dataProblems.push(`${where}.removed: must be true (or left out)`);
  return true;
}

/** Products taken off the site in the price catalogue (prices.json `"removed": true`). catalog.ts hides them. */
export const removedProducts = new Set<string>();

/** A product with its prices from prices.json, or null when it was taken off the site. */
function priced(slug: string, shape: ProductShape): ProductPrice | null {
  const at = `products["${slug}"]`;
  const saved = stored.products[slug];
  if (!saved) dataProblems.push(`${at}: missing`);
  if (isRemoved(at, saved)) {
    removedProducts.add(slug);
    return null;
  }
  const coded: Coded = shape.variantCodes ? { code: shape.code, variantCodes: shape.variantCodes } : { code: shape.code };
  if (shape.kind === "sizes") {
    unexpectedKeys(at, saved, shape.lights ? ["sizes", "lights", "note"] : ["sizes", "note"]);
    const ids = shape.sizes.map(([w, h]) => `${w}x${h}`);
    for (const id of Object.keys(saved?.sizes ?? {})) if (!ids.includes(id)) dataProblems.push(`${at}.sizes: "${id}" is not one of this product's sizes in src/config/prices.ts`);
    // A size taken off the site is left out; one with no entry at all is still reported as missing.
    const sizes = shape.sizes.flatMap(([w, h]) => {
      const id = `${w}x${h}`;
      if (isRemoved(`${at}.sizes["${id}"]`, saved?.sizes?.[id])) return [];
      const price = readPrice(`${at}.sizes["${id}"]`, saved?.sizes?.[id], "product");
      return [{ id, code: `${shape.code}${twoDigits(w)}${twoDigits(h)}`, label: `${w} × ${h} in`, widthIn: w, heightIn: h, price }];
    });
    if (!sizes.length) dataProblems.push(`${at}: every size is removed; mark the whole product "removed": true instead`);
    const lightsOn = shape.lights && !isRemoved(`${at}.lights`, saved?.lights);
    return { kind: "sizes", ...coded, lights: lightsOn ? readPrice(`${at}.lights`, saved?.lights, "product") : null, sizes };
  }
  if (shape.kind === "fixed") {
    unexpectedKeys(at, saved, ["price", "mrp", "note"]);
    const mrp = saved?.mrp;
    if (mrp != null && !isWholeNumber(mrp, 1)) dataProblems.push(`${at}.mrp: ${JSON.stringify(mrp)} must be whole rupees above 0, or null`);
    return { kind: "fixed", ...coded, price: readPrice(`${at}.price`, saved?.price, "product"), ...(mrp !== undefined && { mrp }) };
  }
  unexpectedKeys(at, saved, ["startingPrice", "note"]);
  return { kind: "from", ...coded, startingPrice: readPrice(`${at}.startingPrice`, saved?.startingPrice, "product") };
}

/** Every product on the site, by slug (products taken off the site are in removedProducts instead). */
export const productPrices: Record<string, ProductPrice> = Object.fromEntries(
  Object.entries(productShapes).flatMap(([slug, shape]) => {
    const price = priced(slug, shape);
    return price ? [[slug, price]] : [];
  }),
);
for (const slug of Object.keys(stored.products)) if (!productShapes[slug]) dataProblems.push(`products["${slug}"]: no product with this slug in src/config/prices.ts`);

/**
 * "From ₹…" on each made-to-order category (prices.json `customCategories`). Leave a category out
 * to use its lowest product price (Retirement Gifts does this); null means "price on request".
 */
export const customCategoryPrices: Record<string, PriceEntry> = Object.fromEntries(
  Object.entries(stored.customCategories).map(([slug, value]) => [slug, readPrice(`customCategories["${slug}"]`, value, "product")]),
);

const extra = (key: string) => readPrice(`extras.${key}`, stored.extras[key], "extra");

/** Charges added at checkout (prices.json `extras`). src/config/site.ts reads these. */
export const extraPrices = {
  /** Orders at or above this subtotal ship free. */
  freeShippingFrom: extra("freeShippingFrom"),
  /** Delivery charge below that. */
  shippingFee: extra("shippingFee"),
  /** Gift wrap, per order. */
  giftWrap: extra("giftWrap"),
  /** Extra charge for Cash on Delivery; 0 means none. */
  codFee: extra("codFee"),
};
unexpectedKeys("extras", stored.extras, Object.keys(extraPrices));

if (dataProblems.length) {
  throw new Error(`Prices in src/data/prices.json (fix them in the price catalogue, then npm run catalogue:import):\n${dataProblems.join("\n")}`);
}

/* ---------- Product codes ---------- */

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
  // Codes of products taken off the site stay reserved: old orders still name them.
  for (const slug of removedProducts) bases.set(productShapes[slug].code, slug);
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
