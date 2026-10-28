# Art Studio storefront

Online store for **Art Studio · Art with Soul**, a small handmade resin-art business in India (Instagram `@theartstudioo2026`). Customers pay in ₹ and orders ship pan-India.

@AGENTS.md

## Read first
- `docs/BRIEF.md`: the full brief (products, design reference, features, build phases). Follow it.
- `TODO.md`: every placeholder still waiting on the owner (prices, photos, sizes, open questions).
- `README.md`: commands and where things live.

## Status (28 Oct 2026)
- **Single-product launch.** The owner chose to launch one product line at a time. First: **defence retirement tribute frames** (Army, Navy, Air Force). `src/config/launch.ts` sets the categories on sale (`categories`, `focus`) and switches the shop off (`shop: false`).
- Everything else is parked, not deleted: routes in `src/app/(store)/_parked/` and `src/app/api/_parked/` (Next ignores `_` folders; tsc and eslint skip them), the old shop homepage in `src/app/(home)/_parked/page.tsx`, products and categories still in `seed.json` (filtered out by `catalog.ts`). See `src/app/(store)/_parked/README.md` to bring a section back.
- Live routes: `/` (tribute landing), `/request` (4-step request form), `/product/retirement-tribute-frame`, `POST /api/requests`.
- Ordering: request form → `/api/requests` (saves to `.data/requests.jsonl` locally, logs live, emails the studio via Resend when set up) → customer sends the pre-filled message on WhatsApp, where design and price are agreed. No online payment.
- Phases 2 and 3 (catalogue, cart/checkout) are built and parked. Phase 4 (database, admin) is still to come; a requests table and admin view are the first need.

## Hosting
- Live preview: https://memorylaneart.netlify.app (Netlify free plan), deployed from GitHub `main` (repo `singhamit20596/ArtStudio`). Settings in `netlify.toml` (Node 22, `NEXT_PUBLIC_PREVIEW=1` for the hosted preview).
- Free plan: 300 credits/month; each production deploy (push to `main`) costs 15, and running out pauses the site until next month. Batch pushes; never push after every small change.
- `isLocalPreview` (`src/lib/preview.ts`) tells `npm run preview` apart from the hosted preview. The hosted preview accepts test orders without email (they are only logged).
- To check a Netlify build locally: `npx -y -p node@22 -p netlify-cli@latest -- netlify build --offline` (the CLI needs Node 22; this machine has Node 20).

## Run and check
- `npm run preview` serves http://localhost:3000 with the link guard and test checkout (`NEXT_PUBLIC_PREVIEW=1`). The preview ribbon was removed at the owner's request (28 Oct 2026). If port 3000 is busy, the owner may have it running in Terminal already.
- In the Claude desktop app, the Browser pane can run the site: if `.claude/launch.json` is missing, create it with one configuration named `art-studio` that runs `npm run preview` (`runtimeExecutable` "npm", `runtimeArgs` ["run", "preview"], `port` 3000).
- Before calling a phase done: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and look at the pages at desktop width and at about 390px.

## Business facts (confirmed by the owner)
- Brand name "Art Studio", tagline "Art with Soul". Logo `public/brand/logo.png` (600px, cut from the Instagram profile picture; the hi-res original is pending).
- WhatsApp orders +91 90429 18049. Business email `sandeep698146@gmail.com`.
- Free shipping on orders of ₹3,000 or more; flat ₹100 below that. Prices include taxes.
- Payments at launch: Cash on Delivery and "Order on WhatsApp". Razorpay gets wired in Phase 3 but stays switched off (`site.payments.razorpayEnabled = false`) and shows "Online payments coming soon".
- No domain yet (`NEXT_PUBLIC_SITE_URL` unset).
- All of these live in `src/config/site.ts`. Read them from there; never hard-code them.

## Architecture
- Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4 (CSS-first: tokens in `src/app/globals.css`, no tailwind.config). `cacheComponents` and `partialPrefetching` are on.
- Data: `src/data/seed.json` (12 products, 20 categories, 9 occasions), read only through `src/lib/catalog.ts`; types in `src/lib/types.ts`. Supabase replaces the JSON in Phase 4, so keep data access behind catalog.ts.
- `published: false` hides a product (the Rose Marble tray is hidden until the owner confirms it). `placeholders` lists each product's made-up fields.
- The homepage lives in `src/app/(home)` and uses `<SiteChrome overlay>` (header transparent over the hero). Put new store pages in a `(store)` route group whose layout uses `<SiteChrome>` without `overlay`.
- Menus and footer links: `src/config/nav.ts`. They already point at the Phase 2 URLs above.
- Preview mode: `isPreview` in `src/lib/preview.ts`. `PreviewLinkGuard` turns clicks on unbuilt routes into a toast; links to anything not listed work normally. When you build a route, remove its pattern from `PHASE_BY_PATH` in `src/components/layout/PreviewLinkGuard.tsx`.
- Listings: filtering and sorting run in the browser from the URL (`src/lib/listing.ts`, keys `category, sub, type, occasion, colour, min, max, stock, sort`). Pages prerender every product, and `<Listing>` wraps the `useSearchParams` reader in Suspense. Filter changes use `window.history.replaceState`, which Next keeps in sync with `useSearchParams`.
- Dynamic pages (`/product/[slug]`, `/shop/[category]`, `/occasion/[slug]`, `/custom/[slug]`) await `params` inside a `<Suspense>` with a skeleton (`src/components/ui/Skeletons.tsx`), as Next's instant-navigation check asks. Unknown slugs render the not-found page with `noindex`.
- Client components must import pure helpers from `src/lib/product.ts`, not `catalog.ts`, so `seed.json` stays out of the browser bundle.
- The gift shop is every product tagged `gift`. Product `colours` feed the colour filter (custom pieces have none). Delivery estimates use `site.shipping.courierDays` (placeholder).
- Custom orders: `src/components/custom/CustomRequestButton.tsx` opens WhatsApp with "Hi! I'd like a custom [product name]. Link: [page URL]". Keep it self-contained; a full custom-order flow replaces it later.
- Wishlist, cart, saved-for-later and coupon state: `src/components/providers/ShopProvider.tsx` (useSyncExternalStore over localStorage via `src/lib/local-store.ts`).
- Cart maths: `src/lib/pricing.ts` (`priceCart`), shared by the browser and the order API. Coupons: `src/config/coupons.ts` (empty until the owner sends real offers; the sample codes were removed) + `src/lib/coupons.ts`. "View offers" links hide while there are none. Checkout validation and the `Order` type: `src/lib/checkout.ts`.
- Orders: `POST /api/orders` → `src/lib/orders/build.ts` (re-prices from the catalogue, checks stock, variants, coupon), `store.ts` (`.data/orders.jsonl` locally, log-only in production), `emails.ts` (Resend, or HTML files in `.data/emails/` locally), `razorpay.ts` (create order, verify signature, webhook). Production refuses non-WhatsApp orders unless `RESEND_API_KEY` is set. `/api/pincode/[pin]` proxies India Post with `"use cache"`.
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
- Tribute components live in `src/components/tribute/` and read their copy from `src/config/tribute.ts` (services, frame items, hotspots, process steps, FAQs). `FramePreview` is an SVG sketch in the brand colours that updates live from the preview and the request form.
- Product photos go in `public/products/<slug>/1.jpg, 2.jpg…` at 720×900 (4:5). The current ones are low-res crops from Instagram reels.

## Rules
- Never invent prices, reviews, ratings, stock, sizes or customer names. Use clearly marked placeholders and list them in `TODO.md`. The homepage review slots stay empty until the owner sends real reviews.
- Copy: plain, warm, short sentences in Indian English. Format money with `formatINR` from `src/lib/format.ts`.
- ESLint enforces strict React rules: `react-hooks/set-state-in-effect` (no setState directly in an effect body; derive the value or use useSyncExternalStore) and `react-hooks/purity` (no `Date.now()` or `Math.random()` in render or in handlers created during render; use `event.timeStamp`).
- Mobile-first: no horizontal scroll at 390px, visible focus states, alt text on product photos.
- When the brief is unclear or contradicts itself, ask the owner before building that part.
