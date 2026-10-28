import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationView } from "@/components/checkout/ConfirmationView";

export const metadata: Metadata = {
  title: "Order placed",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return (
    <div className="container-x pt-10 pb-20 md:pt-14 md:pb-28">
      <Suspense fallback={<p className="py-20 text-muted">Loading your order…</p>}>
        <ConfirmationView />
      </Suspense>
    </div>
  );
}
