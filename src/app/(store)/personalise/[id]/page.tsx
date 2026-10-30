import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { PersonaliseFlow } from "@/components/tribute/PersonaliseFlow";
import { T } from "@/i18n/T";

export const metadata: Metadata = {
  title: "Personalise your tribute",
  robots: { index: false },
};

/** Opened from the link after checkout (and in the order emails): /personalise/AS-…?t=… */
export default function PersonalisePage() {
  return (
    <div className="container-x pt-10 pb-20 md:pt-14 md:pb-28">
      <Suspense
        fallback={
          <p className="flex items-center gap-3 py-24" role="status">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" /> <T en="Opening your order…" hi="आपका ऑर्डर खुल रहा है…" />
          </p>
        }
      >
        <PersonaliseFlow />
      </Suspense>
    </div>
  );
}
