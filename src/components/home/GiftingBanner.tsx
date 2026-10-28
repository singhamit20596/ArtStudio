import Image from "next/image";
import { AppLink } from "@/components/ui/AppLink";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { messages, whatsappLink } from "@/lib/whatsapp";

export function GiftingBanner() {
  return (
    <section aria-labelledby="gifting-title" className="overflow-hidden surface-amber">
      <div className="container-x grid items-center gap-12 py-16 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:py-20">
        <div className="reveal max-w-xl">
          <p className="eyebrow">Bulk & corporate gifting</p>
          <h2 id="gifting-title" className="mt-4 text-[30px] font-semibold leading-[1.12] md:text-[40px]">
            Gifting for farewells, teams and weddings
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink">
            Squadron and unit farewells, corporate gifts and wedding favours, made as matching sets with names or logos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink(messages.bulk)} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              <WhatsAppIcon size={17} /> Enquire on WhatsApp
            </a>
            <AppLink href="/bulk-gifting" className="btn btn-outline">
              How it works
            </AppLink>
          </div>
        </div>

        <div className="reveal grid grid-cols-2 gap-3 md:gap-4" aria-hidden="true">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/products/botanical-initial-keychain/1.jpg" alt="" fill sizes="(min-width: 768px) 20vw, 45vw" className="object-cover" />
          </div>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden">
            <Image src="/products/resin-photo-blocks-magnets/1.jpg" alt="" fill sizes="(min-width: 768px) 20vw, 45vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
