import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingSkeleton } from "@/components/ui/Skeletons";
import { getOccasion, listingLabels, occasionHref, occasions, productsForOccasion } from "@/lib/catalog";
import { EmptyListing } from "@/components/listing/EmptyListing";
import { Listing } from "@/components/listing/Listing";
import { ListingHeader, Pill, PillLinks } from "@/components/listing/ListingHeader";

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
        crumbs={[{ label: "Gifts", href: "/gifts" }, { label: occasion.name }]}
        eyebrow="Shop by occasion"
        title={occasion.name}
        description={occasion.description}
        links={
          <PillLinks label="Occasions">
            {occasions.map((o) => (
              <Pill key={o.slug} href={occasionHref(o.slug)} active={o.slug === occasion.slug}>
                {o.name}
              </Pill>
            ))}
          </PillLinks>
        }
      />
      <Listing
        products={productsForOccasion(occasion.slug)}
        facets={["category", "type", "price", "colour", "stock"]}
        labels={listingLabels()}
        empty={<EmptyListing title={`Nothing listed for ${occasion.name} yet`} />}
      />
    </div>
  );
}
