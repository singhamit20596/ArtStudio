/**
 * Festive lines: seasonal collections with their own page, colours, menu item and homepage
 * section (Diwali and Christmas, added 29 Oct 2026). Each line's copy lives in its own file;
 * the shared page parts are in src/components/festive/.
 */
import { christmas } from "./christmas";
import { diwali } from "./diwali";

export interface FestiveLine {
  /** The shop category holding the line's products (seed.json). */
  category: string;
  /** The line's own page. */
  path: string;
  /** Class on the page and its product pages that swaps in the festive colours (globals.css). */
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

/** In homepage order: the sooner festival first. */
export const festiveLines: FestiveLine[] = [diwali, christmas];

/** The festive line a category belongs to, if any. */
export const festiveFor = (category: string) => festiveLines.find((l) => l.category === category);
