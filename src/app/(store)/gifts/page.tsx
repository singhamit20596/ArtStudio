import type { Metadata } from "next";
import { getCategory, giftProducts, listingLabels, occasionHref, occasions } from "@/lib/catalog";
import { Listing } from "@/components/listing/Listing";
import { ListingHeader, Pill, PillLinks } from "@/components/listing/ListingHeader";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { messages, whatsappLink } from "@/lib/whatsapp";

const gifts = getCategory("gifts");

export const metadata: Metadata = {
  title: "Gifts",
  description: gifts?.description,
};

export default function GiftsPage() {
  return (
    <>
      <div className="container-x pb-20 md:pb-28">
        <ListingHeader
          crumbs={[{ label: "Gifts" }]}
          eyebrow="The gift shop"
          title="Gifts that tell a story"
          description={gifts?.description}
          links={
            <PillLinks label="Shop by occasion">
              {occasions.map((o) => (
                <Pill key={o.slug} href={occasionHref(o.slug)}>
                  {o.name}
                </Pill>
              ))}
            </PillLinks>
          }
        />
        <Listing products={giftProducts()} facets={["category", "type", "occasion", "price", "colour", "stock"]} labels={listingLabels()} />
      </div>

      <section aria-labelledby="bulk-title" className="bg-slate-deep text-paper">
        <div className="container-x flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div className="max-w-xl">
            <p className="eyebrow !text-blush">Bulk & corporate gifting</p>
            <h2 id="bulk-title" className="mt-3 text-[24px] font-semibold leading-tight md:text-[28px]">
              Gifting for a team, a farewell or a wedding?
            </h2>
            <p className="mt-3 text-white/80">We make matching sets with names or logos. Tell us the numbers and the date.</p>
          </div>
          <a href={whatsappLink(messages.bulk)} target="_blank" rel="noopener noreferrer" className="btn btn-light shrink-0">
            <WhatsAppIcon size={17} /> Enquire on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
