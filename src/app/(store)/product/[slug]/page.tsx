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
import { themedLineFor } from "@/config/lines";
import { ProcessTimeline } from "@/components/tribute/ProcessTimeline";
import { RequestFrameButton } from "@/components/tribute/RequestFrameButton";
import { TributeBuyPanel } from "@/components/tribute/TributeBuyPanel";
import { serviceTheme } from "@/components/tribute/ServiceDecor";
import { tributeTaglines } from "@/config/tribute";
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
import { formatDaysHi } from "@/i18n/format";
import { hiLine } from "@/i18n/lines";
import { hiCategory, hiProductName, hiShortName, variantNames, variantOptions } from "@/i18n/names";
import { T } from "@/i18n/T";
import { tributeTaglinesHi } from "@/i18n/tribute";
import { FestiveEffects } from "@/components/effects/FestiveEffects";
import { effectForCategory } from "@/components/effects/collections";

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

/** "You may also like": two columns below 768px, four above (`ProductCarousel`). */
const CARD_SIZES = "(min-width: 768px) 25vw, 46vw";

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
  // Themed-line pieces (Diwali, Christmas, Car Gifts) get their line's colours (globals.css) and its page as parent.
  const themed = themedLineFor(product.category);
  const madeToOrder = !custom && product.stock == null;
  const crumbs: Crumb[] = focus || themed ? [] : custom ? [{ label: "Custom", hi: "कस्टम ऑर्डर", href: "/custom" }] : [{ label: "Shop", hi: "दुकान", href: "/shop" }];
  if (category) crumbs.push({ label: category.name, hi: hiCategory(category.slug), href: categoryHref(category) });
  crumbs.push({ label: shortName(product), hi: hiShortName(product.slug) });
  const days = formatDays(product.makingTimeDays);
  const daysHi = formatDaysHi(product.makingTimeDays);
  const similar = similarProducts(product);

  if (product.sizes?.length) return <TributeProductView product={product} crumbs={crumbs} path={path} />;

  // A themed line's page-wide effect (snow, fireworks, racing cars) plays here too, as on the line's page.
  const effect = themed ? effectForCategory(product.category) : undefined;

  return (
    <div className={themed ? themed.theme : "contents"}>
      {effect && <FestiveEffects effect={effect} />}
      <div className="container-x pt-5 pb-16 md:pt-6 md:pb-24">
        <Breadcrumbs items={crumbs} />

        <div className="mt-5 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <Gallery
              images={product.images}
              video={product.video}
              name={shortName(product)}
              fallbackNote={custom ? <T en="Made to order" hi="ऑर्डर पर तैयार" /> : <T en="Photo coming soon" hi="फ़ोटो जल्द आएगी" />}
            />
            {product.samplePhoto && themed && (
              <p className="mt-2 text-[12px] text-muted">
                <T en={themed.samplePhotoNote} hi={hiLine(themed.category)?.samplePhotoNote} />
              </p>
            )}
          </div>

          <div className="min-w-0">
            {category && (
              <AppLink href={categoryHref(category)} className="eyebrow link-grow">
                {custom ? <T en="Made to order" hi="ऑर्डर पर तैयार" /> : null}
                {custom ? " · " : null}
                <T en={category.name} hi={hiCategory(category.slug)} />
              </AppLink>
            )}
            <h1 className="mt-3 text-[24px] font-semibold leading-[1.2] md:text-[30px]">
              <T en={product.name} hi={hiProductName(product.slug)} />
            </h1>

            <div className="mt-4">
              <Price product={product} className="text-[20px]" />
              <p className="mt-1 text-[12.5px] text-muted">
                {custom ? (
                  <T en="Final price depends on size and details." hi="आख़िरी कीमत साइज़ और डिज़ाइन पर निर्भर है।" />
                ) : (
                  <T en="Inclusive of all taxes." hi="सभी टैक्स सहित।" />
                )}{" "}
                {custom || madeToOrder ? (
                  <T en={`Made by hand in ${days}.`} hi={`${daysHi} में हाथ से बनता है।`} />
                ) : (
                  <T en={`Ships in ${days}.`} hi={`${daysHi} में भेजा जाता है।`} />
                )}
              </p>
            </div>

            <div className="mt-7 border-t border-line pt-7">{custom ? <CustomActions product={product} path={path} /> : <BuyBox product={product} path={path} />}</div>

            <ul className="mt-7 grid grid-cols-3 gap-2 border-y border-line py-4 text-center text-[11.5px] leading-snug text-muted">
              <li>
                <T en="Handmade in India" hi="भारत में हाथ से बना" />
              </li>
              <li>
                {custom ? (
                  <T en="Made just for you" hi="सिर्फ़ आपके लिए बना" />
                ) : site.payments.cashOnDelivery ? (
                  <T en="Cash on Delivery" hi="कैश ऑन डिलीवरी" />
                ) : (
                  <T en="Secure payments" hi="सुरक्षित भुगतान" />
                )}
              </li>
              <li>
                <T en="Pan India shipping" hi="पूरे भारत में डिलीवरी" />
              </li>
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
                <p className="eyebrow mb-3">
                  <T en="More like this" hi="ऐसे और पीस" />
                </p>
                <h2 id="similar-title" className="section-title">
                  <T en="You may also like" hi="आपको ये भी पसंद आ सकते हैं" />
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
    </div>
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
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em]">
            <T en={v.name} hi={variantNames[v.name]} />
          </span>
          <span className="ml-2 text-muted">
            <T en={v.options.join(" or ")} hi={v.options.map((o) => variantOptions[o] ?? o).join(" या ")} />
          </span>
        </p>
      ))}
      <div id="request-cta" className="flex flex-wrap gap-3">
        {focus ? (
          <>
            <RequestFrameButton className="flex-1 px-4" />
            <CustomRequestButton productName={name} path={path} label={<T en="Ask on WhatsApp" hi="WhatsApp पर पूछें" />} variant="whatsapp" className="flex-1 px-4" />
          </>
        ) : (
          <CustomRequestButton productName={name} path={path} className="flex-1 px-4" />
        )}
        {launch.shop && <WishlistButton slug={product.slug} name={name} className="!h-12 !w-12 shrink-0 !rounded-none border border-ink/20 !shadow-none" />}
      </div>
      {focus ? <ProcessTimeline making={formatDays(product.makingTimeDays)} makingHi={formatDaysHi(product.makingTimeDays)} /> : <HowCustomWorks />}
      <StickyBar watchId="request-cta">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">
            <T en={name} hi={hiShortName(product.slug)} />
          </p>
          <Price product={product} className="text-[13px]" />
        </div>
        {focus ? <RequestFrameButton label={<T en="Request" hi="बनवाएँ" />} className="min-h-11 px-5" /> : <CustomRequestButton productName={name} path={path} label={<T en="Request" hi="बनवाएँ" />} className="min-h-11 px-5" />}
      </StickyBar>
    </div>
  );
}

/** Tributes with sizes and lights: just the three photos and the buy panel, in the Retirement Gifts colours. */
function TributeProductView({ product, crumbs, path }: { product: Product; crumbs: Crumb[]; path: string }) {
  // Falling gold stars and the fanfare, as on /retirement-gifts.
  const effect = effectForCategory(product.category);
  return (
    <div className={serviceTheme}>
      {effect && <FestiveEffects effect={effect} />}
      <div className="container-x pt-4 pb-12 md:pt-5 md:pb-16">
        <div className="mx-auto max-w-[1080px]">
          <Breadcrumbs items={crumbs} />
        </div>
        <div className="mt-4">
          <TributeBuyPanel product={product} path={path}>
            <h1 className="text-[24px] font-semibold leading-[1.15] md:text-[30px]">
              <T en={shortName(product)} hi={hiShortName(product.slug)} />
            </h1>
            <p className="mt-1 text-[14px] text-muted">
              <T
                en={tributeTaglines[product.slug] ?? product.name.split(" | ").slice(1).join(" · ")}
                hi={tributeTaglinesHi[product.slug] ?? hiProductName(product.slug)?.split(" | ").slice(1).join(" · ")}
              />
            </p>
          </TributeBuyPanel>
        </div>
      </div>
    </div>
  );
}
