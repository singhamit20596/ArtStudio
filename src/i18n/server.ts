import { categories, occasions } from "@/lib/catalog";
import type { SearchItem, SearchLink } from "@/lib/types";
import { categoryNames, hiProductName, occasionNames, type LinkHindi, type SearchHindi } from "./names";

/*
 * Server-side helpers that add Hindi names to catalogue data before it goes to the browser,
 * without changing src/lib/catalog.ts.
 */

const categoryByName = () => new Map(categories.map((c) => [c.name, c.slug]));

/** The search overlay's product list, with Hindi names (so Hindi searches match too). */
export function withHindiSearch(items: SearchItem[]): (SearchItem & SearchHindi)[] {
  const bySlug = categoryByName();
  return items.map((i) => {
    const category = bySlug.get(i.category);
    return { ...i, nameHi: hiProductName(i.slug), categoryHi: category ? categoryNames[category] : undefined };
  });
}

/** Category and occasion links (search), with their Hindi names. */
export function withHindiLinks(links: SearchLink[]): (SearchLink & LinkHindi)[] {
  const bySlug = categoryByName();
  const occasionByName = new Map(occasions.map((o) => [o.name, o.slug]));
  return links.map((l) => {
    const category = l.kind === "Occasion" ? undefined : bySlug.get(l.label);
    const occasion = l.kind === "Occasion" ? occasionByName.get(l.label) : undefined;
    return { ...l, hi: category ? categoryNames[category] : occasion ? occasionNames[occasion] : undefined };
  });
}
