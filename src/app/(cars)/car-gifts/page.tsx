import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarFront } from "lucide-react";
import { cars } from "@/config/cars";
import { products } from "@/lib/catalog";
import { RacingDecor, StartLights } from "@/components/cars/RacingDecor";
import { LineHero } from "@/components/lines/LineHero";

export const metadata: Metadata = {
  title: "Resin Car Gifts",
  description: "Diecast cars and bikes set in resin frames, canvases and displays: handmade gifts for car lovers, delivered across India.",
};

/** Every car gift on one page: the "Car Gifts" menu item opens it. */
export default function CarGiftsPage() {
  const items = products.filter((p) => p.category === cars.category);
  if (items.length === 0) notFound();
  return <LineHero line={cars} products={items} decor={<RacingDecor flagClassName="top-16 lg:top-[76px]" />} after={<StartLights />} Icon={CarFront} />;
}
