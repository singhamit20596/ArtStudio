import { WhatsAppIcon } from "@/components/ui/Icons";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { T } from "@/i18n/T";

/** Floating chat button, bottom-right on every page. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(messages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-float group fixed z-50 grid h-14 w-14 place-items-center rounded-full bg-amber text-[#1e140d] shadow-[0_10px_28px_rgb(90_62_43/0.35)] transition-[transform,bottom] duration-300 hover:scale-105"
    >
      <WhatsAppIcon size={28} />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-brown px-3 py-1.5 text-[12px] text-paper opacity-0 transition-opacity group-hover:opacity-100 md:block">
        <T en="Chat on WhatsApp" hi="WhatsApp पर बात करें" />
      </span>
    </a>
  );
}
