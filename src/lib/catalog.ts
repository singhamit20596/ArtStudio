import seed from "@/data/seed.json";
import { launch } from "@/config/launch";
import { categoryHref, occasionHref, slugify } from "./product";
import type { CartProduct } from "./pricing";
import type { Category, Occasion, Product, SearchItem, SearchLink, Seed } from "./types";

export { categoryHref, effectivePrice, occasionHref, productHref, shortName, slugify } from "./product";

const data = seed as unknown as Seed;

/** Every product, including unpublished drafts. */
export const allProducts: Product[] = data.products;

/** Every category, including ones not on sale yet (see launch.categories). */
export const allCategories: Category[] = data.categories;

const onSale = (category: string) => launch.categories.includes(category);

/**
 * Products visible on the storefront, in "Featured" order (their order in seed.json).
 * Only published products in the categories on sale right now (src/config/launch.ts).
 */
export const products: Product[] = data.products.filter((p) => p.published && onSale(p.category));

export const categories: Category[] = data.categories.filter((c) => onSale(c.slug));
export const readyCategories = categories.filter((c) => c.type === "ready");
/** Ready-made categories with their own /shop/[slug] page ("Gifts" lives at /gifts). */
export const shopCategories = readyCategories.filter((c) => c.slug !== "gifts");
export const customCategories = categories.filter((c) => c.type === "custom");
export const occasions: Occasion[] = data.occasions;

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getOccasion(slug: string) {
  return occasions.find((o) => o.slug === slug);
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

export function productsInCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function productsForOccasion(slug: string) {
  return products.filter((p) => p.occasions.includes(slug));
}

/** The curated gift shop: every product tagged "gift". */
export function giftProducts() {
  return products.filter((p) => p.tags.includes("gift"));
}

/** Same category first, then pieces that share an occasion. */
export function similarProducts(product: Product, limit = 8) {
  const others = products.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.category === product.category);
  const shared = others
    .filter((p) => p.category !== product.category && p.occasions.some((o) => product.occasions.includes(o)))
    .sort((a, b) => sharedCount(b, product) - sharedCount(a, product));
  return [...sameCategory, ...shared].slice(0, limit);
}

const sharedCount = (a: Product, b: Product) => a.occasions.filter((o) => b.occasions.includes(o)).length;

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

/** Categories and occasions the search overlay can suggest. */
export function searchLinks(): SearchLink[] {
  return [
    ...readyCategories.map((c) => ({ label: c.name, kind: "Category", href: categoryHref(c) })),
    ...customCategories.map((c) => ({ label: c.name, kind: "Custom", href: categoryHref(c) })),
    ...occasions.map((o) => ({ label: o.name, kind: "Occasion", href: occasionHref(o.slug) })),
  ];
}

/** Display names for every slug a listing filter can hold (categories, sub-categories, occasions). */
export function listingLabels(): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const c of categories) labels[c.slug] = c.name;
  for (const o of occasions) labels[o.slug] = o.name;
  for (const p of products) if (p.subcategory) labels[slugify(p.subcategory)] = p.subcategory;
  return labels;
}

/** Ready-made products with a price: everything the cart and checkout need to know. */
export function cartCatalog(): CartProduct[] {
  return products
    .filter((p): p is Product & { price: number } => p.type === "ready" && p.price != null)
    .map((p) => ({ slug: p.slug, name: p.name, price: p.price, image: p.images[0] ?? null, stock: p.stock ?? 0, makingTimeDays: p.makingTimeDays }));
}
