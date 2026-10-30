"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Product } from "@/lib/types";
import { TributeArt } from "./TributeArt";
import { hiShortName } from "@/i18n/names";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

/** "frame", "lit" (only while lights are on offer), or "sample-1", "sample-2"… */
export type TributeView = string;

interface Slide {
  id: TributeView;
  label: string;
  /** The caption in Hindi. */
  labelHi?: string;
  src: string | null;
  alt: string;
}

interface TributeGalleryProps {
  product: Product;
  view: TributeView;
  onView: (view: TributeView) => void;
}

/**
 * A tribute's photos: one photo of the frame (plus the same frame lit, while lights are on
 * offer), then the sample photos. Every photo is shown whole, since samples come in any shape.
 * They crossfade; swipe on phones, arrows and thumbnails everywhere.
 */
export function TributeGallery({ product, view, onView }: TributeGalleryProps) {
  const g = product.gallery;
  const name = product.name.split(" | ")[0];
  const nameHi = hiShortName(product.slug);
  const hi = useLang() === "hi";
  const ratio = g?.ratio ?? "4 / 5";
  const startX = useRef<number | null>(null);

  const lights = product.lightPrice != null;
  const slides: Slide[] = [
    { id: "frame", label: name, labelHi: nameHi, src: g?.frame ?? null, alt: name },
    ...(lights ? [{ id: "lit", label: "With light", labelHi: "लाइट के साथ", src: g?.frameLit ?? null, alt: `${name} with its LED lights on` }] : []),
    ...(g?.samples ?? []).map((s, i) => ({
      id: `sample-${i + 1}`,
      label: `Sample ${i + 1} of ${g?.samples?.length}`,
      labelHi: `नमूना ${i + 1} / ${g?.samples?.length}`,
      src: s.src,
      alt: s.alt,
    })),
  ];
  const index = Math.max(0, slides.findIndex((s) => s.id === view));
  // Up to six thumbnails sit in one row; more split into two even rows.
  const cols = slides.length <= 6 ? slides.length : Math.ceil(slides.length / 2);
  const step = (dir: 1 | -1) => onView(slides[(index + dir + slides.length) % slides.length].id);

  const picture = (s: Slide, thumb = false) =>
    s.src ? (
      <Image
        src={s.src}
        alt={thumb ? "" : s.alt}
        fill
        sizes={thumb ? "80px" : "(min-width: 768px) 50vw, 100vw"}
        quality={85}
        priority={!thumb && s.id === "frame"}
        className={thumb ? "object-cover" : "object-contain"}
      />
    ) : (
      <span className={clsx("absolute inset-0 grid place-items-center bg-brown p-[8%]", s.id === "lit" && "brightness-110")}>
        <TributeArt kind={product.slug} className="h-full w-full" />
      </span>
    );

  return (
    <div>
      <div
        className="relative touch-pan-y select-none overflow-hidden"
        style={{ aspectRatio: ratio }}
        role="group"
        aria-roledescription="carousel"
        aria-label={hi ? `${nameHi ?? name}: फ़ोटो` : `${name} photos`}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current == null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => (startX.current = null)}
      >
        {slides.map((s) => (
          <div
            key={s.id}
            aria-hidden={s.id !== slides[index].id}
            className={clsx(
              "absolute inset-0 transition-opacity ease-out motion-reduce:transition-none",
              s.id === "lit" ? "duration-1000" : "duration-500",
              s.id === slides[index].id ? "opacity-100" : "opacity-0",
            )}
          >
            {picture(s)}
          </div>
        ))}
      </div>

      {/* Caption and arrows */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" aria-live="polite">
          <T en={slides[index].label} hi={slides[index].labelHi} />
        </p>
        {slides.length > 1 && (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => step(-1)} aria-label={hi ? "पिछली फ़ोटो" : "Previous photo"} className="btn-press grid h-8 w-8 place-items-center border border-line hover:border-ink">
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label={hi ? "अगली फ़ोटो" : "Next photo"} className="btn-press grid h-8 w-8 place-items-center border border-line hover:border-ink">
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {slides.length > 1 && (
      <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="group" aria-label={hi ? "फ़ोटो चुनें" : "Choose a photo"}>
        {slides.map((s) => (
          <button key={s.id} type="button" onClick={() => onView(s.id)} aria-label={hi ? (s.labelHi ?? s.label) : s.label} aria-pressed={s.id === slides[index].id} className="btn-press group">
            <span
              className={clsx(
                "relative block overflow-hidden bg-brown transition",
                s.id === slides[index].id ? "ring-2 ring-brown ring-offset-2 ring-offset-sage" : "opacity-70 group-hover:opacity-100",
              )}
              style={{ aspectRatio: "1 / 1" }}
            >
              {picture(s, true)}
            </span>
          </button>
        ))}
      </div>
      )}
    </div>
  );
}
