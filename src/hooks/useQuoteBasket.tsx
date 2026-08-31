"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/catalog";

export type QuoteItem = {
  id: string;
  name: string;
  category: string;
  unit: "kg" | "meter";
  quantity: number;
  shade: string;
  image?: string;
  price?: number;
};

type QuoteBasketContextType = {
  items: QuoteItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, defaultQty?: number, defaultShade?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateShade: (id: string, shade: string) => void;
  clearBasket: () => void;
  totalItems: number;
};

const STORAGE_KEY = "mapps_quote_basket";

function getInitialBasket(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => {
        if (!item || typeof item !== "object") return false;
        const obj = item as Record<string, unknown>;
        return Boolean(obj["id"]) && Boolean(obj["name"]);
      })
      .map((item) => ({
        id: String(item["id"]),
        name: String(item["name"] || "Fabric"),
        category: String(item["category"] || "Fabric"),
        unit: item["unit"] === "meter" ? "meter" : "kg",
        quantity:
          typeof item["quantity"] === "number" && !isNaN(item["quantity"]) && item["quantity"] > 0
            ? item["quantity"]
            : 50,
        shade: String(item["shade"] || "Standard Stock Shade"),
        image: item["image"] ? String(item["image"]) : "",
        price: typeof item["price"] === "number" ? item["price"] : 0,
      }));
  } catch {
    // Corrupt or unavailable localStorage (private browsing, quota) — start
    // with an empty basket rather than crashing.
    return [];
  }
}

const QuoteBasketContext = createContext<QuoteBasketContextType | undefined>(undefined);

export function QuoteBasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(getInitialBasket);
  const [isOpen, setIsOpen] = useState(false);

  const saveItems = (newItems: QuoteItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Best-effort persistence — safe to ignore (private browsing, quota).
    }
  };

  const addItem = (
    product: Product,
    defaultQty = product.unit === "kg" ? 50 : 100,
    defaultShade = "Standard Stock Shade",
  ) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === product.id);
      const existing = existingIndex > -1 ? prevItems[existingIndex] : undefined;
      let updated: QuoteItem[];
      if (existing) {
        updated = [...prevItems];
        updated[existingIndex] = {
          ...existing,
          quantity: (existing.quantity || 0) + defaultQty,
        };
      } else {
        const newItem: QuoteItem = {
          id: product.id,
          name: product.name,
          category: product.category,
          unit: product.unit,
          quantity: defaultQty,
          shade: defaultShade,
          image: product.image,
          price: product.price,
        };
        updated = [...prevItems, newItem];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Best-effort persistence — safe to ignore (private browsing, quota).
      }
      return updated;
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const updated = prevItems.filter((i) => i.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Best-effort persistence — safe to ignore (private browsing, quota).
      }
      return updated;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) => {
      const updated = prevItems.map((i) => (i.id === id ? { ...i, quantity } : i));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Best-effort persistence — safe to ignore (private browsing, quota).
      }
      return updated;
    });
  };

  const updateShade = (id: string, shade: string) => {
    setItems((prevItems) => {
      const updated = prevItems.map((i) => (i.id === id ? { ...i, shade } : i));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Best-effort persistence — safe to ignore (private browsing, quota).
      }
      return updated;
    });
  };

  const clearBasket = () => {
    saveItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <QuoteBasketContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        updateShade,
        clearBasket,
        totalItems,
      }}
    >
      {children}
    </QuoteBasketContext.Provider>
  );
}

export function useQuoteBasket() {
  const context = useContext(QuoteBasketContext);
  if (!context) {
    // Safe fallback if hook is used outside provider
    return {
      items: [],
      isOpen: false,
      setIsOpen: () => {},
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      updateShade: () => {},
      clearBasket: () => {},
      totalItems: 0,
    };
  }
  return context;
}
