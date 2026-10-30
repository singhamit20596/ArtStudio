import type { CSSProperties } from "react";
import storedPrices from "@/data/prices.json";
import { cars } from "@/config/cars";
import { christmas } from "@/config/christmas";
import { diwali } from "@/config/diwali";
import { launch } from "@/config/launch";
import { products } from "@/lib/catalog";
import { shortName } from "@/lib/product";
import type { Product } from "@/lib/types";

/*
 * The price catalogue PDF (/price-catalogue, `npm run catalogue:pdf`): which products go in, in
 * which collection, and how they fall onto A4 pages. Prices come only from the catalogue
 * (src/lib/catalog.ts), so the PDF always matches the site.
 *
 * Every size below is in millimetres and is also handed to the CSS (catalogue.css) as a custom
 * property, so the page maths here and the printed layout cannot drift apart. Each page is a fixed
 * A4 sheet, and a card is only placed on a page when it fits whole, so no card is ever split.
 */

/** Page geometry in mm (A4 portrait). */
export const G = {
  pageW: 210,
  pageH: 297,
  /** Left and right margin of the cards. */
  padX: 18,
  /** Reserved at the foot of every page for the WhatsApp line and page number. */
  footerH: 14,
  cols: 3,
  colGap: 7,
  rowGap: 6,
  /** The dark opening band of a collection. */
  heroH: 84,
  /** The thin dark band on a collection's later pages. */
  contH: 20,
  /** A second collection that starts part-way down a page in the same colours. */
  subheadGap: 6,
  subheadH: 26,
  /** Space under any band before the first row of cards. */
  headerGap: 8,
  /** Name and price under a photo. */
  textH: 12,
  /** Sized cards: name line(s), each size row, padding. */
  sizedLineH: 6,
  sizeRowH: 6,
  sizedPad: 4,
} as const;

export const cardW = (G.pageW - 2 * G.padX - (G.cols - 1) * G.colGap) / G.cols;
/** Photos are 4:5, like the site. */
export const photoH = (cardW * 5) / 4;
/** Height a page can fill above the footer. */
const pageRoom = G.pageH - G.footerH;

/** The geometry as CSS custom properties, set on the catalogue's root element. */
export const geometryVars = {
  "--cat-page-w": `${G.pageW}mm`,
  "--cat-page-h": `${G.pageH}mm`,
  "--cat-pad-x": `${G.padX}mm`,
  "--cat-footer-h": `${G.footerH}mm`,
  "--cat-col-gap": `${G.colGap}mm`,
  "--cat-row-gap": `${G.rowGap}mm`,
  "--cat-cont-h": `${G.contH}mm`,
  "--cat-subhead-gap": `${G.subheadGap}mm`,
  "--cat-subhead-h": `${G.subheadH}mm`,
  "--cat-header-gap": `${G.headerGap}mm`,
  "--cat-card-w": `${cardW}mm`,
  "--cat-photo-h": `${photoH}mm`,
  "--cat-text-h": `${G.textH}mm`,
  "--cat-sized-line-h": `${G.sizedLineH}mm`,
  "--cat-size-row-h": `${G.sizeRowH}mm`,
  "--cat-sized-pad": `${G.sizedPad}mm`,
} as CSSProperties;

/* ---------- What goes in ---------- */

export type Decor = "service" | "diwali" | "christmas" | "racing" | "studio";

export interface CatalogueItem {
  slug: string;
  name: string;
  photo: string;
  /** One price, a "From" price, or a price per size. */
  price: { kind: "fixed"; amount: number | null; each: boolean } | { kind: "from"; amount: number | null } | { kind: "sizes"; sizes: { label: string; amount: number }[] };
  /** Lines the name takes on a sized card (they are wider than the name column of a plain card). */
  nameLines: 1 | 2;
}

export interface Section {
  key: string;
  /** Theme class from globals.css ("" for the brand sage, brown and amber). */
  theme: string;
  /** The whole page on the dark surface (Retirement Gifts, like its page on the site). */
  dark: boolean;
  decor: Decor;
  /** The collection's name, shown small above the heading and on its later pages. */
  name: string;
  /** The heading: the second part is gold, as on the site. */
  title: readonly [string, string];
  /** Height of the opening band (mm). */
  heroH: number;
  items: CatalogueItem[];
}

/** prices.json notes such as "Per coaster" or "Per letter" mean the price is for one piece. */
const notes = (storedPrices as unknown as { products: Record<string, { note?: string }> }).products;
const perPiece = (slug: string) => /^per\b/i.test(notes[slug]?.note ?? "");

/** The photo a card shows: the tributes' 4:5 tile, otherwise the first product photo. */
const photoOf = (p: Product) => p.gallery?.tile ?? p.images[0] ?? null;

function toItem(p: Product, photo: string): CatalogueItem {
  const name = shortName(p);
  const nameLines = name.length > 22 ? 2 : 1;
  if (p.sizes?.length) return { slug: p.slug, name, photo, nameLines, price: { kind: "sizes", sizes: p.sizes.map((s) => ({ label: s.label, amount: s.price })) } };
  if (p.type === "custom") return { slug: p.slug, name, photo, nameLines, price: { kind: "from", amount: p.startingPrice } };
  return { slug: p.slug, name, photo, nameLines, price: { kind: "fixed", amount: p.price, each: perPiece(p.slug) } };
}

interface SectionSpec extends Omit<Section, "items" | "heroH"> {
  heroH?: number;
  match: (p: Product) => boolean;
}

/** Collections in catalogue order. A product goes in the first one that matches. */
const SECTIONS: SectionSpec[] = [
  {
    key: "retirement",
    theme: "theme-service",
    dark: true,
    decor: "service",
    name: "Retirement Gifts",
    title: ["They served the nation.", "They deserve the best."],
    heroH: 100,
    match: (p) => p.category === launch.focus,
  },
  ...[diwali, christmas, cars].map(
    (line): SectionSpec => ({
      key: line.category,
      theme: line.theme,
      dark: false,
      decor: line === diwali ? "diwali" : line === christmas ? "christmas" : "racing",
      name: line.eyebrow,
      title: line.title,
      match: (p) => p.category === line.category,
    }),
  ),
  { key: "ready", theme: "", dark: false, decor: "studio", name: "Ready-made", title: ["More from", "the studio."], match: (p) => p.type === "ready" },
  { key: "custom", theme: "", dark: false, decor: "studio", name: "Made to order", title: ["Custom", "made."], match: (p) => p.type === "custom" },
];

/** Products on the site, grouped into the catalogue's collections. Products without a photo are left out (and listed). */
export function catalogueSections(): { sections: Section[]; skipped: string[] } {
  const skipped: string[] = [];
  const placed = new Set<string>();
  const sections = SECTIONS.map(({ match, heroH, ...spec }): Section => {
    const items = products.flatMap((p) => {
      if (placed.has(p.slug) || !match(p)) return [];
      placed.add(p.slug);
      const photo = photoOf(p);
      if (!photo) {
        skipped.push(p.slug);
        return [];
      }
      return [toItem(p, photo)];
    });
    return { ...spec, heroH: heroH ?? G.heroH, items };
  }).filter((s) => s.items.length > 0);
  for (const p of products) if (!placed.has(p.slug)) skipped.push(p.slug);
  return { sections, skipped };
}

/* ---------- Pages ---------- */

export type Block =
  | { type: "hero"; section: Section }
  | { type: "cont"; section: Section }
  | { type: "subhead"; section: Section }
  | { type: "row"; section: Section; items: CatalogueItem[]; height: number };

export interface Page {
  theme: string;
  dark: boolean;
  blocks: Block[];
}

function rowHeight(items: CatalogueItem[]) {
  const sized = items.filter((i) => i.price.kind === "sizes");
  if (!sized.length) return photoH + G.textH;
  const text = Math.max(...sized.map((i) => i.nameLines * G.sizedLineH + (i.price.kind === "sizes" ? i.price.sizes.length : 0) * G.sizeRowH + G.sizedPad));
  return photoH + text;
}

/**
 * Lays the collections out on pages. A collection opens on a new page with its band, unless the
 * page before has the same colours and room for its heading and a first row (Made to order after
 * Ready-made). A row that doesn't fit whole starts a new page with a thin band.
 */
export function paginate(sections: Section[]): Page[] {
  const pages: Page[] = [];
  /** Height used so far on the last page. */
  let used = 0;
  const open = (section: Section, type: "hero" | "cont") => {
    pages.push({ theme: section.theme, dark: section.dark, blocks: [{ type, section }] });
    used = (type === "hero" ? section.heroH : G.contH) + G.headerGap;
  };
  for (const section of sections) {
    const rows: CatalogueItem[][] = [];
    for (let i = 0; i < section.items.length; i += G.cols) rows.push(section.items.slice(i, i + G.cols));
    const subhead = G.subheadGap + G.subheadH + G.headerGap;
    const last = pages.at(-1);
    if (last && last.theme === section.theme && last.dark === section.dark && used + subhead + rowHeight(rows[0]) <= pageRoom) {
      last.blocks.push({ type: "subhead", section });
      used += subhead;
    } else {
      open(section, "hero");
    }
    for (const items of rows) {
      const height = rowHeight(items);
      const gap = () => (pages.at(-1)?.blocks.at(-1)?.type === "row" ? G.rowGap : 0);
      if (used + gap() + height > pageRoom) open(section, "cont");
      used += gap() + height;
      pages.at(-1)?.blocks.push({ type: "row", section, items, height });
    }
  }
  return pages;
}
