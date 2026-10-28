import type { ReactNode } from "react";
import { site } from "@/config/site";
import { formatDays, formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { InstagramIcon } from "@/components/ui/Icons";

/** Description, "About this item", specifications and shipping notes. */
export function ProductDetails({ product }: { product: Product }) {
  const custom = product.type === "custom";
  const specs: [string, string | null][] = [
    ["Material", product.material],
    ["Dimensions", product.dimensions],
    ["Weight", product.weight],
    [custom ? "Making time" : "Ships in", formatDays(product.makingTimeDays)],
    ["Care", product.care],
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[14.5px] leading-relaxed">{product.description}</p>
        {product.highlights.length > 0 && (
          <>
            <h2 className="mt-7 text-[12px] font-semibold uppercase tracking-[0.16em]">About this item</h2>
            <ul className="mt-3 space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[14px] leading-relaxed">
                  <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-brown" />
                  {h}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="divide-y divide-line border-y border-line">
        <Section title="Specifications" open>
          <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[13.5px]">
            {specs
              .filter((s): s is [string, string] => Boolean(s[1]))
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
        </Section>
        <Section title="Shipping & payment">
          <ul className="space-y-2 text-[13.5px] leading-relaxed">
            <li>
              {custom ? `Made to order in ${formatDays(product.makingTimeDays)}, then` : `Packed and sent in ${formatDays(product.makingTimeDays)}, then`} shipped
              anywhere in India.
            </li>
            <li>
              Free shipping on orders of {formatINR(site.shipping.freeShippingThreshold)} or more. A flat {formatINR(site.shipping.flatFee)} below that.
            </li>
            <li>
              {site.payments.cashOnDelivery && "Cash on Delivery available. "}
              {site.payments.razorpayEnabled ? "UPI, cards and netbanking accepted." : `${site.payments.onlineComingSoonLabel}.`}
            </li>
            <li>Prices include taxes.</li>
          </ul>
        </Section>
      </div>

      {product.instagramUrl && (
        <a href={product.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] transition-opacity hover:opacity-70">
          <InstagramIcon size={17} /> <span className="link-line">See this piece on Instagram</span>
        </a>
      )}
    </div>
  );
}

function Section({ title, open, children }: { title: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group/d py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden="true" className="w-3 text-center text-[18px] font-normal leading-none">
          <span className="group-open/d:hidden">+</span>
          <span className="hidden group-open/d:inline">−</span>
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
