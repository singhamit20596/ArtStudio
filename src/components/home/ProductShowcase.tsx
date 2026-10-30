import Image from "next/image";
import { launch } from "@/config/launch";
import { cars } from "@/config/cars";
import { christmas } from "@/config/christmas";
import { diwali } from "@/config/diwali";
import { categoryHref, getCategory, products } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { productHref, shortName } from "@/lib/product";
import type { Product } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { hiShortName } from "@/i18n/names";
import { T } from "@/i18n/T";
import { tr } from "@/i18n/ui";

const ROWS = 3;
/** Seconds each card takes to drift past, per row: slightly different speeds give a sense of depth. */
const PACE = [5.2, 6.4, 4.6];
/** Cards per row that load straight away (about what the widest screen shows); the rest load lazily. */
const EAGER = 10;
const CARD_SIZES = "(min-width: 1024px) 156px, (min-width: 640px) 124px, 104px";

/** The collection chips (names only, no counts: owner, 30 Oct 2026). Links come from categoryHref, so they follow the pages if they move. */
const COLLECTIONS = [
  { label: "Retirement Gifts", category: launch.focus },
  { label: "Diwali", category: diwali.category },
  { label: "Christmas", category: christmas.category },
  { label: "Car Gifts", category: cars.category },
];

/** Tributes use their 4:5 tile (the frame on a canvas); everything else its main photo. */
const photoOf = (p: Product) => p.gallery?.tile ?? p.gallery?.frame ?? p.images[0] ?? null;

/** The card's price line, in English and Hindi. */
function priceOf(p: Product) {
  const from = (amount: number) => <T en={`From ${formatINR(amount)}`} hi={`${formatINR(amount)} से शुरू`} />;
  if (p.price != null) return (p.sizes?.length ?? 0) > 1 ? from(p.price) : formatINR(p.price);
  if (p.startingPrice != null) return from(p.startingPrice);
  return null;
}

/**
 * Every piece with a photo, dealt into rows. Categories take turns, so neighbours differ, and the
 * featured line (Retirement Gifts) lands third in each row, where it shows as the page opens.
 */
function wallRows(): Product[][] {
  const withPhoto = products.filter((p) => photoOf(p) != null);
  const featured = withPhoto.filter((p) => p.category === launch.focus);
  const groups = new Map<string, Product[]>();
  for (const p of withPhoto) if (p.category !== launch.focus) groups.set(p.category, [...(groups.get(p.category) ?? []), p]);
  const queues = [...groups.values()];
  const mixed: Product[] = [];
  while (queues.some((q) => q.length)) for (const q of queues) if (q.length) mixed.push(q.shift()!);
  const order = [...mixed.slice(0, ROWS * 2), ...featured, ...mixed.slice(ROWS * 2)];
  return Array.from({ length: ROWS }, (_, r) => order.filter((_, i) => i % ROWS === r));
}

function Card({ product: p, copy, index }: { product: Product; copy: number; index: number }) {
  const photo = photoOf(p)!;
  const price = priceOf(p);
  const hidden = copy > 0;
  return (
    <li className="showcase-card">
      <AppLink href={productHref(p)} tabIndex={hidden ? -1 : undefined} className="showcase-link">
        <Image src={photo} alt={shortName(p)} fill sizes={CARD_SIZES} loading={!hidden && index < EAGER ? "eager" : "lazy"} className="showcase-photo object-cover" />
        <span className="showcase-label">
          <span className="showcase-name block text-[11px] font-semibold leading-[1.25] text-white sm:text-[11.5px]">
            <T en={shortName(p)} hi={hiShortName(p.slug)} />
          </span>
          {price && <span className="mt-0.5 block text-[10.5px] font-semibold tabular-nums text-[#f2b462] sm:text-[11px]">{price}</span>}
        </span>
      </AppLink>
    </li>
  );
}

/**
 * The first thing on the homepage: a wall of every piece in the studio. Three rows drift slowly in
 * opposite directions (CSS only; hover pauses them, keyboard focus stops them so the focused card
 * can scroll into view). With reduced motion the rows stand still and scroll sideways.
 * Sits under the transparent header, like the hero it replaced.
 */
export function ProductShowcase() {
  const rows = wallRows();
  // A chip shows only while its collection has pieces on the site.
  const chips = COLLECTIONS.flatMap(({ label, category }) => {
    const c = getCategory(category);
    return c && products.some((p) => p.category === category) ? [{ label, href: categoryHref(c) }] : [];
  });

  return (
    <section aria-labelledby="showcase-title" className="showcase surface-brown relative isolate -mt-16 overflow-hidden lg:-mt-[76px]">
      <div className="container-x pt-[84px] lg:pt-[100px]">
        <div className="hero-copy mx-auto max-w-2xl text-center">
          <p className="eyebrow" style={{ "--i": 0 } as React.CSSProperties}>
            Art Studio · Art with Soul
          </p>
          <h1 id="showcase-title" className="mt-2.5 text-[27px] font-semibold leading-[1.12] md:text-[38px]" style={{ "--i": 1 } as React.CSSProperties}>
            <T
              en={
                <>
                  Made by hand, <span className="shimmer">for every moment.</span>
                </>
              }
              hi={
                <>
                  हाथ से बना, <span className="shimmer">हर ख़ास पल के लिए।</span>
                </>
              }
            />
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-muted md:max-w-2xl md:text-[14.5px]" style={{ "--i": 2 } as React.CSSProperties}>
            <T
              en="Tributes, festive décor, car art and keepsakes, finished by hand in small batches."
              hi="ट्रिब्यूट, त्योहारों की सजावट, कार आर्ट और यादगार चीज़ें, थोड़ी-थोड़ी मात्रा में हाथ से तैयार।"
            />
          </p>
        </div>
        <nav aria-label="Collections" className="mt-5">
          <ul className="flex flex-wrap justify-center gap-2">
            {chips.map((c) => (
              <li key={c.href}>
                <AppLink href={c.href} className="showcase-chip">
                  <T en={c.label} hi={tr(c.label)} />
                </AppLink>
              </li>
            ))}
            <li>
              <AppLink href="/shop" className="showcase-chip showcase-chip-all">
                <T en="Shop all" hi="सभी चीज़ें" />
              </AppLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="showcase-wall mt-4 pb-5 md:mt-5 md:pb-7">
        <h2 className="sr-only">
          <T en="Every piece in the studio" hi="स्टूडियो का हर पीस" />
        </h2>
        {rows.map((row, r) => (
          <div key={r} className="showcase-row" style={{ "--n": row.length, "--pace": `${PACE[r % PACE.length]}s` } as React.CSSProperties} data-reverse={r % 2 === 1 || undefined}>
            <div className="showcase-track">
              {[0, 1].map((copy) => (
                <ul key={copy} className="showcase-set" aria-hidden={copy > 0 || undefined} aria-label={copy === 0 ? `Pieces, row ${r + 1} of ${rows.length}` : undefined}>
                  {row.map((p, i) => (
                    <Card key={p.slug} product={p} copy={copy} index={i} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
