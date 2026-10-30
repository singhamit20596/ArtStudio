import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { launch } from "@/config/launch";
import { categoryHref, customCategories, getCategory, productsInCategory } from "@/lib/catalog";
import { formatDays, formatINR } from "@/lib/format";
import { Breadcrumbs } from "@/components/listing/Breadcrumbs";
import { Pill, PillLinks } from "@/components/listing/ListingHeader";
import { CustomRequestButton } from "@/components/custom/CustomRequestButton";
import { HowCustomWorks } from "@/components/custom/HowCustomWorks";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductImage } from "@/components/product/ProductImage";
import { StickyBar } from "@/components/product/StickyBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductSkeleton } from "@/components/ui/Skeletons";
import { hiCategoryDescription } from "@/i18n/catalogue";
import { formatDaysHi } from "@/i18n/format";
import { hiCategory } from "@/i18n/names";
import { T } from "@/i18n/T";

export function generateStaticParams() {
  // The featured tributes redirect to the homepage (next.config.ts), so they get no page here.
  return customCategories.filter((c) => c.slug !== launch.focus).map((c) => ({ slug: c.slug }));
}

function findCategory(slug: string) {
  const category = getCategory(slug);
  return category?.type === "custom" ? category : undefined;
}

export async function generateMetadata({ params }: PageProps<"/custom/[slug]">): Promise<Metadata> {
  const category = findCategory((await params).slug);
  if (!category) return {};
  return {
    title: `Custom ${category.name}`,
    description: `${category.description} Made by hand to order. Request yours on WhatsApp.`,
    openGraph: category.image ? { images: [{ url: category.image, width: 720, height: 900, alt: category.name }] } : undefined,
  };
}

export default function CustomCategoryPage({ params }: PageProps<"/custom/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <CustomCategoryView params={params} />
    </Suspense>
  );
}

/** Reads the URL slug, so it sits under Suspense: navigations show the skeleton at once. */
async function CustomCategoryView({ params }: { params: PageProps<"/custom/[slug]">["params"] }) {
  const category = findCategory((await params).slug);
  if (!category) notFound();

  const pastWork = productsInCategory(category.slug);
  const comingSoon = category.status === "coming-soon";
  const path = categoryHref(category);
  const requestName = category.requestName ?? category.name;
  const price = comingSoon ? (
    <T en="Coming soon" hi="जल्द आ रहा है" />
  ) : category.startingPrice ? (
    <T en={`From ${formatINR(category.startingPrice)}`} hi={`${formatINR(category.startingPrice)} से शुरू`} />
  ) : (
    <T en="Price on request" hi="कीमत पूछने पर" />
  );
  const nameHi = hiCategory(category.slug);
  const madeToOrder = <T en="Made to order" hi="ऑर्डर पर तैयार" />;

  return (
    <>
      <div className="container-x pt-5 pb-16 md:pt-6 md:pb-24">
        <Breadcrumbs items={[{ label: "Custom", hi: "कस्टम ऑर्डर", href: "/custom" }, { label: category.name, hi: nameHi }]} />

        <div className="mt-5 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <div className="relative -mx-4 aspect-[4/5] overflow-hidden bg-brown md:sticky md:top-24 md:mx-0 md:self-start">
            <ProductImage
              src={category.image}
              alt={category.name}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              zoom={false}
              fallbackTitle={<T en={category.name} hi={nameHi} />}
              fallbackNote={comingSoon ? <T en="Coming soon" hi="जल्द आ रहा है" /> : madeToOrder}
            />
          </div>

          <div className="min-w-0">
            <p className="eyebrow">{comingSoon ? <T en="Coming soon" hi="जल्द आ रहा है" /> : madeToOrder}</p>
            <h1 className="mt-3 text-[28px] font-semibold leading-[1.15] md:text-[38px]">
              <T en={category.name} hi={nameHi} />
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              <T en={category.description} hi={hiCategoryDescription(category.slug)} />
            </p>

            <dl className="mt-6 grid grid-cols-[110px_minmax(0,1fr)] gap-y-2 border-y border-line py-4 text-[13.5px]">
              <dt className="text-muted">
                <T en="Price" hi="कीमत" />
              </dt>
              <dd className="font-medium tabular-nums">{price}</dd>
              {category.makingTimeDays && (
                <>
                  <dt className="text-muted">
                    <T en="Making time" hi="बनने में समय" />
                  </dt>
                  <dd>
                    <T
                      en={`${formatDays(category.makingTimeDays)}, then shipped across India`}
                      hi={`${formatDaysHi(category.makingTimeDays)}, फिर पूरे भारत में कहीं भी भेजा जाता है`}
                    />
                  </dd>
                </>
              )}
            </dl>

            <div id="request-cta" className="mt-7">
              <CustomRequestButton
                productName={requestName}
                path={path}
                label={comingSoon ? <T en="Ask about this on WhatsApp" hi="इसके बारे में WhatsApp पर पूछें" /> : <T en="Request this custom piece" hi="यह कस्टम पीस बनवाएँ" />}
                className="w-full"
              />
              {comingSoon && (
                <p className="mt-3 text-[12.5px] text-muted">
                  <T
                    en="We are not taking orders for these yet. Message us and we will tell you when they launch."
                    hi="अभी हम इनके ऑर्डर नहीं ले रहे हैं। मैसेज करें, शुरू होते ही हम आपको बता देंगे।"
                  />
                </p>
              )}
            </div>

            {!comingSoon && <HowCustomWorks className="mt-9" />}
          </div>
        </div>
      </div>

      {pastWork.length > 0 && (
        <section aria-labelledby="past-title" className="container-x pb-16 md:pb-24">
          <SectionHeader id="past-title" eyebrow={<T en="Past work" hi="पहले के काम" />} title={<T en="Recently made" hi="हाल ही में बने" />} />
          <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {pastWork.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} sizes="(min-width: 768px) 25vw, 46vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="more-custom-title" className="border-t border-line">
        <div className="container-x py-12 md:py-16">
          <h2 id="more-custom-title" className="eyebrow mb-5">
            <T en="More made to order" hi="ऑर्डर पर बनने वाले और पीस" />
          </h2>
          <PillLinks label="Custom categories">
            {customCategories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Pill key={c.slug} href={categoryHref(c)}>
                  <T en={c.name} hi={hiCategory(c.slug)} />
                </Pill>
              ))}
          </PillLinks>
        </div>
      </section>

      {!comingSoon && (
        <StickyBar watchId="request-cta">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">
              <T en={category.name} hi={nameHi} />
            </p>
            <p className="text-[13px] tabular-nums text-muted">{price}</p>
          </div>
          <CustomRequestButton productName={requestName} path={path} label={<T en="Request" hi="बनवाएँ" />} className="min-h-11 px-5" />
        </StickyBar>
      )}
    </>
  );
}
