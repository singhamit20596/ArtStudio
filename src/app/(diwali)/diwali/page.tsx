import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Flame } from "lucide-react";
import { diwali } from "@/config/diwali";
import { products } from "@/lib/catalog";
import { DiwaliDecor, DiyaRow } from "@/components/diwali/DiwaliDecor";
import { FestiveHero } from "@/components/festive/FestiveHero";

export const metadata: Metadata = {
  title: "Diwali Décor & Gifts",
  description: "Resin pooja thalis, Shubh Labh hangings, lotus tealight holders and Diwali gift boxes, made by hand to order and delivered across India.",
};

/** Every Diwali piece on one page: the "Diwali" menu item opens it. */
export default function DiwaliPage() {
  const items = products.filter((p) => p.category === diwali.category);
  if (items.length === 0) notFound();
  return <FestiveHero line={diwali} products={items} decor={<DiwaliDecor garlandClassName="top-16 lg:top-[76px]" />} after={<DiyaRow />} Icon={Flame} />;
}
