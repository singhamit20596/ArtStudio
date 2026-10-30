"use client";

import clsx from "clsx";
import Image from "next/image";
import { useShop } from "@/components/providers/ShopProvider";
import { AppLink } from "@/components/ui/AppLink";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { toast } from "@/components/ui/Toaster";
import { formatINR } from "@/lib/format";
import { lineKey, maxQuantity, unitPrice, type CartLine, type CartProduct, type PricedLine } from "@/lib/pricing";
import { productHref, shortName } from "@/lib/product";
import { hiProductName, hiShortName, hiVariant } from "@/i18n/names";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

const linkBtn = "text-[12px] text-muted underline underline-offset-4 transition-colors hover:text-ink";

function Thumb({ product, slug }: { product?: CartProduct; slug: string }) {
  return (
    <AppLink href={productHref({ slug })} tabIndex={-1} aria-hidden="true" className="relative block h-[100px] w-20 shrink-0 overflow-hidden bg-brown">
      {product?.image && <Image src={product.image} alt="" fill sizes="80px" className="object-cover" />}
    </AppLink>
  );
}

/** Lines in the cart: quantity, remove, save for later. */
export function CartLines({ lines, unavailable, className }: { lines: PricedLine[]; unavailable: CartLine[]; className?: string }) {
  const { setQuantity, removeFromCart, saveForLater } = useShop();
  const hi = useLang() === "hi";

  return (
    <ul className={clsx("divide-y divide-line", className)}>
      {lines.map(({ key, line, product, quantity, unitPrice: each, lineTotal }) => (
        <li key={key} className="flex gap-4 py-5">
          <Thumb product={product} slug={line.slug} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <AppLink href={productHref(product)} className="line-clamp-2 text-[13.5px] leading-snug hover:underline">
                <T en={product.name} hi={hiProductName(product.slug)} />
              </AppLink>
              <p className="shrink-0 text-[13.5px] font-medium tabular-nums">{formatINR(lineTotal)}</p>
            </div>
            {line.variant && (
              <p className="mt-0.5 text-[12.5px] text-muted">
                <T en={line.variant} hi={hiVariant(line.variant)} />
              </p>
            )}
            {quantity > 1 && (
              <p className="text-[12px] text-muted tabular-nums">
                <T en={`${formatINR(each)} each`} hi={`${formatINR(each)} प्रति पीस`} />
              </p>
            )}
            {product.stock <= 3 && (
              <p className="mt-0.5 text-[12px] font-medium text-ink">
                <T en={`Only ${product.stock} left`} hi={`सिर्फ़ ${product.stock} बचे हैं`} />
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <QuantityStepper size="sm" value={quantity} max={maxQuantity(product)} onChange={(q) => setQuantity(key, q)} itemName={hi ? (hiShortName(product.slug) ?? shortName(product)) : shortName(product)} />
              <button
                type="button"
                className={linkBtn}
                onClick={() => {
                  saveForLater(key);
                  toast("Saved for later", "बाद के लिए रख लिया");
                }}
              >
                <T en="Save for later" hi="बाद के लिए रखें" />
              </button>
              <button type="button" className={linkBtn} onClick={() => removeFromCart(key)}>
                <T en="Remove" hi="हटाएँ" />
              </button>
            </div>
          </div>
        </li>
      ))}
      {unavailable.map((line) => (
        <li key={lineKey(line)} className="flex gap-4 py-5 opacity-70">
          <Thumb slug={line.slug} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px]">
              <T en="This piece is no longer available" hi="यह पीस अब उपलब्ध नहीं है" />
            </p>
            {line.variant && (
              <p className="text-[12.5px] text-muted">
                <T en={line.variant} hi={hiVariant(line.variant)} />
              </p>
            )}
            <button type="button" className={clsx(linkBtn, "mt-2")} onClick={() => removeFromCart(lineKey(line))}>
              <T en="Remove" hi="हटाएँ" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** "Saved for later" list with Move to cart. */
export function SavedForLater({ catalogue }: { catalogue: CartProduct[] }) {
  const { saved, moveToCart, removeSaved } = useShop();
  if (saved.length === 0) return null;

  return (
    <section aria-labelledby="saved-title">
      <h2 id="saved-title" className="text-[12px] font-semibold uppercase tracking-[0.16em]">
        <T en="Saved for later" hi="बाद के लिए रखे गए" /> ({saved.length})
      </h2>
      <ul className="mt-2 divide-y divide-line">
        {saved.map((line) => {
          const key = lineKey(line);
          const product = catalogue.find((p) => p.slug === line.slug);
          const available = product && maxQuantity(product) > 0;
          return (
            <li key={key} className="flex gap-4 py-4">
              <Thumb product={product} slug={line.slug} />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[13px] leading-snug">
                  {product ? <T en={product.name} hi={hiProductName(product.slug)} /> : <T en="No longer available" hi="अब उपलब्ध नहीं है" />}
                </p>
                {line.variant && (
                  <p className="text-[12px] text-muted">
                    <T en={line.variant} hi={hiVariant(line.variant)} />
                  </p>
                )}
                {product && (
                  <p className="mt-0.5 text-[13px] tabular-nums">{available ? formatINR(unitPrice(product, line.options)) : <T en="Sold out" hi="बिक गया" />}</p>
                )}
                <div className="mt-2 flex gap-4">
                  {available && (
                    <button type="button" className={linkBtn} onClick={() => moveToCart(key)}>
                      <T en="Move to cart" hi="कार्ट में डालें" />
                    </button>
                  )}
                  <button type="button" className={linkBtn} onClick={() => removeSaved(key)}>
                    <T en="Remove" hi="हटाएँ" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
