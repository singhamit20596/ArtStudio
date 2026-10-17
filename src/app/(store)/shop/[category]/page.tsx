import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingSkeleton } from "@/components/ui/Skeletons";
import { categoryHref, getCategory, listingLabels, productsInCategory, shopCategories } from "@/lib/catalog";
import { EmptyListing } from "@/components/listing/EmptyListing";
import { Listing } from "@/components/listing/Listing";
import { ListingHeader, Pill, PillLinks } from "@/components/listing/ListingHeader";

export function generateStaticParams() {
  return shopCategories.map((c) => ({ category: c.slug }));
}

function findCategory(slug: string) {
  const category = getCategory(slug);
  return category && shopCategories.includes(category) ? category : undefined;
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = findCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    openGraph: category.image ? { images: [{ url: category.image, width: 720, height: 900, alt: category.name }] } : undefined,
  };
}

export default function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <CategoryView params={params} />
    </Suspense>
  );
}

/** Reads the URL slug, so it sits under Suspense: navigations show the skeleton at once. */
async function CategoryView({ params }: { params: PageProps<"/shop/[category]">["params"] }) {
  const category = findCategory((await params).category);
  if (!category) notFound();

  return (
    <div className="container-x pb-20 md:pb-28">
      <ListingHeader
        crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name }]}
        eyebrow="Ready made"
        title={category.name}
        description={category.description}
        links={
          <PillLinks label="Categories">
            {shopCategories.map((c) => (
              <Pill key={c.slug} href={categoryHref(c)} active={c.slug === category.slug}>
                {c.name}
              </Pill>
            ))}
          </PillLinks>
        }
      />
      <Listing
        products={productsInCategory(category.slug)}
        facets={["sub", "occasion", "price", "colour", "stock"]}
        labels={listingLabels()}
        empty={<EmptyListing />}
      />
    </div>
  );
}
