import { diwali } from "@/config/diwali";
import { SiteChrome } from "@/components/layout/SiteChrome";

/** The Diwali page: the whole page, header and footer included, wears the Diwali colours. */
export default function DiwaliLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={diwali.theme}>
      <SiteChrome overlay>{children}</SiteChrome>
    </div>
  );
}
