import clsx from "clsx";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { tributeTaglines } from "@/config/tribute";
import { formatINR } from "@/lib/format";
import { productHref, shortName } from "@/lib/product";
import type { Product } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { TributeArt } from "./TributeArt";

/**
 * The tributes as three cards: photo, name, one line, starting price. While lights are on offer,
 * hover or focus turns them on (the lit photo fades in); touch screens show the lit photo.
 */
export function TributeCards({ products, className }: { products: Product[]; className?: string }) {
  return (
    // Phones: a row you swipe through. Wider screens: three columns.
    <ul className={clsx("-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0", className)}>
      {products.map((p, i) => {
        const g = p.gallery;
        const from = Math.min(...(p.sizes?.map((s) => s.price) ?? [p.price ?? 0]));
        return (
          <li key={p.slug} className="reveal-scale w-[62%] shrink-0 snap-start sm:w-auto" style={{ animationDelay: `${i * 90}ms` }}>
            <AppLink href={productHref(p)} className="group block outline-offset-4">
              <span className="relative block aspect-[4/5] overflow-hidden bg-brown shadow-[0_30px_60px_-30px_rgb(20_12_6/0.9)]">
                {g?.tile ? (
                  <Image src={g.tile} alt={`${shortName(p)}, lights off`} fill sizes="(min-width: 640px) 290px, 62vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center p-[10%]">
                    <TributeArt kind={p.slug} className="h-full w-full" />
                  </span>
                )}
                {g?.tileLit && p.lightPrice != null && (
                  <Image
                    src={g.tileLit}
                    alt={`${shortName(p)} with its lights on`}
                    fill
                    sizes="(min-width: 640px) 290px, 62vw"
                    className="object-cover opacity-0 transition-[opacity,transform] duration-1000 ease-soft group-hover:scale-[1.03] group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                  />
                )}
              </span>
              <span className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[16px] font-semibold leading-snug">{shortName(p)}</span>
                <ArrowRight size={17} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{tributeTaglines[p.slug] ?? p.description}</span>
              <span className="mt-1.5 block text-[12.5px] font-semibold tabular-nums">From {formatINR(from)}</span>
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
}
