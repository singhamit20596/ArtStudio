import { notFound } from "next/navigation";
import { launch } from "@/config/launch";
import { site } from "@/config/site";
import { exampleFrame, hotspots } from "@/config/tribute";
import { getCategory } from "@/lib/catalog";
import { formatDays, formatINR } from "@/lib/format";
import { Marquee } from "@/components/home/Marquee";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Faq } from "@/components/tribute/Faq";
import { HotspotExplorer } from "@/components/tribute/HotspotExplorer";
import { PreviewSection } from "@/components/tribute/PreviewSection";
import { PriceBand } from "@/components/tribute/PriceBand";
import { ProcessTimeline } from "@/components/tribute/ProcessTimeline";
import { TributeHero } from "@/components/tribute/TributeHero";

/** Homepage for the launch product line: defence retirement tribute frames. */
export default function HomePage() {
  const category = getCategory(launch.focus);
  if (!category) notFound();
  const making = category.makingTimeDays ? formatDays(category.makingTimeDays) : "two weeks";
  const price = category.startingPrice ? formatINR(category.startingPrice) : "a price we confirm with you";

  return (
    <>
      <TributeHero category={category} />

      <Marquee phrases={["Indian Army", "Indian Navy", "Indian Air Force", "Made by hand", "Engraved name plate", "Pan India delivery"]} />

      <section id="inside" aria-labelledby="inside-title" className="container-x py-20 md:py-28">
        <SectionHeader
          id="inside-title"
          eyebrow="What goes inside"
          title="Their service, in one frame"
          subtitle="Every frame is built around what they earned and wore. Explore an Indian Air Force frame we made."
          className="reveal"
        />
        <div className="mt-12">
          <HotspotExplorer frame={exampleFrame} spots={hotspots} />
        </div>
      </section>

      <section id="preview" aria-labelledby="preview-title" className="surface-amber">
        <div className="container-x py-20 md:py-28">
          <PreviewSection />
        </div>
      </section>

      <section id="process" aria-labelledby="process-title" className="surface-brown">
        <div className="container-x grid gap-6 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16 md:py-28">
          <div className="reveal-left md:sticky md:top-28 md:self-start">
            <p className="eyebrow">How it works</p>
            <h2 id="process-title" className="section-title mt-3">
              From your request to their wall
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">No payment online. We agree every detail with you before we start.</p>
          </div>
          <ProcessTimeline making={making} />
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="container-x grid gap-10 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-16 md:py-28">
        <div className="reveal-left">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-title" className="section-title mt-3">
            Good to know
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">Something else on your mind? Ask us on WhatsApp at {site.contact.whatsappDisplay}.</p>
        </div>
        <Faq values={{ price, making, freeShipping: formatINR(site.shipping.freeShippingThreshold) }} />
      </section>

      <PriceBand startingPrice={category.startingPrice ?? null} making={making} />
    </>
  );
}
