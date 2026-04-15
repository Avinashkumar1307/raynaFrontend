"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { TripFilters } from "@/lib/types";

interface FilterContextType {
  filters: TripFilters;
  setDestination: (destination: string | null) => void;
  setDateRange: (start: string | null, end: string | null) => void;
  setTravelers: (count: number) => void;
  setBudgetRange: (min: number | null, max: number | null) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: TripFilters = {
  destination: null,
  dateRange: { start: null, end: null },
  travelers: 1,
  budgetRange: { min: null, max: null },
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<TripFilters>(defaultFilters);

  const setDestination = useCallback((destination: string | null) => {
    setFilters((prev) => ({ ...prev, destination }));
  }, []);

  const setDateRange = useCallback((start: string | null, end: string | null) => {
    setFilters((prev) => ({ ...prev, dateRange: { start, end } }));
  }, []);

  const setTravelers = useCallback((count: number) => {
    setFilters((prev) => ({ ...prev, travelers: Math.max(1, count) }));
  }, []);

  const setBudgetRange = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, budgetRange: { min, max } }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters =
    filters.destination !== null ||
    filters.dateRange.start !== null ||
    filters.dateRange.end !== null ||
    filters.travelers !== 1 ||
    filters.budgetRange.min !== null ||
    filters.budgetRange.max !== null;

  return (
    <FilterContext.Provider
      value={{ filters, setDestination, setDateRange, setTravelers, setBudgetRange, clearFilters, hasActiveFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
