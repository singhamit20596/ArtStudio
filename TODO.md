# Art Studio website: what I still need from you

Everything below is a placeholder. Reply with whatever you have. The top section matters most for the Retirement Tributes launch.
Product data lives in `src/data/seed.json`, business settings in `src/config/site.ts`, coupon codes in `src/config/coupons.ts`.

## Retirement Tributes launch: please check

Retirement Tributes (Newspaper Tribute, Box Frame and Resin Frame) are the featured line: they open the homepage with one heartfelt line and lead every menu. The rest of the shop is back below them, still with the placeholders listed further down.

### Before the first real order

- [ ] **Your UPI ID** (e.g. `artstudio@okicici`). Goes in `payments.upi.id` in `src/config/site.ts`. Without it the live site cannot offer "Pay by UPI"; the preview uses a dummy ID that cannot receive money.
- [ ] **Order emails (Resend).** Order alerts, "I've paid" alerts and the customer's personalisation details (with photo links) all reach you by email. Until Resend is set up (steps under Phase 3 below), you only hear about an order if the customer messages you on WhatsApp.
- [ ] **Cash on Delivery for tributes.** Checkout still offers COD. For made-to-order pieces of ₹3,000–₹11,000, do you want COD, or UPI and WhatsApp only?

### The three tributes (prices and copy are placeholders; change freely)

| Tribute | Sizes and prices (placeholders) | LED lights | Making time |
|---|---|---|---|
| Box Frame (medals, photo, name plate) | 12 × 16 in ₹4,999 · 16 × 20 in ₹6,499 · 18 × 24 in ₹7,999 · 20 × 24 in ₹8,999 · 24 × 30 in ₹10,999 | + ₹799 | 10–14 days |
| Newspaper Tribute (framed front page) | 12 × 16 in ₹2,999 · 16 × 20 in ₹3,999 · 18 × 24 in ₹4,999 · 20 × 30 in ₹6,499 | + ₹799 | 7–10 days |
| Resin Frame (photo and crest in resin) | 8 × 10 in ₹3,499 · 10 × 12 in ₹4,499 · 12 × 16 in ₹5,999 · 16 × 20 in ₹7,999 | + ₹699 | 7–10 days |

- [ ] **Sizes, prices, light prices and making times** in the table above (all in `src/data/seed.json`). Send your real ones.
- [ ] **The homepage line**: "They served the nation. They deserve the best." with a short paragraph about years far from home and festivals on duty (`src/components/tribute/TributeHero.tsx`). Change any words.
- [x] **Faces pixelated** in every Retirement Tribute photo (28 Oct 2026): main photos, lit versions, homepage tiles, design photos, all samples (including the small photos in the newspaper collages and film strip), the source mockups in `exports/iaf-frames/`, the old Instagram frame photo and the homepage Instagram tile of the frame. Please look through them once; send word if any face was missed.
- [ ] **LED lights are hidden for now** (`lights: false` in `src/config/launch.ts`). The light prices above stay saved; set it to `true` to offer lights again (the "with light" photos come back with it).
- [ ] **Main photos are mockups.** Each tribute shows one main photo, then its samples (in `public/products/<slug>/`, made by `scripts/make-tribute-photos.py`):
  - Box Frame and Resin Frame come from the mockups in `exports/iaf-frames/` (your blue shadow box and round resin plaque recreated cleanly, with stock models in painted-on uniforms and stock rooms from Pexels; see `PHOTO-CREDITS.md`). Please confirm they show pieces you make.
  - **Newspaper Tribute is a sample I designed** (masthead "The Nation's Pride", placeholder caption "Rank and Name", a stock model's portrait). Send a photo of a real newspaper tribute to replace it.
  - The "with light" photos (hidden while lights are off) are edited: the room is darkened and warm LEDs are drawn inside the frame. Real lit photos would be better.
  - The name plates on the mockups still carry names from the original frames (e.g. "Prashant", "Saurabh Kumar"). Are those customers happy to be shown, or should we blur the names?
  - When you send real photos: the frame alone with very little background, and (for later) the same with lights on, lights only inside the frame.
- [ ] **Newspaper Tribute sample photos** (all 3 you sent, in `public/products/newspaper-tribute/`, shown in this order: `sample-3.jpg`, `sample-1.jpg`, `sample-2.jpg`):
  - "Manish is retired" (shown first) was added on your word that you have permission to use it. It shows a real person's face and full name, and the slideshow arrows of the website it came from.
  - The Army collage is also a screenshot: the website's slideshow arrows show at its left and right edges.
  - The "Retirement Celebration" one shows US forces (American flag and uniforms), not Indian ones.
- [ ] **Box Frame sample photos** (the 7 you sent, now after the main photo, in `public/products/box-frame/sample-1.jpg` to `sample-7.jpg`). Please check before launch:
  - They look AI-generated and still carry the generator's sparkle mark in a corner. I kept them whole rather than cropping the mark out.
  - Several have garbled text that customers will notice: "Indian army curto Service Before cell." (Army frame), "SERCEANT" and "SENIOR FIELE OFFICEN" (embroidered frame), "OPEDATION VIJBO-COR" and other misspelt patches.
  - Some show names ("Satpal Singh", "RK Singh", "Rik Singh"). Fine to show?
  - Real photos of frames you have made would be better; send them and we swap them in.
- [ ] **Resin Frame sample photos** (3 of the 4 you sent, after the main photo, in `public/products/resin-frame/sample-1.jpg` to `sample-3.jpg`: green, red, blue with medals). The plain blue one was left out: it is the same plaque and shot as the blue one with medals. Like the Box Frame samples they look AI-generated (sparkle mark in a corner), and:
  - The green one says "Indian Navy" on its plaque but carries the Air Force crest.
  - The small top plaque on the blue one has garbled text.

### Personalising after payment

After paying, the customer gets a private link (on the order page and in their email; they can also save it to their own WhatsApp) to: pick a design, enter rank, name, unit and years, upload up to 12 photos, pick a background colour and add notes.

- [ ] **Designs** offered for each type (in `templates`, `src/config/tribute.ts`). Box Frame: Sky blue, Happy Retirement, Velvet and gold (with photos). Newspaper: Front page (photo), Photo story, Broadsheet (sketches). Resin: Rectangle, Arch (sketches) and Round (photo). Rename, add or remove; a photo for each design helps customers choose.
- [ ] **Background colours**: Army green, Navy blue, Air Force blue, Maroon, Black, Ivory. Change the list or the shades.
- [ ] **Sending the link on WhatsApp automatically** needs the paid WhatsApp Business API (through a provider such as Interakt, AiSensy or Gupshup). For now the owner email has a "Send link on WhatsApp" button that opens a chat with the customer from your phone. Is that enough to start?
- [ ] **Where uploaded photos live**: Netlify Blobs storage on your Netlify site. Photos count toward your Netlify usage, so check it after the first few orders.
- [ ] **A page to see orders and photos** without opening emails: planned for Phase 4 (admin panel).

### Still open from before

- [ ] **How customers get their medals to you.** Do they courier the originals, hand them over, or do you source replicas? The site avoids saying either way.
- [ ] **Copy to check** in `src/config/tribute.ts`: "What goes inside" notes, the five "How it works" steps and the FAQs.
- [ ] **Hotspot positions** sit on the blue shadow box mockup (`frame-detail.jpg`). If that photo changes, the numbered points need moving to match it.

## New in Phase 3: please check

- [ ] **Offer codes.** None are set up (the sample codes were removed). Send your real offers: code, discount, minimum order and last date. Until then the coupon box stays, but "View offers" links are hidden.
- [ ] **Cash on Delivery fee**: none for now (`payments.codFee` in `site.ts`). Tell us if you charge one.
- [ ] **Gift wrap**: placeholder charge **₹49** per order, with an optional gift message (`giftWrap` in `site.ts`). Confirm the price, or say if it should be free.
- [ ] **Free shipping** is judged on the cart value *before* a coupon (₹3,000 or more ships free even if a coupon brings the total under). Is that how you want it?
- [ ] **Order emails** (set up when you are ready, about 15 minutes):
  1. Create a free account at resend.com and an API key. Add it as `RESEND_API_KEY` in Vercel.
  2. Once you have a domain, verify it in Resend and set `ORDER_EMAIL_FROM`, e.g. `Art Studio <orders@yourdomain.in>`. Until then Resend can only email your own account address, so customers would not get their copy.
  3. New-order alerts go to **sandeep698146@gmail.com**. Is that the right inbox?

  Until email is set up, the live site only takes "Order on WhatsApp" orders (Cash on Delivery orders need the email as their record until the Phase 4 database).
- [ ] **Read the order emails**: on your computer, each test order saves the customer and owner emails as files in `.data/emails/`. Open one in a browser and tell us what to change.
- [ ] **Razorpay**: online payment is built but switched off, and should stay off until the Phase 4 database. When your account is ready we also need a **webhook secret** (Razorpay dashboard → Webhooks, events `payment.captured` and `order.paid`).
- [ ] **WhatsApp orders**: checkout can send the whole order (number, items, total, address) to your WhatsApp. Are you happy to confirm these and share payment details in the chat?

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

## Hosting (Netlify)

- [ ] **Before launch, move to a paid Netlify plan** (Personal $9 or Pro $20 a month). The free plan's 300 credits pause the site when they run out.
- [ ] **Domain**: once bought, connect it in Netlify → Domain management and change `NEXT_PUBLIC_SITE_URL` in `netlify.toml` (now `https://memorylaneart.netlify.app`).

## 5. Business details

- [ ] **Domain** (e.g. artstudio.in). Set it as `NEXT_PUBLIC_SITE_URL`; it is used in WhatsApp request links, sharing previews and SEO.
- [ ] **Business hours** for the footer (e.g. Mon–Sat, 10am–7pm IST).
- [ ] **City / pickup address** (optional) for the About and Contact pages.
- [ ] **Courier partner** and rough delivery days by region, for the pincode checker (Phase 2).
- [ ] **Return and refund rules** for ready-made vs custom pieces (Phase 5 policy pages).
- [ ] **GSTIN**, if registered, for invoices.
- [ ] **COD fee**: none, or a fixed amount?
- [ ] **Razorpay**: when your account is ready, send the key ID and secret (they go into Vercel settings, never into the code). Until then checkout offers Cash on Delivery and "Order on WhatsApp", with "Online payments coming soon".
