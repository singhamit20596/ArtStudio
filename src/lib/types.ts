export type ProductType = "ready" | "custom";

export interface Variant {
  name: string;
  options: string[];
}

export interface DayRange {
  min: number;
  max: number;
}

/** A size a made-to-order piece can be built in, with its price. */
export interface SizeOption {
  id: string;
  /** Unique product code for this size, e.g. "RTBF2424" (src/config/prices.ts). */
  code: string;
  /** "16 × 20 in" */
  label: string;
  widthIn: number;
  heightIn: number;
  price: number;
}

/** A tribute's photos: one main photo (plus its lit version), then samples (null = photo still to come). */
export interface ProductGallery {
  /** Shape of the photo box, as CSS aspect-ratio, e.g. "4 / 3". Photos are shown whole inside it. */
  ratio: string;
  /** The frame on its own, lights off, with very little background. */
  frame: string | null;
  /** The same shot with the LED lights on (the light stays inside the frame). */
  frameLit: string | null;
  /** The frame photo, lights off and on, on a 4:5 canvas for the homepage cards. */
  tile: string | null;
  tileLit: string | null;
  /** Extra sample photos shown after the three main ones, whole (any shape). */
  samples?: { src: string; alt: string }[];
}

/** Mirrors the product data model in the brief; stored in Supabase from Phase 4. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  category: string;
  subcategory: string | null;
  occasions: string[];
  price: number | null;
  mrp: number | null;
  startingPrice: number | null;
  images: string[];
  video: string | null;
  description: string;
  highlights: string[];
  dimensions: string | null;
  material: string | null;
  weight: string | null;
  care: string | null;
  makingTimeDays: DayRange;
  stock: number | null;
  variants: Variant[];
  /** Colour families for the listing filter (see COLOURS in listing.ts). Empty for custom pieces. */
  colours: string[];
  /** Search keywords. The "gift" tag puts a product in the /gifts collection. */
  tags: string[];
  isNew: boolean;
  isBestseller: boolean;
  isCustomisable: boolean;
  instagramUrl: string | null;
  createdAt: string;
  /** Product code from the price list: line + product, e.g. "PFTR" (sized products: each size has its own). */
  code?: string | null;
  /** Code added for each customer choice, e.g. letter "M" → "M". */
  variantCodes?: Record<string, string>;
  /** Sizes with their own prices (price above is then the smallest). */
  sizes?: SizeOption[];
  /** Extra charge for LED lights; null or missing = no light option. */
  lightPrice?: number | null;
  gallery?: ProductGallery;
  /** The photo shows another maker's piece (used with permission), not the studio's own: shown with a note. */
  samplePhoto?: boolean;
  /** Hidden from the storefront when false (e.g. awaiting confirmation). */
  published: boolean;
  /** Fields that still hold placeholder values. Listed in TODO.md. */
  placeholders: string[];
  notes?: string;
}

export type CategoryStatus = "active" | "made-to-order" | "coming-soon";

export interface Category {
  slug: string;
  type: ProductType;
  name: string;
  description: string;
  image: string | null;
  status: CategoryStatus;
  /** Custom categories: completes "Hi! I'd like a custom …" in the WhatsApp request. */
  requestName?: string;
  startingPrice?: number | null;
  makingTimeDays?: DayRange | null;
}

export interface Occasion {
  slug: string;
  name: string;
  description: string;
}

export interface Seed {
  occasions: Occasion[];
  categories: Category[];
  products: Product[];
}

/** Minimal product shape sent to the browser for the search overlay. */
export interface SearchItem {
  slug: string;
  name: string;
  type: ProductType;
  category: string;
  price: number | null;
  startingPrice: number | null;
  image: string | null;
  tags: string[];
}

/** A category or occasion suggested by the search overlay. */
export interface SearchLink {
  label: string;
  /** "Category", "Custom" or "Occasion" */
  kind: string;
  href: string;
}
