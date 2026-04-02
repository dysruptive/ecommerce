"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const STORAGE_KEY = "cart";

let listeners: (() => void)[] = [];

function emitChange() {
  for (const listener of listeners) listener();
}

const EMPTY_CART: CartItem[] = [];
let cachedRaw: string | null = null;
let cachedSnapshot: CartItem[] = EMPTY_CART;

function getSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    cachedSnapshot = raw ? JSON.parse(raw) : EMPTY_CART;
    return cachedSnapshot;
  } catch {
    return EMPTY_CART;
  }
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function setItems(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitChange();
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const current = getSnapshot();
      const key = item.variantId
        ? `${item.productId}-${item.variantId}`
        : item.productId;
      const existing = current.find((i) =>
        i.variantId
          ? `${i.productId}-${i.variantId}` === key
          : i.productId === key,
      );

      if (existing) {
        setItems(
          current.map((i) =>
            i === existing
              ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
              : i,
          ),
        );
      } else {
        setItems([...current, { ...item, quantity: item.quantity ?? 1 }]);
      }
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string, variantId?: string) => {
      const current = getSnapshot();
      setItems(
        current.filter(
          (i) =>
            !(
              i.productId === productId &&
              (variantId ? i.variantId === variantId : !i.variantId)
            ),
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }
      const current = getSnapshot();
      setItems(
        current.map((i) =>
          i.productId === productId &&
          (variantId ? i.variantId === variantId : !i.variantId)
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount };
}
