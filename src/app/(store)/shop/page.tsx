import type { Metadata } from "next";
import { listingLabels, products, shopCategories, categoryHref } from "@/lib/catalog";
import { Listing } from "@/components/listing/Listing";
import { ListingHeader, Pill, PillLinks } from "@/components/listing/ListingHeader";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Handmade resin trays, pooja thalis, torans, wall clocks, keychains and made-to-order keepsakes. Shipped across India.",
};

export default function ShopPage() {
  return (
    <div className="container-x pb-20 md:pb-28">
      <ListingHeader
        crumbs={[{ label: "Shop" }]}
        eyebrow="Handmade in India"
        title="Shop all"
        description="Ready-to-ship pieces and made-to-order keepsakes, all poured and finished by hand."
        links={
          <PillLinks label="Categories">
            {shopCategories.map((c) => (
              <Pill key={c.slug} href={categoryHref(c)}>
                {c.name}
              </Pill>
            ))}
            <Pill href="/gifts">Gifts</Pill>
            <Pill href="/custom">Custom made</Pill>
          </PillLinks>
        }
      />
      <Listing products={products} facets={["category", "type", "occasion", "price", "colour", "stock"]} labels={listingLabels()} />
    </div>
  );
}
