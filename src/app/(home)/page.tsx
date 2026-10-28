import { notFound } from "next/navigation";
import { launch } from "@/config/launch";
import { forOccasions, getCategory, newArrivals, products } from "@/lib/catalog";
import { AppLink } from "@/components/ui/AppLink";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { EditorialBanners } from "@/components/home/EditorialBanners";
import { CustomMadeGrid } from "@/components/home/CustomMadeGrid";
import { StoryBlock } from "@/components/home/StoryBlock";
import { CustomerLove } from "@/components/home/CustomerLove";
import { InstagramStrip } from "@/components/home/InstagramStrip";
import { GiftingBanner } from "@/components/home/GiftingBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustRow } from "@/components/home/TrustRow";
import { Marquee } from "@/components/home/Marquee";
import { TributeHero } from "@/components/tribute/TributeHero";

const CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 46vw";

/**
 * Homepage. Retirement Tributes come first and fill the opening screen (owner, 28 Oct 2026):
 * one heartfelt line and the three tributes. The rest of the studio follows below.
 * The old shop hero (`components/home/Hero.tsx`) is kept for later but not shown.
 */
export default function HomePage() {
  const focus = getCategory(launch.focus);
  if (!focus) notFound();
  const tributes = products.filter((p) => p.category === launch.focus);
  const arrivals = newArrivals(8).filter((p) => p.category !== launch.focus);
  const festive = forOccasions(["diwali", "karwa-chauth"], 8);

  return (
    <>
      {/* 1. The featured line */}
      <TributeHero products={tributes} />
      {/* 2. The rest of the studio */}
      <section aria-labelledby="studio-title" className="container-x pt-16 text-center md:pt-24">
        <p className="eyebrow">Art Studio · Art with Soul</p>
        <h2 id="studio-title" className="section-title mt-3">
          More from the studio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">Handmade resin décor, pooja pieces and personalised gifts, made in small batches.</p>
      </section>
      <CategoryStrip />

      {/* 3 */}
      <section aria-labelledby="new-title" className="container-x py-14 md:py-20">
        <ProductCarousel
          label="New arrivals"
          header={
            <>
              <p className="eyebrow mb-3">Just in</p>
              <h2 id="new-title" className="section-title">
                New Arrivals
              </h2>
            </>
          }
          action={
            <AppLink href="/shop?sort=newest" className="nav-label link-line">
              View all
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

      {/* 6 */}
      <section aria-labelledby="festive-title" className="container-x pb-16 md:pb-24">
        <ProductCarousel
          label="Festive edit"
          header={
            <>
              <p className="eyebrow mb-3">Diwali · Karwa Chauth</p>
              <h2 id="festive-title" className="section-title">
                The Festive Edit
              </h2>
              <p lang="hi" className="mt-3 text-[17px] text-eyebrow">
                त्योहार की रौनक, आपके घर के लिए
              </p>
            </>
          }
          action={
            <AppLink href="/occasion/diwali" className="nav-label link-line">
              Shop festive
            </AppLink>
          }
        >
          {festive.map((p) => (
            <ProductCard key={p.slug} product={p} sizes={CARD_SIZES} />
          ))}
        </ProductCarousel>
      </section>

      {/* 7 */}
      <CustomMadeGrid />
      {/* 8 */}
      <StoryBlock />
      {/* 9 */}
      <CustomerLove />
      {/* 10 */}
      <InstagramStrip />
      {/* 11 */}
      <GiftingBanner />
      {/* 12 */}
      <Newsletter />
      {/* 13 */}
      <TrustRow />
      {/* 14 */}
      <Marquee />
    </>
  );
}
