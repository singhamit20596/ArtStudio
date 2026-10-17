import Image from "next/image";
import type { NavMenu } from "@/config/nav";
import { AppLink } from "@/components/ui/AppLink";

/** Dropdown panel shown under the header for one top-level menu. */
export function MegaMenu({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  return (
    <div id={`menu-${menu.id}`} role="region" aria-label={`${menu.label} menu`} className="anim-drop absolute inset-x-0 top-full border-t border-line bg-paper text-ink shadow-[0_24px_40px_-24px_rgb(0_0_0/0.22)]">
      <div className="container-x flex gap-12 py-10">
        <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(190px,230px))] content-start gap-x-12 gap-y-8">
          {menu.columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="grid gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <AppLink href={link.href} onClick={onNavigate} className="link-grow text-[14px] text-ink">
                      {link.label}
                    </AppLink>
                    {link.note && <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{link.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {menu.features.length > 0 && (
          <div className="flex shrink-0 gap-5">
            {menu.features.map((f) => (
              <AppLink key={f.href} href={f.href} onClick={onNavigate} className="group block w-[190px]">
                <span className="relative block aspect-[4/5] overflow-hidden bg-sand">
                  <Image src={f.image} alt={f.alt} fill sizes="190px" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]" />
                </span>
                <span className="eyebrow mt-3 block">{f.eyebrow}</span>
                <span className="mt-1 block text-[13px] font-medium uppercase tracking-[0.12em]">{f.title}</span>
              </AppLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
