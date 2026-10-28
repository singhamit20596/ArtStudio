# Art Studio storefront

Online store for **Art Studio · Art with Soul**, a small handmade resin-art business in India (Instagram `@theartstudioo2026`). Customers pay in ₹ and orders ship pan-India.

@AGENTS.md

## Read first
- `docs/BRIEF.md`: the full brief (products, design reference, features, build phases). Follow it.
- `TODO.md`: every placeholder still waiting on the owner (prices, photos, sizes, open questions).
- `README.md`: commands and where things live.

## Status (28 Oct 2026)
- **Full shop, tributes first (owner, 28 Oct 2026).** Every page is back (shop, gifts, occasions, search, wishlist, custom hub, `/request`, `/api/requests`, `/api/razorpay/webhook`); nothing is parked. **Retirement Tributes** are the featured line (`launch.focus`), in three types and this order: `newspaper-tribute` (Newspaper Tribute), `box-frame` (Box Frame, renamed from "shadow frame" by the owner) and `resin-frame` (Resin Frame). `src/config/launch.ts`: `categories: null` (all on sale), `shop: true`, `cart: true`.
- Homepage (`src/app/(home)/page.tsx`): the tribute block fills the opening screen (`TributeHero`: one sentimental line about their service, then the three `TributeCards`), then "More from the studio" and the old shop sections (category strip, new arrivals, editorial banners, festive edit, custom grid, story, reviews, Instagram, gifting, newsletter, trust row, marquee). The old shop `Hero` and the old tribute `SignatureBanner` are not used. The tribute block itself stays minimal: no buttons or extra sections (owner's earlier request).
- `/retirement-tributes` (in the `(home)` group, same `TributeHero`) shows all three. The "Retirement Tributes" header label links there (`NavMenu.href`; hover still opens a photos-only panel, phones get a plain link). It is also where `categoryHref` for the focus category, breadcrumbs and the `/custom/retirement-tribute-frames` redirect (`next.config.ts`) go. The footer's first column lists the three. No other duplicates on purpose (owner asked to remove redundant links): not in the category strip or the Custom menu.
- Tribute product pages show one main photo (owner: "just keep 1 image" of the same frame), its lit version only while `launch.lights` is on, then `gallery.samples` (the owner's sample photos: 7 Box Frame, 3 Resin Frame, 3 Newspaper; a near-identical resin sample was left out. The "Manish is retired" newspaper sample shows a real person's name and face; the owner confirmed permission on 28 Oct 2026), and the buy panel; no timeline, details, explorer or "other tributes". The unused tribute sections stay in `src/components/tribute/`.
- **Lights hidden (owner, 28 Oct 2026):** `launch.lights = false` makes `catalog.ts` clear every `lightPrice`, so the buy panel has no lights choice, cart labels show just the size, homepage cards don't light up on hover, and `/api/orders` drops a saved `light: true`. Flip the flag to bring it all back.
- **Faces are pixelated (owner, 28 Oct 2026)** in every tribute image, including the source mockups in `exports/iaf-frames/` (so `scripts/make-tribute-photos.py` rebuilds pixelated photos). Pixelate faces (mosaic, about 7 blocks across a face) in any new tribute photo before adding it. The owner asked for no face-detection installs: find faces by eye with a grid overlay and mosaic them with Pillow.
- **Compact sizing (owner, 28 Oct 2026: "smaller so more fits").** `.btn` is 44px tall, 12px text; `.section-title` 24/30px; the tribute block and tribute pages are tightened so each fits one desktop screen. Keep new UI at this density.
- Tribute routes: `/product/[slug]`, `/cart`, `/checkout`, `/checkout/confirmation`, `/personalise/[id]?t=token`; APIs `/api/orders`, `/api/orders/[id]/paid`, `/api/orders/verify`, `/api/personalise/[id]` (+ `/files`), `/api/files/[...key]`, `/api/pincode/[pin]`.
- Checkout sends only the lines it shows (`totals.lines`), so a saved cart holding a renamed or removed product no longer blocks the order; the summary says what was left out. After editing `seed.json`, restart `next dev`: route handlers (e.g. `/api/orders`) can keep the old product list until a restart, which refuses orders for renamed products.
- Flow: product page (size, LED lights, "Ask on WhatsApp") → cart → checkout (UPI default, COD, WhatsApp) → confirmation (UPI QR / "I've paid" with 12-digit UTR → `payment_claimed`) → `/personalise` (layout, name plate, photos, background colour, notes). Owner hears about everything by email (Resend). No "pay a minimum" option (owner, 28 Oct 2026).
- Sizes, prices, light prices and making times are placeholders (see `TODO.md`). Photos come from `scripts/make-tribute-photos.py`: Box Frame (blue shadow box) and Resin Frame (round plaque) are cropped from the mockups in `exports/iaf-frames/` (the owner's designs recreated in another session, stock models, Pexels rooms; credits in `PHOTO-CREDITS.md`); the Newspaper Tribute is a sample drawn by that script. "With light" photos are edited (room darkened, LEDs drawn inside the frame only). The cream and velvet box designs appear only as design choices when personalising.
- Phase 4 (database, admin) is still to come; an admin view of orders, payment claims and personalisation photos is the first need.

## Hosting
- Live preview: https://memorylaneart.netlify.app (Netlify free plan), deployed from GitHub `main` (repo `singhamit20596/ArtStudio`). Settings in `netlify.toml` (Node 22, `NEXT_PUBLIC_PREVIEW=1` for the hosted preview).
- Free plan: 300 credits/month; each production deploy (push to `main`) costs 15, and running out pauses the site until next month. Batch pushes; never push after every small change.
- `isLocalPreview` (`src/lib/preview.ts`) tells `npm run preview` apart from the hosted preview. The hosted preview accepts test orders without email (saved to Netlify Blobs) and shows a dummy UPI ID.
- To check a Netlify build locally: `npx -y -p node@22 -p netlify-cli@latest -- netlify build --offline` (the CLI needs Node 22; this machine has Node 20).

## Run and check
- `npm run preview` serves http://localhost:3000 with the link guard and test checkout (`NEXT_PUBLIC_PREVIEW=1`). The preview ribbon was removed at the owner's request (28 Oct 2026). If port 3000 is busy, the owner may have it running in Terminal already.
- In the Claude desktop app, the Browser pane can run the site: if `.claude/launch.json` is missing, create it with one configuration named `art-studio` that runs `npm run preview` (`runtimeExecutable` "npm", `runtimeArgs` ["run", "preview"], `port` 3000).
- Before calling a phase done: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and look at the pages at desktop width and at about 390px.

## Business facts (confirmed by the owner)
- Brand name "Art Studio", tagline "Art with Soul". Logo `public/brand/logo.png` (600px, cut from the Instagram profile picture; the hi-res original is pending).
- WhatsApp orders +91 90429 18049. Business email `sandeep698146@gmail.com`.
- Free shipping on orders of ₹3,000 or more; flat ₹100 below that. Prices include taxes.
- Payments at launch: UPI (owner's choice: "UPI link now, Razorpay later"; UPI ID still pending in `site.payments.upi.id`), Cash on Delivery and "Order on WhatsApp". Razorpay is wired but switched off (`site.payments.razorpayEnabled = false`) and shows "Online payments coming soon".
- No domain yet (`NEXT_PUBLIC_SITE_URL` unset).
- All of these live in `src/config/site.ts`. Read them from there; never hard-code them.

## Architecture
- Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4 (CSS-first: tokens in `src/app/globals.css`, no tailwind.config). `cacheComponents` and `partialPrefetching` are on.
- Data: `src/data/seed.json` (12 products, 20 categories, 9 occasions), read only through `src/lib/catalog.ts`; types in `src/lib/types.ts`. Supabase replaces the JSON in Phase 4, so keep data access behind catalog.ts.
- `published: false` hides a product (the Rose Marble tray is hidden until the owner confirms it). `placeholders` lists each product's made-up fields.
- The homepage lives in `src/app/(home)` and uses `<SiteChrome overlay>` (header transparent over the hero). Put new store pages in a `(store)` route group whose layout uses `<SiteChrome>` without `overlay`.
- Menus and footer links: `src/config/nav.ts`. They already point at the Phase 2 URLs above.
- Preview mode: `isPreview` in `src/lib/preview.ts`. `PreviewLinkGuard` turns clicks on unbuilt routes (accounts, tracking, admin, about and policy pages) into a toast; links to anything not listed work normally. When you build a route, remove its pattern from `PHASE_BY_PATH` in `src/components/layout/PreviewLinkGuard.tsx`.
- Listings: filtering and sorting run in the browser from the URL (`src/lib/listing.ts`, keys `category, sub, type, occasion, colour, min, max, stock, sort`). Pages prerender every product, and `<Listing>` wraps the `useSearchParams` reader in Suspense. Filter changes use `window.history.replaceState`, which Next keeps in sync with `useSearchParams`.
- Dynamic pages (`/product/[slug]`, `/shop/[category]`, `/occasion/[slug]`, `/custom/[slug]`) await `params` inside a `<Suspense>` with a skeleton (`src/components/ui/Skeletons.tsx`), as Next's instant-navigation check asks. Unknown slugs render the not-found page with `noindex`.
- Client components must import pure helpers from `src/lib/product.ts`, not `catalog.ts`, so `seed.json` stays out of the browser bundle.
- The gift shop is every product tagged `gift`. Product `colours` feed the colour filter (custom pieces have none). Delivery estimates use `site.shipping.courierDays` (placeholder).
- Custom orders: `src/components/custom/CustomRequestButton.tsx` opens WhatsApp with "Hi! I'd like a custom [product name]. Link: [page URL]". Keep it self-contained; a full custom-order flow replaces it later.
- Wishlist, cart, saved-for-later and coupon state: `src/components/providers/ShopProvider.tsx` (useSyncExternalStore over localStorage via `src/lib/local-store.ts`).
- Cart maths: `src/lib/pricing.ts` (`priceCart`), shared by the browser and the order API. Coupons: `src/config/coupons.ts` (empty until the owner sends real offers; the sample codes were removed) + `src/lib/coupons.ts`. "View offers" links hide while there are none. Checkout validation and the `Order` type: `src/lib/checkout.ts`.
- Sized products: `sizes` (`SizeOption`), `lightPrice` and `gallery` (`lifestyle`, `closeup`, `lifestyleLit`, `closeupLit`) on a product. Cart lines carry `options {size, light}`; `unitPrice` and `describeOptions` in `pricing.ts` price and label them in the browser and on the server.
- Orders: `POST /api/orders` → `src/lib/orders/build.ts` (re-prices from the catalogue, checks stock, sizes, lights, variants, coupon; adds a random `token`), `store.ts` (`saveOrder`/`getOrderWithToken` via `src/lib/storage.ts`: Netlify Blobs on Netlify, `.data/store/<bucket>/` elsewhere), `emails.ts` (Resend, or HTML files in `.data/emails/` under `next dev`), `razorpay.ts` (create order, verify signature, webhook). Production refuses non-WhatsApp orders unless `RESEND_API_KEY` is set (the hosted preview is exempt). `/api/pincode/[pin]` proxies India Post with `"use cache"`.
- UPI: `src/lib/upi.ts` (`upi://pay` link, `isUtr`), `src/components/checkout/UpiPayPanel.tsx` (QR via `qrcode`, "I've paid" → `/api/orders/[id]/paid`).
- Personalisation: `src/lib/personalise.ts` (steps, validation, limits: 12 photos, 5 MB), `src/components/tribute/PersonaliseFlow.tsx` (shrinks photos to 2000 px JPEG before upload), layouts and background colours in `src/config/tribute.ts`. Every order API and photo URL checks the order token; keep it that way.
- The static preview export (`npm run build:preview`) sets `pageExtensions: ["tsx"]` so `route.ts` API files are left out; checkout cannot place orders there.
- `npm run build:preview` and `scripts/relativize-export.mjs` only exist to publish a static preview inside the Claude app's artifact viewer. Local work and Vercel don't need them.

## Design system
- Look and layout follow theplatedproject.com as a style reference only; never copy its text, images or names. Features follow Amazon.in.
- Poppins, self-hosted in `src/fonts` (Latin, plus Devanagari for Hindi lines in festive banners). Body 14px. Uppercase letter-spaced classes: `.nav-label`, `.eyebrow`, `.btn` with `.btn-dark`, `.btn-light`, `.btn-outline`, `.btn-outline-light`, `.btn-whatsapp`. Square corners. Product cards are borderless, 4:5, one badge, wishlist heart, title format "Name | Material | Size".
- Brand palette (owner, 28 Oct 2026): sage #87A96B, brown #5A3E2B, amber #D5851F. **Every background, button, badge, border and decoration uses only these three** (no white, cream or grey surfaces). Text may use any colour that reads well (owner's rule).
- Surfaces (`globals.css`): the page is sage; `.surface-brown` (header, footer, dark sections), `.surface-amber` (announcement bar, feature sections, marquee) and `.surface-sage` (drawers, menus, sticky bar) set the background plus readable text colours. `text-ink`, `text-muted`, `text-eyebrow`, `border-line` and `.eyebrow` follow the surface automatically: near-black on sage/amber, white on brown. Use `text-[#1e140d]` for dark text on an amber/sage badge that might sit inside a brown surface.
- Buttons: `.btn-dark` brown (on sage/amber), `.btn-light` amber (on brown or as secondary), `.btn-whatsapp` amber, `.btn-outline`, `.btn-outline-light` (amber border on brown). Image placeholders are `bg-brown`; the "no photo" `.mount` card is amber. Errors use `text-error`. Checkboxes and radios are custom-styled in brown. The colour-filter swatches keep real product colours on purpose.
- Turbopack's file-system caches are off in `next.config.ts` (they served a stale globals.css). If a long-running `next dev` shows old styles, restart it.
- Motion is CSS-first, with small client components for interaction: scroll-driven `.reveal`, `.reveal-left/right` (vertical on phones), `.reveal-scale`, `.timeline-fill`; `.sheen`, `.slow-zoom`, `.ping`, `.drop-in`, `.pop-in`, `.step-in`, `.shimmer`; `TiltCard` and `PointerGlow` (mouse only). Content stays visible without animation, and everything respects `prefers-reduced-motion`.
- Tribute components live in `src/components/tribute/` and read their copy from `src/config/tribute.ts` (services, frame items, hotspots, process steps, FAQs, layouts, backgrounds). `FramePreview` and `TributeArt` are SVG sketches in the brand colours that stand in for missing photos and update live. Personalise designs with an `image` show that photo; the rest use `TemplateThumb` sketches.
- Product photos go in `public/products/<slug>/` at 4:5 (the tribute mockups are 1080×1350; older products use `1.jpg, 2.jpg…` at 720×900 cropped from Instagram reels). Tributes use `frame.jpg`, `frame-lit.jpg`, `tile.jpg`, `tile-lit.jpg`, `sample-*.jpg` and `design-*.jpg`. Give a changed photo a new filename: the Next image cache keeps serving the old one under the same URL.
- Tribute galleries (`gallery` in seed.json): `ratio` (the photo box: newspaper 1/1, box 4/3, resin 1/1; every photo is shown whole inside it), `frame`, `frameLit`, `samples`, plus `tile`/`tileLit` (the frame photo on a 4:5 canvas for the homepage cards; the lit one fades in on hover while lights are on offer). `TributeGallery` crossfades the photos; choosing "With LED lights" switches it to the lit photo.

## Rules
- Never invent prices, reviews, ratings, stock, sizes or customer names. Use clearly marked placeholders and list them in `TODO.md`. The homepage review slots stay empty until the owner sends real reviews.
- Copy: plain, warm, short sentences in Indian English. Format money with `formatINR` from `src/lib/format.ts`.
- ESLint enforces strict React rules: `react-hooks/set-state-in-effect` (no setState directly in an effect body; derive the value or use useSyncExternalStore) and `react-hooks/purity` (no `Date.now()` or `Math.random()` in render or in handlers created during render; use `event.timeStamp`).
- Mobile-first: no horizontal scroll at 390px, visible focus states, alt text on product photos.
- When the brief is unclear or contradicts itself, ask the owner before building that part.
