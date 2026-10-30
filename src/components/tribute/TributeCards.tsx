import clsx from "clsx";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { tributeTaglines } from "@/config/tribute";
import { formatINR } from "@/lib/format";
import { productHref, shortName } from "@/lib/product";
import type { Product } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { TributeArt } from "./TributeArt";
import { hiProductCopy } from "@/i18n/catalogue";
import { hiShortName } from "@/i18n/names";
import { T } from "@/i18n/T";
import { tributeTaglinesHi } from "@/i18n/tribute";

/**
 * The tributes as three cards: photo, name, one line, starting price. While lights are on offer,
 * hover or focus turns them on (the lit photo fades in); touch screens show the lit photo.
 */
export function TributeCards({ products, className }: { products: Product[]; className?: string }) {
  return (
    // Phones: two side by side, an odd last card centred below (2 + 1), all visible without swiping.
    // Wider screens: three columns. The row rises as one on wider screens (`.cards-reveal`), never card by card.
    <ul className={clsx("cards-reveal flex flex-wrap justify-center gap-x-3 gap-y-6 sm:grid sm:grid-cols-3 sm:gap-5", className)}>
      {products.map((p) => {
        const g = p.gallery;
        const from = Math.min(...(p.sizes?.map((s) => s.price) ?? [p.price ?? 0]));
        return (
          <li key={p.slug} className="w-[calc(50%-0.375rem)] sm:w-auto">
            <AppLink href={productHref(p)} className="group block outline-offset-4">
              <span className="relative block aspect-[4/5] overflow-hidden bg-brown shadow-[0_30px_60px_-30px_rgb(20_12_6/0.9)]">
                {g?.tile ? (
                  <Image src={g.tile} alt={`${shortName(p)}, lights off`} fill sizes="(min-width: 640px) 290px, 46vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]" />
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
                    sizes="(min-width: 640px) 290px, 46vw"
                    className="object-cover opacity-0 transition-[opacity,transform] duration-1000 ease-soft group-hover:scale-[1.03] group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                  />
                )}
              </span>
              {/* Phones: the name gets the full half-width card (the whole card is the link); the arrow joins from 640px. */}
              <span className="mt-2.5 flex items-center justify-between gap-2 sm:mt-3">
                <span className="line-clamp-2 text-[14px] font-semibold leading-snug sm:text-[16px]">
                  <T en={shortName(p)} hi={hiShortName(p.slug)} />
                </span>
                <ArrowRight size={17} aria-hidden="true" className="hidden shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
              </span>
              <span className="mt-0.5 line-clamp-3 text-[12px] leading-snug text-muted sm:line-clamp-none sm:text-[12.5px]">
                <T en={tributeTaglines[p.slug] ?? p.description} hi={tributeTaglines[p.slug] ? tributeTaglinesHi[p.slug] : hiProductCopy(p.slug)?.description} />
              </span>
              <span className="mt-1.5 block text-[12.5px] font-semibold tabular-nums">
                <T en={`From ${formatINR(from)}`} hi={`${formatINR(from)} से शुरू`} />
              </span>
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
}
