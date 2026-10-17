import { SiteChrome } from "@/components/layout/SiteChrome";

/** The homepage gets the transparent-over-hero header; other pages use the (store) group (Phase 2). */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome overlay>{children}</SiteChrome>;
}
