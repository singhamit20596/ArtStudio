import seed from "@/data/seed.json";
import type { Category, Occasion, Product, SearchItem, Seed } from "./types";

const data = seed as unknown as Seed;

/** Every product, including unpublished drafts. */
export const allProducts: Product[] = data.products;

/** Products visible on the storefront. */
export const products: Product[] = data.products.filter((p) => p.published);

export const categories: Category[] = data.categories;
export const readyCategories = categories.filter((c) => c.type === "ready");
export const customCategories = categories.filter((c) => c.type === "custom");
export const occasions: Occasion[] = data.occasions;

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

const newestFirst = (a: Product, b: Product) => b.createdAt.localeCompare(a.createdAt);

export function newArrivals(limit = 8) {
  return products.filter((p) => p.type === "ready").sort(newestFirst).slice(0, limit);
}

export function forOccasions(slugs: string[], limit = 8) {
  return products
    .filter((p) => p.type === "ready" && p.occasions.some((o) => slugs.includes(o)))
    .sort(newestFirst)
    .slice(0, limit);
}

export function productHref(p: Pick<Product, "slug">) {
  return `/product/${p.slug}`;
}

export function categoryHref(c: Pick<Category, "slug" | "type">) {
  if (c.type === "ready") return c.slug === "gifts" ? "/gifts" : `/shop/${c.slug}`;
  return `/custom/${c.slug}`;
}

export function occasionHref(slug: string) {
  return `/occasion/${slug}`;
}

/** "Shubh Labh Toran | Resin Door Hanging | Pair" → "Shubh Labh Toran" */
export function shortName(p: Pick<Product, "name">) {
  return p.name.split(" | ")[0];
}

export function searchIndex(): SearchItem[] {
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    type: p.type,
    category: getCategory(p.category)?.name ?? "",
    price: p.price,
    startingPrice: p.startingPrice,
    image: p.images[0] ?? null,
    tags: p.tags,
  }));
}
