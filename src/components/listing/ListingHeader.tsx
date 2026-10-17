import clsx from "clsx";
import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface ListingHeaderProps {
  crumbs: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Quick links under the description (sub-categories, other occasions). */
  links?: ReactNode;
}

/** Title block at the top of every listing page. */
export function ListingHeader({ crumbs, eyebrow, title, description, links }: ListingHeaderProps) {
  return (
    <header className="pt-6 pb-8 md:pt-8 md:pb-12">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 max-w-2xl md:mt-12">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-[32px] font-semibold leading-[1.1] md:text-[44px]">{title}</h1>
        {description && <div className="mt-4 text-[15px] leading-relaxed text-muted">{description}</div>}
      </div>
      {links && <div className="mt-7">{links}</div>}
    </header>
  );
}

/** Pill links used under a listing title. */
export function PillLinks({ children, label }: { children: ReactNode; label: string }) {
  return (
    <nav aria-label={label}>
      <ul className="scroller -mx-4 gap-2 px-4 md:mx-0 md:flex-wrap md:px-0">{children}</ul>
    </nav>
  );
}

export function Pill({ href, active = false, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <li className="shrink-0">
      <AppLink
        href={href}
        aria-current={active ? "page" : undefined}
        className={clsx(
          "inline-block whitespace-nowrap border px-4 py-2 text-[13px] transition-colors",
          active ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink",
        )}
      >
        {children}
      </AppLink>
    </li>
  );
}
