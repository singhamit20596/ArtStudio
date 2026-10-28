import { forOccasions, newArrivals } from "@/lib/catalog";
import { AppLink } from "@/components/ui/AppLink";
import { ProductCard } from "@/components/product/ProductCard";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { SignatureBanner } from "@/components/home/SignatureBanner";
import { EditorialBanners } from "@/components/home/EditorialBanners";
import { CustomMadeGrid } from "@/components/home/CustomMadeGrid";
import { StoryBlock } from "@/components/home/StoryBlock";
import { CustomerLove } from "@/components/home/CustomerLove";
import { InstagramStrip } from "@/components/home/InstagramStrip";
import { GiftingBanner } from "@/components/home/GiftingBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustRow } from "@/components/home/TrustRow";
import { Marquee } from "@/components/home/Marquee";

const CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 46vw";

export default function HomePage() {
  const arrivals = newArrivals(8);
  const festive = forOccasions(["diwali", "karwa-chauth"], 8);

  return (
    <>
      {/* 1 */}
      <Hero />
      {/* 2 */}
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

      {/* 4 */}
      <SignatureBanner />
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
