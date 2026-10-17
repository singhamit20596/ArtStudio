import { WhatsAppIcon } from "@/components/ui/Icons";
import { messages, whatsappLink } from "@/lib/whatsapp";

/** Floating chat button, bottom-right on every page. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(messages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-float group fixed z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_28px_rgb(0_0_0/0.22)] transition-[transform,bottom] duration-300 hover:scale-105"
    >
      <WhatsAppIcon size={28} />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-ink px-3 py-1.5 text-[12px] text-paper opacity-0 transition-opacity group-hover:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
