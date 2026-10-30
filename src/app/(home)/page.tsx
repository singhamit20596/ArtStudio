import { notFound } from "next/navigation";
import { launch } from "@/config/launch";
import { getCategory, newArrivals, products } from "@/lib/catalog";
import { AppLink } from "@/components/ui/AppLink";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { EditorialBanners } from "@/components/home/EditorialBanners";
import { CustomMadeGrid } from "@/components/home/CustomMadeGrid";
import { StoryBlock } from "@/components/home/StoryBlock";
import { CustomerLove } from "@/components/home/CustomerLove";
import { InstagramStrip } from "@/components/home/InstagramStrip";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustRow } from "@/components/home/TrustRow";
import { Marquee } from "@/components/home/Marquee";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { TributeHero } from "@/components/tribute/TributeHero";
import { serviceTheme, ServiceDecor } from "@/components/tribute/ServiceDecor";
import { CarFront, Flame, Snowflake } from "lucide-react";
import { ChristmasDecor } from "@/components/christmas/ChristmasDecor";
import { DiwaliDecor } from "@/components/diwali/DiwaliDecor";
import { RacingDecor } from "@/components/cars/RacingDecor";
import { cars } from "@/config/cars";
import { LineBand } from "@/components/lines/LineBand";
import { christmas } from "@/config/christmas";
import { diwali } from "@/config/diwali";
import { themedLineFor, type ThemedLine } from "@/config/lines";
import { T } from "@/i18n/T";
import { EffectZone } from "@/components/effects/EffectZone";
import { FestiveEffects } from "@/components/effects/FestiveEffects";

const CARD_SIZES = "(min-width: 768px) 25vw, 46vw";

/**
 * Homepage. It opens with a wall of every piece (`ProductShowcase`, owner, 30 Oct 2026), then
 * Retirement Gifts (in their own navy-and-brass colours): one heartfelt line and the three tributes. The rest
 * of the studio follows below.
 * The old shop hero (`components/home/Hero.tsx`) is kept for later but not shown.
 * Each collection section is an `EffectZone`: while it fills most of the screen, its page-wide effect
 * and tune play (`FestiveEffects zones`, at the end).
 */
export default function HomePage() {
  const focus = getCategory(launch.focus);
  if (!focus) notFound();
  const tributes = products.filter((p) => p.category === launch.focus);
  const picks = (line: ThemedLine) => line.featured.map((slug) => products.find((p) => p.slug === slug)).filter((p) => p != null);
  const diwaliPicks = picks(diwali);
  const christmasPicks = picks(christmas);
  const carPicks = picks(cars);
  // Tributes, Diwali and Christmas pieces have their own sections above, so these lists leave them out.
  const ownSection = (category: string) => category === launch.focus || themedLineFor(category) != null;
  // Every ready piece, newest first: the newest are all in the collection sections above, so a short
  // list would come back empty once those are left out.
  const arrivals = newArrivals(products.length)
    .filter((p) => !ownSection(p.category))
    .slice(0, 8);

  return (
    <>
      {/* 0. Every piece at a glance: the product showcase, under the transparent header */}
      <ProductShowcase />
      {/* 1. The featured line, in the Retirement Gifts colours */}
      <EffectZone effect="retirement" className={serviceTheme}>
        <TributeHero products={tributes} first={false} decor={<ServiceDecor />} />
      </EffectZone>
      {/* 1b. The festivals, right below the tributes (owner, 29 Oct 2026): Diwali first, then Christmas */}
      {diwaliPicks.length > 0 && (
        <EffectZone effect="diwali">
          <LineBand line={diwali} products={diwaliPicks} decor={<DiwaliDecor />} Icon={Flame} cta="See all Diwali" />
        </EffectZone>
      )}
      {christmasPicks.length > 0 && (
        <EffectZone effect="christmas">
          <LineBand line={christmas} products={christmasPicks} decor={<ChristmasDecor />} Icon={Snowflake} cta="See all Christmas" />
        </EffectZone>
      )}
      {/* 1c. Car Gifts, year-round (owner, 30 Oct 2026) */}
      {carPicks.length > 0 && (
        <EffectZone effect="cars">
          <LineBand line={cars} products={carPicks} decor={<RacingDecor />} Icon={CarFront} cta="See all car gifts" />
        </EffectZone>
      )}
      {/* 2. The rest of the studio */}
      <section aria-labelledby="studio-title" className="container-x pt-16 text-center md:pt-24">
        <p className="eyebrow">Art Studio · Art with Soul</p>
        <h2 id="studio-title" className="section-title mt-3">
          <T en="More from the studio" hi="स्टूडियो से और भी" />
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
          <T
            en="Handmade resin décor, pooja pieces and personalised gifts, made in small batches."
            hi="हाथ से बनी रेज़िन सजावट, पूजा का सामान और पर्सनलाइज़्ड तोहफ़े, थोड़ी-थोड़ी मात्रा में बने।"
          />
        </p>
      </section>
      <CategoryStrip />

      {/* 3 */}
      <section aria-labelledby="new-title" className="container-x py-14 md:py-20">
        <ProductCarousel
          label="New arrivals"
          header={
            <>
              <p className="eyebrow mb-3">
                <T en="Just in" hi="अभी-अभी आए" />
              </p>
              <h2 id="new-title" className="section-title">
                <T en="New Arrivals" hi="नए पीस" />
              </h2>
            </>
          }
          action={
            <AppLink href="/shop?sort=newest" className="nav-label link-line">
              <T en="View all" hi="सब देखें" />
            </AppLink>
          }
        >
          {arrivals.map((p) => (
            <ProductCard key={p.slug} product={p} sizes={CARD_SIZES} />
          ))}
        </ProductCarousel>
      </section>

      {/* 5 */}
      <EditorialBanners />

      {/* 7 */}
      <CustomMadeGrid />
      {/* 8 */}
      <StoryBlock />
      {/* 9 */}
      <CustomerLove />
      {/* 10 */}
      <InstagramStrip />
      {/* 12 */}
      <Newsletter />
      {/* 13 */}
      <TrustRow />
      {/* 14 */}
      <Marquee />
      {/* Page-wide effect and tune of the collection section in view */}
      <FestiveEffects zones />
    </>
  );
}
