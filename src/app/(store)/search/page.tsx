import type { Metadata } from "next";
import { Suspense } from "react";
import { listingLabels, products, searchLinks } from "@/lib/catalog";
import { SearchResults, SearchView } from "@/components/search/SearchResults";
import { withHindiLinks } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default function SearchPage() {
  const props = { products, labels: listingLabels(), links: withHindiLinks(searchLinks()) };
  return (
    <div className="container-x pb-20 md:pb-28">
      <Suspense fallback={<SearchView {...props} query="" />}>
        <SearchResults {...props} />
      </Suspense>
    </div>
  );
}
