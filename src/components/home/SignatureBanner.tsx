import Image from "next/image";
import { getCategory } from "@/lib/catalog";
import { formatDays, formatINR } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { CustomRequestButton } from "@/components/custom/CustomRequestButton";

const SERVICES = ["Indian Air Force", "Indian Army", "Indian Navy"];

/** Homepage hero spot for the signature product: retirement & tribute frames. */
export function SignatureBanner() {
  const cat = getCategory("retirement-tribute-frames");
  if (!cat) return null;
  const path = "/custom/retirement-tribute-frames";

  return (
    <section aria-labelledby="signature-title" className="surface-brown">
      <div className="container-x grid items-center gap-12 py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16 md:py-24 lg:gap-24">
        <div className="reveal relative mx-auto w-full max-w-[400px] p-3">
          {/* A thin amber mount around the photo, like the frames themselves */}
          <span aria-hidden="true" className="absolute inset-0 border border-amber/60" />
          <div className="relative aspect-[4/5] overflow-hidden bg-brown">
            {cat.image && (
              <Image
                src={cat.image}
                alt="IAF retirement shadow box with medals, wings, patches, rank stripes, a photo and a name plate"
                fill
                sizes="(min-width: 768px) 400px, 90vw"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="reveal max-w-xl">
          <p className="eyebrow">Signature · Made to order</p>
          <h2 id="signature-title" className="mt-4 text-[32px] font-semibold leading-[1.1] md:text-[46px]">
            Honour a lifetime of service
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Shadow-box tribute frames for IAF, Army and Navy retirements. We arrange the officer&apos;s own medals, wings, patches and rank insignia around a
            photograph, finished with an engraved name plate.
          </p>

          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Made for">
            {SERVICES.map((s) => (
              <li key={s} className="border border-line px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink">
                {s}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid max-w-sm grid-cols-2 gap-6 border-t border-line pt-6">
            <div>
              <dt className="text-[12px] text-muted">Starting at</dt>
              <dd className="mt-1 text-[19px] font-medium tabular-nums">{cat.startingPrice ? formatINR(cat.startingPrice) : "On request"}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted">Making time</dt>
              <dd className="mt-1 text-[19px] font-medium tabular-nums">{cat.makingTimeDays ? formatDays(cat.makingTimeDays) : "Ask us"}</dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <CustomRequestButton productName="Retirement & Tribute Frame" path={path} label="Request your frame" variant="light" />
            <AppLink href={path} className="btn btn-outline-light">
              View past work
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
