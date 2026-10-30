import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { AppLink } from "@/components/ui/AppLink";
import { T } from "@/i18n/T";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="container-x flex flex-col items-center py-24 text-center md:py-32">
        <p className="eyebrow">
          <T en="Page not found" hi="पेज नहीं मिला" />
        </p>
        <h1 className="mt-4 text-[30px] font-semibold leading-tight md:text-[40px]">
          <T en="This piece has moved on" hi="यह पीस अब यहाँ नहीं है" />
        </h1>
        <p className="mt-4 max-w-md text-muted">
          <T
            en="The page you were looking for is not here. It may have moved, or it may open later as the studio grows."
            hi="आप जो पेज ढूँढ़ रहे थे, वह यहाँ नहीं है। हो सकता है वह कहीं और चला गया हो, या स्टूडियो के बढ़ने के साथ बाद में खुले।"
          />
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AppLink href="/" className="btn btn-dark">
            <T en="Back to the homepage" hi="होमपेज पर वापस जाएँ" />
          </AppLink>
          <AppLink href="/request" className="btn btn-outline">
            <T en="Request a frame" hi="फ़्रेम बनवाएँ" />
          </AppLink>
        </div>
      </div>
    </SiteChrome>
  );
}
