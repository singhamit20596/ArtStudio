import Image from "next/image";
import { site } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InstagramIcon } from "@/components/ui/Icons";
import { T } from "@/i18n/T";

/** Six latest posts as static images (no API). Replace files in /public/instagram to update. */
const posts = [
  { image: "/instagram/01-toran.jpg", href: "https://www.instagram.com/reel/DehcHR6TtL2/", alt: "Reel: Shubh Labh door hangings for Diwali" },
  { image: "/instagram/02-coaster.jpg", href: "https://www.instagram.com/reel/DeXJ1XwTw6f/", alt: "Reel: blush agate resin tray" },
  { image: "/instagram/03-iaf.jpg", href: "https://www.instagram.com/reel/DeRz5G_CBu0/", alt: "Reel: IAF retirement tribute frame" },
  { image: "/instagram/04-karwa.jpg", href: "https://www.instagram.com/reel/DeMlAapzv6X/", alt: "Reel: Karwa Chauth chalni and thali set" },
  { image: "/instagram/05-thali.jpg", href: "https://www.instagram.com/reel/DeHf5SUM9gw/", alt: "Reel: red resin pooja thali" },
  { image: "/instagram/06-shadowbox.jpg", href: "https://www.instagram.com/reel/Dd6vjLGzJ1e/", alt: "Reel: LED birthday shadow box" },
];

export function InstagramStrip() {
  return (
    <section aria-labelledby="ig-title" className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeader
          id="ig-title"
          eyebrow={<T en="On Instagram" hi="Instagram पर" />}
          title={site.social.instagramHandle}
          subtitle={<T en="New pieces, behind-the-scenes pours and happy customers." hi="नए पीस, बनते हुए पीस की झलकियाँ और ख़ुश ग्राहक।" />}
          action={
            <a href={site.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <InstagramIcon size={17} /> <T en="Follow" hi="फ़ॉलो करें" />
            </a>
          }
        />
      </div>
      <ul className="container-x mt-10 grid grid-cols-3 gap-1.5 md:grid-cols-6 md:gap-2">
        {posts.map((p) => (
          <li key={p.href}>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[3/4] overflow-hidden bg-brown">
              <Image src={p.image} alt={p.alt} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" />
              <span className="absolute inset-0 grid place-items-center bg-brown/0 text-paper transition-colors duration-300 group-hover:bg-brown/50">
                <InstagramIcon size={26} className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
