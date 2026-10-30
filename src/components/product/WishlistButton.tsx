"use client";

import clsx from "clsx";
import { Heart } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { toast } from "@/components/ui/Toaster";
import { useLang } from "@/i18n/use-lang";

export function WishlistButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const { isWishlisted, toggleWishlist } = useShop();
  const active = isWishlisted(slug);
  const hi = useLang() === "hi";

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={hi ? (active ? `${name} को विशलिस्ट से हटाएँ` : `${name} को विशलिस्ट में रखें`) : active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={() => (toggleWishlist(slug) ? toast("Saved to your wishlist", "आपकी विशलिस्ट में रख लिया") : toast("Removed from your wishlist", "आपकी विशलिस्ट से हटा दिया"))}
      className={clsx(
        "grid h-9 w-9 place-items-center rounded-full bg-sage text-[#1e140d] shadow-[0_2px_10px_rgb(90_62_43/0.25)] transition hover:scale-105",
        className,
      )}
    >
      <Heart size={17} strokeWidth={1.7} className={clsx(active && "fill-amber")} />
    </button>
  );
}
