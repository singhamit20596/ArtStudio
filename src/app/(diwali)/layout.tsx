import { diwali } from "@/config/diwali";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { FestiveEffects } from "@/components/effects/FestiveEffects";

/** The Diwali page: the whole page, header and footer included, wears the Diwali colours. Fireworks and a festive tune over the whole page as it opens (FestiveEffects). */
export default function DiwaliLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={diwali.theme}>
      <SiteChrome overlay>{children}</SiteChrome>
      <FestiveEffects effect="diwali" />
    </div>
  );
}
