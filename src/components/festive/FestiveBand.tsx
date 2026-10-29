import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import type { FestiveLine } from "@/config/festive";
import type { Product } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { FestiveCards } from "./FestiveCards";

interface FestiveBandProps {
  line: FestiveLine;
  products: Product[];
  decor: React.ReactNode;
  Icon: LucideIcon;
  /** Button label, e.g. "See all Christmas". */
  cta: string;
}

/** A festive line's homepage section, in its own colours: four pieces and a link to the rest. */
export function FestiveBand({ line, products, decor, Icon, cta }: FestiveBandProps) {
  const titleId = `${line.category}-band-title`;
  return (
    <section aria-labelledby={titleId} className={clsx(line.theme)}>
      <div className="surface-brown relative overflow-hidden">
        {decor}
        <div className="container-x relative pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div className="max-w-xl">
              <p className="eyebrow">{line.eyebrow}</p>
              <h2 id={titleId} className="section-title mt-3">
                {line.title[0]} <span className="shimmer">{line.title[1]}</span>
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{line.bandLine}</p>
            </div>
            <AppLink href={line.path} className="btn btn-light btn-press">
              {cta}
            </AppLink>
          </div>
          <FestiveCards line={line} products={products} Icon={Icon} row className="mt-8" />
        </div>
      </div>
    </section>
  );
}
