"use client";

import Image from "next/image";
import { Clock, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { AppLink } from "@/components/ui/AppLink";
import { formatINR } from "@/lib/format";
import { clearRecentSearches, rememberSearch, useRecentSearches } from "@/lib/recent-searches";
import { POPULAR_SEARCHES, rank } from "@/lib/search";
import type { SearchItem, SearchLink } from "@/lib/types";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
  links: SearchLink[];
}

export function SearchOverlay({ open, onClose, items, links }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const recent = useRecentSearches();

  const results = useMemo(() => rank(items, query, (i) => `${i.name} ${i.category} ${i.tags.join(" ")}`).slice(0, 6), [query, items]);
  const linkResults = useMemo(() => rank(links, query, (l) => l.label).slice(0, 4), [query, links]);

  const go = (q: string) => {
    const term = q.trim();
    if (!term) return;
    rememberSearch(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    go(query);
  };

  return (
    <Drawer open={open} onClose={onClose} side="top" label="Search">
      <div className="container-x py-5 md:py-7">
        <form role="search" onSubmit={submit} className="flex items-center gap-3 border-b border-ink pb-3">
          <Search size={20} aria-hidden="true" className="shrink-0" />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            data-autofocus
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search thalis, clocks, tribute frames…"
            className="min-w-0 flex-1 bg-transparent text-[18px] outline-none placeholder:text-muted md:text-[22px]"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="grid h-10 w-10 place-items-center">
            <X size={22} />
          </button>
        </form>

        {query.trim() === "" ? (
          <div className="mt-6 space-y-6">
            {recent.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="eyebrow">Recent searches</p>
                  <button type="button" onClick={clearRecentSearches} className="text-[12px] text-muted underline underline-offset-4 hover:text-ink">
                    Clear
                  </button>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <li key={r}>
                      <button type="button" onClick={() => go(r)} className="flex items-center gap-2 border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink">
                        <Clock size={13} aria-hidden="true" className="text-muted" />
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="eyebrow mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((p) => (
                  <button key={p} type="button" onClick={() => setQuery(p)} className="border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : results.length === 0 && linkResults.length === 0 ? (
          <p className="mt-6 text-muted">
            Nothing matches “{query}” yet. Try “thali”, “clock” or “frame”, or message us on WhatsApp for a custom piece.
          </p>
        ) : (
          <div className="mt-5">
            {linkResults.length > 0 && (
              <ul className="mb-4 flex flex-wrap gap-2" aria-label="Categories">
                {linkResults.map((l) => (
                  <li key={l.href}>
                    <AppLink href={l.href} onClick={onClose} className="inline-flex items-baseline gap-2 bg-amber px-4 py-2 text-[13px] text-[#1e140d] transition hover:brightness-95">
                      {l.label}
                      <span className="text-[10.5px] uppercase tracking-[0.12em] text-muted">{l.kind}</span>
                    </AppLink>
                  </li>
                ))}
              </ul>
            )}
            {results.length > 0 && (
              <ul className="grid gap-x-8 gap-y-1 md:grid-cols-2" aria-label="Products">
                {results.map((r) => (
                  <li key={r.slug}>
                    <AppLink href={`/product/${r.slug}`} onClick={() => { rememberSearch(query); onClose(); }} className="flex items-center gap-4 py-2.5 hover:bg-brown/10">
                      <span className="relative h-16 w-[52px] shrink-0 overflow-hidden bg-brown">
                        {r.image && <Image src={r.image} alt="" fill sizes="52px" className="object-cover" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px]">{r.name}</span>
                        <span className="block text-[12px] text-muted">
                          {r.category} ·{" "}
                          {r.type === "custom"
                            ? r.startingPrice
                              ? `From ${formatINR(r.startingPrice)}`
                              : "Made to order"
                            : r.price
                              ? formatINR(r.price)
                              : ""}
                        </span>
                      </span>
                    </AppLink>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => go(query)} className="nav-label link-line mt-5">
              See all results for “{query.trim()}”
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
