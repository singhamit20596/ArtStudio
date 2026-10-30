import clsx from "clsx";
import type { Product } from "@/lib/types";
import { PointerGlow } from "./PointerGlow";
import { TributeCards } from "./TributeCards";
import { T } from "@/i18n/T";

interface TributeHeroProps {
  products: Product[];
  /** The first block on the page (`/retirement-gifts`): under the transparent header, with the page's h1. */
  first?: boolean;
  /** Decoration behind the opening (`ServiceDecor`: ribbon band and stars). */
  decor?: React.ReactNode;
  /** Shown between the intro and the cards (`MedalRow`). */
  after?: React.ReactNode;
}

/**
 * A few words for those who served, then the three tributes. As the first block on a page
 * (`/retirement-gifts`) it sits under the transparent header and holds the page's h1; lower
 * down (the homepage, below the product showcase) it keeps its place and uses an h2.
 * Wrap it in `serviceTheme` (ServiceDecor.tsx) for the Retirement Gifts colours.
 */
export function TributeHero({ products, first = true, decor, after }: TributeHeroProps) {
  const Title = first ? "h1" : "h2";
  const Sub = first ? "h2" : "h3";
  return (
    <PointerGlow aria-labelledby="hero-title" className={clsx("surface-brown", first ? "-mt-16 lg:-mt-[76px]" : "border-t border-line")}>
      {decor}
      <div className={clsx("container-x relative pb-12 md:pb-14", first ? "pt-24 lg:pt-28" : "pt-12 md:pt-14")}>
        <div className="hero-copy mx-auto max-w-2xl text-center">
          <p className="eyebrow" style={{ "--i": 0 } as React.CSSProperties}>
            <T en="A Special Tribute to Defence Personnel" hi="देश के रक्षकों को एक ख़ास सलाम" />
          </p>
          <Title id="hero-title" className="mt-3 text-[28px] font-semibold leading-[1.12] md:text-[42px]" style={{ "--i": 1 } as React.CSSProperties}>
            <T
              en={
                <>
                  They served the nation. <span className="shimmer">They deserve the best.</span>
                </>
              }
              hi={
                <>
                  उन्होंने देश की सेवा की। <span className="shimmer">उन्हें मिले सबसे ख़ास सम्मान।</span>
                </>
              }
            />
          </Title>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-muted md:text-[15px]" style={{ "--i": 2 } as React.CSSProperties}>
            <T
              en="Years far from home. Festivals spent on duty. A lifetime given to keep the rest of us safe. As they hang up the uniform, honour that service with a tribute made by hand around their medals, photographs and story."
              hi="घर से दूर बीते साल। ड्यूटी पर बीते त्योहार। हम सबको सुरक्षित रखने में लगा दी पूरी ज़िंदगी। अब जब वे वर्दी उतार रहे हैं, उनकी इस सेवा का सम्मान कीजिए, उनके मेडल, तस्वीरों और कहानी से हाथ से बने एक तोहफ़े के साथ।"
            />
          </p>
        </div>
        {after}

        <div id="tributes" className="mx-auto mt-8 max-w-4xl scroll-mt-28 md:mt-10">
          <Sub className="sr-only">
            <T en="Our tributes" hi="हमारे ट्रिब्यूट" />
          </Sub>
          <TributeCards products={products} />
        </div>
      </div>
    </PointerGlow>
  );
}
