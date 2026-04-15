"use client";

import { useState, useRef, useEffect } from "react";
import { useFilters } from "@/context/FilterContext";
import { MapPin, Calendar, Users, Wallet, X } from "lucide-react";
import DestinationPicker from "./DestinationPicker";
import DatePicker from "./DatePicker";
import TravelersPicker from "./TravelersPicker";
import BudgetPicker from "./BudgetPicker";
import { cn } from "@/lib/utils";

type OpenPicker = "where" | "when" | "who" | "budget" | null;

export default function TopFilterBar() {
  const { filters, setDestination, setDateRange, setTravelers, setBudgetRange, clearFilters, hasActiveFilters } = useFilters();
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Close picker on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenPicker(null);
      }
    }
    if (openPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openPicker]);

  function togglePicker(picker: OpenPicker) {
    setOpenPicker((prev) => (prev === picker ? null : picker));
  }

  function formatDateRange() {
    if (!filters.dateRange.start && !filters.dateRange.end) return null;
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const parts: string[] = [];
    if (filters.dateRange.start) parts.push(new Date(filters.dateRange.start + "T00:00").toLocaleDateString("en-US", opts));
    if (filters.dateRange.end) parts.push(new Date(filters.dateRange.end + "T00:00").toLocaleDateString("en-US", opts));
    return parts.join(" - ");
  }

  function formatBudget() {
    if (filters.budgetRange.min === null && filters.budgetRange.max === null) return null;
    if (filters.budgetRange.max === null) return `$${filters.budgetRange.min}+`;
    if (filters.budgetRange.min === null || filters.budgetRange.min === 0) return `Up to $${filters.budgetRange.max}`;
    return `$${filters.budgetRange.min}-$${filters.budgetRange.max}`;
  }

  const pills = [
    {
      key: "where" as const,
      icon: MapPin,
      label: "Where",
      value: filters.destination,
      active: !!filters.destination,
    },
    {
      key: "when" as const,
      icon: Calendar,
      label: "When",
      value: formatDateRange(),
      active: !!filters.dateRange.start || !!filters.dateRange.end,
    },
    {
      key: "who" as const,
      icon: Users,
      label: `${filters.travelers} traveler${filters.travelers !== 1 ? "s" : ""}`,
      value: filters.travelers > 1 ? `${filters.travelers}` : null,
      active: filters.travelers > 1,
    },
    {
      key: "budget" as const,
      icon: Wallet,
      label: "Budget",
      value: formatBudget(),
      active: filters.budgetRange.min !== null || filters.budgetRange.max !== null,
    },
  ];

  return (
    <div ref={barRef} className="relative flex items-center gap-2 px-4 sm:px-6 py-2.5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      {pills.map((pill) => {
        const Icon = pill.icon;
        return (
          <button
            key={pill.key}
            onClick={() => togglePicker(pill.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
              openPicker === pill.key
                ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]"
                : pill.active
                  ? "border-[var(--brand-accent)]/50 bg-[var(--brand-accent)]/5 text-[var(--brand-accent)]"
                  : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Icon className="size-3.5" />
            {pill.value || pill.label}
          </button>
        );
      })}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
        >
          <X className="size-3" />
          Clear
        </button>
      )}

      {/* Pickers */}
      {openPicker === "where" && (
        <DestinationPicker
          value={filters.destination}
          onChange={setDestination}
          onClose={() => setOpenPicker(null)}
        />
      )}
      {openPicker === "when" && (
        <DatePicker
          startDate={filters.dateRange.start}
          endDate={filters.dateRange.end}
          onChange={setDateRange}
          onClose={() => setOpenPicker(null)}
        />
      )}
      {openPicker === "who" && (
        <TravelersPicker
          value={filters.travelers}
          onChange={setTravelers}
          onClose={() => setOpenPicker(null)}
        />
      )}
      {openPicker === "budget" && (
        <BudgetPicker
          min={filters.budgetRange.min}
          max={filters.budgetRange.max}
          onChange={setBudgetRange}
          onClose={() => setOpenPicker(null)}
        />
      )}
    </div>
  );
}
