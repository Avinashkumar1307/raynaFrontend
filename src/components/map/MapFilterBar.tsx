"use client";

import type { MapServiceFilter } from "@/lib/types";
import { MapPin, Building, Compass, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  activeFilter: MapServiceFilter;
  onChange: (filter: MapServiceFilter) => void;
}

const filters: { key: MapServiceFilter; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: MapPin },
  { key: "tours", label: "Tours", icon: Compass },
  { key: "hotels", label: "Hotels", icon: Building },
  { key: "activities", label: "Activities", icon: MapPin },
  { key: "restaurants", label: "Food", icon: UtensilsCrossed },
];

export default function MapFilterBar({ activeFilter, onChange }: Props) {
  return (
    <div className="flex gap-1.5 p-2">
      {filters.map((f) => {
        const Icon = f.icon;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
              activeFilter === f.key
                ? "bg-[var(--brand-accent)] text-white shadow-sm"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
            )}
          >
            <Icon className="size-3.5" />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
