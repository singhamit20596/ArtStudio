"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Product } from "@/lib/types";
import { createLocalStore, pushRecent } from "@/lib/local-store";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "./ProductCard";
import { T } from "@/i18n/T";

const NONE: string[] = [];
const store = createLocalStore<string[]>("artstudio.recentlyViewed", NONE);

/** Records this product and lists the others the visitor looked at recently (this browser only). */
export function RecentlyViewed({ current, products }: { current: string; products: Product[] }) {
  const slugs = useSyncExternalStore(store.subscribe, store.get, store.server);

  useEffect(() => {
    store.set(pushRecent(store.get(), current, 12));
  }, [current]);

  const items = slugs
    .filter((s) => s !== current)
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recent-title" className="container-x pb-20 md:pb-24">
      <SectionHeader id="recent-title" eyebrow={<T en="Your browsing" hi="आपने देखा" />} title={<T en="Recently viewed" hi="हाल ही में देखे गए" />} />
      <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {items.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} sizes="(min-width: 768px) 25vw, 46vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
