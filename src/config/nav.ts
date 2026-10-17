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
  columns: NavColumn[];
  features: NavFeature[];
}

export const mainNav: NavMenu[] = [
  {
    id: "shop",
    label: "Shop",
    columns: [
      {
        title: "Ready made",
        links: [
          { label: "Trays & Coasters", href: "/shop/trays-coasters" },
          { label: "Pooja & Festive", href: "/shop/pooja-festive" },
          { label: "Wall Décor", href: "/shop/wall-decor" },
          { label: "Keychains & Accessories", href: "/shop/keychains-accessories" },
          { label: "Gifts", href: "/gifts" },
          { label: "View all", href: "/shop" },
        ],
      },
      {
        title: "Browse by",
        links: [
          { label: "New arrivals", href: "/shop?sort=newest" },
          { label: "Bestsellers", href: "/shop?sort=bestselling" },
          { label: "Under ₹1,500", href: "/shop?max=1500" },
        ],
      },
    ],
    features: [
      { eyebrow: "Wall Décor", title: "Marble Noir clock", href: "/product/marble-noir-wall-clock", image: "/products/marble-noir-wall-clock/1.jpg", alt: "Marble Noir resin wall clock" },
      { eyebrow: "Pooja & Festive", title: "Thalis & torans", href: "/shop/pooja-festive", image: "/products/lal-pooja-thali/1.jpg", alt: "Red resin pooja thali" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    columns: [
      {
        title: "Keepsakes",
        links: [
          { label: "Retirement & Tribute Frames", href: "/custom/retirement-tribute-frames" },
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
      { eyebrow: "IAF · Army · Navy", title: "Retirement tribute frames", href: "/custom/retirement-tribute-frames", image: "/products/iaf-retirement-tribute-frame/1.jpg", alt: "IAF retirement shadow-box frame with medals and patches" },
    ],
  },
  {
    id: "festive",
    label: "Festive",
    columns: [
      {
        title: "Festivals",
        links: [
          { label: "Diwali", href: "/occasion/diwali" },
          { label: "Karwa Chauth", href: "/occasion/karwa-chauth" },
          { label: "Raksha Bandhan", href: "/occasion/raksha-bandhan" },
        ],
      },
      {
        title: "Pooja & décor",
        links: [
          { label: "Pooja thalis", href: "/shop/pooja-festive?type=thalis" },
          { label: "Torans & door hangings", href: "/shop/pooja-festive?type=torans" },
          { label: "Karwa Chauth sets", href: "/shop/pooja-festive?type=karwa-chauth" },
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
    title: "About",
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
      { label: "FAQs", href: "/faq" },
      { label: "Shipping & returns", href: "/shipping-returns" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
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
      { label: "Retirement & Tribute Frames", href: "/custom/retirement-tribute-frames" },
      { label: "Shadow Boxes", href: "/custom/shadow-boxes" },
      { label: "Fridge Magnets", href: "/custom/fridge-magnets" },
      { label: "Phone Covers", href: "/custom/phone-covers" },
      { label: "All custom pieces", href: "/custom" },
    ],
  },
];
