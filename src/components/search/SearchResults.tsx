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
import { hiListingLabel, hiProductName, linkKinds, popularSearches, type LinkHindi } from "@/i18n/names";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

interface SearchProps {
  products: Product[];
  labels: Record<string, string>;
  links: (SearchLink & LinkHindi)[];
}

export function SearchResults(props: SearchProps) {
  const params = useSearchParams();
  return <SearchView {...props} query={params.toString()} />;
}

/** The /search page: query box, matching categories, then the filterable results. */
export function SearchView({ products, labels, links, query }: SearchProps & { query: string }) {
  const q = new URLSearchParams(query).get("q")?.trim() ?? "";

  const hi = useLang() === "hi";
  // Hindi names are searched too, so a search in Hindi finds pieces as well.
  const results = useMemo(
    () =>
      rank(products, q, (p) =>
        [
          p.name,
          hiProductName(p.slug),
          labels[p.category],
          hiListingLabel(p.category),
          p.subcategory,
          p.type === "custom" ? "custom made to order personalised कस्टम ऑर्डर" : "",
          ...p.tags,
          ...p.occasions.flatMap((o) => [labels[o], hiListingLabel(o)]),
        ].join(" "),
      ),
    [products, labels, q],
  );
  const matchingLinks = useMemo(() => rank(links, q, (l) => `${l.label} ${l.hi ?? ""}`).slice(0, 8), [links, q]);

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
        <Breadcrumbs items={[{ label: "Search", hi: "खोज" }]} />
        <h1 className="mt-8 text-[28px] font-semibold leading-[1.15] md:mt-12 md:text-[40px]">{q ? <T en={<>Results for “{q}”</>} hi={<>“{q}” के नतीजे</>} /> : <T en="Search the studio" hi="स्टूडियो में खोजें" />}</h1>
        <form key={q} role="search" onSubmit={submit} className="mt-6 flex max-w-xl items-center gap-3 border-b border-ink pb-2">
          <Search size={19} aria-hidden="true" className="shrink-0" />
          <label htmlFor="search-page-input" className="sr-only">
            <T en="Search products" hi="प्रोडक्ट खोजें" />
          </label>
          <input
            id="search-page-input"
            name="q"
            type="search"
            defaultValue={q}
            autoComplete="off"
            placeholder={hi ? "थाली, घड़ी, ट्रिब्यूट फ़्रेम खोजें…" : "Search thalis, clocks, tribute frames…"}
            className="h-11 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          <button type="submit" className="nav-label h-11 px-2">
            <T en="Search" hi="खोजें" />
          </button>
        </form>

        {matchingLinks.length > 0 && (
          <div className="mt-6">
            <PillLinks label={hi ? "मिलती-जुलती कैटेगरी" : "Matching categories"}>
              {matchingLinks.map((l) => (
                <Pill key={l.href} href={l.href}>
                  <T en={l.label} hi={l.hi} />
                  <span className="ml-2 text-[11px] uppercase tracking-[0.12em] opacity-60">
                    <T en={l.kind} hi={linkKinds[l.kind]} />
                  </span>
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
  const hi = useLang() === "hi";
  return (
    <div>
      <p className="eyebrow mb-3">
        <T en="Popular searches" hi="लोकप्रिय खोजें" />
      </p>
      <ul className="flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((p) => (
          <li key={p}>
            <AppLink
              href={`/search?q=${encodeURIComponent(hi ? (popularSearches[p] ?? p) : p)}`}
              className="inline-block border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink"
            >
              <T en={p} hi={popularSearches[p]} />
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
      <p className="text-[17px] font-medium">
        <T en={<>Nothing matches “{q}” yet.</>} hi={<>“{q}” से मेल खाता कुछ नहीं मिला।</>} />
      </p>
      <p className="mt-2 max-w-lg text-muted">
        <T
          en="Check the spelling or try a shorter word. Many of our pieces are made to order, so tell us what you are looking for and we will let you know if we can make it."
          hi="स्पेलिंग जाँचें या छोटा शब्द आज़माएँ। हमारे कई पीस ऑर्डर पर बनते हैं, इसलिए बताइए आप क्या ढूँढ़ रहे हैं, हम बता देंगे कि बना सकते हैं या नहीं।"
        />
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={whatsappLink(messages.custom(q))} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
          <WhatsAppIcon size={17} /> <T en="Ask us on WhatsApp" hi="WhatsApp पर पूछें" />
        </a>
        <AppLink href="/custom" className="btn btn-outline">
          <T en="Browse custom pieces" hi="कस्टम पीस देखें" />
        </AppLink>
      </div>
      <div className="mt-12">
        <Suggestions />
      </div>
    </div>
  );
}
