import type { Metadata } from "next";
import { listingLabels, products, shopCategories, categoryHref } from "@/lib/catalog";
import { Listing } from "@/components/listing/Listing";
import { ListingHeader, Pill, PillLinks } from "@/components/listing/ListingHeader";
import { hiCategory } from "@/i18n/names";
import { T } from "@/i18n/T";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Handmade resin trays, pooja thalis, torans, wall clocks, keychains and made-to-order keepsakes. Shipped across India.",
};

export default function ShopPage() {
  return (
    <div className="container-x pb-20 md:pb-28">
      <ListingHeader
        crumbs={[{ label: "Shop", hi: "दुकान" }]}
        eyebrow={<T en="Handmade in India" hi="भारत में हाथ से बना" />}
        title={<T en="Shop all" hi="सभी चीज़ें" />}
        description={
          <T
            en="Ready-to-ship pieces and made-to-order keepsakes, all poured and finished by hand."
            hi="भेजने के लिए तैयार पीस और ऑर्डर पर बनने वाली यादगार चीज़ें, सब हाथ से ढाली और सजाई गईं।"
          />
        }
        links={
          <PillLinks label="Categories">
            {shopCategories.map((c) => (
              <Pill key={c.slug} href={categoryHref(c)}>
                <T en={c.name} hi={hiCategory(c.slug)} />
              </Pill>
            ))}
            <Pill href="/custom">
              <T en="Custom made" hi="कस्टम ऑर्डर" />
            </Pill>
          </PillLinks>
        }
      />
      <Listing products={products} facets={["category", "type", "occasion", "price", "colour", "stock"]} labels={listingLabels()} />
    </div>
  );
}
