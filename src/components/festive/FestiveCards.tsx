import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { FestiveLine } from "@/config/festive";
import { formatINR } from "@/lib/format";
import { productHref, shortName } from "@/lib/product";
import type { Product } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";

interface FestiveCardsProps {
  line: FestiveLine;
  products: Product[];
  /** Drawn on the "photo coming soon" card (a snowflake for Christmas, a flame for Diwali). */
  Icon: LucideIcon;
  /** A swipe row on phones and four columns wider up (the homepage sections); otherwise a grid. */
  row?: boolean;
  className?: string;
}

/** A festive line's pieces as cards: photo (or a "photo coming soon" mount card), name, one line, price. */
export function FestiveCards({ line, products, Icon, row = false, className }: FestiveCardsProps) {
  return (
    <ul
      className={clsx(
        row
          ? "-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0"
          : "grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((p, i) => (
        <li key={p.slug} className={clsx("reveal-scale", row && "w-[46%] shrink-0 snap-start sm:w-auto")} style={{ animationDelay: `${(i % 4) * 80}ms` }}>
          <AppLink href={productHref(p)} className="group block outline-offset-4">
            <span className="relative block aspect-[4/5] overflow-hidden bg-brown shadow-[0_24px_48px_-28px_rgb(10_6_4/0.8)]">
              {p.images[0] ? (
                <Image
                  src={p.images[0]}
                  alt={shortName(p)}
                  fill
                  sizes={row ? "(min-width: 640px) 25vw, 46vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 46vw"}
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                />
              ) : (
                // No photo yet: a mount card with the line's icon and a note (the name is right below).
                <span className="mount absolute inset-0 flex flex-col items-center justify-center gap-3 p-[14%] text-center">
                  <Icon size={34} strokeWidth={1.3} aria-hidden="true" className="text-[var(--mount-icon,var(--color-gold))] transition-transform duration-700 ease-soft group-hover:scale-110" />
                  <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted">{line.noPhoto}</span>
                </span>
              )}
              {p.isCustomisable && (
                <span className="absolute left-2 top-2 bg-brown px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-paper">Personalised</span>
              )}
            </span>
            <span className="mt-2.5 block text-[14px] font-semibold leading-snug">{shortName(p)}</span>
            <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{line.taglines[p.slug] ?? p.description}</span>
            {p.price != null && <span className="mt-1 block text-[13px] font-semibold tabular-nums">{formatINR(p.price)}</span>}
          </AppLink>
        </li>
      ))}
    </ul>
  );
}
