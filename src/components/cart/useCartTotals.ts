"use client";

import { useMemo } from "react";
import { useShop } from "@/components/providers/ShopProvider";
import { priceCart, type CartProduct, type PaymentMethod } from "@/lib/pricing";

/** The visitor's cart priced against the catalogue (a preview; the server recomputes at checkout). */
export function useCartTotals(catalogue: CartProduct[], giftWrap = false, payment?: PaymentMethod) {
  const { cart, couponCode } = useShop();
  return useMemo(() => priceCart(cart, catalogue, { couponCode, giftWrap, payment }), [cart, catalogue, couponCode, giftWrap, payment]);
}
