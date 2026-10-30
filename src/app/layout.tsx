import type { Metadata, Viewport } from "next";
import "./globals.css";
import { poppins, poppinsDevanagari } from "./fonts";
import { site } from "@/config/site";
import { ShopProvider } from "@/components/providers/ShopProvider";
import { Toaster } from "@/components/ui/Toaster";
import { PreviewLinkGuard } from "@/components/layout/PreviewLinkGuard";
import { LANG_SCRIPT } from "@/i18n/lang";

const title = `${site.name} · Retirement gifts for defence personnel`;

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    title,
    description: site.description,
    images: [{ url: "/products/box-frame/tile.jpg", width: 900, height: 1125, alt: "Retirement tribute box frame with medals, badges and a name plate" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#5a3e2b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the language script below may switch lang/data-lang before React hydrates.
    <html lang="en-IN" className={`${poppins.variable} ${poppinsDevanagari.variable}`} suppressHydrationWarning>
      <head>
        {/* Hindi or English (src/i18n/lang.ts): applied before the first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
      </head>
      <body>
        <ShopProvider>
          {children}
          <Toaster />
          <PreviewLinkGuard />
        </ShopProvider>
      </body>
    </html>
  );
}
