import { cars } from "@/config/cars";
import { christmas } from "@/config/christmas";
import { diwali } from "@/config/diwali";
import { launch } from "@/config/launch";
import type { EffectName } from "./types";

/** Which effect a shop category's pages play (server side: the product page picks its effect from this). */
const byCategory: Record<string, EffectName> = {
  [diwali.category]: "diwali",
  [christmas.category]: "christmas",
  [cars.category]: "cars",
  [launch.focus]: "retirement",
};

export const effectForCategory = (category: string): EffectName | undefined => byCategory[category];
