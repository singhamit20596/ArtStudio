import { Fragment } from "react";
import { AppLink } from "@/components/ui/AppLink";

export interface Crumb {
  label: string;
  href?: string;
}

/** Home / Shop / Pooja & Festive. The last crumb is the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <Fragment key={`${c.label}-${i}`}>
              <li className={last ? "line-clamp-1 text-ink" : undefined}>
                {c.href && !last ? (
                  <AppLink href={c.href} className="link-grow hover:text-ink">
                    {c.label}
                  </AppLink>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{c.label}</span>
                )}
              </li>
              {!last && (
                <li aria-hidden="true" className="text-ink/30">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
