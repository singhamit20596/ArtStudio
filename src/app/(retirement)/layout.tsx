import { SiteChrome } from "@/components/layout/SiteChrome";
import { FestiveEffects } from "@/components/effects/FestiveEffects";
import { serviceTheme } from "@/components/tribute/ServiceDecor";

/** The Retirement Gifts page: the whole page, header and footer included, wears the service colours (navy, brass, parchment). Falling gold stars and a brass fanfare over the whole page as it opens (FestiveEffects). */
export default function RetirementLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={serviceTheme}>
      <SiteChrome overlay>{children}</SiteChrome>
      <FestiveEffects effect="retirement" />
    </div>
  );
}
