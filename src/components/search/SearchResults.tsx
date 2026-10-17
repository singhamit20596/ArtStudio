"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { Product, SearchLink } from "@/lib/types";
import { POPULAR_SEARCHES, rank } from "@/lib/search";
import { rememberSearch } from "@/lib/recent-searches";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { AppLink } from "@/components/ui/AppLink";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Breadcrumbs } from "@/components/listing/Breadcrumbs";
import { Pill, PillLinks } from "@/components/listing/ListingHeader";
import { ListingView } from "@/components/listing/ProductListing";

interface SearchProps {
  products: Product[];
  labels: Record<string, string>;
  links: SearchLink[];
}

export function SearchResults(props: SearchProps) {
  const params = useSearchParams();
  return <SearchView {...props} query={params.toString()} />;
}

/** The /search page: query box, matching categories, then the filterable results. */
export function SearchView({ products, labels, links, query }: SearchProps & { query: string }) {
  const q = new URLSearchParams(query).get("q")?.trim() ?? "";

  const results = useMemo(
    () =>
      rank(products, q, (p) =>
        [p.name, labels[p.category], p.subcategory, p.type === "custom" ? "custom made to order personalised" : "", ...p.tags, ...p.occasions.map((o) => labels[o])].join(" "),
      ),
    [products, labels, q],
  );
  const matchingLinks = useMemo(() => rank(links, q, (l) => l.label).slice(0, 8), [links, q]);

  useEffect(() => {
    if (q) rememberSearch(q);
  }, [q]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    if (!next) return;
    // A new search starts without the previous filters.
    window.history.pushState(null, "", `?q=${encodeURIComponent(next)}`);
  };

  return (
    <>
      <header className="pt-6 pb-8 md:pt-8 md:pb-10">
        <Breadcrumbs items={[{ label: "Search" }]} />
        <h1 className="mt-8 text-[28px] font-semibold leading-[1.15] md:mt-12 md:text-[40px]">{q ? <>Results for “{q}”</> : "Search the studio"}</h1>
        <form key={q} role="search" onSubmit={submit} className="mt-6 flex max-w-xl items-center gap-3 border-b border-ink pb-2">
          <Search size={19} aria-hidden="true" className="shrink-0" />
          <label htmlFor="search-page-input" className="sr-only">
            Search products
          </label>
          <input
            id="search-page-input"
            name="q"
            type="search"
            defaultValue={q}
            autoComplete="off"
            placeholder="Search thalis, clocks, tribute frames…"
            className="h-11 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          <button type="submit" className="nav-label h-11 px-2">
            Search
          </button>
        </form>

        {matchingLinks.length > 0 && (
          <div className="mt-6">
            <PillLinks label="Matching categories">
              {matchingLinks.map((l) => (
                <Pill key={l.href} href={l.href}>
                  {l.label}
                  <span className="ml-2 text-[11px] uppercase tracking-[0.12em] opacity-60">{l.kind}</span>
                </Pill>
              ))}
            </PillLinks>
          </div>
        )}
      </header>

      {!q ? (
        <Suggestions />
      ) : (
        <ListingView
          products={results}
          facets={["category", "type", "occasion", "price", "colour", "stock"]}
          labels={labels}
          defaultSortLabel="Best match"
          query={query}
          empty={<NoResults q={q} />}
        />
      )}
    </>
  );
}

function Suggestions() {
  return (
    <div>
      <p className="eyebrow mb-3">Popular searches</p>
      <ul className="flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((p) => (
          <li key={p}>
            <AppLink href={`/search?q=${encodeURIComponent(p)}`} className="inline-block border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink">
              {p}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoResults({ q }: { q: string }) {
  return (
    <div className="border-t border-line pt-10">
      <p className="text-[17px] font-medium">Nothing matches “{q}” yet.</p>
      <p className="mt-2 max-w-lg text-muted">Check the spelling or try a shorter word. Many of our pieces are made to order, so tell us what you are looking for and we will let you know if we can make it.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={whatsappLink(messages.custom(q))} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
          <WhatsAppIcon size={17} /> Ask us on WhatsApp
        </a>
        <AppLink href="/custom" className="btn btn-outline">
          Browse custom pieces
        </AppLink>
      </div>
      <div className="mt-12">
        <Suggestions />
      </div>
    </div>
  );
}
