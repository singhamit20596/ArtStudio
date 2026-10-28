import type { Metadata } from "next";
import { products } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/listing/Breadcrumbs";
import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="container-x">
      <div className="pt-6 pb-8 md:pt-8">
        <Breadcrumbs items={[{ label: "Wishlist" }]} />
        <h1 className="mt-8 text-[30px] font-semibold leading-tight md:text-[40px]">Your wishlist</h1>
      </div>
      <WishlistView products={products} />
    </div>
  );
}
