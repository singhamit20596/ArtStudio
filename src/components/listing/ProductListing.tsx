"use client";

import clsx from "clsx";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import {
  activeFilterCount,
  applyFilters,
  COLOURS,
  filtersToQuery,
  parseFilters,
  priceLabel,
  priceLabelHi,
  sortProducts,
  SORTS,
  TYPE_LABELS,
  type FacetKey,
  type ListingFilters,
} from "@/lib/listing";
import { Drawer } from "@/components/ui/Drawer";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterGroups } from "./FilterGroups";
import { colourLabels, hiListingLabel, sortLabels, typeLabels } from "@/i18n/names";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

export interface ListingProps {
  /** The products this page covers, in "Featured" (or best-match) order. */
  products: Product[];
  /** Filter groups offered on this page, in display order. */
  facets: FacetKey[];
  /** Names for category, subcategory and occasion slugs. */
  labels: Record<string, string>;
  /** Label for the default sort ("Featured", or "Best match" on search). */
  defaultSortLabel?: string;
  /** Shown instead of the grid when the page has no products at all. */
  empty?: ReactNode;
}

const PAGE = 24;
const CARD_SIZES = "(min-width: 1024px) 24vw, (min-width: 768px) 31vw, 46vw";

/** Reads the filters from the URL. Wrap in <Suspense> with <ListingView query=""> as the fallback. */
export function ProductListing(props: ListingProps) {
  const params = useSearchParams();
  return <ListingView {...props} query={params.toString()} />;
}

export function ListingView({ products, facets, labels, defaultSortLabel = "Featured", empty, query }: ListingProps & { query: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const filters = useMemo(() => parseFilters(new URLSearchParams(query)), [query]);
  const results = useMemo(() => sortProducts(applyFilters(products, filters), filters.sort), [products, filters]);
  const active = activeFilterCount(filters);
  const hi = useLang() === "hi";

  const update = (next: Partial<ListingFilters>) => {
    const qs = filtersToQuery({ ...filters, ...next }, new URLSearchParams(window.location.search));
    // The History API keeps Next.js's useSearchParams in sync without a server round trip.
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };
  const clearAll = () => update({ category: [], sub: [], type: [], occasion: [], colour: [], min: null, max: null, stock: false });

  if (products.length === 0) return <>{empty}</>;

  const groups = <FilterGroups products={products} filters={filters} facets={facets} labels={labels} onChange={update} />;
  const countLabel = <T en={`${results.length} ${results.length === 1 ? "piece" : "pieces"}`} hi={`${results.length} पीस`} />;

  return (
    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:gap-16">
      <aside aria-label={hi ? "फ़िल्टर" : "Filters"} className="hidden lg:block">
        <h2 className="nav-label border-b border-ink pb-3">
          <T en="Filter" hi="फ़िल्टर" />
        </h2>
        {groups}
      </aside>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
          <p className="text-[13px] text-muted" aria-live="polite">
            {countLabel}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSheetOpen(true)} className="nav-label flex h-10 items-center gap-2 border border-ink/20 px-3.5 lg:hidden">
              <SlidersHorizontal size={15} strokeWidth={1.8} aria-hidden="true" />
              <T en="Filter" hi="फ़िल्टर" />
              {active > 0 && <span className="tabular-nums">({active})</span>}
            </button>
            <label className="relative flex h-10 items-center border border-ink/20 lg:border-transparent">
              <span className="sr-only">
                <T en="Sort by" hi="क्रम बदलें" />
              </span>
              <span aria-hidden="true" className="nav-label hidden pl-3.5 text-muted sm:inline">
                <T en="Sort" hi="क्रम" />
              </span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as ListingFilters["sort"] })}
                className="h-full cursor-pointer appearance-none bg-transparent pl-3.5 pr-8 text-[13px] outline-none sm:pl-2"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {hi ? (s.key === "featured" ? (sortLabels[defaultSortLabel] ?? sortLabels.featured) : sortLabels[s.key]) : s.key === "featured" ? defaultSortLabel : s.label}
                  </option>
                ))}
              </select>
              <svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" className="pointer-events-none absolute right-3 fill-none stroke-current">
                <path d="M1 1l4 4 4-4" strokeWidth="1.4" />
              </svg>
            </label>
          </div>
        </div>

        <ActiveChips filters={filters} labels={labels} onChange={update} onClear={clearAll} />

        {results.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[16px] font-medium">
              <T en="No pieces match these filters" hi="इन फ़िल्टर से मेल खाता कोई पीस नहीं मिला" />
            </p>
            <p className="mt-2 text-muted">
              <T en="Try removing a filter, or message us for a custom piece." hi="कोई फ़िल्टर हटाकर देखें, या कस्टम पीस के लिए हमें मैसेज करें।" />
            </p>
            <button type="button" onClick={clearAll} className="btn btn-dark mt-6">
              <T en="Clear filters" hi="फ़िल्टर हटाएँ" />
            </button>
          </div>
        ) : (
          <Grid key={query} products={results} />
        )}
      </div>

      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom" label={hi ? "फ़िल्टर" : "Filters"}>
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="nav-label">
            <T en="Filter" hi="फ़िल्टर" />
          </h2>
          <button type="button" onClick={() => setSheetOpen(false)} aria-label={hi ? "फ़िल्टर बंद करें" : "Close filters"} className="-mr-2 grid h-10 w-10 place-items-center">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4">{groups}</div>
        <div className="grid grid-cols-2 gap-3 border-t border-line px-5 py-4">
          <button type="button" onClick={clearAll} disabled={active === 0} className="btn btn-outline disabled:opacity-40">
            <T en="Clear all" hi="सब हटाएँ" />
          </button>
          <button type="button" onClick={() => setSheetOpen(false)} className="btn btn-dark">
            <T en={`Show ${results.length}`} hi={`${results.length} दिखाएँ`} />
          </button>
        </div>
      </Drawer>
    </div>
  );
}

function Grid({ products }: { products: Product[] }) {
  const [limit, setLimit] = useState(PAGE);
  const shown = products.slice(0, limit);
  return (
    <>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
        {shown.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} sizes={CARD_SIZES} />
          </li>
        ))}
      </ul>
      {products.length > limit && (
        <div className="mt-14 flex flex-col items-center gap-4">
          <p className="text-[12.5px] text-muted">
            <T en={`Showing ${shown.length} of ${products.length}`} hi={`${products.length} में से ${shown.length}`} />
          </p>
          <button type="button" onClick={() => setLimit((n) => n + PAGE)} className="btn btn-outline">
            <T en="Show more" hi="और दिखाएँ" />
          </button>
        </div>
      )}
    </>
  );
}

function ActiveChips({
  filters,
  labels,
  onChange,
  onClear,
}: {
  filters: ListingFilters;
  labels: Record<string, string>;
  onChange: (next: Partial<ListingFilters>) => void;
  onClear: () => void;
}) {
  const hi = useLang() === "hi";
  const chips: { key: string; label: string; labelHi?: string; remove: () => void }[] = [];
  (["category", "sub", "type", "occasion", "colour"] as const).forEach((k) =>
    filters[k].forEach((v) =>
      chips.push({
        key: `${k}:${v}`,
        label: k === "type" ? TYPE_LABELS[v] ?? v : k === "colour" ? COLOURS.find((c) => c.slug === v)?.label ?? v : labels[v] ?? v,
        labelHi: k === "type" ? typeLabels[v] : k === "colour" ? colourLabels[v] : hiListingLabel(v),
        remove: () => onChange({ [k]: filters[k].filter((x) => x !== v) }),
      }),
    ),
  );
  if (filters.min != null || filters.max != null)
    chips.push({ key: "price", label: priceLabel(filters.min, filters.max), labelHi: priceLabelHi(filters.min, filters.max), remove: () => onChange({ min: null, max: null }) });
  if (filters.stock) chips.push({ key: "stock", label: "In stock", labelHi: "स्टॉक में", remove: () => onChange({ stock: false }) });

  if (chips.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.remove}
          aria-label={hi ? `फ़िल्टर हटाएँ: ${c.labelHi ?? c.label}` : `Remove filter: ${c.label}`}
          className={clsx("flex items-center gap-1.5 bg-amber px-3 py-1.5 text-[12.5px] text-[#1e140d] transition hover:brightness-95")}
        >
          <T en={c.label} hi={c.labelHi} />
          <X size={13} aria-hidden="true" />
        </button>
      ))}
      <button type="button" onClick={onClear} className="ml-1 text-[12.5px] underline underline-offset-4 hover:no-underline">
        <T en="Clear all" hi="सब हटाएँ" />
      </button>
    </div>
  );
}
