import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductSkeleton } from "@/components/ui/Skeletons";
import { getCategory, getProduct, productHref, products, shortName, similarProducts, categoryHref } from "@/lib/catalog";
import { formatDays } from "@/lib/format";
import type { Product } from "@/lib/types";
import { site } from "@/config/site";
import { AppLink } from "@/components/ui/AppLink";
import { Breadcrumbs, type Crumb } from "@/components/listing/Breadcrumbs";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { CustomRequestButton } from "@/components/custom/CustomRequestButton";
import { launch } from "@/config/launch";
import { ProcessTimeline } from "@/components/tribute/ProcessTimeline";
import { RequestFrameButton } from "@/components/tribute/RequestFrameButton";
import { HowCustomWorks } from "@/components/custom/HowCustomWorks";
import { BuyBox } from "@/components/product/BuyBox";
import { Gallery } from "@/components/product/Gallery";
import { Price } from "@/components/product/Price";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetails } from "@/components/product/ProductDetails";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ShareButtons } from "@/components/product/ShareButtons";
import { StickyBar } from "@/components/product/StickyBar";
import { WishlistButton } from "@/components/product/WishlistButton";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: product.images[0] ? { images: [{ url: product.images[0], width: 720, height: 900, alt: shortName(product) }] } : undefined,
  };
}

const CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 46vw";

export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductView params={params} />
    </Suspense>
  );
}

/** Reads the URL slug, so it sits under Suspense: navigations show the skeleton at once. */
async function ProductView({ params }: { params: PageProps<"/product/[slug]">["params"] }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const custom = product.type === "custom";
  const path = productHref(product);
  const focus = product.category === launch.focus;
  const crumbs: Crumb[] = focus ? [] : custom ? [{ label: "Custom", href: "/custom" }] : [{ label: "Shop", href: "/shop" }];
  if (category) crumbs.push({ label: category.name, href: categoryHref(category) });
  crumbs.push({ label: shortName(product) });
  const similar = similarProducts(product);

  return (
    <>
      <div className="container-x pt-5 pb-16 md:pt-6 md:pb-24">
        <Breadcrumbs items={crumbs} />

        <div className="mt-5 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <Gallery images={product.images} video={product.video} name={shortName(product)} fallbackNote={custom ? "Made to order" : "Photo coming soon"} />
          </div>

          <div className="min-w-0">
            {category && (
              <AppLink href={categoryHref(category)} className="eyebrow link-grow">
                {custom ? `Made to order · ${category.name}` : category.name}
              </AppLink>
            )}
            <h1 className="mt-3 text-[24px] font-semibold leading-[1.2] md:text-[30px]">{product.name}</h1>

            <div className="mt-4">
              <Price product={product} className="text-[20px]" />
              <p className="mt-1 text-[12.5px] text-muted">
                {custom ? "Final price depends on size and details." : "Inclusive of all taxes."}{" "}
                {custom ? `Made by hand in ${formatDays(product.makingTimeDays)}.` : `Ships in ${formatDays(product.makingTimeDays)}.`}
              </p>
            </div>

            <div className="mt-7 border-t border-line pt-7">{custom ? <CustomActions product={product} path={path} /> : <BuyBox product={product} path={path} />}</div>

            <ul className="mt-7 grid grid-cols-3 gap-2 border-y border-line py-4 text-center text-[11.5px] leading-snug text-muted">
              <li>Handmade in India</li>
              <li>{custom ? "Made just for you" : site.payments.cashOnDelivery ? "Cash on Delivery" : "Secure payments"}</li>
              <li>Pan India shipping</li>
            </ul>

            <div className="mt-4">
              <ShareButtons name={shortName(product)} />
            </div>

            <div className="mt-8">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="container-x pb-16 md:pb-24">
          <ProductCarousel
            label="Similar pieces"
            header={
              <>
                <p className="eyebrow mb-3">More like this</p>
                <h2 id="similar-title" className="section-title">
                  You may also like
                </h2>
              </>
            }
          >
            {similar.map((p) => (
              <ProductCard key={p.slug} product={p} sizes={CARD_SIZES} />
            ))}
          </ProductCarousel>
        </section>
      )}

      <RecentlyViewed current={product.slug} products={products} />
    </>
  );
}

/** Custom pieces: one WhatsApp request button instead of the cart (the full custom flow replaces it later). */
function CustomActions({ product, path }: { product: Product; path: string }) {
  const name = shortName(product);
  const focus = product.category === launch.focus;
  return (
    <div className="space-y-7">
      {product.variants.map((v) => (
        <p key={v.name} className="text-[13.5px]">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em]">{v.name}</span>
          <span className="ml-2 text-muted">{v.options.join(" or ")}</span>
        </p>
      ))}
      <div id="request-cta" className="flex flex-wrap gap-3">
        {focus ? (
          <>
            <RequestFrameButton className="flex-1 px-4" />
            <CustomRequestButton productName={name} path={path} label="Ask on WhatsApp" variant="whatsapp" className="flex-1 px-4" />
          </>
        ) : (
          <CustomRequestButton productName={name} path={path} className="flex-1 px-4" />
        )}
        {launch.shop && <WishlistButton slug={product.slug} name={name} className="!h-12 !w-12 shrink-0 !rounded-none border border-ink/20 !shadow-none" />}
      </div>
      {focus ? <ProcessTimeline making={formatDays(product.makingTimeDays)} /> : <HowCustomWorks />}
      <StickyBar watchId="request-cta">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{name}</p>
          <Price product={product} className="text-[13px]" />
        </div>
        {focus ? <RequestFrameButton label="Request" className="min-h-11 px-5" /> : <CustomRequestButton productName={name} path={path} label="Request" className="min-h-11 px-5" />}
      </StickyBar>
    </div>
  );
}
