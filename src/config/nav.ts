export interface NavLink {
  label: string;
  href: string;
  note?: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavFeature {
  eyebrow: string;
  title: string;
  href: string;
  image: string;
  alt: string;
}

export interface NavMenu {
  id: string;
  label: string;
  /** When set, the label itself is a link (hover still opens the panel; on phones it is a plain link). */
  href?: string;
  columns: NavColumn[];
  features: NavFeature[];
}

/** The three Retirement Gifts (the tributes), the featured line. Used in the header menu, footer and mobile menu. */
export const launchNav: NavLink[] = [
  { label: "Newspaper Tribute", href: "/product/newspaper-tribute" },
  { label: "Box Frame", href: "/product/box-frame" },
  { label: "Resin Frame", href: "/product/resin-frame" },
];

export const launchFooterNav: NavColumn[] = [
  {
    title: "Retirement gifts",
    links: launchNav,
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & returns", href: "/shipping-returns" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Header menus. Retirement Gifts come first (the featured line), then the shop. */
export const mainNav: NavMenu[] = [
  {
    id: "tributes",
    label: "Retirement Gifts",
    href: "/retirement-gifts",
    columns: [],
    features: [
      { eyebrow: "Front page", title: "Newspaper Tribute", href: "/product/newspaper-tribute", image: "/products/newspaper-tribute/tile.jpg", alt: "Newspaper tribute frame" },
      { eyebrow: "Medals and photo", title: "Box Frame", href: "/product/box-frame", image: "/products/box-frame/tile.jpg", alt: "Box frame with medals and badges" },
      { eyebrow: "Set in resin", title: "Resin Frame", href: "/product/resin-frame", image: "/products/resin-frame/tile.jpg", alt: "Round resin frame with a photograph and crest" },
    ],
  },
  {
    id: "christmas",
    label: "Christmas",
    href: "/christmas",
    columns: [
      {
        title: "Ornaments",
        links: [
          { label: "Holographic tree", href: "/product/holo-christmas-tree" },
          { label: "Marble reindeer", href: "/product/marble-reindeer-ornament" },
          { label: "Christmas disc", href: "/product/christmas-disc-ornament" },
          { label: "Glitter tree", href: "/product/sea-glass-tree-ornament" },
        ],
      },
      {
        title: "Coasters",
        links: [
          { label: "Candy cane", href: "/product/candy-cane-christmas-coaster" },
          { label: "Snowflake", href: "/product/snowflake-coaster" },
          { label: "Merry Christmas", href: "/product/merry-christmas-coaster" },
          { label: "Melted snowman", href: "/product/melted-snowman-coaster" },
          { label: "Candy cane hexagon", href: "/product/candy-cane-hexagon-coaster" },
        ],
      },
      {
        title: "Gifts & décor",
        links: [
          { label: "Stocking keychain", href: "/product/stocking-keychain" },
          { label: "Santa & reindeer plaque", href: "/product/santa-reindeer-plaque" },
          { label: "Christmas dome magnet", href: "/product/christmas-dome-magnet" },
          { label: "Glitter tree canvas", href: "/product/glitter-tree-canvas" },
          { label: "All Christmas", href: "/christmas" },
        ],
      },
    ],
    features: [
      { eyebrow: "Ornament", title: "Holographic Tree", href: "/product/holo-christmas-tree", image: "/products/holo-christmas-tree/1.jpg", alt: "Resin Christmas tree with gold flakes and holographic sparkle" },
      { eyebrow: "Ornament", title: "Marble Reindeer", href: "/product/marble-reindeer-ornament", image: "/products/marble-reindeer-ornament/1.jpg", alt: "Red marble resin reindeer with gold antlers" },
    ],
  },
  {
    // Diwali took the place of "Shop" in the header (owner, 29 Oct 2026). The shop pages are
    // still linked from the homepage, the footer and search.
    id: "diwali",
    label: "Diwali",
    href: "/diwali",
    columns: [
      {
        title: "Gift boxes & sets",
        links: [
          { label: "Ganesh Lakshmi gift box", href: "/product/ganesh-lakshmi-gift-box" },
          { label: "Pink Shubh Labh gift box", href: "/product/pink-shubh-labh-gift-box" },
          { label: "Shubh Labh & candle box", href: "/product/shubh-labh-candle-gift-box" },
          { label: "Pink lotus pooja set", href: "/product/pink-lotus-pooja-set" },
        ],
      },
      {
        title: "Thalis & Shubh Labh",
        links: [
          { label: "Lotus pearl thali", href: "/product/lotus-pearl-pooja-thali" },
          { label: "Peacock feather thali", href: "/product/peacock-feather-pooja-thali" },
          { label: "Namokar Mantra thali", href: "/product/namokar-mantra-thali" },
          { label: "Shubh Labh, white & gold", href: "/product/shubh-labh-hangings" },
          { label: "Ganesh Lakshmi Shubh Labh", href: "/product/ganesh-lakshmi-shubh-labh" },
        ],
      },
      {
        title: "Diyas & décor",
        links: [
          { label: "Lotus tealight holder", href: "/product/lotus-tealight-holder" },
          { label: "Krishna mantra LED plaque", href: "/product/krishna-mantra-led-plaque" },
          { label: "Ganesha rose petal plaque", href: "/product/ganesha-rose-petal-plaque" },
          { label: "Radha Krishna frame", href: "/product/radha-krishna-frame" },
          { label: "All Diwali", href: "/diwali" },
        ],
      },
    ],
    features: [
      { eyebrow: "Diya", title: "Lotus Tealight", href: "/product/lotus-tealight-holder", image: "/products/lotus-tealight-holder/1.jpg", alt: "Gold resin lotus tealight holder with a lit tealight" },
    ],
  },
  {
    // Car Gifts took the place of "Custom" in the header (owner, 30 Oct 2026). The custom-order
    // pages are still linked from the homepage and the footer.
    id: "car-gifts",
    label: "Car Gifts",
    href: "/car-gifts",
    columns: [
      {
        title: "Frames",
        links: [
          { label: "Hot Wheels smoke frame", href: "/product/hot-wheels-smoke-frame" },
          { label: "BMW M smoke frame", href: "/product/bmw-m-smoke-frame" },
          { label: "Hot Wheels tyre track", href: "/product/hot-wheels-tyre-track-frame" },
          { label: "Twin drift shadow box", href: "/product/hot-wheels-twin-drift-frame" },
          { label: "Three cars spotlight", href: "/product/three-cars-spotlight-frame" },
          { label: "Ferrari flame burnout", href: "/product/ferrari-flame-burnout-frame" },
        ],
      },
      {
        title: "Canvases",
        links: [
          { label: "Ferrari racing stripe", href: "/product/ferrari-racing-stripe-canvas" },
          { label: "BMW M760Li drift", href: "/product/bmw-drift-smoke-canvas" },
          { label: "Pagani ocean wave", href: "/product/pagani-ocean-wave-canvas" },
          { label: "Emerald splash", href: "/product/emerald-splash-car-board" },
          { label: "Zaporozhets vintage", href: "/product/vintage-car-wheat-canvas" },
        ],
      },
      {
        title: "Plaques & displays",
        links: [
          { label: "Harley-Davidson plaque", href: "/product/harley-davidson-plaque" },
          { label: "Tyre display shelf", href: "/product/tyre-display-shelf" },
          { label: "All car gifts", href: "/car-gifts" },
        ],
      },
    ],
    features: [
      { eyebrow: "Canvas", title: "BMW Drift", href: "/product/bmw-drift-smoke-canvas", image: "/products/bmw-drift-smoke-canvas/1.jpg", alt: "Silver diecast BMW drifting out of white resin smoke on a black canvas" },
    ],
  },
  {
    id: "about",
    label: "About",
    columns: [
      {
        title: "The studio",
        links: [
          { label: "Our story", href: "/about" },
          { label: "Bulk & corporate gifting", href: "/bulk-gifting" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Help",
        links: [
          { label: "Track order", href: "/track-order" },
          { label: "Shipping & returns", href: "/shipping-returns" },
          { label: "FAQs", href: "/faq" },
        ],
      },
    ],
    features: [],
  },
];

export const footerNav: NavColumn[] = [
  {
    title: "Retirement gifts",
    links: launchNav,
  },
  {
    title: "Shop",
    links: [
      { label: "Trays & Coasters", href: "/shop/trays-coasters" },
      { label: "Pooja & Festive", href: "/shop/pooja-festive" },
      { label: "Wall Décor", href: "/shop/wall-decor" },
      { label: "Keychains & Accessories", href: "/shop/keychains-accessories" },
    ],
  },
  {
    title: "Custom",
    links: [
      { label: "Shadow Boxes", href: "/custom/shadow-boxes" },
      { label: "Fridge Magnets", href: "/custom/fridge-magnets" },
      { label: "Phone Covers", href: "/custom/phone-covers" },
      { label: "All custom pieces", href: "/custom" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Track order", href: "/track-order" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping & returns", href: "/shipping-returns" },
      { label: "Bulk gifting", href: "/bulk-gifting" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
