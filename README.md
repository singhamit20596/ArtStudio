# Art Studio · Art with Soul

Online store for Art Studio (Instagram [@theartstudioo2026](https://www.instagram.com/theartstudioo2026/)): handmade resin décor, pooja & festive pieces, personalised gifts and IAF / Army / Navy retirement frames.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS 4. Supabase, Razorpay and Resend are added in later phases.

## Status

| Phase | What | State |
|---|---|---|
| 1 | Design system + homepage | Done |
| 2 | Catalogue: listing pages, filters, search, product and custom pages | **Done (this build)** |
| 3 | Cart, wishlist, coupons, checkout (COD + WhatsApp; Razorpay wired but off), order emails | Next |
| 4 | Accounts, order tracking, reviews & Q&A, admin panel (Supabase) | |
| 5 | SEO, performance, accessibility, policy pages, final README | |

`TODO.md` lists every placeholder (prices, photos, sizes) still to be supplied.

## Run it on your computer

Needs [Node.js 20.9 or newer](https://nodejs.org/) (check with `node -v`).

```bash
npm install
npm run preview      # http://localhost:3000, with the "Phase 2 preview" banner
npm run dev          # same site without the banner
```

Leave it running while we work: changes to the files show up in the browser automatically.

Other commands:

```bash
npm run build          # production build (what Vercel runs)
npm run build:preview  # static, portable preview in out/ (open out/index.html via any static host)
npm run lint
```

## Where things live

| To change… | Edit |
|---|---|
| Business name, WhatsApp, email, shipping rules, courier days, announcement bar, hero images/video | `src/config/site.ts` |
| Menu and footer links | `src/config/nav.ts` |
| Products, categories, occasions (until the database arrives) | `src/data/seed.json` |
| "Featured" order on shop pages | the order of products in `src/data/seed.json` |
| What appears in the gift shop (`/gifts`) | add or remove the `"gift"` tag on a product |
| Colours, type, buttons, motion | `src/app/globals.css` |
| Homepage section order | `src/app/(home)/page.tsx` |
| Product photos | `public/products/<product-slug>/1.jpg, 2.jpg …` |
| Instagram strip images | `public/instagram/` |

### Add a product (for now)

1. Copy one product block in `src/data/seed.json` and give it a new `id` and `slug`.
2. Put its photos in `public/products/<slug>/` as `1.jpg`, `2.jpg`…, and list them in `images`.
3. `type` is `"ready"` (Add to cart) or `"custom"` (made to order, WhatsApp request). Set `price` for ready items, `startingPrice` for custom ones.
4. `colours` drive the colour filter (use the names in `COLOURS` in `src/lib/listing.ts`); add the `"gift"` tag to show it in the gift shop.

From Phase 4 this moves to the admin panel at `/admin`; `seed.json` is imported into the database once.

## Pages

| URL | What it is |
|---|---|
| `/shop`, `/shop/<category>` | All products, and each ready-made category. Filters: category, ready or custom, occasion, price, colour, in stock. Sort: featured, newest, price, bestselling. |
| `/gifts`, `/occasion/<occasion>` | The gift shop and each occasion (Diwali, Retirement, Birthday…) |
| `/custom`, `/custom/<category>` | Custom-made hub and each custom category, with the WhatsApp request button |
| `/product/<slug>` | Product page. Ready pieces: variants, quantity, Order on WhatsApp, pincode checker. Custom pieces: past work, "From" price, making time, request button |
| `/search?q=…` | Search results, with the same filters |

Filters live in the address (for example `/shop?category=pooja-festive&max=1500&sort=newest`), so a filtered page can be shared or bookmarked.

## Design notes

- Layout and type follow the brief's reference (theplatedproject.com) as a style guide only: Poppins throughout, uppercase letter-spaced navigation and buttons, borderless 4:5 product cards, editorial banners.
- Brand accents are sampled from the logo: cream `#f8f4ed`, blush `#eabead`, slate `#687686`, gold `#c7a879` (text gold `#8b6b3e` for contrast).
- Fade-up on scroll uses CSS scroll-driven animations, so content is never hidden waiting for JavaScript; it is switched off for visitors who prefer reduced motion.
- The custom-order button (`src/components/custom/CustomRequestButton.tsx`) is self-contained so the full custom flow can replace it later.

## Deploying (Phase 5 has the full guide)

Push to GitHub, import the repo in [Vercel](https://vercel.com/new), and add `NEXT_PUBLIC_SITE_URL` once you have a domain. No other settings are needed for Phase 1.
