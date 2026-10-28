import type { ReactNode } from "react";
import { launch } from "@/config/launch";
import { launchNav, mainNav } from "@/config/nav";
import { cartCatalog, searchIndex, searchLinks } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Header, footer and floating WhatsApp button around every page (plus the announcement bar when the shop is open). */
export function SiteChrome({ overlay = false, children }: { overlay?: boolean; children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-[90] bg-brown px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      {launch.shop && <AnnouncementBar />}
      <Header
        overlay={overlay}
        shop={launch.shop}
        cart={launch.shop || launch.cart}
        menus={launch.shop ? mainNav : []}
        links={launch.shop ? [] : launchNav}
        searchItems={launch.shop ? searchIndex() : []}
        searchLinks={launch.shop ? searchLinks() : []}
        cartCatalogue={launch.shop || launch.cart ? cartCatalog() : []}
      />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
