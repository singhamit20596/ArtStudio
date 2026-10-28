import type { Metadata } from "next";
import { cartCatalog } from "@/lib/catalog";
import { CartView } from "@/components/cart/CartView";
import { Breadcrumbs } from "@/components/listing/Breadcrumbs";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-x">
      <div className="pt-6 pb-8 md:pt-8">
        <Breadcrumbs items={[{ label: "Cart" }]} />
        <h1 className="mt-8 text-[30px] font-semibold leading-tight md:text-[40px]">Your cart</h1>
      </div>
      <CartView catalogue={cartCatalog()} />
    </div>
  );
}
