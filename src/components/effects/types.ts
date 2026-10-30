/**
 * The collections with their own page-wide effect and tune (owner, 30 Oct 2026):
 * - christmas: snow over the whole page, "Jingle Bells" (public domain) on synthesised bells;
 * - diwali: fireworks bursting across the page, an original bansuri-style tune with soft cracker pops;
 * - cars: racing cars streaking across with speed lines and tyre smoke, race-start beeps and an engine rev;
 * - retirement: slow falling gold stars and confetti, an original brass fanfare with a marching drum.
 */
export type EffectName = "christmas" | "diwali" | "cars" | "retirement";

export const effectNames: readonly EffectName[] = ["christmas", "diwali", "cars", "retirement"];

export const isEffectName = (value: string | null | undefined): value is EffectName => effectNames.includes(value as EffectName);
