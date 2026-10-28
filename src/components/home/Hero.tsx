import clsx from "clsx";
import Image from "next/image";
import { site } from "@/config/site";
import { AppLink } from "@/components/ui/AppLink";

/**
 * Full-bleed opener. Plays the hero reel when `site.hero.video` is set; until then
 * shows three product panels like a small gallery wall (one panel on phones).
 */
export function Hero() {
  const { video, poster, panels } = site.hero;
  const mobilePanel = 0; // phones show one panel: the darker thali reads best under the headline

  return (
    <section aria-labelledby="hero-title" className="relative -mt-16 overflow-hidden bg-brown text-paper lg:-mt-[76px]">
      <div className="relative h-[min(80svh,700px)] min-h-[520px] lg:h-[min(80svh,760px)]">
        {video ? (
          <div className="hero-panel absolute inset-0">
            <video className="h-full w-full object-cover" src={video} poster={poster} autoPlay muted loop playsInline aria-hidden="true" />
          </div>
        ) : (
          <div className="absolute inset-0 grid grid-cols-1 gap-[3px] md:grid-cols-3">
            {panels.map((panel, i) => (
              <div
                key={panel.src}
                className={clsx("hero-panel relative overflow-hidden", i !== mobilePanel && "hidden md:block")}
                style={{ "--i": i } as React.CSSProperties}
              >
                <Image src={panel.src} alt={panel.alt} fill priority sizes="(min-width: 768px) 34vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Legibility: darker at the foot for the copy, a little at the top for the header */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(51_36_26/0.92)_0%,rgb(51_36_26/0.62)_42%,rgb(51_36_26/0.2)_68%,rgb(51_36_26/0.5)_100%)] md:bg-[linear-gradient(to_top,rgb(51_36_26/0.86)_0%,rgb(51_36_26/0.35)_45%,rgb(51_36_26/0.15)_70%,rgb(51_36_26/0.5)_100%)]" />

        <div className="container-x relative flex h-full flex-col justify-end pb-14 md:pb-20">
          <div className="hero-copy max-w-xl">
            <p className="eyebrow !text-[#efae55]" style={{ "--i": 0 } as React.CSSProperties}>
              {site.tagline} · Handmade in India
            </p>
            <h1 id="hero-title" className="mt-4 text-[38px] font-semibold leading-[1.06] md:text-[58px]" style={{ "--i": 1 } as React.CSSProperties}>
              Art that tells a story
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85" style={{ "--i": 2 } as React.CSSProperties}>
              Resin décor, festive thalis and tribute frames, poured and finished by hand.
            </p>
            <div className="mt-8" style={{ "--i": 3 } as React.CSSProperties}>
              <AppLink href="/shop" className="btn btn-light">
                Shop the collection
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
