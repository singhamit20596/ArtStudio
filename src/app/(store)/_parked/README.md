# Parked routes

The site launches with one product line: **defence retirement tribute frames** (`src/config/launch.ts`).
These routes are kept for later but are not built: Next.js ignores folders that start with `_`.
They are also left out of `tsc` and `eslint` (see `tsconfig.json` and `eslint.config.mjs`).

| Folder | Pages |
|---|---|
| `shop/` | `/shop`, `/shop/[category]` |
| `gifts/`, `occasion/` | `/gifts`, `/occasion/[slug]` |
| `search/` | `/search` |
| `cart/`, `checkout/`, `wishlist/` | cart, checkout (COD / WhatsApp / Razorpay), confirmation, wishlist |
| `custom/` | `/custom`, `/custom/[slug]` |
| `../../api/_parked/` | `/api/orders`, `/api/orders/verify`, `/api/razorpay/webhook`, `/api/pincode/[pin]` |

To bring a section back: move its folder up one level (`git mv src/app/(store)/_parked/shop src/app/(store)/shop`),
add its categories to `launch.categories`, set `launch.shop = true` if it needs the cart, then run
`npx tsc --noEmit`, `npm run lint` and `npm run build`, because the code may need small updates by then.
