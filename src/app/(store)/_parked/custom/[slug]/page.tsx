import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

export function generateStaticParams() {
  return customCategories.map((c) => ({ slug: c.slug }));
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
  const price = comingSoon ? "Coming soon" : category.startingPrice ? `From ${formatINR(category.startingPrice)}` : "Price on request";

  return (
    <>
      <div className="container-x pt-5 pb-16 md:pt-6 md:pb-24">
        <Breadcrumbs items={[{ label: "Custom", href: "/custom" }, { label: category.name }]} />

        <div className="mt-5 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <div className="relative -mx-4 aspect-[4/5] overflow-hidden bg-brown md:sticky md:top-24 md:mx-0 md:self-start">
            <ProductImage
              src={category.image}
              alt={category.name}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              zoom={false}
              fallbackTitle={category.name}
              fallbackNote={comingSoon ? "Coming soon" : "Made to order"}
            />
          </div>

          <div className="min-w-0">
            <p className="eyebrow">{comingSoon ? "Coming soon" : "Made to order"}</p>
            <h1 className="mt-3 text-[28px] font-semibold leading-[1.15] md:text-[38px]">{category.name}</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{category.description}</p>

            <dl className="mt-6 grid grid-cols-[110px_minmax(0,1fr)] gap-y-2 border-y border-line py-4 text-[13.5px]">
              <dt className="text-muted">Price</dt>
              <dd className="font-medium tabular-nums">{price}</dd>
              {category.makingTimeDays && (
                <>
                  <dt className="text-muted">Making time</dt>
                  <dd>{formatDays(category.makingTimeDays)}, then shipped across India</dd>
                </>
              )}
            </dl>

            <div id="request-cta" className="mt-7">
              <CustomRequestButton
                productName={requestName}
                path={path}
                label={comingSoon ? "Ask about this on WhatsApp" : "Request this custom piece"}
                className="w-full"
              />
              {comingSoon && <p className="mt-3 text-[12.5px] text-muted">We are not taking orders for these yet. Message us and we will tell you when they launch.</p>}
            </div>

            {!comingSoon && <HowCustomWorks className="mt-9" />}
          </div>
        </div>
      </div>

      {pastWork.length > 0 && (
        <section aria-labelledby="past-title" className="container-x pb-16 md:pb-24">
          <SectionHeader id="past-title" eyebrow="Past work" title="Recently made" />
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
            More made to order
          </h2>
          <PillLinks label="Custom categories">
            {customCategories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Pill key={c.slug} href={categoryHref(c)}>
                  {c.name}
                </Pill>
              ))}
          </PillLinks>
        </div>
      </section>

      {!comingSoon && (
        <StickyBar watchId="request-cta">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{category.name}</p>
            <p className="text-[13px] tabular-nums text-muted">{price}</p>
          </div>
          <CustomRequestButton productName={requestName} path={path} label="Request" className="min-h-11 px-5" />
        </StickyBar>
      )}
    </>
  );
}
