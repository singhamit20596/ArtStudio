import type { Product } from "@/lib/types";
import { PointerGlow } from "./PointerGlow";
import { TributeCards } from "./TributeCards";

/** The whole homepage: a few words for those who served, then the three tributes. */
export function TributeHero({ products }: { products: Product[] }) {
  return (
    <PointerGlow aria-labelledby="hero-title" className="surface-brown -mt-16 lg:-mt-[76px]">
      <div className="container-x pt-24 pb-12 md:pb-14 lg:pt-28">
        <div className="hero-copy mx-auto max-w-2xl text-center">
          <p className="eyebrow" style={{ "--i": 0 } as React.CSSProperties}>
            A Special Tribute to Defence Personnel
          </p>
          <h1 id="hero-title" className="mt-3 text-[28px] font-semibold leading-[1.12] md:text-[42px]" style={{ "--i": 1 } as React.CSSProperties}>
            They served the nation. <span className="shimmer">They deserve the best.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-muted md:text-[15px]" style={{ "--i": 2 } as React.CSSProperties}>
            Years far from home. Festivals spent on duty. A lifetime given to keep the rest of us safe. As they hang up the uniform, honour that
            service with a tribute made by hand around their medals, photographs and story.
          </p>
        </div>

        <div id="tributes" className="mx-auto mt-8 max-w-4xl scroll-mt-28 md:mt-10">
          <h2 className="sr-only">Our tributes</h2>
          <TributeCards products={products} />
        </div>
      </div>
    </PointerGlow>
  );
}
