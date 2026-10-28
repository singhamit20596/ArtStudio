/**
 * What the site sells right now, and what it puts first.
 * The full shop is open again (owner, 28 Oct 2026), with Retirement Tributes on top.
 */
export const launch = {
  /** Category slugs on sale, or null for every category. Products in other categories are hidden everywhere. */
  categories: null as string[] | null,
  /** The featured line: first on the homepage and first in the menus. */
  focus: "retirement-tribute-frames",
  /** The full shop: category menus, product search, wishlist and the announcement bar. */
  shop: true,
  /** Cart, checkout and the order flow. */
  cart: true,
  /**
   * The "With LED lights" option on tributes. Off for now (owner, 28 Oct 2026): light prices stay
   * in seed.json, but the catalogue clears them, so pages, cart and order API all leave lights out.
   */
  lights: false,
};
