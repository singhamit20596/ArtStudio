import { SiteChrome } from "@/components/layout/SiteChrome";

/** Every page except the homepage: solid white header from the start. */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
