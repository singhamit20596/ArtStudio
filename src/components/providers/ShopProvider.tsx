"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { createLocalStore } from "@/lib/local-store";
import { lineKey, MAX_QTY, type CartLine } from "@/lib/pricing";

/**
 * Wishlist, cart, saved-for-later and coupon state, kept in the visitor's browser.
 * Phase 4 syncs signed-in customers to Supabase.
 */
export type { CartLine };

interface ShopState {
  wishlist: string[];
  isWishlisted: (slug: string) => boolean;
  /** Returns true when the item was added, false when removed. */
  toggleWishlist: (slug: string) => boolean;

  cart: CartLine[];
  saved: CartLine[];
  cartCount: number;
  /** Adds (or tops up) a line, never beyond `max`. Returns the new quantity in the cart. */
  addToCart: (line: CartLine, max: number) => number;
  setQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  saveForLater: (key: string) => void;
  moveToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  clearCart: () => void;

  couponCode: string;
  setCouponCode: (code: string) => void;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  offersOpen: boolean;
  setOffersOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopState | null>(null);

const NO_SLUGS: string[] = [];
const NO_LINES: CartLine[] = [];
const wishlistStore = createLocalStore<string[]>("artstudio.wishlist", NO_SLUGS);
const cartStore = createLocalStore<CartLine[]>("artstudio.cart", NO_LINES);
const savedStore = createLocalStore<CartLine[]>("artstudio.saved", NO_LINES);
const couponStore = createLocalStore<string>("artstudio.coupon", "");

const without = (lines: CartLine[], key: string) => lines.filter((l) => lineKey(l) !== key);

export function ShopProvider({ children }: { children: ReactNode }) {
  const wishlist = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.get, wishlistStore.server);
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.server);
  const saved = useSyncExternalStore(savedStore.subscribe, savedStore.get, savedStore.server);
  const couponCode = useSyncExternalStore(couponStore.subscribe, couponStore.get, couponStore.server);
  const [cartOpen, setCartOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);

  const toggleWishlist = useCallback((slug: string) => {
    const list = wishlistStore.get();
    const added = !list.includes(slug);
    wishlistStore.set(added ? [...list, slug] : list.filter((s) => s !== slug));
    return added;
  }, []);

  const addToCart = useCallback((line: CartLine, max: number) => {
    const key = lineKey(line);
    const lines = cartStore.get();
    const existing = lines.find((l) => lineKey(l) === key);
    const quantity = Math.min((existing?.quantity ?? 0) + line.quantity, max, MAX_QTY);
    cartStore.set(existing ? lines.map((l) => (lineKey(l) === key ? { ...l, quantity } : l)) : [...lines, { ...line, quantity }]);
    savedStore.set(without(savedStore.get(), key));
    return quantity;
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    cartStore.set(cartStore.get().map((l) => (lineKey(l) === key ? { ...l, quantity: Math.max(1, Math.min(quantity, MAX_QTY)) } : l)));
  }, []);

  const removeFromCart = useCallback((key: string) => cartStore.set(without(cartStore.get(), key)), []);

  const saveForLater = useCallback((key: string) => {
    const line = cartStore.get().find((l) => lineKey(l) === key);
    if (!line) return;
    cartStore.set(without(cartStore.get(), key));
    savedStore.set([line, ...without(savedStore.get(), key)]);
  }, []);

  const moveToCart = useCallback((key: string) => {
    const line = savedStore.get().find((l) => lineKey(l) === key);
    if (!line) return;
    savedStore.set(without(savedStore.get(), key));
    cartStore.set([...without(cartStore.get(), key), line]);
  }, []);

  const removeSaved = useCallback((key: string) => savedStore.set(without(savedStore.get(), key)), []);

  const clearCart = useCallback(() => {
    cartStore.set(NO_LINES);
    couponStore.set("");
  }, []);

  const setCouponCode = useCallback((code: string) => couponStore.set(code.trim().toUpperCase()), []);

  const value = useMemo<ShopState>(
    () => ({
      wishlist,
      isWishlisted: (slug) => wishlist.includes(slug),
      toggleWishlist,
      cart,
      saved,
      cartCount: cart.reduce((n, line) => n + line.quantity, 0),
      addToCart,
      setQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      removeSaved,
      clearCart,
      couponCode,
      setCouponCode,
      cartOpen,
      setCartOpen,
      offersOpen,
      setOffersOpen,
    }),
    [wishlist, toggleWishlist, cart, saved, addToCart, setQuantity, removeFromCart, saveForLater, moveToCart, removeSaved, clearCart, couponCode, setCouponCode, cartOpen, offersOpen],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
