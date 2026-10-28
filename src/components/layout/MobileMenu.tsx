"use client";

import { ChevronDown, ChevronRight, Heart, Package, User, X } from "lucide-react";
import type { NavLink, NavMenu } from "@/config/nav";
import { site } from "@/config/site";
import { Drawer } from "@/components/ui/Drawer";
import { AppLink } from "@/components/ui/AppLink";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink, messages } from "@/lib/whatsapp";
import { Logo } from "./Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  menus: NavMenu[];
  links?: NavLink[];
  cta?: NavLink;
  shop: boolean;
}

export function MobileMenu({ open, onClose, menus, links = [], cta, shop }: MobileMenuProps) {
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
        {links.length > 0 && (
          <ul className="border-b border-line py-2">
            {links.map((link, i) => (
              <li key={link.href} className="menu-item" style={{ "--i": i } as React.CSSProperties}>
                <AppLink href={link.href} onClick={onClose} className="nav-label flex items-center justify-between py-4">
                  {link.label}
                  <span aria-hidden="true">→</span>
                </AppLink>
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <AppLink href={cta.href} onClick={onClose} className="btn btn-dark mt-6 w-full">
            {cta.label}
          </AppLink>
        )}
        {menus.map((menu) =>
          menu.href ? (
            <AppLink key={menu.id} href={menu.href} onClick={onClose} className="nav-label flex items-center justify-between border-b border-line py-4">
              {menu.label}
              <ChevronRight size={16} aria-hidden="true" />
            </AppLink>
          ) : (
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
          ),
        )}

        {shop && (
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
        )}
      </nav>

      <div className="grid gap-3 surface-brown px-5 py-5">
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
