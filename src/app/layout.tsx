import type { Metadata, Viewport } from "next";
import "./globals.css";
import { poppins, poppinsDevanagari } from "./fonts";
import { site } from "@/config/site";
import { ShopProvider } from "@/components/providers/ShopProvider";
import { Toaster } from "@/components/ui/Toaster";
import { PreviewLinkGuard } from "@/components/layout/PreviewLinkGuard";

const title = `${site.name} · ${site.tagline} | Handmade resin art, pooja thalis & tribute frames`;

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
    images: [{ url: "/products/marble-noir-wall-clock/1.jpg", width: 720, height: 900, alt: "Marble Noir resin wall clock" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${poppinsDevanagari.variable}`}>
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
