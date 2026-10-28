"use client";

import { Heart } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { AppLink } from "@/components/ui/AppLink";
import type { Product } from "@/lib/types";

/** Saved pieces, kept in this browser (synced to an account in Phase 4). */
export function WishlistView({ products }: { products: Product[] }) {
  const { wishlist } = useShop();
  const items = wishlist.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => p !== undefined);

  if (items.length === 0) {
    return (
      <div className="mount mb-20 flex flex-col items-center px-8 py-16 text-center">
        <Heart size={28} strokeWidth={1.5} className="text-brown" aria-hidden="true" />
        <p className="mt-4 text-[18px] font-medium">Nothing saved yet</p>
        <p className="mt-2 max-w-sm text-muted">Tap the heart on any piece to keep it here for later.</p>
        <AppLink href="/shop" className="btn btn-dark mt-7">
          Shop all
        </AppLink>
      </div>
    );
  }

  return (
    <>
      <p className="text-[13px] text-muted">
        {items.length} saved {items.length === 1 ? "piece" : "pieces"}. Saved on this device only.
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 pb-20 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 md:pb-28">
        {items.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 31vw, 46vw" />
          </li>
        ))}
      </ul>
    </>
  );
}
