import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { launch } from "@/config/launch";
import { getCategory, products } from "@/lib/catalog";
import { MedalRow, ServiceDecor } from "@/components/tribute/ServiceDecor";
import { TributeHero } from "@/components/tribute/TributeHero";

export const metadata: Metadata = {
  title: "Retirement Gifts",
  description: "Newspaper tributes, box frames and resin frames for retiring defence personnel, made by hand around their medals, photographs and story.",
};

/** All three retirement gifts on one page: the "Retirement Gifts" menu label opens it (it was /retirement-tributes). */
export default function RetirementGiftsPage() {
  const category = getCategory(launch.focus);
  if (!category) notFound();
  return (
    <TributeHero
      products={products.filter((p) => p.category === launch.focus)}
      decor={<ServiceDecor ribbonClassName="top-16 lg:top-[76px]" />}
      after={<MedalRow />}
    />
  );
}
