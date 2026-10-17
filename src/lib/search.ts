/** Typo-tolerant matching shared by the search overlay and the /search page. */

export const POPULAR_SEARCHES = ["Tribute frame", "Pooja thali", "Wall clock", "Keychain", "Karwa Chauth", "Shadow box"];

export const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ऀ-ॿ\s]/g, " ");

export const tokenise = (query: string) => normalise(query).split(/\s+/).filter(Boolean);

/** Edit distance capped at 1, enough to forgive a single typo ("keychian"). */
function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** 0 when any query word is missing from `text`; higher is a better match. */
export function matchScore(text: string, tokens: string[]) {
  const words = normalise(text).split(/\s+/).filter(Boolean);
  let total = 0;
  for (const t of tokens) {
    if (words.some((w) => w.startsWith(t))) total += 3;
    else if (words.some((w) => w.includes(t))) total += 2;
    else if (t.length >= 4 && words.some((w) => withinOneEdit(w.slice(0, t.length + 1), t) || withinOneEdit(w, t))) total += 1;
    else return 0;
  }
  return total;
}

/** Items that match every query word, best first. */
export function rank<T>(items: T[], query: string, text: (item: T) => string) {
  const tokens = tokenise(query);
  if (tokens.length === 0) return [];
  return items
    .map((item) => ({ item, s: matchScore(text(item), tokens) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.item);
}
