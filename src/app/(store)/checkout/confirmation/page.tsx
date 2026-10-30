import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationView } from "@/components/checkout/ConfirmationView";
import { T } from "@/i18n/T";

export const metadata: Metadata = {
  title: "Order placed",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return (
    <div className="container-x pt-10 pb-20 md:pt-14 md:pb-28">
      <Suspense
        fallback={
          <p className="py-20 text-muted">
            <T en="Loading your order…" hi="आपका ऑर्डर खुल रहा है…" />
          </p>
        }
      >
        <ConfirmationView />
      </Suspense>
    </div>
  );
}
