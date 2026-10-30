/** A random number between a and b. */
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** A random item. */
export const pickOne = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
