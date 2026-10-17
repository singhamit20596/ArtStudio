# Art Studio website: what I still need from you

Everything below is a placeholder in the Phase 2 build. Reply with whatever you have; nothing here blocks Phase 3.
Product data lives in `src/data/seed.json`, business settings in `src/config/site.ts`.

## New in Phase 2: please check

- [ ] **Delivery times** for the pincode checker on product pages. It currently assumes **3–7 courier days** anywhere in India, on top of each product's making time (`shipping.courierDays` in `src/config/site.ts`). Send your courier partner and rough days by region and we will make it accurate.
- [ ] **Army Post Office pincodes** (starting with 9): the checker asks these customers to message you on WhatsApp. Do you ship to APO addresses directly?
- [ ] **Colours** (for the colour filter), read from the photos: Shubh Labh toran multicolour/green, Blush Agate pink/green/gold, Karwa Chauth set teal/gold, Lal Pooja Thali red/gold, Alphabet Letters multicolour, Botanical keychain clear/green, Marble Noir white/black/gold. Correct any that are wrong.
- [ ] **The gift shop** (`/gifts`) shows products tagged `gift`: Blush Agate tray, IAF tribute frame, Birthday shadow box, Memory photo frame, Photo blocks & magnets, Alphabet letters, Botanical keychain, Marble Noir clock. Add or remove any.
- [ ] **"Featured" order** on listing pages follows the order of products in `seed.json`. Tell us which pieces should come first.
- [ ] **Custom order steps** shown next to every "Request this custom piece" button: (1) message us on WhatsApp, (2) share photos, names, colours and the date, (3) we reply with the design details and final price, (4) once you confirm, we make it and ship it. Does this match how you work? Do you take an advance for custom pieces?
- [ ] **Cash on Delivery for custom pieces**: product pages for custom pieces do not mention COD. Is COD allowed for them?
- [ ] **Short lines for each occasion page** (e.g. Housewarming: "Trays, clocks and torans for a new home."), in `occasions` in `seed.json`. Edit freely.
- [ ] **Gift wrap**: the brief asks for a gift-wrap option. Is there a charge, and what does the wrap look like? (Built with the cart in Phase 3.)
- [ ] **Sizes and weights** are not shown on product pages until you send them (the Specifications table hides empty rows).

## 1. Photos (biggest visual upgrade)

The current pictures were grabbed from your Instagram, so they are small (about 360–640 px wide) and some reel covers carry text, emojis or the Shorts logo.

- [ ] **Logo**: the original file (PNG with transparent background or SVG, at least 1000 px). The current one is copied from your profile picture at 150 px.
- [ ] **Hero reel**: one 10–20 second clip, no text on it, landscape or 4:5, 1080p MP4. It plays muted behind the headline. Save it as `public/hero/hero.mp4` and set `hero.video` in `src/config/site.ts`.
- [ ] **Product photos**: 3–5 per product, at least 1600 px on the long side, on a plain background plus one "in the home" shot. Name them `1.jpg`, `2.jpg`… in each product's folder (table below). The second photo shows when a shopper hovers a product card.
- [ ] **Memory Photo Frame**: needs a clean photo (the reel cover has heavy text, so no image is shown yet).
- [ ] **Shadow box**: the current photo has emoji stickers covering faces; a clean shot would read better.

## 2. Prices and product details

| Product | Type | Status | Placeholder price | Stock | Making time | Photo folder |
|---|---|---|---|---|---|---|
| Shubh Labh Toran | ready | live | ₹1,299 | 5 | 2–4 days | `public/products/shubh-labh-toran/` |
| Blush Agate | ready | live | ₹1,899 | 3 | 2–4 days | `public/products/blush-agate-resin-tray/` |
| Rose Marble | ready | hidden | ₹2,199 | 1 | 2–4 days | `public/products/rose-marble-resin-tray/` |
| IAF Retirement Tribute Frame | custom | live | from ₹4,999 | made to order | 10–14 days | `public/products/iaf-retirement-tribute-frame/` |
| Karwa Chauth Chalni & Thali Set | ready | live | ₹2,499 | 4 | 2–4 days | `public/products/karwa-chauth-chalni-thali-set/` |
| Lal Pooja Thali | ready | live | ₹1,499 | 6 | 2–4 days | `public/products/lal-pooja-thali/` |
| Birthday Shadow Box | custom | live | from ₹2,999 | made to order | 7–10 days | `public/products/birthday-shadow-box-led/` |
| Memory Photo Frame | custom | live | from ₹1,499 | made to order | 5–7 days | `public/products/memory-photo-frame-easel/` |
| Photo Blocks & Fridge Magnets | custom | live | from ₹599 | made to order | 5–7 days | `public/products/resin-photo-blocks-magnets/` |
| Alphabet Letters | ready | live | ₹149 per letter | 26 | 2–3 days | `public/products/resin-alphabet-letters/` |
| Botanical Initial Keychain | ready | live | ₹249 | 20 | 2–3 days | `public/products/botanical-initial-keychain/` |
| Marble Noir wall clock | ready | live | ₹3,499 | 2 | 2–4 days | `public/products/marble-noir-wall-clock/` |

For every product please also send: **size** (cm or inches), **weight** (for courier charges), and correct the **materials** and **care** lines in `seed.json` (they are drafts).

Questions:
- [ ] **Blush Agate**: the brief called it a coaster, the photo looks like a serving tray. Which is it?
- [ ] **Rose Marble tray**: it appears as a collab post on @sabbcreations65's profile. Is it your piece? It stays hidden until you confirm and send a photo.
- [ ] **Lal Pooja Thali**: is the base steel or all resin?
- [ ] Do you want MRP / "% off" shown on any items? (Left empty so no discount is invented.)

## 3. Custom-made categories

Starting price and making time for each (shown as "From ₹…" and on the WhatsApp request pages):

| Category | Status now | Starting price | Making time |
|---|---|---|---|
| Retirement & Tribute Frames | active | ₹4,999 | 10–14 days |
| Resin Trays | active | ₹1,999 | 7–10 days |
| Fridge Magnets | active | ₹599 | 5–7 days |
| Phone Covers | coming soon | — | — |
| Personalised Shadow Boxes | active | ₹2,999 | 7–10 days |
| Resin Photo Frames | made to order | ₹1,499 | 5–7 days |
| Name Plates | made to order | — | — |
| Flower Preservation | made to order | — | — |
| Initial & Name Keychains | active | ₹249 | 4–6 days |
| Wall Clocks | active | ₹2,999 | 8–12 days |
| Resin Jewellery | made to order | — | — |
| Pet Memorials | made to order | — | — |
| Rakhi & Festive Customs | active | — | — |
| Resin Rangoli | made to order | — | — |
| Bookmarks, Coaster Sets & Desk Organisers | made to order | — | — |

- [ ] Remove any of categories 5–15 you do not want to offer yet.
- [ ] For tribute frames: do you also make Army and Navy versions today? (The copy says IAF, Army and Navy.)

## 4. Reviews

- [ ] Screenshots or text from your Instagram "Order+review" highlight: customer first name, city, product, review text and photo. Only use reviews the customer is happy to have shown. The homepage has three clearly marked empty slots until then.

## 5. Business details

- [ ] **Domain** (e.g. artstudio.in). Set it as `NEXT_PUBLIC_SITE_URL`; it is used in WhatsApp request links, sharing previews and SEO.
- [ ] **Business hours** for the footer (e.g. Mon–Sat, 10am–7pm IST).
- [ ] **City / pickup address** (optional) for the About and Contact pages.
- [ ] **Courier partner** and rough delivery days by region, for the pincode checker (Phase 2).
- [ ] **Return and refund rules** for ready-made vs custom pieces (Phase 5 policy pages).
- [ ] **GSTIN**, if registered, for invoices.
- [ ] **COD fee**: none, or a fixed amount?
- [ ] **Razorpay**: when your account is ready, send the key ID and secret (they go into Vercel settings, never into the code). Until then checkout offers Cash on Delivery and "Order on WhatsApp", with "Online payments coming soon".
