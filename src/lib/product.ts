import { themedLineFor } from "@/config/lines";
import { launch } from "@/config/launch";
import type { Category, Product } from "./types";

/*
 * Pure helpers with no catalogue data, so client components can use them
 * without pulling seed.json into the browser bundle. catalog.ts re-exports them.
 */

export function productHref(p: Pick<Product, "slug">) {
  return `/product/${p.slug}`;
}

export function categoryHref(c: Pick<Category, "slug" | "type">) {
  // The featured line (Retirement Gifts) has its own page.
  if (c.slug === launch.focus) return "/retirement-gifts";
  // Themed lines (Diwali, Christmas, Car Gifts) have their own pages too.
  const themed = themedLineFor(c.slug);
  if (themed) return themed.path;
  if (c.type === "ready") return `/shop/${c.slug}`;
  return `/custom/${c.slug}`;
}

export function occasionHref(slug: string) {
  return `/occasion/${slug}`;
}

/** "Shubh Labh Toran | Resin Door Hanging | Pair" → "Shubh Labh Toran" */
export function shortName(p: Pick<Product, "name">) {
  return p.name.split(" | ")[0];
}

/** Price used for sorting and the price filter: the price, or the "From" price of a custom piece. */
export function effectivePrice(p: Pick<Product, "price" | "startingPrice">) {
  return p.price ?? p.startingPrice;
}

/** "Torans & door hangings" → "torans-door-hangings" */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
