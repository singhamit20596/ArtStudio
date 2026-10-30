import type { ReactNode } from "react";
import { site } from "@/config/site";
import { formatDays, formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { InstagramIcon } from "@/components/ui/Icons";
import { hiCare, hiProductCopy } from "@/i18n/catalogue";
import { formatDaysHi } from "@/i18n/format";
import { T } from "@/i18n/T";
import { tr } from "@/i18n/ui";

/** Description, "About this item", specifications and shipping notes. */
export function ProductDetails({ product }: { product: Product }) {
  const custom = product.type === "custom";
  const copy = hiProductCopy(product.slug);
  const days = formatDays(product.makingTimeDays);
  const daysHi = formatDaysHi(product.makingTimeDays);
  // [label, Hindi label, value, Hindi value]
  const specs: [string, string, string | null, string | undefined][] = [
    ["Material", "सामग्री", product.material, copy?.material],
    ["Dimensions", "माप", product.dimensions, undefined],
    ["Weight", "वज़न", product.weight, undefined],
    [custom ? "Making time" : "Ships in", custom ? "बनने में समय" : "भेजा जाता है", days, daysHi],
    ["Care", "देखभाल", product.care, hiCare(product.care)],
  ];
  const onlineLabel = site.payments.onlineComingSoonLabel;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[14.5px] leading-relaxed">
          <T en={product.description} hi={copy?.description} />
        </p>
        {product.highlights.length > 0 && (
          <>
            <h2 className="mt-7 text-[12px] font-semibold uppercase tracking-[0.16em]">
              <T en="About this item" hi="इस पीस के बारे में" />
            </h2>
            <ul className="mt-3 space-y-2">
              {product.highlights.map((h, i) => (
                <li key={h} className="flex gap-3 text-[14px] leading-relaxed">
                  <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-brown" />
                  {/* Hindi highlights follow the English order; a count mismatch keeps the English. */}
                  <span>
                    <T en={h} hi={copy?.highlights.length === product.highlights.length ? copy.highlights[i] : undefined} />
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="divide-y divide-line border-y border-line">
        <Section title={<T en="Specifications" hi="जानकारी" />} open>
          <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[13.5px]">
            {specs
              .filter((s): s is [string, string, string, string | undefined] => Boolean(s[2]))
              .map(([k, kHi, v, vHi]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">
                    <T en={k} hi={kHi} />
                  </dt>
                  <dd>
                    <T en={v} hi={vHi} />
                  </dd>
                </div>
              ))}
          </dl>
        </Section>
        <Section title={<T en="Shipping & payment" hi="डिलीवरी और भुगतान" />}>
          <ul className="space-y-2 text-[13.5px] leading-relaxed">
            <li>
              <T
                en={`${custom ? `Made to order in ${days}, then` : `Packed and sent in ${days}, then`} shipped anywhere in India.`}
                hi={custom ? `ऑर्डर पर ${daysHi} में बनता है, फिर भारत में कहीं भी भेजा जाता है।` : `${daysHi} में पैक करके भेजा जाता है, भारत में कहीं भी।`}
              />
            </li>
            <li>
              <T
                en={`Free shipping on orders of ${formatINR(site.shipping.freeShippingThreshold)} or more. A flat ${formatINR(site.shipping.flatFee)} below that.`}
                hi={`${formatINR(site.shipping.freeShippingThreshold)} या उससे ज़्यादा के ऑर्डर पर डिलीवरी मुफ़्त। उससे कम पर ${formatINR(site.shipping.flatFee)}।`}
              />
            </li>
            <li>
              {site.payments.cashOnDelivery && <T en="Cash on Delivery available. " hi="कैश ऑन डिलीवरी उपलब्ध है। " />}
              {site.payments.razorpayEnabled ? (
                <T en="UPI, cards and netbanking accepted." hi="UPI, कार्ड और नेटबैंकिंग से भुगतान कर सकते हैं।" />
              ) : (
                <T en={`${onlineLabel}.`} hi={tr(onlineLabel) && `${tr(onlineLabel)}।`} />
              )}
            </li>
            <li>
              <T en="Prices include taxes." hi="कीमतों में टैक्स शामिल है।" />
            </li>
          </ul>
        </Section>
      </div>

      {product.instagramUrl && (
        <a href={product.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] transition-opacity hover:opacity-70">
          <InstagramIcon size={17} /> <span className="link-line">
            <T en="See this piece on Instagram" hi="यह पीस Instagram पर देखें" />
          </span>
        </a>
      )}
    </div>
  );
}

function Section({ title, open, children }: { title: ReactNode; open?: boolean; children: ReactNode }) {
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
