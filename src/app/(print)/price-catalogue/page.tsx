import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import clsx from "clsx";
import { site } from "@/config/site";
import { formatINR } from "@/lib/format";
import { RacingDecor, StartLights } from "@/components/cars/RacingDecor";
import { ChristmasDecor } from "@/components/christmas/ChristmasDecor";
import { DiwaliDecor, DiyaRow } from "@/components/diwali/DiwaliDecor";
import { MedalRow, ServiceDecor } from "@/components/tribute/ServiceDecor";
import { catalogueSections, geometryVars, paginate, type Block, type CatalogueItem, type Decor, type Page } from "./plan";

export const metadata: Metadata = {
  title: { absolute: `${site.name} · Price catalogue` },
};

/**
 * The price catalogue to share with clients: a cover, then every product on the site with its
 * photo, name and price, collection by collection on A4 sheets in each collection's colours.
 * `npm run catalogue:pdf` prints it to catalogue/Art-Studio-Catalogue.pdf (scripts/catalogue-pdf.mjs).
 */
export default function PriceCataloguePage() {
  const { sections, skipped } = catalogueSections();
  const pages = paginate(sections);
  const total = pages.length + 1;
  // Where each collection starts (the cover is page 1).
  const contents = sections.map((s) => ({
    name: s.name,
    page: pages.findIndex((p) => p.blocks.some((b) => b.section === s && b.type !== "row" && b.type !== "cont")) + 2,
  }));

  return (
    // data-skipped: products left out for want of a photo; the PDF script prints them.
    <main className="catalogue" style={geometryVars} data-skipped={skipped.join(" ")}>
      <Cover contents={contents} />
      {pages.map((page, i) => (
        <Sheet key={i} page={page} number={i + 2} total={total} />
      ))}
    </main>
  );
}

/* ---------- Cover ---------- */

const monthFormat = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/** "October 2026", the month the catalogue is printed in. */
async function CatalogueMonth() {
  await connection();
  return monthFormat.format(new Date());
}

function Cover({ contents }: { contents: { name: string; page: number }[] }) {
  return (
    <section className="cat-sheet" aria-label="Cover">
      <div className="cat-fill cat-cover surface-brown">
        <div className="cat-cover-frame" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element -- print page: the original logo file, loaded at once for the PDF */}
        <img src="/brand/logo.png" alt={`${site.name} · ${site.tagline}`} className="cat-cover-logo" loading="eager" decoding="sync" />
        <p className="eyebrow cat-cover-brand">
          {site.name} · {site.tagline}
        </p>
        <h1 className="cat-cover-title">Price catalogue</h1>
        <p className="cat-cover-month">
          <Suspense fallback={null}>
            <CatalogueMonth />
          </Suspense>
        </p>

        <ol className="cat-contents">
          {contents.map((c) => (
            <li key={c.name}>
              <span>{c.name}</span>
              <span className="cat-leader" aria-hidden="true" />
              <span className="tabular-nums">{c.page}</span>
            </li>
          ))}
        </ol>

        <div className="cat-cover-order surface-amber">
          <p className="eyebrow">Order on WhatsApp</p>
          <p className="cat-cover-phone">{site.contact.whatsappDisplay}</p>
          <p className="cat-cover-insta">Instagram {site.social.instagramHandle}</p>
        </div>
        <p className="cat-cover-note">Prices in ₹, taxes included. Every piece is made by hand.</p>
      </div>
    </section>
  );
}

/* ---------- Product pages ---------- */

function Sheet({ page, number, total }: { page: Page; number: number; total: number }) {
  return (
    <section className={clsx("cat-sheet", page.theme)} aria-label={`Page ${number}`}>
      <div className={clsx("cat-fill", page.dark && "surface-brown")}>
        {page.blocks.map((block, i) => (
          <PageBlock key={i} block={block} dark={page.dark} />
        ))}
        <footer className="cat-footer">
          <span>
            {site.name} · {site.tagline}
          </span>
          <span>
            Order on WhatsApp <strong>{site.contact.whatsappDisplay}</strong>
          </span>
          <span className="tabular-nums">
            {number} / {total}
          </span>
        </footer>
      </div>
    </section>
  );
}

function PageBlock({ block, dark }: { block: Block; dark: boolean }) {
  const { section } = block;
  if (block.type === "row") {
    return (
      <ul className="cat-row" style={{ height: `${block.height}mm` }}>
        {block.items.map((item) => (
          <Card key={item.slug} item={item} />
        ))}
      </ul>
    );
  }
  if (block.type === "cont") {
    return (
      <div className={clsx("cat-cont", !dark && "surface-brown")}>
        <BandDecor decor={section.decor} />
        <p className="eyebrow relative">{section.name}</p>
      </div>
    );
  }
  const Heading = block.type === "hero" ? "h2" : "h3";
  return (
    <div className={clsx(block.type === "hero" ? "cat-hero" : "cat-subhead", !dark && "surface-brown")} style={block.type === "hero" ? { height: `${section.heroH}mm` } : undefined}>
      <BandDecor decor={section.decor} />
      <div className="relative">
        <p className="eyebrow">{section.name}</p>
        <Heading className="cat-title">
          {section.title[0]} <span className="cat-gold">{section.title[1]}</span>
        </Heading>
      </div>
      {block.type === "hero" && <AfterTitle decor={section.decor} />}
    </div>
  );
}

/** The collection's decoration from its page on the site, drawn still. */
function BandDecor({ decor }: { decor: Decor }) {
  switch (decor) {
    case "service":
      return <ServiceDecor />;
    case "diwali":
      return <DiwaliDecor />;
    case "christmas":
      return <ChristmasDecor />;
    case "racing":
      return <RacingDecor />;
    default:
      return <div className="cat-studio-frame" aria-hidden="true" />;
  }
}

/** The row under the heading, as on the site: medals, diyas, start lights, or a small amber ornament. */
function AfterTitle({ decor }: { decor: Decor }) {
  switch (decor) {
    case "service":
      return <MedalRow />;
    case "diwali":
      return <DiyaRow />;
    case "racing":
      return <StartLights />;
    case "studio":
      return (
        <div className="cat-ornament" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      );
    default:
      return null;
  }
}

function Card({ item }: { item: CatalogueItem }) {
  const { price } = item;
  return (
    <li className="cat-card">
      <div className="cat-photo">
        {/* eslint-disable-next-line @next/next/no-img-element -- print page: the original photo at full quality, loaded at once for the PDF */}
        <img src={item.photo} alt={item.name} loading="eager" decoding="sync" />
      </div>
      {price.kind === "sizes" ? (
        <div className="cat-sized">
          <p className="cat-name" style={{ height: `calc(var(--cat-sized-line-h) * ${item.nameLines})` }}>
            {item.name}
          </p>
          <ul className="cat-sizes">
            {price.sizes.map((s) => (
              <li key={s.label}>
                <span>{s.label}</span>
                <span className="cat-amount">{formatINR(s.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="cat-text">
          <p className="cat-name">{item.name}</p>
          <p className="cat-price">
            {price.amount == null ? (
              <span className="cat-unit">On request</span>
            ) : (
              <>
                {price.kind === "from" && <span className="cat-unit">From</span>}
                <span className="cat-amount">{formatINR(price.amount)}</span>
                {price.kind === "fixed" && price.each && <span className="cat-unit">each</span>}
              </>
            )}
          </p>
        </div>
      )}
    </li>
  );
}

