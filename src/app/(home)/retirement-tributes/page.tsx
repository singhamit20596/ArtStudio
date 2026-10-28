import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { launch } from "@/config/launch";
import { getCategory, products } from "@/lib/catalog";
import { TributeHero } from "@/components/tribute/TributeHero";

export const metadata: Metadata = {
  title: "Retirement Tributes",
  description: "Newspaper tributes, box frames and resin frames for Army, Navy and Air Force retirements, made by hand around their medals, photographs and story.",
};

/** All three tributes on one page: the "Retirement Tributes" menu label opens it. */
export default function RetirementTributesPage() {
  const category = getCategory(launch.focus);
  if (!category) notFound();
  return <TributeHero products={products.filter((p) => p.category === launch.focus)} />;
}
