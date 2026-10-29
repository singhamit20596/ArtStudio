import { christmas } from "@/config/christmas";
import { SiteChrome } from "@/components/layout/SiteChrome";

/** The Christmas page: the whole page, header and footer included, wears the Christmas colours. */
export default function ChristmasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={christmas.theme}>
      <SiteChrome overlay>{children}</SiteChrome>
    </div>
  );
}
