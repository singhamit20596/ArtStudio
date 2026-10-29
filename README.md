# Art Studio · Art with Soul

Online store for Art Studio (Instagram [@theartstudioo2026](https://www.instagram.com/theartstudioo2026/)): handmade resin décor, pooja & festive pieces, personalised gifts and Army / Navy / Air Force retirement tributes. The first line to go live is Retirement Tributes.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS 4. Supabase, Razorpay and Resend are added in later phases.

## Status

| Phase | What | State |
|---|---|---|
| 1 | Design system + homepage | Done |
| 2 | Catalogue: listing pages, filters, search, product and custom pages | Done |
| 3 | Cart, wishlist, coupons, checkout (UPI, COD, WhatsApp; Razorpay wired but off), order emails | Done |
| 3b | Retirement Tributes launch: three tribute types with sizes and lights, UPI, personalisation after payment | **Done (this build)** |
| 4 | Accounts, order tracking, reviews & Q&A, admin panel (Supabase) | Next |
| 5 | SEO, performance, accessibility, policy pages, final README | |

`TODO.md` lists every placeholder (prices, photos, sizes) still to be supplied.

## Run it on your computer

Needs [Node.js 20.9 or newer](https://nodejs.org/) (check with `node -v`).

```bash
npm install
npm run preview      # http://localhost:3000, with test checkout and notes on unbuilt pages
npm run dev          # same site, as it will run live
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
| **Festive pages** (Diwali, Christmas): copy, product taglines, homepage picks | `src/config/diwali.ts`, `src/config/christmas.ts` (pages `/diwali`, `/christmas`; shared parts in `src/components/festive/`) |
| **Prices**: every product, size and option, "From" prices for made-to-order categories, gift wrap, COD fee, delivery fee, free-shipping threshold | `src/config/prices.ts` |
| Business name, WhatsApp, email, courier days, announcement bar, hero images/video | `src/config/site.ts` |
| Offer (coupon) codes | `src/config/coupons.ts` |
| Menu and footer links | `src/config/nav.ts` |
| Products, categories, occasions (until the database arrives; no prices) | `src/data/seed.json` |
| "Featured" order on shop pages | the order of products in `src/data/seed.json` |
| What appears in the gift shop (`/gifts`) | add or remove the `"gift"` tag on a product |
| Colours, type, buttons, motion | `src/app/globals.css` |
| Homepage section order | `src/app/(home)/page.tsx` |
| Product photos | `public/products/<product-slug>/1.jpg, 2.jpg …` |
| Instagram strip images | `public/instagram/` |

### Add a product (for now)

1. Copy one product block in `src/data/seed.json` and give it a new `id` and `slug`.
2. Put its photos in `public/products/<slug>/` as `1.jpg`, `2.jpg`…, and list them in `images`.
3. `type` is `"ready"` (Add to cart) or `"custom"` (made to order, WhatsApp request). Add its price and product code to `src/config/prices.ts`: `kind: "fixed"` for ready items, `"from"` for custom ones, or `sized(code("RT", "BF"), [[w, h, price], …])` for pieces sold in sizes. The code is the product line (2 letters, from `productLines`; add a line for a new category) + 2 letters for the product; sizes, variants (`variantCodes`) and lights are added to it automatically (e.g. `RTBF1815`). The build checks the rules.
4. `colours` drive the colour filter (use the names in `COLOURS` in `src/lib/listing.ts`); add the `"gift"` tag to show it in the gift shop.

From Phase 4 this moves to the admin panel at `/admin`; `seed.json` is imported into the database once.

## Pages (Retirement Tributes launch)

The featured line is **Retirement Tributes** for Army, Navy and Air Force retirements, in three types: Newspaper Tribute, Box Frame and Resin Frame. Their pages are deliberately minimal. The rest of the shop follows below them (see further down).

| URL | What it is |
|---|---|
| `/` | Opens with one heartfelt line about their service and the three tributes (hovering a card turns its lights on), then the rest of the studio |
| `/retirement-tributes` | All three tributes on one page (the "Retirement Tributes" menu label opens it) |
| `/product/newspaper-tribute`, `/product/box-frame`, `/product/resin-frame` | One main photo plus sample photos on the left; size, "Ask on WhatsApp", add to cart and buy now on the right. The LED lights option is switched off for now (`lights` in `src/config/launch.ts`) |
| `/cart`, `/checkout`, `/checkout/confirmation` | Cart and guest checkout. Pay by UPI (QR code or "Open UPI app"), Cash on Delivery or Order on WhatsApp |
| `/personalise/<order>?t=<token>` | Private link sent after the order: choose the layout, name plate (rank, name, unit, years), upload photos, background colour, notes. Can be changed until making starts |

- Sizes, prices and light prices: `src/config/prices.ts` (the only price list). Photos: `gallery` on the same product, files in `public/products/<slug>/`, built by `python3 scripts/make-tribute-photos.py` from the mockups in `exports/iaf-frames/` (see `PHOTO-CREDITS.md` there); the newspaper photos are a drawn sample. When you replace a photo, give it a new filename so browsers and the image cache pick it up.
- Copy (services, what goes inside, steps, FAQs, layouts, background colours): `src/config/tribute.ts`.
- Which line is live: `src/config/launch.ts`.

### The rest of the shop

All the shop pages are live again (categories, gifts, occasions, search, wishlist, custom-made hub, `/request`), with Retirement Tributes kept first: at the top of the homepage, first in the header menu, the category strip and the footer. `src/config/launch.ts` decides which categories are on sale (`null` = all) and which line is featured (`focus`).

## Orders, emails and payments

- **Checkout** is guest-only for now (accounts arrive in Phase 4). Typing a pincode fills in the city and state from India Post's free public lookup; customers can still edit them.
- **Payment methods**: **UPI** (the order page shows a QR code and an "Open UPI app" button with the amount filled in; the customer taps "I've paid" with the 12-digit UTR and you check it in your bank app), Cash on Delivery, and "Order on WhatsApp". Razorpay is built but switched off (`payments.razorpayEnabled` in `site.ts`). UPI needs your UPI ID in `payments.upi.id`.
- **Prices are checked on the server** (`src/app/api/orders/route.ts`): the browser's totals are only a preview, so a changed price, a size that doesn't exist, an expired coupon or too many items is refused.
- **Personalisation**: every order gets a private token. The confirmation page, the customer's email and the "Save link to my WhatsApp" button all carry the `/personalise` link. Uploaded photos are shrunk in the browser (2000 px JPEG) and can only be opened with the order's token.
- **Where orders and photos are stored until Phase 4**: Netlify Blobs on the live site (`src/lib/storage.ts`, nothing to set up), and `.data/store/` on your computer. Emails (new order, "I've paid", personalisation details with photo links) go out through Resend; on your computer they are saved in `.data/emails/` instead. Without `RESEND_API_KEY` the live checkout only accepts WhatsApp orders, because email is how you hear about the others.

### Settings (environment variables)

Copy `.env.example` to `.env.local` on your computer, or add them in Vercel → Settings → Environment Variables.

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The live address, once the domain is bought |
| `RESEND_API_KEY` | Sends order emails (resend.com) |
| `ORDER_EMAIL_FROM` | Sender, e.g. `Art Studio <orders@yourdomain.in>` (needs the domain verified in Resend) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay keys, when online payment is switched on |
| `RAZORPAY_WEBHOOK_SECRET` | From Razorpay's webhook settings; the webhook URL is `/api/razorpay/webhook` |

## Design notes

- Layout and type follow the brief's reference (theplatedproject.com) as a style guide only: Poppins throughout, uppercase letter-spaced navigation and buttons, borderless 4:5 product cards, editorial banners.
- Colour theme: only sage `#87A96B` (page background), brown `#5A3E2B` (header, footer, main buttons) and amber `#D5851F` (highlights) for every background, button and line. Text uses whichever colour reads best on each: near-black on sage and amber, white on brown. Change them in `src/app/globals.css`.
- Fade-up on scroll uses CSS scroll-driven animations, so content is never hidden waiting for JavaScript; it is switched off for visitors who prefer reduced motion.
- The custom-order button (`src/components/custom/CustomRequestButton.tsx`) is self-contained so the full custom flow can replace it later.

## Hosting (Netlify)

The site runs on Netlify's free plan at **https://memorylaneart.netlify.app** and deploys itself from the `main` branch on GitHub. Build settings live in `netlify.toml`; Netlify adds its Next.js adapter automatically.

- **Credits:** the free plan has 300 credits a month. Each push to `main` (a production deploy) uses 15, and visitor traffic uses about 20 per GB. Deploy previews and branch deploys are free. If the credits run out, Netlify pauses the site until the next month, so changes are pushed in batches. Check usage in Netlify → Usage & billing.
- **Preview mode:** `NEXT_PUBLIC_PREVIEW = "1"` in `netlify.toml` keeps the notes on unbuilt pages, a dummy UPI ID, and lets the checkout take test orders without email set up. Delete that line at launch.
- **Secrets** (Resend, Razorpay) go in Netlify → Project configuration → Environment variables, never in `netlify.toml`.
- **Before launch:** move to a paid plan (Personal or Pro) so a busy festival week can't pause the shop, and connect the domain.
- **Check a Netlify build on your computer** (needs Node 22, which this command downloads):

  ```bash
  npx -y -p node@22 -p netlify-cli@latest -- netlify build --offline
  ```
