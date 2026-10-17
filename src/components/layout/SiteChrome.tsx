import type { ReactNode } from "react";
import { mainNav } from "@/config/nav";
import { searchIndex, searchLinks } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PreviewRibbon } from "./PreviewRibbon";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Announcement bar, header, footer and floating WhatsApp button around every page. */
export function SiteChrome({ overlay = false, children }: { overlay?: boolean; children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-[90] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <PreviewRibbon />
      <AnnouncementBar />
      <Header overlay={overlay} menus={mainNav} searchItems={searchIndex()} searchLinks={searchLinks()} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
