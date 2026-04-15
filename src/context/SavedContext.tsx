"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { SavedItem } from "@/lib/types";

interface SavedContextType {
  items: SavedItem[];
  saveItem: (item: SavedItem) => void;
  unsaveItem: (id: string) => void;
  isSaved: (id: string) => boolean;
  getSavedByType: (type: SavedItem["type"]) => SavedItem[];
  clearSaved: () => void;
  totalSaved: number;
}

const SavedContext = createContext<SavedContextType | null>(null);

const SAVED_STORAGE_KEY = "rayna_saved";

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const saveItem = useCallback((item: SavedItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, { ...item, savedAt: Date.now() }];
    });
  }, []);

  const unsaveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isSaved = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const getSavedByType = useCallback(
    (type: SavedItem["type"]) => items.filter((i) => i.type === type),
    [items]
  );

  const clearSaved = useCallback(() => setItems([]), []);

  const totalSaved = items.length;

  return (
    <SavedContext.Provider
      value={{ items, saveItem, unsaveItem, isSaved, getSavedByType, clearSaved, totalSaved }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within SavedProvider");
  return ctx;
}
