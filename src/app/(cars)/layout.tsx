import { cars } from "@/config/cars";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { FestiveEffects } from "@/components/effects/FestiveEffects";

/** The Car Gifts page: the whole page, header and footer included, wears the racing colours. Racing cars, a race start and an engine rev over the whole page as it opens (FestiveEffects). */
export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cars.theme}>
      <SiteChrome overlay>{children}</SiteChrome>
      <FestiveEffects effect="cars" />
    </div>
  );
}
