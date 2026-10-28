import type { ReactNode } from "react";
import { launch } from "@/config/launch";
import { launchCta, launchNav, mainNav } from "@/config/nav";
import { cartCatalog, searchIndex, searchLinks } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Announcement bar, header, footer and floating WhatsApp button around every page. */
export function SiteChrome({ overlay = false, children }: { overlay?: boolean; children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-[90] bg-brown px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header
        overlay={overlay}
        shop={launch.shop}
        menus={launch.shop ? mainNav : []}
        links={launch.shop ? [] : launchNav}
        cta={launch.shop ? undefined : launchCta}
        searchItems={launch.shop ? searchIndex() : []}
        searchLinks={launch.shop ? searchLinks() : []}
        cartCatalogue={launch.shop ? cartCatalog() : []}
      />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
