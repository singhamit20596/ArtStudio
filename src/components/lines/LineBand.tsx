import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import type { ThemedLine } from "@/config/lines";
import type { Product } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { LineCards } from "./LineCards";
import { hiLine } from "@/i18n/lines";
import { T } from "@/i18n/T";
import { tr } from "@/i18n/ui";

interface LineBandProps {
  line: ThemedLine;
  products: Product[];
  decor: React.ReactNode;
  Icon: LucideIcon;
  /** Button label, e.g. "See all Christmas". */
  cta: string;
}

/** A themed line's homepage section, in its own colours: four pieces and a link to the rest. */
export function LineBand({ line, products, decor, Icon, cta }: LineBandProps) {
  const titleId = `${line.category}-band-title`;
  const hi = hiLine(line.category);
  return (
    <section aria-labelledby={titleId} className={clsx(line.theme)}>
      <div className="surface-brown relative overflow-hidden">
        {decor}
        <div className="container-x relative pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div className="max-w-xl">
              <p className="eyebrow">
                <T en={line.eyebrow} hi={hi?.eyebrow} />
              </p>
              <h2 id={titleId} className="section-title mt-3">
                <T
                  en={
                    <>
                      {line.title[0]} <span className="shimmer">{line.title[1]}</span>
                    </>
                  }
                  hi={
                    hi && (
                      <>
                        {hi.title[0]} <span className="shimmer">{hi.title[1]}</span>
                      </>
                    )
                  }
                />
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                <T en={line.bandLine} hi={hi?.bandLine} />
              </p>
            </div>
            <AppLink href={line.path} className="btn btn-light btn-press">
              <T en={cta} hi={tr(cta)} />
            </AppLink>
          </div>
          <LineCards line={line} products={products} Icon={Icon} row className="mt-8" />
        </div>
      </div>
    </section>
  );
}
