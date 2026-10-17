"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

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

/** A tiny localStorage-backed store for useSyncExternalStore (safe when storage is blocked). */
function createLocalStore<T>(key: string, fallback: T) {
  let value: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    get: (): T => (value === undefined ? (value = read()) : value),
    server: (): T => fallback,
    set(next: T) {
      value = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage unavailable (private mode, blocked): keep it in memory */
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        value = read();
        listeners.forEach((l) => l());
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

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
