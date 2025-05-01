"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Cart, CartItem } from "@/lib/types";

type CartContextType = {
  cart: Cart | null;
  addItem: (
    restaurantInfo: { id: string; name: string; deliveryFee: number },
    item: CartItem
  ) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (
    restaurantInfo: { id: string; name: string; deliveryFee: number },
    item: CartItem
  ) => {
    if (!cart || cart.restaurantId !== restaurantInfo.id) {
      setCart({
        restaurantId: restaurantInfo.id,
        restaurantName: restaurantInfo.name,
        deliveryFee: restaurantInfo.deliveryFee,
        items: [item],
      });
      return;
    }

    // Same restaurant? Update or insert item
    const existing = cart.items.find((i) => i.itemId === item.itemId);
    const updatedItems = existing
      ? cart.items.map((i) =>
          i.itemId === item.itemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      : [...cart.items, item];

    setCart({
      ...cart,
      items: updatedItems,
    });
  };

  const removeItem = (itemId: string) => {
    if (!cart) return;
    const updatedItems = cart.items.filter((i) => i.itemId !== itemId);
    if (updatedItems.length === 0) {
      setCart(null);
    } else {
      setCart({ ...cart, items: updatedItems });
    }
  };

  const clearCart = () => setCart(null);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
