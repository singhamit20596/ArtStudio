"use client";

import clsx from "clsx";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShop } from "@/components/providers/ShopProvider";
import { StickyBar } from "@/components/product/StickyBar";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatDays, formatINR } from "@/lib/format";
import { describeOptions, lineCode, MAX_QTY, unitPrice } from "@/lib/pricing";
import { shortName } from "@/lib/product";
import type { Product } from "@/lib/types";
import { useOrigin } from "@/lib/use-origin";
import { whatsappLink } from "@/lib/whatsapp";
import { TributeGallery, type TributeView } from "./TributeGallery";

const ACTIONS_ID = "tribute-actions";

/**
 * The tribute product page body: three photos on the left; size, lights, WhatsApp help,
 * quantity and cart on the right. Choosing lights switches the photo to match.
 */
export function TributeBuyPanel({ product, path, children }: { product: Product; path: string; children?: React.ReactNode }) {
  const sizes = product.sizes ?? [];
  const [sizeId, setSizeId] = useState(sizes[0]?.id ?? "");
  const [light, setLight] = useState(false);
  const [view, setView] = useState<TributeView>("frame");
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const origin = useOrigin();
  const { addToCart, setCartOpen } = useShop();

  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const options = { size: size?.id, light };
  const price = unitPrice(product, options);
  const name = shortName(product);
  const lightOffered = product.lightPrice != null;

  const code = lineCode(product, { options });
  const askText = `Hi! I have a question about the ${name} (${describeOptions(product, options)}, ${formatINR(price)}${code ? `, code ${code}` : ""}).${origin ? ` Link: ${origin}${path}` : ""}`;

  const put = () => addToCart({ slug: product.slug, quantity: qty, options, variant: describeOptions(product, options) }, MAX_QTY) > 0;
  const add = () => {
    put();
    setCartOpen(true);
  };
  const buyNow = () => {
    if (put()) router.push("/checkout");
  };

  if (!size) return null;

  return (
    <div className="mx-auto grid max-w-[1080px] gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 lg:gap-12">
      <div className="md:sticky md:top-24 md:self-start">
        <TributeGallery product={product} view={view} onView={setView} />
      </div>

      <div className="min-w-0">
        {children}

        {/* Price follows size and lights */}
        <div className="mt-3">
          <p key={price} className="pop-in text-[24px] font-semibold tabular-nums">
            {formatINR(price)}
          </p>
          <p className="mt-0.5 text-[12px] text-muted">
            Inclusive of all taxes. Made to order in {formatDays(product.makingTimeDays)}.
          </p>
        </div>

        {/* 1. Size */}
        <fieldset className="mt-5 border-t border-line pt-4">
          <legend className="text-[11px] font-semibold uppercase tracking-[0.16em]">Size</legend>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === size.id}
                onClick={() => setSizeId(s.id)}
                className={clsx(
                  "btn-press border px-2.5 py-2 text-left transition-colors",
                  s.id === size.id ? "border-brown bg-brown text-white" : "border-line hover:border-ink",
                )}
              >
                <span className="block text-[12.5px] font-semibold tabular-nums">{s.label}</span>
                <span className={clsx("block text-[11.5px] tabular-nums", s.id === size.id ? "text-white/80" : "text-muted")}>{formatINR(s.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* 2. Lights */}
        {lightOffered && (
          <fieldset className="mt-4">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.16em]">Lights</legend>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              {[
                { on: false, label: "Without lights", note: "Included", Icon: LightbulbOff },
                { on: true, label: "With LED lights", note: `+ ${formatINR(product.lightPrice ?? 0)}`, Icon: Lightbulb },
              ].map(({ on, label, note, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={light === on}
                  onClick={() => {
                    setLight(on);
                    setView(on ? "lit" : "frame");
                  }}
                  className={clsx(
                    "btn-press flex items-center gap-2.5 border px-2.5 py-2 text-left transition-colors",
                    light === on ? "border-brown bg-brown text-white" : "border-line hover:border-ink",
                  )}
                >
                  <Icon size={18} strokeWidth={1.6} aria-hidden="true" className={clsx(on && light && "text-amber")} />
                  <span>
                    <span className="block text-[12.5px] font-semibold">{label}</span>
                    <span className={clsx("block text-[11.5px] tabular-nums", light === on ? "text-white/80" : "text-muted")}>{note}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* 3. Questions: WhatsApp, front and centre */}
        <div className="surface-amber mt-5 flex items-center justify-between gap-3 px-4 py-3">
          <p className="text-[13px] font-semibold leading-snug">Questions? Get them answered instantly.</p>
          <a href={whatsappLink(askText)} target="_blank" rel="noopener noreferrer" className="attention btn btn-dark btn-press shrink-0 px-4">
            <WhatsAppIcon size={16} /> Ask
          </a>
        </div>

        {/* 4. Cart */}
        <div id={ACTIONS_ID} className="mt-5 space-y-2">
          <div className="flex gap-2">
            <QuantityStepper value={qty} max={MAX_QTY} onChange={(q) => setQty(Math.max(1, Math.min(MAX_QTY, q)))} itemName={name} />
            <button type="button" onClick={add} className="btn btn-dark btn-press flex-1 px-3">
              Add to cart
            </button>
            <button type="button" onClick={buyNow} className="btn btn-outline btn-press flex-1 px-3">
              Buy now
            </button>
          </div>
          <p className="pt-1 text-[12px] leading-relaxed text-muted">
            After you pay, you choose the design, add the name and rank, upload photos and pick the background colour.
          </p>
        </div>

        <StickyBar watchId={ACTIONS_ID}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">
              {name} · {size.label}
            </p>
            <p className="text-[13px] tabular-nums text-muted">{formatINR(price)}</p>
          </div>
          <button type="button" onClick={add} className="btn btn-dark min-h-11 px-5">
            Add to cart
          </button>
        </StickyBar>
      </div>
    </div>
  );
}
