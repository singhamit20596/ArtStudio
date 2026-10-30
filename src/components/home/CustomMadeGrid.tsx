import { categoryHref, customCategories } from "@/lib/catalog";
import { AppLink } from "@/components/ui/AppLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CustomCategoryCard } from "@/components/custom/CustomCategoryCard";
import { hiCategory } from "@/i18n/names";
import { T } from "@/i18n/T";

const FEATURED = [
  "retirement-tribute-frames",
  "shadow-boxes",
  "fridge-magnets",
  "resin-trays",
  "initial-keychains",
  "wall-clocks",
  "flower-preservation",
  "phone-covers",
];

export function CustomMadeGrid() {
  const featured = FEATURED.map((slug) => customCategories.find((c) => c.slug === slug)).filter((c) => c !== undefined);
  const more = customCategories.filter((c) => !FEATURED.includes(c.slug));

  return (
    <section aria-labelledby="custom-title" className="surface-amber">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          id="custom-title"
          eyebrow={<T en="Made to order" hi="ऑर्डर पर तैयार" />}
          title={<T en="Custom Made" hi="आपकी पसंद से बना" />}
          subtitle={<T en="Tell us the story, the names and the colours. We make it by hand, just for you." hi="हमें कहानी, नाम और रंग बताइए। हम इसे सिर्फ़ आपके लिए हाथ से बनाते हैं।" />}
          action={
            <AppLink href="/custom" className="nav-label link-line">
              <T en="Explore all custom pieces" hi="सभी कस्टम पीस देखें" />
            </AppLink>
          }
        />

        <ul className="cards-reveal mt-10 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-6">
          {featured.map((c) => (
            <li key={c.slug}>
              <CustomCategoryCard category={c} sizes="(min-width: 768px) 25vw, 46vw" />
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-ink/10 pt-8">
          <p className="eyebrow mb-4">
            <T en="More made to order" hi="ऑर्डर पर बनने वाले और पीस" />
          </p>
          <ul className="flex flex-wrap gap-2">
            {more.map((c) => (
              <li key={c.slug}>
                <AppLink href={categoryHref(c)} className="inline-block border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink">
                  <T en={c.name} hi={hiCategory(c.slug)} />
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
