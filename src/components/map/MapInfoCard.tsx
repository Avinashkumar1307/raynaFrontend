"use client";

import type { MapPin } from "@/lib/types";
import { X, MapPin as MapPinIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  pin: MapPin;
  onClose: () => void;
}

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  tours: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", label: "Tour" },
  hotels: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Hotel" },
  activities: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", label: "Activity" },
  restaurants: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Restaurant" },
  all: { bg: "bg-gray-500/10", text: "text-gray-600 dark:text-gray-400", label: "Place" },
};

export default function MapInfoCard({ pin, onClose }: Props) {
  const typeStyle = typeColors[pin.type] || typeColors.all;

  return (
    <div className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden z-10 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex">
        {pin.image && (
          <div className="w-24 h-24 flex-shrink-0 bg-[var(--bg-card)]">
            <img src={pin.image} alt={pin.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 rounded-full font-semibold border-0 h-auto mb-1 ${typeStyle.bg} ${typeStyle.text}`}>
                {typeStyle.label}
              </Badge>
              <h4 className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-1">{pin.title}</h4>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
            >
              <X className="size-3.5" />
            </button>
          </div>
          {pin.description && (
            <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">{pin.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            {pin.time && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                <Clock className="size-3" /> {pin.time}
              </span>
            )}
            {pin.price != null && (
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {pin.currency || "$"}{pin.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
