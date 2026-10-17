import { Suspense } from "react";
import { ListingView, ProductListing, type ListingProps } from "./ProductListing";

/**
 * Filterable product grid. The page is prerendered with every product showing;
 * the browser then applies the filters in the URL (?category=…&sort=…).
 */
export function Listing(props: ListingProps) {
  return (
    <Suspense fallback={<ListingView {...props} query="" />}>
      <ProductListing {...props} />
    </Suspense>
  );
}
