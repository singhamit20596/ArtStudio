"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import { COLOURS, facetCounts, PRICE_PRESETS, priceLabel, TYPE_LABELS, type FacetKey, type ListingFilters } from "@/lib/listing";

interface FilterGroupsProps {
  products: Product[];
  filters: ListingFilters;
  facets: FacetKey[];
  labels: Record<string, string>;
  onChange: (next: Partial<ListingFilters>) => void;
}

const LEGENDS: Record<FacetKey, string> = {
  category: "Category",
  sub: "Category",
  type: "Ready or custom",
  occasion: "Occasion",
  price: "Price",
  colour: "Colour",
  stock: "Availability",
};

/** The filter groups, shared by the desktop sidebar and the mobile bottom sheet. */
export function FilterGroups({ products, filters, facets, labels, onChange }: FilterGroupsProps) {
  return (
    <div className="divide-y divide-line">
      {facets.map((key) => {
        const body = renderFacet(key, { products, filters, labels, onChange });
        return body ? (
          <details key={key} open className="group/f py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
              {LEGENDS[key]}
              <span aria-hidden="true" className="w-3 text-center text-[16px] font-normal leading-none">
                <span className="group-open/f:hidden">+</span>
                <span className="hidden group-open/f:inline">−</span>
              </span>
            </summary>
            <fieldset className="mt-3">
              <legend className="sr-only">{LEGENDS[key]}</legend>
              {body}
            </fieldset>
          </details>
        ) : null;
      })}
    </div>
  );
}

function renderFacet(key: FacetKey, { products, filters, labels, onChange }: Omit<FilterGroupsProps, "facets">): ReactNode {
  if (key === "price") return <PriceFacet products={products} filters={filters} onChange={onChange} />;

  if (key === "stock") {
    const hasReady = products.some((p) => p.type === "ready");
    if (!hasReady && !filters.stock) return null;
    return (
      <Option checked={filters.stock} onToggle={() => onChange({ stock: !filters.stock })} label="In stock" hint="Ready to ship" />
    );
  }

  const counts = facetCounts(products, filters, key);
  const selected = filters[key];
  // Categories and occasions follow the catalogue order (labels are built in that order).
  const order = Object.keys(labels);
  let options = [...counts.keys()];
  if (key === "category" || key === "occasion") options.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  if (key === "colour") options = COLOURS.map((c) => c.slug).filter((c) => counts.has(c));
  if (key === "type") options = ["ready", "custom"].filter((t) => counts.has(t));
  // A group with a single choice filters nothing, unless it is already in use.
  if (options.length < 2 && selected.length === 0) return null;

  const toggle = (value: string) =>
    onChange({ [key]: selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value] });

  return (
    <ul className="space-y-0.5">
      {options.map((value) => {
        const colour = key === "colour" ? COLOURS.find((c) => c.slug === value) : undefined;
        const label = key === "type" ? TYPE_LABELS[value] : (colour?.label ?? labels[value] ?? value);
        return (
          <li key={value}>
            <Option
              checked={selected.includes(value)}
              onToggle={() => toggle(value)}
              label={label}
              count={counts.get(value) ?? 0}
              swatch={colour?.swatch}
            />
          </li>
        );
      })}
    </ul>
  );
}

function Option({
  checked,
  onToggle,
  label,
  count,
  hint,
  swatch,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  count?: number;
  hint?: string;
  swatch?: string;
}) {
  const dim = count === 0 && !checked;
  return (
    <label className={clsx("flex min-h-9 cursor-pointer items-center gap-3 py-1 text-[13.5px]", dim && "text-muted")}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="h-4 w-4 shrink-0 cursor-pointer accent-brown" />
      {swatch && <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full ring-1 ring-ink/15" style={{ background: swatch }} />}
      <span className="flex-1 leading-snug">
        {label}
        {hint && <span className="block text-[12px] text-muted">{hint}</span>}
      </span>
      {count != null && <span className="text-[12px] tabular-nums text-muted">{count}</span>}
    </label>
  );
}

function PriceFacet({ products, filters, onChange }: Pick<FilterGroupsProps, "products" | "filters" | "onChange">) {
  if (!products.some((p) => p.price != null || p.startingPrice != null)) return null;
  const isPreset = (p: (typeof PRICE_PRESETS)[number]) => p.min === filters.min && p.max === filters.max;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const read = (k: string) => {
      const n = Number(data.get(k));
      return data.get(k) !== "" && Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
    };
    let min = read("min");
    let max = read("max");
    if (min != null && max != null && min > max) [min, max] = [max, min];
    onChange({ min, max });
  };

  return (
    <div>
      <ul className="space-y-0.5">
        {PRICE_PRESETS.map((p) => (
          <li key={priceLabel(p.min, p.max)}>
            <Option checked={isPreset(p)} onToggle={() => onChange(isPreset(p) ? { min: null, max: null } : { min: p.min, max: p.max })} label={priceLabel(p.min, p.max)} />
          </li>
        ))}
      </ul>
      <form key={`${filters.min}-${filters.max}`} onSubmit={submit} className="mt-3 flex items-center gap-2">
        <PriceInput name="min" label="Minimum price" placeholder="Min" defaultValue={filters.min} />
        <span aria-hidden="true" className="text-muted">
          –
        </span>
        <PriceInput name="max" label="Maximum price" placeholder="Max" defaultValue={filters.max} />
        <button type="submit" className="h-9 shrink-0 border border-ink px-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-brown hover:border-brown hover:text-paper">
          Go
        </button>
      </form>
    </div>
  );
}

function PriceInput({ name, label, placeholder, defaultValue }: { name: string; label: string; placeholder: string; defaultValue: number | null }) {
  return (
    <label className="flex h-9 min-w-0 flex-1 items-center border border-ink/20 px-2 focus-within:border-ink">
      <span aria-hidden="true" className="text-muted">
        ₹
      </span>
      <span className="sr-only">{label}</span>
      <input
        name={name}
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="w-full min-w-0 bg-transparent pl-1 text-[13px] tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
    </label>
  );
}
