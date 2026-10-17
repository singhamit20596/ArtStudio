import { WhatsAppIcon } from "@/components/ui/Icons";
import { AppLink } from "@/components/ui/AppLink";
import { messages, whatsappLink } from "@/lib/whatsapp";

/** Shown when a category or occasion has nothing listed yet. */
export function EmptyListing({ title = "Nothing listed here yet" }: { title?: string }) {
  return (
    <div className="mount flex flex-col items-center px-8 py-16 text-center md:py-20">
      <p className="eyebrow">Made to order</p>
      <p className="mt-3 max-w-md text-[18px] font-medium leading-snug">{title}</p>
      <p className="mt-2 max-w-md text-muted">Tell us what you have in mind and we can make it for you by hand.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
          <WhatsAppIcon size={17} /> Message us
        </a>
        <AppLink href="/shop" className="btn btn-outline">
          Shop all
        </AppLink>
      </div>
    </div>
  );
}
