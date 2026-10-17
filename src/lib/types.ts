export type ProductType = "ready" | "custom";

export interface Variant {
  name: string;
  options: string[];
}

export interface DayRange {
  min: number;
  max: number;
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
