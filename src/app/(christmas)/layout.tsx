import { christmas } from "@/config/christmas";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { FestiveEffects } from "@/components/effects/FestiveEffects";

/** The Christmas page: the whole page, header and footer included, wears the Christmas colours. Snow and "Jingle Bells" over the whole page as it opens (FestiveEffects). */
export default function ChristmasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={christmas.theme}>
      <SiteChrome overlay>{children}</SiteChrome>
      <FestiveEffects effect="christmas" />
    </div>
  );
}
