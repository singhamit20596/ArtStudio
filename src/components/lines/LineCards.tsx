import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ThemedLine } from "@/config/lines";
import { formatINR } from "@/lib/format";
import { productHref, shortName } from "@/lib/product";
import type { Product } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { hiProductCopy } from "@/i18n/catalogue";
import { hiLine } from "@/i18n/lines";
import { hiShortName } from "@/i18n/names";
import { T } from "@/i18n/T";

interface LineCardsProps {
  line: ThemedLine;
  products: Product[];
  /** Drawn on the "photo coming soon" card (a snowflake for Christmas, a flame for Diwali). */
  Icon: LucideIcon;
  /** The homepage sections: two columns on phones and small tablets, four in one row from 768px. Otherwise 2, 3, then 4 columns. */
  row?: boolean;
  className?: string;
}

/**
 * A themed line's pieces as cards: photo (or a "photo coming soon" mount card), name, one line, price.
 * Always a grid, so every piece shows without swiping. The grid rises as one on wider screens (`.cards-reveal`), never card by card.
 */
export function LineCards({ line, products, Icon, row = false, className }: LineCardsProps) {
  const hi = hiLine(line.category);
  return (
    <ul
      className={clsx(
        row
          ? "cards-reveal grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-5"
          : "cards-reveal grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((p) => (
        <li key={p.slug}>
          <AppLink href={productHref(p)} className="group block outline-offset-4">
            <span className="relative block aspect-[4/5] overflow-hidden bg-brown shadow-[0_24px_48px_-28px_rgb(10_6_4/0.8)]">
              {p.images[0] ? (
                <Image
                  src={p.images[0]}
                  alt={shortName(p)}
                  fill
                  sizes={row ? "(min-width: 768px) 25vw, 46vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 46vw"}
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                />
              ) : (
                // No photo yet: a mount card with the line's icon and a note (the name is right below).
                <span className="mount absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-[14%] text-center sm:gap-3">
                  <Icon strokeWidth={1.3} aria-hidden="true" className="size-7 text-[var(--mount-icon,var(--color-gold))] transition-transform duration-700 ease-soft group-hover:scale-110 sm:size-[34px]" />
                  <span className="text-[9.5px] uppercase leading-snug tracking-[0.14em] text-muted sm:text-[10.5px] sm:tracking-[0.18em]">
                    <T en={line.noPhoto} hi={hi?.noPhoto} />
                  </span>
                </span>
              )}
              {p.isCustomisable && (
                <span className="absolute left-2 top-2 bg-brown px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-paper sm:px-2 sm:py-1 sm:text-[9.5px] sm:tracking-[0.14em]">
                  <T en="Personalised" hi="पर्सनलाइज़्ड" />
                </span>
              )}
            </span>
            <span className="mt-2.5 line-clamp-2 text-[13.5px] font-semibold leading-snug sm:text-[14px]">
              <T en={shortName(p)} hi={hiShortName(p.slug)} />
            </span>
            <span className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted sm:text-[12.5px]">
              <T en={line.taglines[p.slug] ?? p.description} hi={line.taglines[p.slug] ? hi?.taglines[p.slug] : hiProductCopy(p.slug)?.description} />
            </span>
            {p.price != null && <span className="mt-1 block text-[13px] font-semibold tabular-nums">{formatINR(p.price)}</span>}
          </AppLink>
        </li>
      ))}
    </ul>
  );
}
