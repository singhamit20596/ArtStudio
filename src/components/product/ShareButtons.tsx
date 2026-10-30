"use client";

import { Link2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { toast } from "@/components/ui/Toaster";
import { messages } from "@/lib/whatsapp";
import { T } from "@/i18n/T";

/** Share on WhatsApp or copy the page link. */
export function ShareButtons({ name }: { name: string }) {
  const shareOnWhatsApp = () => {
    const text = messages.share(name, window.location.href);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied", "लिंक कॉपी हो गया");
    } catch {
      toast("Could not copy the link. Copy it from the address bar instead.", "लिंक कॉपी नहीं हो सका। ऊपर एड्रेस बार से कॉपी कर लें।");
    }
  };

  const button = "flex h-9 items-center gap-2 px-1 text-[12.5px] transition-opacity hover:opacity-70";
  return (
    <div className="flex items-center gap-4">
      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
        <T en="Share" hi="शेयर करें" />
      </span>
      <button type="button" onClick={shareOnWhatsApp} className={button}>
        <WhatsAppIcon size={16} /> WhatsApp
      </button>
      <button type="button" onClick={copy} className={button}>
        <Link2 size={16} strokeWidth={1.7} aria-hidden="true" /> <T en="Copy link" hi="लिंक कॉपी करें" />
      </button>
    </div>
  );
}
