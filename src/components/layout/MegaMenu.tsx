import Image from "next/image";
import type { NavMenu } from "@/config/nav";
import { AppLink } from "@/components/ui/AppLink";
import { T } from "@/i18n/T";
import { tr } from "@/i18n/ui";

/** Dropdown panel shown under the header for one top-level menu. */
export function MegaMenu({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  return (
    <div id={`menu-${menu.id}`} role="region" aria-label={`${menu.label} menu`} className="anim-drop absolute inset-x-0 top-full surface-sage border-t border-line shadow-[0_24px_40px_-24px_rgb(90_62_43/0.4)]">
      <div className="container-x flex gap-10 py-7">
        {menu.columns.length > 0 && (
        <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(180px,220px))] content-start gap-x-10 gap-y-7">
          {menu.columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4"><T en={col.title} hi={tr(col.title)} /></p>
              <ul className="grid gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <AppLink href={link.href} onClick={onNavigate} className="link-grow text-[14px] text-ink">
                      <T en={link.label} hi={tr(link.label)} />
                    </AppLink>
                    {link.note && <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"><T en={link.note} hi={tr(link.note)} /></span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        )}
        {menu.features.length > 0 && (
          <div className="flex shrink-0 gap-4">
            {menu.features.map((f) => (
              <AppLink key={f.href} href={f.href} onClick={onNavigate} className="group block w-[160px]">
                <span className="relative block aspect-[4/5] overflow-hidden bg-brown">
                  <Image src={f.image} alt={f.alt} fill sizes="160px" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]" />
                </span>
                <span className="eyebrow mt-3 block"><T en={f.eyebrow} hi={tr(f.eyebrow)} /></span>
                <span className="mt-1 block text-[13px] font-medium uppercase tracking-[0.12em]"><T en={f.title} hi={tr(f.title)} /></span>
              </AppLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
