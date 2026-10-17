"use client";

import Image from "next/image";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { AppLink } from "@/components/ui/AppLink";
import { toast } from "@/components/ui/Toaster";
import { formatINR } from "@/lib/format";
import { isPreview } from "@/lib/preview";
import type { SearchItem } from "@/lib/types";

const POPULAR = ["Tribute frame", "Pooja thali", "Wall clock", "Keychain", "Karwa Chauth", "Shadow box"];

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ऀ-ॿ\s]/g, " ");

/** Edit distance capped at 1, enough to forgive a single typo ("keychian"). */
function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function score(item: SearchItem, tokens: string[]) {
  const words = normalise(`${item.name} ${item.category} ${item.tags.join(" ")}`).split(/\s+/).filter(Boolean);
  let total = 0;
  for (const t of tokens) {
    if (words.some((w) => w.startsWith(t))) total += 3;
    else if (words.some((w) => w.includes(t))) total += 2;
    else if (t.length >= 4 && words.some((w) => withinOneEdit(w.slice(0, t.length + 1), t) || withinOneEdit(w, t))) total += 1;
    else return 0;
  }
  return total;
}

export function SearchOverlay({ open, onClose, items }: { open: boolean; onClose: () => void; items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    const tokens = normalise(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];
    return items
      .map((item) => ({ item, s: score(item, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((r) => r.item);
  }, [query, items]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (isPreview) {
      toast("The full search results page arrives in Phase 2.");
      return;
    }
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
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
          <div className="mt-6">
            <p className="eyebrow mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button key={p} type="button" onClick={() => setQuery(p)} className="border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink">
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="mt-6 text-muted">
            Nothing matches “{query}” yet. Try “thali”, “clock” or “frame”, or message us on WhatsApp for a custom piece.
          </p>
        ) : (
          <ul className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-2">
            {results.map((r) => (
              <li key={r.slug}>
                <AppLink href={`/product/${r.slug}`} onClick={onClose} className="flex items-center gap-4 py-2.5 hover:bg-cream">
                  <span className="relative h-16 w-[52px] shrink-0 overflow-hidden bg-sand">
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
      </div>
    </Drawer>
  );
}
