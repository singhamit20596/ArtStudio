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
import { hiCategoryDescription } from "@/i18n/catalogue";
import { formatDaysHi } from "@/i18n/format";
import { hiCategory } from "@/i18n/names";
import { T } from "@/i18n/T";

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
          crumbs={[{ label: "Custom", hi: "कस्टम ऑर्डर" }]}
          eyebrow={<T en="Made to order" hi="ऑर्डर पर तैयार" />}
          title={<T en="Custom Made" hi="आपकी पसंद से बना" />}
          description={
            <T
              en="Tell us the story, the names and the colours. We make it by hand, just for you, and ship it anywhere in India."
              hi="हमें कहानी, नाम और रंग बताइए। हम इसे सिर्फ़ आपके लिए हाथ से बनाते हैं, और भारत में कहीं भी भेजते हैं।"
            />
          }
        />
      </div>

      {signature && (
        <section aria-labelledby="signature-title" className="surface-brown">
          <div className="container-x grid items-center gap-10 py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:py-20">
            <div className="relative aspect-[4/5] overflow-hidden md:order-2 md:aspect-[5/4]">
              {signature.image && <Image src={signature.image} alt="IAF retirement shadow box with medals, wings and a name plate" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />}
            </div>
            <div className="max-w-lg">
              <p className="eyebrow">
                <T en="Our signature · IAF · Army · Navy" hi="हमारी पहचान · वायु सेना · थल सेना · नौसेना" />
              </p>
              <h2 id="signature-title" className="mt-4 text-[30px] font-semibold leading-[1.12] md:text-[38px]">
                <T en={signature.name} hi={hiCategory(signature.slug)} />
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                <T en={signature.description} hi={hiCategoryDescription(signature.slug)} />
              </p>
              <p className="mt-4 text-[13.5px] text-muted">
                {signature.startingPrice ? (
                  <T en={`From ${formatINR(signature.startingPrice)}`} hi={`${formatINR(signature.startingPrice)} से शुरू`} />
                ) : (
                  <T en="Price on request" hi="कीमत पूछने पर" />
                )}
                {signature.makingTimeDays ? (
                  <T en={` · Made in ${formatDays(signature.makingTimeDays)}`} hi={` · ${formatDaysHi(signature.makingTimeDays)} में बनता है`} />
                ) : null}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CustomRequestButton productName={signature.requestName ?? signature.name} path={categoryHref(signature)} variant="light" />
                <AppLink href={categoryHref(signature)} className="btn btn-outline-light">
                  <T en="See past work" hi="पहले के काम देखें" />
                </AppLink>
              </div>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="all-custom-title" className="container-x py-16 md:py-24">
        <SectionHeader
          id="all-custom-title"
          eyebrow={<T en="Choose a piece" hi="पीस चुनें" />}
          title={<T en="Everything we make to order" hi="जो कुछ हम ऑर्डर पर बनाते हैं" />}
        />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {rest.map((c) => (
            <li key={c.slug}>
              <CustomCategoryCard category={c} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 31vw, 46vw" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-title" className="surface-amber">
        <div className="container-x grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div className="max-w-md">
            <p className="eyebrow">
              <T en="Simple and personal" hi="आसान और अपनापन भरा" />
            </p>
            <h2 id="how-title" className="section-title mt-3">
              <T en="Your idea, made by hand" hi="आपका आइडिया, हाथ से बना" />
            </h2>
            <p className="mt-4 text-muted">
              <T
                en="Every custom piece starts with a chat. Send us what you have in mind and we take it from there."
                hi="हर कस्टम पीस एक बातचीत से शुरू होता है। आपके मन में जो है, हमें भेजिए, आगे हम सँभाल लेंगे।"
              />
            </p>
          </div>
          <HowCustomWorks />
        </div>
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="recent-custom-title" className="container-x py-16 md:py-24">
          <SectionHeader id="recent-custom-title" eyebrow={<T en="Past work" hi="पहले के काम" />} title={<T en="Recently made" hi="हाल ही में बने" />} />
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
