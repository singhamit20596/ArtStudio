import { WhatsAppIcon } from "@/components/ui/Icons";
import { AppLink } from "@/components/ui/AppLink";
import type { ReactNode } from "react";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { T } from "@/i18n/T";

/** Shown when a category or occasion has nothing listed yet. */
export function EmptyListing({ title = <T en="Nothing listed here yet" hi="यहाँ अभी कुछ नहीं है" /> }: { title?: ReactNode }) {
  return (
    <div className="mount flex flex-col items-center px-8 py-16 text-center md:py-20">
      <p className="eyebrow">
        <T en="Made to order" hi="ऑर्डर पर तैयार" />
      </p>
      <p className="mt-3 max-w-md text-[18px] font-medium leading-snug">{title}</p>
      <p className="mt-2 max-w-md text-muted">
        <T en="Tell us what you have in mind and we can make it for you by hand." hi="बताइए आपके मन में क्या है, हम उसे आपके लिए हाथ से बना सकते हैं।" />
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
          <WhatsAppIcon size={17} /> <T en="Message us" hi="हमें मैसेज करें" />
        </a>
        <AppLink href="/shop" className="btn btn-outline">
          <T en="Shop all" hi="सभी चीज़ें देखें" />
        </AppLink>
      </div>
    </div>
  );
}
