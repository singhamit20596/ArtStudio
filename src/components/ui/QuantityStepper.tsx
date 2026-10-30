"use client";

import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import { useLang } from "@/i18n/use-lang";

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** Used in the button labels, e.g. "Marble Noir". */
  itemName?: string;
  size?: "sm" | "md";
  className?: string;
}

/** − 1 + control for quantities. */
export function QuantityStepper({ value, max, onChange, itemName, size = "md", className }: QuantityStepperProps) {
  const hi = useLang() === "hi";
  const of = itemName ? (hi ? ` (${itemName})` : ` of ${itemName}`) : "";
  const button = clsx("grid h-full place-items-center disabled:opacity-30", size === "sm" ? "w-8" : "w-10");
  return (
    <div className={clsx("flex items-center border border-ink/20", size === "sm" ? "h-9" : "h-11", className)} role="group" aria-label={`${hi ? "मात्रा" : "Quantity"}${of}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={`${hi ? "एक कम" : "One fewer"}${of}`} className={button}>
        <Minus size={size === "sm" ? 13 : 15} />
      </button>
      <output aria-live="polite" className="w-7 text-center text-[13px] tabular-nums">
        {value}
      </output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`${hi ? "एक और" : "One more"}${of}`} className={button}>
        <Plus size={size === "sm" ? 13 : 15} />
      </button>
    </div>
  );
}
