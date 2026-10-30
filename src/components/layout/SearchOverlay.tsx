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
import { linkKinds, popularSearches, type LinkHindi, type SearchHindi } from "@/i18n/names";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  items: (SearchItem & SearchHindi)[];
  links: (SearchLink & LinkHindi)[];
}

export function SearchOverlay({ open, onClose, items, links }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const recent = useRecentSearches();
  const lang = useLang();
  const hi = lang === "hi";

  // Hindi names are searched too, so "पूजा थाली" finds the thalis.
  const results = useMemo(
    () => rank(items, query, (i) => `${i.name} ${i.nameHi ?? ""} ${i.category} ${i.categoryHi ?? ""} ${i.tags.join(" ")}`).slice(0, 6),
    [query, items],
  );
  const linkResults = useMemo(() => rank(links, query, (l) => `${l.label} ${l.hi ?? ""}`).slice(0, 4), [query, links]);

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
    <Drawer open={open} onClose={onClose} side="top" label={hi ? "खोजें" : "Search"}>
      <div className="container-x py-5 md:py-7">
        <form role="search" onSubmit={submit} className="flex items-center gap-3 border-b border-ink pb-3">
          <Search size={20} aria-hidden="true" className="shrink-0" />
          <label htmlFor="site-search" className="sr-only">
            <T en="Search products" hi="प्रोडक्ट खोजें" />
          </label>
          <input
            id="site-search"
            data-autofocus
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={hi ? "थाली, घड़ी, ट्रिब्यूट फ़्रेम खोजें…" : "Search thalis, clocks, tribute frames…"}
            className="min-w-0 flex-1 bg-transparent text-[18px] outline-none placeholder:text-muted md:text-[22px]"
          />
          <button type="button" onClick={onClose} aria-label={hi ? "खोज बंद करें" : "Close search"} className="grid h-10 w-10 place-items-center">
            <X size={22} />
          </button>
        </form>

        {query.trim() === "" ? (
          <div className="mt-6 space-y-6">
            {recent.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="eyebrow">
                    <T en="Recent searches" hi="हाल की खोजें" />
                  </p>
                  <button type="button" onClick={clearRecentSearches} className="text-[12px] text-muted underline underline-offset-4 hover:text-ink">
                    <T en="Clear" hi="हटाएँ" />
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
              <p className="eyebrow mb-3">
                <T en="Popular searches" hi="लोकप्रिय खोजें" />
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((p) => (
                  <button key={p} type="button" onClick={() => setQuery(hi ? (popularSearches[p] ?? p) : p)} className="border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink">
                    <T en={p} hi={popularSearches[p]} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : results.length === 0 && linkResults.length === 0 ? (
          <p className="mt-6 text-muted">
            <T
              en={<>Nothing matches “{query}” yet. Try “thali”, “clock” or “frame”, or message us on WhatsApp for a custom piece.</>}
              hi={<>“{query}” से मेल खाता कुछ नहीं मिला। “थाली”, “घड़ी” या “फ़्रेम” खोजकर देखें, या कस्टम पीस के लिए WhatsApp पर मैसेज करें।</>}
            />
          </p>
        ) : (
          <div className="mt-5">
            {linkResults.length > 0 && (
              <ul className="mb-4 flex flex-wrap gap-2" aria-label={hi ? "कैटेगरी" : "Categories"}>
                {linkResults.map((l) => (
                  <li key={l.href}>
                    <AppLink href={l.href} onClick={onClose} className="inline-flex items-baseline gap-2 bg-amber px-4 py-2 text-[13px] text-[#1e140d] transition hover:brightness-95">
                      <T en={l.label} hi={l.hi} />
                      <span className="text-[10.5px] uppercase tracking-[0.12em] text-muted">
                        <T en={l.kind} hi={linkKinds[l.kind]} />
                      </span>
                    </AppLink>
                  </li>
                ))}
              </ul>
            )}
            {results.length > 0 && (
              <ul className="grid gap-x-8 gap-y-1 md:grid-cols-2" aria-label={hi ? "प्रोडक्ट" : "Products"}>
                {results.map((r) => (
                  <li key={r.slug}>
                    <AppLink href={`/product/${r.slug}`} onClick={() => { rememberSearch(query); onClose(); }} className="flex items-center gap-4 py-2.5 hover:bg-brown/10">
                      <span className="relative h-16 w-[52px] shrink-0 overflow-hidden bg-brown">
                        {r.image && <Image src={r.image} alt="" fill sizes="52px" className="object-cover" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px]">
                          <T en={r.name} hi={r.nameHi} />
                        </span>
                        <span className="block text-[12px] text-muted">
                          <T en={r.category} hi={r.categoryHi} /> ·{" "}
                          {r.type === "custom" ? (
                            r.startingPrice ? (
                              <T en={`From ${formatINR(r.startingPrice)}`} hi={`${formatINR(r.startingPrice)} से शुरू`} />
                            ) : (
                              <T en="Made to order" hi="ऑर्डर पर तैयार" />
                            )
                          ) : r.price ? (
                            formatINR(r.price)
                          ) : (
                            ""
                          )}
                        </span>
                      </span>
                    </AppLink>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => go(query)} className="nav-label link-line mt-5">
              <T en={<>See all results for “{query.trim()}”</>} hi={<>“{query.trim()}” के सभी नतीजे देखें</>} />
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
