import type { Metadata } from "next";
import { cartCatalog } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/listing/Breadcrumbs";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-x">
      <div className="pt-6 pb-8 md:pt-8">
        <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        <h1 className="mt-8 text-[30px] font-semibold leading-tight md:text-[40px]">Checkout</h1>
      </div>
      <CheckoutView catalogue={cartCatalog()} />
    </div>
  );
}
