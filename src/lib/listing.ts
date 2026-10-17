import { formatINR } from "./format";
import { effectivePrice, slugify } from "./product";
import type { Product } from "./types";

/*
 * Filtering and sorting for listing pages. Pure functions over the URL query, so the
 * same code runs in the browser now and can move to a database query in Phase 4.
 *
 * URL keys: category, sub, type, occasion, colour (comma-separated), min, max, stock=1, sort.
 */

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "bestselling";
export type FacetKey = "category" | "sub" | "type" | "occasion" | "price" | "colour" | "stock";
type ListKey = "category" | "sub" | "type" | "occasion" | "colour";

export interface ListingFilters {
  category: string[];
  sub: string[];
  type: string[];
  occasion: string[];
  colour: string[];
  min: number | null;
  max: number | null;
  stock: boolean;
  sort: SortKey;
}

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "bestselling", label: "Bestselling" },
];

export const TYPE_LABELS: Record<string, string> = { ready: "Ready to ship", custom: "Made to order" };

/** Colour families used by the colour filter. `swatch` is any CSS background. */
export const COLOURS: { slug: string; label: string; swatch: string }[] = [
  { slug: "red", label: "Red", swatch: "#b3261e" },
  { slug: "pink", label: "Pink", swatch: "#e8a7b3" },
  { slug: "gold", label: "Gold", swatch: "linear-gradient(135deg,#e6cf9c,#a8844e)" },
  { slug: "green", label: "Green", swatch: "#6f9468" },
  { slug: "teal", label: "Teal", swatch: "#1f7a78" },
  { slug: "blue", label: "Blue", swatch: "#2f5d9b" },
  { slug: "white", label: "White", swatch: "#ffffff" },
  { slug: "black", label: "Black", swatch: "#111111" },
  { slug: "clear", label: "Clear", swatch: "repeating-conic-gradient(#e8e2d9 0 25%,#fff 0 50%) 0 0/8px 8px" },
  { slug: "multicolour", label: "Multicolour", swatch: "conic-gradient(#e8a7b3,#e6cf9c,#6f9468,#2f5d9b,#e8a7b3)" },
];

export const PRICE_PRESETS: { min: number | null; max: number | null }[] = [
  { min: null, max: 500 },
  { min: 500, max: 1500 },
  { min: 1500, max: 3000 },
  { min: 3000, max: null },
];

export function priceLabel(min: number | null, max: number | null) {
  if (min != null && max != null) return `${formatINR(min)} – ${formatINR(max)}`;
  if (max != null) return `Under ${formatINR(max)}`;
  if (min != null) return `${formatINR(min)} and above`;
  return "Any price";
}

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const num = (v: string | null) => {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
};

export function parseFilters(params: URLSearchParams): ListingFilters {
  const sort = params.get("sort");
  return {
    category: list(params.get("category")),
    sub: list(params.get("sub")),
    type: list(params.get("type")),
    occasion: list(params.get("occasion")),
    colour: list(params.get("colour")),
    min: num(params.get("min")),
    max: num(params.get("max")),
    stock: params.get("stock") === "1",
    sort: SORTS.some((s) => s.key === sort) ? (sort as SortKey) : "featured",
  };
}

const FILTER_KEYS = ["category", "sub", "type", "occasion", "colour", "min", "max", "stock", "sort", "page"];

/** Writes the filters into `base`, keeping any other keys (such as the search query `q`). */
export function filtersToQuery(f: ListingFilters, base: URLSearchParams) {
  const params = new URLSearchParams(base);
  FILTER_KEYS.forEach((k) => params.delete(k));
  (["category", "sub", "type", "occasion", "colour"] as ListKey[]).forEach((k) => {
    if (f[k].length) params.set(k, f[k].join(","));
  });
  if (f.min != null) params.set("min", String(f.min));
  if (f.max != null) params.set("max", String(f.max));
  if (f.stock) params.set("stock", "1");
  if (f.sort !== "featured") params.set("sort", f.sort);
  return params.toString();
}

export function activeFilterCount(f: ListingFilters) {
  return f.category.length + f.sub.length + f.type.length + f.occasion.length + f.colour.length + (f.min != null || f.max != null ? 1 : 0) + (f.stock ? 1 : 0);
}

/** The value a product contributes to each list facet. */
export function facetValues(p: Product, key: ListKey): string[] {
  switch (key) {
    case "category":
      return [p.category];
    case "sub":
      return p.subcategory ? [slugify(p.subcategory)] : [];
    case "type":
      return [p.type];
    case "occasion":
      return p.occasions;
    case "colour":
      return p.colours;
  }
}

function matches(p: Product, f: ListingFilters, skip?: FacetKey) {
  for (const key of ["category", "sub", "type", "occasion", "colour"] as ListKey[]) {
    if (key === skip || f[key].length === 0) continue;
    if (!facetValues(p, key).some((v) => f[key].includes(v))) return false;
  }
  if (skip !== "price" && (f.min != null || f.max != null)) {
    const price = effectivePrice(p);
    if (price == null || (f.min != null && price < f.min) || (f.max != null && price > f.max)) return false;
  }
  if (skip !== "stock" && f.stock && !(p.type === "ready" && (p.stock ?? 0) > 0)) return false;
  return true;
}

export function applyFilters(products: Product[], f: ListingFilters, skip?: FacetKey) {
  return products.filter((p) => matches(p, f, skip));
}

/** For each option of a list facet: how many products it would show, given the other filters. */
export function facetCounts(products: Product[], f: ListingFilters, key: ListKey) {
  const counts = new Map<string, number>();
  for (const p of products) for (const v of facetValues(p, key)) counts.set(v, counts.get(v) ?? 0);
  for (const p of applyFilters(products, f, key)) for (const v of facetValues(p, key)) counts.set(v, (counts.get(v) ?? 0) + 1);
  return counts;
}

const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
  const pa = effectivePrice(a);
  const pb = effectivePrice(b);
  if (pa == null) return pb == null ? 0 : 1;
  if (pb == null) return -1;
  return (pa - pb) * dir;
};

/** Stable sort; "featured" keeps the order the page passed in. */
export function sortProducts(products: Product[], sort: SortKey) {
  const out = [...products];
  if (sort === "newest") out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (sort === "price-asc") out.sort(byPrice(1));
  if (sort === "price-desc") out.sort(byPrice(-1));
  if (sort === "bestselling") out.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
  return out;
}
