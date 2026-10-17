import type { Metadata } from "next";
import Image from "next/image";
import { customCategories, getCategory, products, categoryHref } from "@/lib/catalog";
import { formatDays, formatINR } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ListingHeader } from "@/components/listing/ListingHeader";
import { CustomCategoryCard } from "@/components/custom/CustomCategoryCard";
import { CustomRequestButton } from "@/components/custom/CustomRequestButton";
import { HowCustomWorks } from "@/components/custom/HowCustomWorks";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Custom made",
  description: "Retirement tribute frames, shadow boxes, photo magnets, name plates and more, made by hand to your story. Request yours on WhatsApp.",
};

const SIGNATURE = "retirement-tribute-frames";

export default function CustomHubPage() {
  const signature = getCategory(SIGNATURE);
  const rest = customCategories.filter((c) => c.slug !== SIGNATURE);
  const recent = products.filter((p) => p.type === "custom");

  return (
    <>
      <div className="container-x">
        <ListingHeader
          crumbs={[{ label: "Custom" }]}
          eyebrow="Made to order"
          title="Custom Made"
          description="Tell us the story, the names and the colours. We make it by hand, just for you, and ship it anywhere in India."
        />
      </div>

      {signature && (
        <section aria-labelledby="signature-title" className="bg-slate-deep text-paper">
          <div className="container-x grid items-center gap-10 py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:py-20">
            <div className="relative aspect-[4/5] overflow-hidden md:order-2 md:aspect-[5/4]">
              {signature.image && <Image src={signature.image} alt="IAF retirement shadow box with medals, wings and a name plate" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />}
            </div>
            <div className="max-w-lg">
              <p className="eyebrow !text-blush">Our signature · IAF · Army · Navy</p>
              <h2 id="signature-title" className="mt-4 text-[30px] font-semibold leading-[1.12] md:text-[38px]">
                {signature.name}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80">{signature.description}</p>
              <p className="mt-4 text-[13.5px] text-white/80">
                {signature.startingPrice ? <>From {formatINR(signature.startingPrice)}</> : "Price on request"}
                {signature.makingTimeDays ? <> · Made in {formatDays(signature.makingTimeDays)}</> : null}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CustomRequestButton productName={signature.requestName ?? signature.name} path={categoryHref(signature)} variant="light" />
                <AppLink href={categoryHref(signature)} className="btn btn-outline-light">
                  See past work
                </AppLink>
              </div>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="all-custom-title" className="container-x py-16 md:py-24">
        <SectionHeader id="all-custom-title" eyebrow="Choose a piece" title="Everything we make to order" />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {rest.map((c) => (
            <li key={c.slug}>
              <CustomCategoryCard category={c} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 31vw, 46vw" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-title" className="bg-cream">
        <div className="container-x grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div className="max-w-md">
            <p className="eyebrow">Simple and personal</p>
            <h2 id="how-title" className="section-title mt-3">
              Your idea, made by hand
            </h2>
            <p className="mt-4 text-muted">Every custom piece starts with a chat. Send us what you have in mind and we take it from there.</p>
          </div>
          <HowCustomWorks />
        </div>
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="recent-custom-title" className="container-x py-16 md:py-24">
          <SectionHeader id="recent-custom-title" eyebrow="Past work" title="Recently made" />
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {recent.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} sizes="(min-width: 768px) 25vw, 46vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
