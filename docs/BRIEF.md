# Build an e-commerce website for my handmade art studio

You are building a production-ready, mobile-first online store for my small handmade art business. Read this whole brief before writing any code. Work in phases (see "Build order") and show me the result after each phase.

---

## 0. Business details (confirmed by owner)

- Brand name on site: Art Studio
- Tagline: Art with Soul
- Logo: taken from the Instagram profile picture (original high-res file still to come)
- WhatsApp number for orders: +91 90429 18049
- Business email: sandeep698146@gmail.com
- Instagram: https://www.instagram.com/theartstudioo2026/
- Free-shipping threshold: ₹3,000 · Flat shipping fee below it: ₹100
- Payment gateway: not yet. Launch with Cash on Delivery + "Order on WhatsApp"; keep Razorpay wired but switched off, shown as "Online payments coming soon"
- Domain: not decided yet

---

## 1. About the business

- Handmade decorative and custom pieces, mostly epoxy resin work plus shadow-box / tribute frames.
- Instagram bio tone: "Art that tells a story ✨ Handcrafted with love ✨ 🚚 Pan India Shipping".
- Sells pan-India. Prices in ₹ (INR), inclusive of taxes.
- Every piece is handmade, so each product needs a **making time** ("Ships in 5–7 days") on top of courier time.
- Instagram content is partly in Hindi (e.g. "आपके घर के लिए", "स्पेशल"). Site language is English; Hindi phrases are fine in festive banners.

---

## 2. Product structure

There are two top-level types. Every product has a `type` field: `"ready"` or `"custom"`.

### A. Ready Made — in stock, buy directly (Add to Cart / Buy Now)
Items already made and listed. Subcategories:
- Trays & Coasters
- Pooja & Festive (thalis, torans/door hangings, Karwa Chauth sets, Diwali décor)
- Wall Décor (clocks, wall panels)
- Keychains & Accessories
- Gifts (curated collection that pulls from all of the above)

### B. Custom Made — made to order
1. **Retirement & Tribute Frames — IAF / Army / Navy** (shadow box with the person's medals, wings/badges, patches, rank insignia, photo and an engraved name plate). This is the signature product — give it a hero spot on the homepage.
2. **Resin Trays** (custom colours, names, initials, monograms)
3. **Fridge Magnets** (photo magnets / resin photo blocks)
4. **Phone Covers** (resin / pressed-flower covers — no photos yet, show "Coming soon")
5. **Personalised Shadow Boxes** (birthday, anniversary, wedding — optional LED lighting)
6. **Resin Photo Frames** (photo + flowers/butterflies, with easel stand)
7. **Name Plates** (home / door / desk)
8. **Flower Preservation** (wedding varmala, bouquet, single rose preserved in resin)
9. **Initial & Name Keychains**
10. **Wall Clocks** (custom colours, geode / marble effects)
11. **Resin Jewellery** (earrings, pendants, rings)
12. **Pet Memorials** (photo + paw print / fur in resin)
13. **Rakhi & Festive Customs** (resin rakhis, name torans, custom pooja thalis)
14. **Resin Rangoli** (reusable floor/table rangoli)
15. **Bookmarks, Coaster Sets & Desk Organisers**

Categories 5–15 are new; where there are no photos yet, show a tasteful "Made to order" card instead of an empty grid.

**The custom-order flow will be designed later.** For now, every custom product page shows: past-work gallery, description, starting price ("From ₹___"), making time, and a single **"Request this custom piece"** button that opens WhatsApp with a pre-filled message: `Hi! I'd like a custom [product name]. Link: [page URL]`. Build this as an isolated component so the full flow can replace it later.

### Seed catalogue (from my Instagram posts)
Instagram blocks automated access, so here is the list taken from my 12 most recent posts. There may be more posts; I'll add them through the admin panel. I'll supply the photos — create image slots at `/public/products/<slug>/1.jpg, 2.jpg …` and use clearly labelled placeholders until then. Use placeholder prices and list every placeholder in a `TODO.md` so I can fill them in.

| # | Post date | Product (suggested name) | Type | Category | What it is |
|---|---|---|---|---|---|
| 1 | 15 Oct 2026 | Shubh Labh Toran \| Resin Door Hanging \| Pair | Ready | Pooja & Festive | Pair of vertical hangings: kalash, swastik, elephant, diya, "शुभ" / "लाभ" lettering, beaded strings |
| 2 | 11 Oct 2026 | Blush Agate \| Resin Coaster | Ready | Trays & Coasters | Agate-edge coaster in blush pink and sage green with gold rim |
| 3 | 10 Oct 2026 | Rose Marble \| Resin Serving Tray | Ready | Trays & Coasters | Rectangular wavy-edge tray, pink/mauve marble swirl, gold ring accent (collab post with @sabbcreations65 — I'll confirm if it's listed) |
| 4 | 09 Oct 2026 | IAF Retirement Tribute Frame \| Shadow Box | Custom | Retirement & Tribute Frames | Blue-backed shadow box with medals, wings, patches, rank stripes, photo, name plate |
| 5 | 07 Oct 2026 | Karwa Chauth Chalni & Thali Set \| Resin | Ready | Pooja & Festive | Teal resin set with mirror sieve, gold leaf and bells |
| 6 | 05 Oct 2026 | Lal Pooja Thali \| Resin with Gold Leaf | Ready | Pooja & Festive | Red glitter resin thali, gold leaf sprigs, two gold diya/katori holders |
| 7 | 30 Sep 2026 | Birthday Shadow Box with LED Lights | Custom | Personalised Shadow Boxes | Lit shadow box with photos, flowers, miniatures, "Happy Birthday" card |
| 8 | 26 Sep 2026 | Memory Photo Frame \| Resin with Easel | Custom | Resin Photo Frames | Wavy resin frame with photo, butterflies, dried flowers, on wooden easel |
| 9 | 22 Sep 2026 | Photo Blocks & Fridge Magnets \| Resin | Custom | Fridge Magnets | Clear resin blocks/magnets with customer photo and flowers |
| 10 | 17 Sep 2026 | Alphabet Letters \| Resin | Ready | Keychains & Accessories | Multicolour resin letters with glitter/flowers (sell single letter or set) |
| 11 | 16 Sep 2026 | Botanical Initial Keychain \| Resin | Ready (letter variant) | Keychains & Accessories | Clear letter keychains with pressed flowers/leaves; variant selector A–Z |
| 12 | 15 Sep 2026 | Marble Noir \| Resin Wall Clock | Ready | Wall Décor | White marble effect with black-and-gold geode edge, gold Roman numerals |

Product data model (store in the database; also export a `seed.json`):
`id, slug, name, type (ready|custom), category, subcategory, occasions[], price, mrp, startingPrice (custom), images[], video, description, highlights[] ("About this item" bullets), dimensions, material, weight, care, makingTimeDays {min,max}, stock, variants[] (e.g. letter, colour, size), tags[], isNew, isBestseller, isCustomisable, instagramUrl, createdAt`

Occasions for filtering and "Shop by occasion": Retirement, Birthday, Anniversary, Wedding, Housewarming, Diwali, Karwa Chauth, Raksha Bandhan, Corporate gifting.

---

## 3. Design — reference: https://theplatedproject.com/

Use it as a **layout and style reference only**. Do not copy its text, images, logos, product names or brand assets.

What to borrow:
- **Typography:** Poppins throughout. Body 14px, slight letter-spacing (~0.35px). Nav links uppercase, ~11px, bold, wide letter-spacing (~0.3em). Buttons uppercase, ~13px, medium weight, letter-spacing ~0.2em. Section headings ~32–36px, semibold.
- **Colour:** mostly black-and-white editorial: white backgrounds, near-black (#111) buttons and text, very dark (#0F0F0F) announcement bar. Add my brand accents from the logo sparingly: warm cream sections, muted gold for highlights/badges, blush and dusty blue for small touches.
- **Header:** thin announcement bar on top (rotating messages: "Pan India shipping", "Handcrafted with love", current offer code). Logo left, centred uppercase nav with dropdown mega-menus, icons right (search, account, wishlist, cart). Header is transparent over the hero and turns solid white on scroll.
- **Hero:** full-bleed autoplay muted looping video (I'll supply a reel) with a short headline and one uppercase CTA.
- **Homepage section order:**
  1. Hero video
  2. Category tiles strip (round or square image tiles with labels)
  3. "New Arrivals" product carousel + View all
  4. Signature banner: Retirement & Tribute Frames (IAF / Army / Navy) — "Honour a lifetime of service"
  5. Two or three large editorial banners with emotive headlines + CTA (e.g. "Bring festivals home", "Gifts that tell a story")
  6. "Festive Edit" carousel (Diwali, Karwa Chauth)
  7. "Custom Made" section — grid of custom categories with "Made to order" feel
  8. Story block — centred text about handmade, every piece tells a story
  9. Customer love — review cards with customer photos (from my Instagram "Order+review" highlight; I'll supply screenshots)
  10. Instagram strip — 6 latest post images linking to the profile (static images I supply; no API)
  11. Bulk / corporate gifting banner with enquiry CTA
  12. Newsletter signup ("Join the inner circle — new drops and festive offers")
  13. Trust icons row: Handmade, Cash on Delivery, Pan India Shipping, Secure Payments
  14. Thin scrolling marquee strip with a brand line
  15. Footer: columns (About, Help, Shop, Custom), contact + WhatsApp + hours, Instagram link, policies
- **Product cards:** clean image (4:5), second image on hover, small badge top-left ("New", "Handmade", "Bestseller", "Customisable"), title in the format `Name | Material | Size`, price in ₹ underneath, wishlist heart. No borders, generous whitespace.
- **Cart:** slide-out drawer from the right, plus a separate "Offers" drawer showing active coupons with a copy button.
- **Floating WhatsApp button** bottom-right on every page.
- Subtle motion only: fade-up on scroll, image hover zoom, smooth carousels.

---

## 4. Features — reference: Amazon.in

**Search & browse**
- Prominent search with autosuggest (products + categories), typo-tolerant, recent searches
- Listing pages with breadcrumbs, filters (category, ready/custom, occasion, price range, colour, rating, in stock), sort (Featured, Newest, Price low→high, high→low, Bestselling, Top rated), result count, pagination or infinite scroll
- Mobile filters in a bottom sheet

**Product page**
- Image gallery with thumbnails, hover zoom on desktop, swipe + pinch on mobile, product video support
- Title, star rating + review count (jumps to reviews), price with MRP strike-through and % off
- Variant selectors (letter, colour, size)
- **Pincode checker** → serviceable yes/no + estimated delivery date = making time + courier days
- Stock message ("Only 2 left — each piece is handmade")
- Add to Cart, Buy Now, quantity, wishlist, share (WhatsApp / copy link)
- Gift wrap + gift message option
- "About this item" bullets, specs table (dimensions, material, weight, care instructions)
- Ratings & reviews: average, 5→1 star breakdown bars, verified-buyer badge, photo reviews, sort by most recent / most helpful, "Was this helpful?"
- Customer Q&A (questions answered by me from admin)
- "Frequently bought together", "Similar items", "Recently viewed"
- Sticky Add to Cart bar on mobile

**Cart & checkout**
- Cart with quantity edit, remove, **Save for later**, coupon field, free-shipping progress bar ("Add ₹___ more for free shipping")
- Guest checkout + login with phone OTP or email
- Address form with pincode auto-fill of city/state, multiple saved addresses
- Payment: Razorpay (UPI, cards, netbanking, wallets) + Cash on Delivery (with optional COD fee); "Order on WhatsApp" fallback
- Order confirmation page + email with order ID

**Account**
- My Orders with status timeline (Placed → Being handmade → Shipped → Delivered), courier tracking link, reorder
- Wishlist, saved addresses, write a review for delivered items
- Public "Track order" page (order ID + phone)

**Marketing**
- Coupon codes (flat / % off / min order value), festive sale banners with countdown, "Deals" section
- Newsletter capture stored in DB

---

## 5. Admin panel (`/admin`, owner login only)

- Add / edit / archive products: photos (drag-drop upload, reorder), video, price, MRP, stock, variants, making time, category, occasions, badges
- Orders list: filter by status, update status (sends customer an email), add courier + tracking number, print packing slip
- Reviews moderation (approve / hide), answer Q&A
- Coupons, homepage banners, and announcement bar text editable without code
- Simple dashboard: orders today, revenue this month, top products

---

## 6. Tech requirements

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase: Postgres, Auth (phone OTP + email), Storage for images, Row Level Security
- Razorpay with server-side order creation and signature verification via webhook
- Transactional email via Resend (or similar)
- Deploy on Vercel; give me a README with step-by-step setup, all env variables, and how to add a product
- Mobile-first, fast (next/image, lazy loading, Lighthouse 90+ on mobile), accessible (alt text, keyboard nav, contrast)
- SEO: per-page titles/meta, Open Graph images, Product structured data (JSON-LD), sitemap.xml, robots.txt, clean slugs
- Pages: Home, Shop (all), Category, Occasion, Product, Custom Made hub, Search, Cart, Checkout, Order confirmation, Track order, Account (orders, wishlist, addresses), About / Our story, Contact, Bulk & corporate gifting enquiry, FAQ, Shipping & returns, Privacy policy, Terms, 404
- Draft sensible starter copy for policy pages and mark them for my review

---

## 7. Build order — stop and show me after each phase

1. **Design system + homepage** using seed data and placeholders. Show me before continuing.
2. **Catalogue:** listing pages, filters, search, product page, custom product pages with the WhatsApp request button.
3. **Commerce:** cart drawer, wishlist, save for later, coupons, checkout, Razorpay + COD, order emails.
4. **Accounts & admin:** login, order history/tracking, reviews and Q&A, full admin panel.
5. **Polish:** SEO, performance, accessibility pass, README, `TODO.md` of everything I still need to provide.

Out of scope for now: the full custom-order configurator (upload photos, choose medals, live preview) — we'll design that next. Keep custom products' CTA as a swappable component.

If something in this brief is unclear or conflicts, ask me before building that part rather than guessing.
