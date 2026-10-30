import Image from "next/image";
import { AppLink } from "@/components/ui/AppLink";
import { Sparkle } from "@/components/ui/Icons";
import { T } from "@/i18n/T";

const tiles: { label: string; hi: string; href: string; image: string | null }[] = [
  { label: "Pooja & Festive", hi: "पूजा और त्योहार", href: "/shop/pooja-festive", image: "/products/lal-pooja-thali/1.jpg" },
  { label: "Trays & Coasters", hi: "ट्रे और कोस्टर", href: "/shop/trays-coasters", image: "/products/blush-agate-resin-tray/1.jpg" },
  { label: "Wall Décor", hi: "दीवार की सजावट", href: "/shop/wall-decor", image: "/products/marble-noir-wall-clock/1.jpg" },
  { label: "Keychains", hi: "कीचेन", href: "/shop/keychains-accessories", image: "/products/botanical-initial-keychain/1.jpg" },
  { label: "Shadow Boxes", hi: "शैडो बॉक्स", href: "/custom/shadow-boxes", image: "/products/birthday-shadow-box-led/1.jpg" },
  { label: "Photo Magnets", hi: "फ़ोटो मैग्नेट", href: "/custom/fridge-magnets", image: "/products/resin-photo-blocks-magnets/1.jpg" },
  { label: "Made to Order", hi: "ऑर्डर पर तैयार", href: "/custom", image: null },
];

export function CategoryStrip() {
  return (
    <section aria-labelledby="cat-title" className="pt-10 pb-4 md:pt-14">
      <h2 id="cat-title" className="sr-only">
        <T en="Shop by category" hi="कैटेगरी के हिसाब से देखें" />
      </h2>
      <ul className="scroller container-x gap-5 sm:gap-7 lg:justify-between lg:gap-4">
        {tiles.map((t) => (
          <li key={t.href} className="w-[88px] shrink-0 sm:w-[104px] lg:w-[124px]">
            <AppLink href={t.href} className="group flex flex-col items-center gap-3 text-center">
              <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-brown ring-1 ring-brown ring-offset-[3px] ring-offset-sage transition-[box-shadow] duration-300 group-hover:ring-amber">
                {t.image ? (
                  <Image src={t.image} alt="" fill sizes="124px" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-110" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-amber text-[#1e140d]">
                    <Sparkle size={26} />
                  </span>
                )}
              </span>
              <span className="text-[10.5px] font-semibold uppercase leading-snug tracking-[0.16em]">
                <T en={t.label} hi={t.hi} />
              </span>
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
