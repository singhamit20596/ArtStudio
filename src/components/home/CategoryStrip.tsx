import Image from "next/image";
import { AppLink } from "@/components/ui/AppLink";
import { Sparkle } from "@/components/ui/Icons";

const tiles: { label: string; href: string; image: string | null }[] = [
  { label: "Pooja & Festive", href: "/shop/pooja-festive", image: "/products/lal-pooja-thali/1.jpg" },
  { label: "Trays & Coasters", href: "/shop/trays-coasters", image: "/products/blush-agate-resin-tray/1.jpg" },
  { label: "Wall Décor", href: "/shop/wall-decor", image: "/products/marble-noir-wall-clock/1.jpg" },
  { label: "Keychains", href: "/shop/keychains-accessories", image: "/products/botanical-initial-keychain/1.jpg" },
  { label: "Tribute Frames", href: "/custom/retirement-tribute-frames", image: "/products/iaf-retirement-tribute-frame/1.jpg" },
  { label: "Shadow Boxes", href: "/custom/shadow-boxes", image: "/products/birthday-shadow-box-led/1.jpg" },
  { label: "Photo Magnets", href: "/custom/fridge-magnets", image: "/products/resin-photo-blocks-magnets/1.jpg" },
  { label: "Made to Order", href: "/custom", image: null },
];

export function CategoryStrip() {
  return (
    <section aria-labelledby="cat-title" className="pt-10 pb-4 md:pt-14">
      <h2 id="cat-title" className="sr-only">
        Shop by category
      </h2>
      <ul className="scroller container-x gap-5 sm:gap-7 lg:justify-between lg:gap-4">
        {tiles.map((t) => (
          <li key={t.href} className="w-[88px] shrink-0 sm:w-[104px] lg:w-[124px]">
            <AppLink href={t.href} className="group flex flex-col items-center gap-3 text-center">
              <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-sand ring-1 ring-line ring-offset-[3px] ring-offset-paper transition-[box-shadow] duration-300 group-hover:ring-gold">
                {t.image ? (
                  <Image src={t.image} alt="" fill sizes="124px" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-110" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-ink text-gold">
                    <Sparkle size={26} />
                  </span>
                )}
              </span>
              <span className="text-[10.5px] font-semibold uppercase leading-snug tracking-[0.16em]">{t.label}</span>
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
