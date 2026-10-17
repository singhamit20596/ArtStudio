import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { AppLink } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="container-x flex flex-col items-center py-24 text-center md:py-32">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-4 text-[30px] font-semibold leading-tight md:text-[40px]">This piece has moved on</h1>
        <p className="mt-4 max-w-md text-muted">The page you were looking for is not here. It may have sold out or been renamed.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AppLink href="/shop" className="btn btn-dark">
            Shop all
          </AppLink>
          <AppLink href="/search" className="btn btn-outline">
            Search
          </AppLink>
        </div>
      </div>
    </SiteChrome>
  );
}
