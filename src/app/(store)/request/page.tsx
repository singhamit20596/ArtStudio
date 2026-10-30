import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/listing/Breadcrumbs";
import { RequestForm } from "@/components/tribute/RequestForm";
import { RequestFormFromUrl } from "@/components/tribute/RequestFormFromUrl";
import { T } from "@/i18n/T";

export const metadata: Metadata = {
  title: "Request a tribute frame",
  description: "Tell us the service, rank and name, and what should go inside. We reply on WhatsApp with the layout and the final price.",
};

export default function RequestPage() {
  return (
    <div className="container-x pb-20 md:pb-28">
      <div className="pt-6 pb-8 md:pt-8 md:pb-12">
        <Breadcrumbs items={[{ label: "Request a frame", hi: "फ़्रेम बनवाएँ" }]} />
        <p className="eyebrow mt-8 md:mt-12">
          <T en="Retirement tribute frame" hi="रिटायरमेंट ट्रिब्यूट फ़्रेम" />
        </p>
        <h1 className="mt-3 text-[32px] font-semibold leading-[1.1] md:text-[44px]">
          <T en="Request a frame" hi="फ़्रेम बनवाएँ" />
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
          <T
            en="Four short steps, about two minutes. Nothing to pay now: we agree the design and the price with you on WhatsApp."
            hi="चार छोटे चरण, लगभग दो मिनट। अभी कुछ भुगतान नहीं करना है: डिज़ाइन और कीमत हम WhatsApp पर आपके साथ तय करते हैं।"
          />
        </p>
      </div>
      <Suspense fallback={<RequestForm initial={{}} />}>
        <RequestFormFromUrl />
      </Suspense>
    </div>
  );
}
