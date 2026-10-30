import clsx from "clsx";
import Image from "next/image";
import { AppLink } from "@/components/ui/AppLink";
import { T } from "@/i18n/T";

const banners = [
  {
    eyebrow: "Pooja & Festive",
    title: "Bring festivals home",
    body: "Torans, thalis and Karwa Chauth sets in jewel-toned resin and gold.",
    cta: "Shop festive",
    hi: {
      eyebrow: "पूजा और त्योहार",
      title: "त्योहारों को घर लाएँ",
      body: "रत्नों जैसे रंगों वाली रेज़िन और सुनहरे काम में तोरण, थाली और करवा चौथ सेट।",
      cta: "त्योहार की चीज़ें देखें",
    },
    href: "/shop/pooja-festive",
    image: "/products/shubh-labh-toran/1.jpg",
    alt: "Shubh Labh resin door hangings on a wall",
    tone: "surface-amber",
  },
  {
    eyebrow: "Personalised",
    title: "Gifts that tell a story",
    body: "Initial keychains, photo blocks and shadow boxes, made around a name, a date or a memory.",
    cta: "Shop personalised",
    hi: {
      eyebrow: "पर्सनलाइज़्ड",
      title: "ऐसे तोहफ़े जो कहानी कहें",
      body: "अक्षर कीचेन, फ़ोटो ब्लॉक और शैडो बॉक्स, किसी नाम, तारीख़ या याद के इर्द-गिर्द बने।",
      cta: "पर्सनलाइज़्ड तोहफ़े देखें",
    },
    href: "/custom",
    image: "/products/botanical-initial-keychain/1.jpg",
    alt: "Resin initial keychains with pressed flowers",
    tone: "surface-brown",
  },
];

export function EditorialBanners() {
  return (
    <section aria-label="Featured collections" className="container-x grid gap-4 py-16 md:grid-cols-2 md:gap-6 md:py-24">
      {banners.map((b) => (
        <AppLink key={b.href} href={b.href} className={clsx("reveal group grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] overflow-hidden", b.tone)}>
          <div className="flex min-w-0 flex-col justify-center gap-3 p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">
              <T en={b.eyebrow} hi={b.hi.eyebrow} />
            </p>
            <h3 className="text-[22px] font-semibold leading-[1.15] sm:text-[26px] lg:text-[30px]">
              <T en={b.title} hi={b.hi.title} />
            </h3>
            <p className="text-[13.5px] leading-relaxed text-muted">
              <T en={b.body} hi={b.hi.body} />
            </p>
            <span className="nav-label link-line mt-3 self-start">
              <T en={b.cta} hi={b.hi.cta} />
            </span>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={b.image} alt={b.alt} fill sizes="(min-width: 768px) 25vw, 45vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]" />
          </div>
        </AppLink>
      ))}
    </section>
  );
}
