# Art Studio storefront

Online store for **Art Studio · Art with Soul**, a small handmade resin-art business in India (Instagram `@theartstudioo2026`). Customers pay in ₹ and orders ship pan-India.

@AGENTS.md

## Read first
- `docs/BRIEF.md`: the full brief (products, design reference, features, build phases). Follow it.
- `TODO.md`: every placeholder still waiting on the owner (prices, photos, sizes, open questions).
- `README.md`: commands and where things live.

## Status (handoff from a Claude app chat, 17 Oct 2026)
- Phase 1 (design system + homepage) is built. The owner has not given design feedback yet: ask for it, or for the go-ahead, before starting Phase 2.
- Phase 2 (next): listing pages (`/shop`, `/shop/[category]`, `/gifts`, `/occasion/[slug]`, `/custom`, `/custom/[slug]`), filters and sort, `/search` results, the product page (`/product/[slug]`), and custom product pages with the WhatsApp request button. Stop and show the owner when the phase is done.
- This folder was copied from a cloud sandbox and is **not a git repo yet**. Before changing anything, run `npm install` if `node_modules` is missing, then `git init && git add -A && git commit -m "Phase 1: design system and homepage"`.

## Run and check
- `npm run preview` serves http://localhost:3000 with the "Phase 1 preview" ribbon and the link guard (`NEXT_PUBLIC_PREVIEW=1`). If port 3000 is busy, the owner may have it running in Terminal already.
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
- Preview mode: `isPreview` in `src/lib/preview.ts`. `PreviewLinkGuard` turns clicks on unbuilt routes into a toast. When you build a route, remove its pattern from `PHASE_BY_PATH` in `src/components/layout/PreviewLinkGuard.tsx`.
- Custom orders: `src/components/custom/CustomRequestButton.tsx` opens WhatsApp with "Hi! I'd like a custom [product name]. Link: [page URL]". Keep it self-contained; a full custom-order flow replaces it later.
- Wishlist and cart state: `src/components/providers/ShopProvider.tsx` (useSyncExternalStore over localStorage). Cart lines and checkout arrive in Phase 3.
- `npm run build:preview` and `scripts/relativize-export.mjs` only exist to publish a static preview inside the Claude app's artifact viewer. Local work and Vercel don't need them.

## Design system
- Look and layout follow theplatedproject.com as a style reference only; never copy its text, images or names. Features follow Amazon.in.
- Poppins, self-hosted in `src/fonts` (Latin, plus Devanagari for Hindi lines in festive banners). Body 14px. Uppercase letter-spaced classes: `.nav-label`, `.eyebrow`, `.btn` with `.btn-dark`, `.btn-light`, `.btn-outline`, `.btn-outline-light`, `.btn-whatsapp`. Square corners. Product cards are borderless, 4:5, one badge, wishlist heart, title format "Name | Material | Size".
- Colour tokens (`@theme` in globals.css): ink #111111, paper #ffffff, cream #f8f4ed, sand #efe6d8, gold #c7a879 (use `gold-ink` #8b6b3e for gold text, for contrast), blush #eabead, slate #687686. Use the accents sparingly.
- Motion is CSS only: scroll-driven `.reveal` keeps content visible without it, and everything respects `prefers-reduced-motion`.
- Product photos go in `public/products/<slug>/1.jpg, 2.jpg…` at 720×900 (4:5). The current ones are low-res crops from Instagram reels.

## Rules
- Never invent prices, reviews, ratings, stock, sizes or customer names. Use clearly marked placeholders and list them in `TODO.md`. The homepage review slots stay empty until the owner sends real reviews.
- Copy: plain, warm, short sentences in Indian English. Format money with `formatINR` from `src/lib/format.ts`.
- ESLint enforces strict React rules: `react-hooks/set-state-in-effect` (no setState directly in an effect body; derive the value or use useSyncExternalStore) and `react-hooks/purity` (no `Date.now()` or `Math.random()` in render or in handlers created during render; use `event.timeStamp`).
- Mobile-first: no horizontal scroll at 390px, visible focus states, alt text on product photos.
- When the brief is unclear or contradicts itself, ask the owner before building that part.
