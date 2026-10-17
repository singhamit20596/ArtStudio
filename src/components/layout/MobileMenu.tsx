"use client";

import { ChevronDown, Heart, Package, User, X } from "lucide-react";
import type { NavMenu } from "@/config/nav";
import { site } from "@/config/site";
import { Drawer } from "@/components/ui/Drawer";
import { AppLink } from "@/components/ui/AppLink";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink, messages } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function MobileMenu({ open, onClose, menus }: { open: boolean; onClose: () => void; menus: NavMenu[] }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" label="Menu">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <AppLink href="/" onClick={onClose} aria-label={`${site.name} home`}>
          <Logo compact />
        </AppLink>
        <button type="button" onClick={onClose} aria-label="Close menu" className="-mr-2 grid h-10 w-10 place-items-center">
          <X size={22} />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 px-5">
        {menus.map((menu) => (
          <details key={menu.id} className="group border-b border-line">
            <summary className="nav-label flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
              {menu.label}
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="grid gap-5 pb-5">
              {menu.columns.map((col) => (
                <div key={col.title}>
                  <p className="eyebrow mb-2">{col.title}</p>
                  <ul className="grid gap-2">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <AppLink href={link.href} onClick={onClose} className="block py-0.5 text-[14px]">
                          {link.label}
                          {link.note && <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{link.note}</span>}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}

        <ul className="grid gap-1 py-5 text-[14px]">
          <li>
            <AppLink href="/wishlist" onClick={onClose} className="flex items-center gap-3 py-2">
              <Heart size={18} strokeWidth={1.6} /> Wishlist
            </AppLink>
          </li>
          <li>
            <AppLink href="/account" onClick={onClose} className="flex items-center gap-3 py-2">
              <User size={18} strokeWidth={1.6} /> Account
            </AppLink>
          </li>
          <li>
            <AppLink href="/track-order" onClick={onClose} className="flex items-center gap-3 py-2">
              <Package size={18} strokeWidth={1.6} /> Track order
            </AppLink>
          </li>
        </ul>
      </nav>

      <div className="grid gap-3 border-t border-line bg-cream px-5 py-5">
        <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
          <WhatsAppIcon size={18} /> Chat on WhatsApp
        </a>
        <a href={site.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-1 text-[13px]">
          <InstagramIcon size={18} /> {site.social.instagramHandle}
        </a>
      </div>
    </Drawer>
  );
}
