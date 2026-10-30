/**
 * Themed lines: collections with their own page, colours, decoration, menu item and homepage
 * section (Diwali, Christmas and Car Gifts, added 29–30 Oct 2026). Each line's copy lives in its
 * own file; the shared page parts are in src/components/lines/.
 */
import { cars } from "./cars";
import { christmas } from "./christmas";
import { diwali } from "./diwali";

export interface ThemedLine {
  /** The shop category holding the line's products (seed.json). */
  category: string;
  /** The line's own page. */
  path: string;
  /** Class on the page and its product pages that swaps in the line's colours (globals.css). */
  theme: string;
  eyebrow: string;
  /** The heading: the second part gets the gold shimmer. */
  title: readonly [string, string];
  intro: string;
  /** Shown under the products. */
  note: string;
  /** The homepage section: its one line and the four pieces it shows. */
  bandLine: string;
  featured: readonly string[];
  /** Under a photo of a piece made by another maker (samplePhoto in seed.json). */
  samplePhotoNote: string;
  /** On a card while a piece has no photo yet. */
  noPhoto: string;
  /** One short line per product for the cards. */
  taglines: Record<string, string>;
}

/** In homepage order: the festivals (sooner first), then the year-round lines. */
export const themedLines: ThemedLine[] = [diwali, christmas, cars];

/** The themed line a category belongs to, if any. */
export const themedLineFor = (category: string) => themedLines.find((l) => l.category === category);
