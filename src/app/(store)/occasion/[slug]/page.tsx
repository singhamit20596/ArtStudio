import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingSkeleton } from "@/components/ui/Skeletons";
import { getOccasion, listingLabels, occasionHref, occasions, productsForOccasion } from "@/lib/catalog";
import { EmptyListing } from "@/components/listing/EmptyListing";
import { Listing } from "@/components/listing/Listing";
import { ListingHeader, Pill, PillLinks } from "@/components/listing/ListingHeader";
import { hiOccasionDescription } from "@/i18n/catalogue";
import { hiOccasion } from "@/i18n/names";
import { T } from "@/i18n/T";

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/occasion/[slug]">): Promise<Metadata> {
  const occasion = getOccasion((await params).slug);
  if (!occasion) return {};
  return { title: `${occasion.name} gifts`, description: occasion.description };
}

export default function OccasionPage({ params }: PageProps<"/occasion/[slug]">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <OccasionView params={params} />
    </Suspense>
  );
}

/** Reads the URL slug, so it sits under Suspense: navigations show the skeleton at once. */
async function OccasionView({ params }: { params: PageProps<"/occasion/[slug]">["params"] }) {
  const occasion = getOccasion((await params).slug);
  if (!occasion) notFound();

  return (
    <div className="container-x pb-20 md:pb-28">
      <ListingHeader
        crumbs={[{ label: "Shop", hi: "दुकान", href: "/shop" }, { label: occasion.name, hi: hiOccasion(occasion.slug) }]}
        eyebrow={<T en="Shop by occasion" hi="मौक़े के हिसाब से" />}
        title={<T en={occasion.name} hi={hiOccasion(occasion.slug)} />}
        description={<T en={occasion.description} hi={hiOccasionDescription(occasion.slug)} />}
        links={
          <PillLinks label="Occasions">
            {occasions.map((o) => (
              <Pill key={o.slug} href={occasionHref(o.slug)} active={o.slug === occasion.slug}>
                <T en={o.name} hi={hiOccasion(o.slug)} />
              </Pill>
            ))}
          </PillLinks>
        }
      />
      <Listing
        products={productsForOccasion(occasion.slug)}
        facets={["category", "type", "price", "colour", "stock"]}
        labels={listingLabels()}
        empty={<EmptyListing title={<T en={`Nothing listed for ${occasion.name} yet`} hi={`${hiOccasion(occasion.slug) ?? occasion.name} के लिए अभी कुछ नहीं है`} />} />}
      />
    </div>
  );
}
