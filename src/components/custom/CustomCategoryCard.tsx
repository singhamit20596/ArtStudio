import { formatINR } from "@/lib/format";
import { categoryHref } from "@/lib/product";
import type { Category } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { ProductImage } from "@/components/product/ProductImage";
import { hiCategoryDescription } from "@/i18n/catalogue";
import { hiCategory } from "@/i18n/names";
import { T } from "@/i18n/T";

/** A custom category tile: photo (or a "Made to order" mount card), name, line and starting price. */
export function CustomCategoryCard({ category, sizes }: { category: Category; sizes: string }) {
  return (
    <AppLink href={categoryHref(category)} className="group block">
      <span className="relative block aspect-[4/5] overflow-hidden bg-brown">
        <ProductImage
          src={category.image}
          alt={category.name}
          sizes={sizes}
          fallbackTitle={<T en={category.name} hi={hiCategory(category.slug)} />}
          fallbackNote={category.status === "coming-soon" ? <T en="Coming soon" hi="जल्द आ रहा है" /> : <T en="Made to order" hi="ऑर्डर पर तैयार" />}
        />
      </span>
      <h3 className="mt-3.5 text-[12.5px] font-semibold uppercase leading-snug tracking-[0.14em]">
        <T en={category.name} hi={hiCategory(category.slug)} />
      </h3>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">
        <T en={category.description} hi={hiCategoryDescription(category.slug)} />
      </p>
      <p className="mt-1.5 text-[12.5px] tabular-nums">
        {category.status === "coming-soon" ? (
          <span className="text-muted">
            <T en="Coming soon" hi="जल्द आ रहा है" />
          </span>
        ) : category.startingPrice ? (
          <T
            en={
              <>
                <span className="text-muted">From </span>
                <span className="font-medium">{formatINR(category.startingPrice)}</span>
              </>
            }
            hi={
              <>
                <span className="font-medium">{formatINR(category.startingPrice)}</span>
                <span className="text-muted"> से शुरू</span>
              </>
            }
          />
        ) : (
          <span className="text-muted">
            <T en="Price on request" hi="कीमत पूछने पर" />
          </span>
        )}
      </p>
    </AppLink>
  );
}
