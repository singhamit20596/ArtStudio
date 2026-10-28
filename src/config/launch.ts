/**
 * What the site sells right now. The studio launches one product line at a time;
 * everything else stays in seed.json and in src/app/(store)/_parked for when it relaunches.
 */
export const launch = {
  /** Category slugs on sale. Products in other categories are hidden everywhere. */
  categories: ["retirement-tribute-frames"] as string[],
  /** The category the homepage, menus and request form are built around. */
  focus: "retirement-tribute-frames",
  /** Cart, checkout, wishlist, offers and product search (their routes are parked). */
  shop: false,
};
