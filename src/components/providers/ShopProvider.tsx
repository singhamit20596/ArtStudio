"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { createLocalStore } from "@/lib/local-store";

/**
 * Wishlist and cart state, kept in the visitor's browser for now.
 * Phase 3 adds cart lines, coupons and checkout; Phase 4 syncs signed-in users to Supabase.
 */
export interface CartLine {
  slug: string;
  quantity: number;
  variant?: string;
}

interface ShopState {
  wishlist: string[];
  isWishlisted: (slug: string) => boolean;
  /** Returns true when the item was added, false when removed. */
  toggleWishlist: (slug: string) => boolean;
  cart: CartLine[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopState | null>(null);

const NO_SLUGS: string[] = [];
const NO_LINES: CartLine[] = [];
const wishlistStore = createLocalStore<string[]>("artstudio.wishlist", NO_SLUGS);
const cartStore = createLocalStore<CartLine[]>("artstudio.cart", NO_LINES);

export function ShopProvider({ children }: { children: ReactNode }) {
  const wishlist = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.get, wishlistStore.server);
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.server);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleWishlist = useCallback((slug: string) => {
    const list = wishlistStore.get();
    const added = !list.includes(slug);
    wishlistStore.set(added ? [...list, slug] : list.filter((s) => s !== slug));
    return added;
  }, []);

  const value = useMemo<ShopState>(
    () => ({
      wishlist,
      isWishlisted: (slug) => wishlist.includes(slug),
      toggleWishlist,
      cart,
      cartCount: cart.reduce((n, line) => n + line.quantity, 0),
      cartOpen,
      setCartOpen,
    }),
    [wishlist, toggleWishlist, cart, cartOpen],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
