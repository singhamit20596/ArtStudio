import type { LucideIcon } from "lucide-react";
import type { FestiveLine } from "@/config/festive";
import type { Product } from "@/lib/types";
import { FestiveCards } from "./FestiveCards";

interface FestiveHeroProps {
  line: FestiveLine;
  products: Product[];
  /** The line's decoration over the opening (snow and lights, or a garland and diyas). */
  decor: React.ReactNode;
  /** Shown under the intro (the Diwali diyas). */
  after?: React.ReactNode;
  Icon: LucideIcon;
}

/** A festive line's page: a dark opening with its decoration and heading, then every piece. */
export function FestiveHero({ line, products, decor, after, Icon }: FestiveHeroProps) {
  return (
    <>
      <section aria-labelledby="festive-title" className="surface-brown relative -mt-16 overflow-hidden lg:-mt-[76px]">
        {decor}
        <div className="container-x relative pt-28 pb-12 text-center md:pb-14 lg:pt-36">
          <div className="hero-copy mx-auto max-w-2xl">
            <p className="eyebrow" style={{ "--i": 0 } as React.CSSProperties}>
              {line.eyebrow}
            </p>
            <h1 id="festive-title" className="mt-3 text-[30px] font-semibold leading-[1.1] md:text-[46px]" style={{ "--i": 1 } as React.CSSProperties}>
              {line.title[0]} <span className="shimmer">{line.title[1]}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-muted md:text-[15px]" style={{ "--i": 2 } as React.CSSProperties}>
              {line.intro}
            </p>
          </div>
          {after}
        </div>
      </section>

      <section aria-label={`${line.eyebrow}: every piece`} className="container-x py-10 md:py-14">
        <FestiveCards line={line} products={products} Icon={Icon} />
        <p className="mt-10 text-center text-[13px] text-muted">{line.note}</p>
      </section>
    </>
  );
}
