import { Check } from "lucide-react";
import { site } from "@/config/site";
import { services } from "@/config/tribute";
import { formatINR } from "@/lib/format";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { PointerGlow } from "./PointerGlow";
import { RequestFrameButton } from "./RequestFrameButton";

/** Closing call to action: starting price, making time, what's included, two ways to start. */
export function PriceBand({ startingPrice, making }: { startingPrice: number | null; making: string }) {
  const freeDelivery = startingPrice != null && startingPrice >= site.shipping.freeShippingThreshold;
  return (
    <PointerGlow aria-labelledby="start-title" className="surface-brown border-b border-line">
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div className="reveal-left">
          <p className="eyebrow">Begin their tribute</p>
          <h2 id="start-title" className="mt-4 text-[34px] font-semibold leading-[1.08] md:text-[48px]">
            Ready to honour <span className="shimmer">their service?</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">Choose the tribute and size, pay, then personalise it with their name, rank and photos.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <RequestFrameButton variant="light" />
            <a href={whatsappLink(messages.custom("retirement tribute frame"))} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-press">
              <WhatsAppIcon size={17} /> Ask on WhatsApp
            </a>
          </div>
        </div>

        <div className="reveal-right border border-line p-7 md:p-9">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Starting at</p>
          <p className="mt-2 text-[44px] font-semibold leading-none tabular-nums">{startingPrice ? formatINR(startingPrice) : "On request"}</p>
          <p className="mt-3 text-[13.5px] text-muted">The price depends on the tribute, the size and whether you add lights.</p>
          <ul className="mt-7 grid gap-3 text-[14px]">
            <li className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
              For {services.filter((s) => s.id !== "other").map((s) => s.label.replace("Indian ", "")).join(", ")} retirements
            </li>
            <li className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
              Shadow box, newspaper or resin, in several sizes, with or without LED lights
            </li>
            <li className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
              Personalised with their name, rank, photos and your choice of colour
            </li>
            <li className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
              Made by hand in about {making}
            </li>
            <li className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
              {freeDelivery ? "Free delivery across India" : "Delivered across India"}
            </li>
          </ul>
        </div>
      </div>
    </PointerGlow>
  );
}
