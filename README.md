# Art Studio · Art with Soul

Online store for Art Studio (Instagram [@theartstudioo2026](https://www.instagram.com/theartstudioo2026/)): handmade resin décor, pooja & festive pieces, personalised gifts and IAF / Army / Navy retirement frames.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS 4. Supabase, Razorpay and Resend are added in later phases.

## Status

| Phase | What | State |
|---|---|---|
| 1 | Design system + homepage | Done |
| 2 | Catalogue: listing pages, filters, search, product and custom pages | Done |
| 3 | Cart, wishlist, coupons, checkout (COD + WhatsApp; Razorpay wired but off), order emails | **Done (this build)** |
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
| Business name, WhatsApp, email, shipping rules, courier days, COD fee, gift wrap, announcement bar, hero images/video | `src/config/site.ts` |
| Offer (coupon) codes | `src/config/coupons.ts` |
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

## Pages (tribute-frame launch)

The studio is launching one product line at a time. Right now the site sells **defence retirement tribute frames** (Army, Navy, Air Force); everything else is parked for later (see below).

| URL | What it is |
|---|---|
| `/` | The tribute frame: animated hero, "What goes inside" photo explorer, live name-plate preview, how it works, FAQs, price |
| `/request` | Four-step request form with a live frame sketch. Ends with "Send on WhatsApp" |
| `/product/retirement-tribute-frame` | Product page for the frame |

Copy for these pages (services, what goes inside, steps, FAQs) is in `src/config/tribute.ts`.

### Parked for later

The shop pages (categories, gifts, occasions, search, cart, checkout, wishlist, custom-made hub) are kept in `src/app/(store)/_parked/` and simply not built. To bring one back, follow `src/app/(store)/_parked/README.md` and add its categories to `categories` in `src/config/launch.ts`.

## Orders, emails and payments

- **Checkout** is guest-only for now (accounts arrive in Phase 4). Typing a pincode fills in the city and state from India Post's free public lookup; customers can still edit them.
- **Payment methods**: Cash on Delivery, "Order on WhatsApp" (the order is sent to your WhatsApp to confirm in the chat), and online payment through Razorpay, which is built but switched off (`payments.razorpayEnabled` in `site.ts`).
- **Prices are checked on the server** (`src/app/api/orders/route.ts`): the browser's totals are only a preview, so a changed price, an expired coupon or too many items is refused.
- **Where orders go until Phase 4**: on your computer, every order is added to `.data/orders.jsonl` and its two emails (yours and the customer's) are saved in `.data/emails/` so you can open them. On the live site, orders are emailed to you; without `RESEND_API_KEY` set, the live checkout only accepts WhatsApp orders so nothing gets lost.

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
- **Preview mode:** `NEXT_PUBLIC_PREVIEW = "1"` in `netlify.toml` keeps the notes on unbuilt pages and lets the checkout take test orders that go nowhere. Delete that line at launch.
- **Secrets** (Resend, Razorpay) go in Netlify → Project configuration → Environment variables, never in `netlify.toml`.
- **Before launch:** move to a paid plan (Personal or Pro) so a busy festival week can't pause the shop, and connect the domain.
- **Check a Netlify build on your computer** (needs Node 22, which this command downloads):

  ```bash
  npx -y -p node@22 -p netlify-cli@latest -- netlify build --offline
  ```
