"use client";

import clsx from "clsx";
import { Heart } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { toast } from "@/components/ui/Toaster";

export function WishlistButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const { isWishlisted, toggleWishlist } = useShop();
  const active = isWishlisted(slug);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={() => toast(toggleWishlist(slug) ? "Saved to your wishlist" : "Removed from your wishlist")}
      className={clsx(
        "grid h-9 w-9 place-items-center rounded-full bg-sage text-[#1e140d] shadow-[0_2px_10px_rgb(90_62_43/0.25)] transition hover:scale-105",
        className,
      )}
    >
      <Heart size={17} strokeWidth={1.7} className={clsx(active && "fill-amber")} />
    </button>
  );
}
