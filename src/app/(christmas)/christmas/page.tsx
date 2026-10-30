import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Snowflake } from "lucide-react";
import { christmas } from "@/config/christmas";
import { products } from "@/lib/catalog";
import { ChristmasDecor } from "@/components/christmas/ChristmasDecor";
import { LineHero } from "@/components/lines/LineHero";

export const metadata: Metadata = {
  title: "Christmas Décor & Gifts",
  description: "Resin Christmas ornaments, coasters and little gifts, made by hand to order and delivered across India.",
};

/** Every Christmas piece on one page: the "Christmas" menu item opens it. */
export default function ChristmasPage() {
  const items = products.filter((p) => p.category === christmas.category);
  if (items.length === 0) notFound();
  return <LineHero line={christmas} products={items} decor={<ChristmasDecor lightsClassName="top-16 lg:top-[76px]" />} Icon={Snowflake} />;
}
