"use client";

import { Link2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { toast } from "@/components/ui/Toaster";
import { messages } from "@/lib/whatsapp";

/** Share on WhatsApp or copy the page link. */
export function ShareButtons({ name }: { name: string }) {
  const shareOnWhatsApp = () => {
    const text = messages.share(name, window.location.href);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied");
    } catch {
      toast("Could not copy the link. Copy it from the address bar instead.");
    }
  };

  const button = "flex h-9 items-center gap-2 px-1 text-[12.5px] transition-opacity hover:opacity-70";
  return (
    <div className="flex items-center gap-4">
      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Share</span>
      <button type="button" onClick={shareOnWhatsApp} className={button}>
        <WhatsAppIcon size={16} /> WhatsApp
      </button>
      <button type="button" onClick={copy} className={button}>
        <Link2 size={16} strokeWidth={1.7} aria-hidden="true" /> Copy link
      </button>
    </div>
  );
}
