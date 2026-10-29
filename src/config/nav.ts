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

/** The three Retirement Tributes, the featured line. Used in the header menu, footer and mobile menu. */
export const launchNav: NavLink[] = [
  { label: "Newspaper Tribute", href: "/product/newspaper-tribute" },
  { label: "Box Frame", href: "/product/box-frame" },
  { label: "Resin Frame", href: "/product/resin-frame" },
];

export const launchFooterNav: NavColumn[] = [
  {
    title: "Retirement tributes",
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

/** Header menus. Retirement Tributes come first (the featured line), then the shop. */
export const mainNav: NavMenu[] = [
  {
    id: "tributes",
    label: "Retirement Tributes",
    href: "/retirement-tributes",
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
    // still linked from the homepage, the footer, search and the Festive and Gifts menus.
    id: "diwali",
    label: "Diwali",
    href: "/diwali",
    columns: [
      {
        title: "Gift boxes & sets",
        links: [
          { label: "Ganesh Lakshmi gift box", href: "/product/ganesh-lakshmi-gift-box" },
          { label: "Pink pooja gift box", href: "/product/pink-pooja-gift-box" },
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
    id: "custom",
    label: "Custom",
    columns: [
      {
        title: "Keepsakes",
        links: [
          { label: "Personalised Shadow Boxes", href: "/custom/shadow-boxes" },
          { label: "Resin Photo Frames", href: "/custom/resin-photo-frames" },
          { label: "Flower Preservation", href: "/custom/flower-preservation" },
          { label: "Pet Memorials", href: "/custom/pet-memorials" },
        ],
      },
      {
        title: "For the home",
        links: [
          { label: "Resin Trays", href: "/custom/resin-trays" },
          { label: "Wall Clocks", href: "/custom/wall-clocks" },
          { label: "Name Plates", href: "/custom/name-plates" },
          { label: "Resin Rangoli", href: "/custom/resin-rangoli" },
          { label: "Rakhi & Festive Customs", href: "/custom/rakhi-festive-customs" },
        ],
      },
      {
        title: "Small gifts",
        links: [
          { label: "Fridge Magnets", href: "/custom/fridge-magnets" },
          { label: "Initial & Name Keychains", href: "/custom/initial-keychains" },
          { label: "Resin Jewellery", href: "/custom/resin-jewellery" },
          { label: "Phone Covers", href: "/custom/phone-covers", note: "Coming soon" },
          { label: "Bookmarks & Desk", href: "/custom/bookmarks-coasters-desk" },
        ],
      },
    ],
    features: [
      { eyebrow: "Your photos", title: "Photo blocks & magnets", href: "/custom/fridge-magnets", image: "/products/resin-photo-blocks-magnets/1.jpg", alt: "Resin photo blocks and fridge magnets" },
    ],
  },
  {
    id: "festive",
    label: "Festive",
    columns: [
      {
        title: "Festivals",
        links: [
          { label: "Diwali", href: "/diwali" },
          { label: "Karwa Chauth", href: "/occasion/karwa-chauth" },
          { label: "Raksha Bandhan", href: "/occasion/raksha-bandhan" },
        ],
      },
      {
        title: "Pooja & décor",
        links: [
          { label: "Pooja thalis", href: "/shop/pooja-festive?sub=pooja-thalis" },
          { label: "Torans & door hangings", href: "/shop/pooja-festive?sub=torans-door-hangings" },
          { label: "Karwa Chauth sets", href: "/shop/pooja-festive?sub=karwa-chauth" },
          { label: "All Pooja & Festive", href: "/shop/pooja-festive" },
        ],
      },
    ],
    features: [
      { eyebrow: "Diwali", title: "Shubh Labh toran", href: "/product/shubh-labh-toran", image: "/products/shubh-labh-toran/1.jpg", alt: "Pair of Shubh Labh resin door hangings" },
      { eyebrow: "Karwa Chauth", title: "Chalni & thali set", href: "/product/karwa-chauth-chalni-thali-set", image: "/products/karwa-chauth-chalni-thali-set/1.jpg", alt: "Teal resin Karwa Chauth chalni and thali" },
    ],
  },
  {
    id: "gifts",
    label: "Gifts",
    columns: [
      {
        title: "By occasion",
        links: [
          { label: "Retirement", href: "/occasion/retirement" },
          { label: "Birthday", href: "/occasion/birthday" },
          { label: "Anniversary", href: "/occasion/anniversary" },
          { label: "Wedding", href: "/occasion/wedding" },
          { label: "Housewarming", href: "/occasion/housewarming" },
        ],
      },
      {
        title: "Gifting",
        links: [
          { label: "The gift shop", href: "/gifts" },
          { label: "Bulk & corporate gifting", href: "/bulk-gifting" },
          { label: "Corporate gifting ideas", href: "/occasion/corporate-gifting" },
        ],
      },
    ],
    features: [
      { eyebrow: "Personalised", title: "Shadow boxes", href: "/custom/shadow-boxes", image: "/products/birthday-shadow-box-led/1.jpg", alt: "LED-lit birthday shadow box" },
      { eyebrow: "Pressed flowers", title: "Initial keychains", href: "/product/botanical-initial-keychain", image: "/products/botanical-initial-keychain/1.jpg", alt: "Resin initial keychains with pressed flowers" },
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
    title: "Retirement tributes",
    links: launchNav,
  },
  {
    title: "Shop",
    links: [
      { label: "Trays & Coasters", href: "/shop/trays-coasters" },
      { label: "Pooja & Festive", href: "/shop/pooja-festive" },
      { label: "Wall Décor", href: "/shop/wall-decor" },
      { label: "Keychains & Accessories", href: "/shop/keychains-accessories" },
      { label: "Gifts", href: "/gifts" },
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
