"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
  onClose: () => void;
}

const presets = [
  { label: "Budget", min: 0, max: 500, icon: "💰" },
  { label: "Mid-range", min: 500, max: 2000, icon: "💎" },
  { label: "Luxury", min: 2000, max: null, icon: "👑" },
];

export default function BudgetPicker({ min, max, onChange, onClose }: Props) {
  const activePreset = presets.find(
    (p) => p.min === min && p.max === max
  );

  return (
    <div className="absolute top-full right-0 mt-2 w-[280px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Quick select</p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  onChange(preset.min, preset.max);
                  onClose();
                }}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center",
                  activePreset?.label === preset.label
                    ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/10"
                    : "border-[var(--border-color)] hover:border-[var(--brand-accent)]/50"
                )}
              >
                <span className="text-lg">{preset.icon}</span>
                <span className="text-[11px] font-medium text-[var(--text-primary)]">{preset.label}</span>
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  {preset.max ? `$${preset.min}-$${preset.max}` : `$${preset.min}+`}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Custom range (USD)</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={min ?? ""}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null, max)}
              placeholder="Min"
              min={0}
              className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
            />
            <span className="text-[var(--text-tertiary)] text-xs">to</span>
            <input
              type="number"
              value={max ?? ""}
              onChange={(e) => onChange(min, e.target.value ? Number(e.target.value) : null)}
              placeholder="Max"
              min={0}
              className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
            />
          </div>
        </div>

        {(min !== null || max !== null) && (
          <button
            onClick={() => { onChange(null, null); onClose(); }}
            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
          >
            <X className="size-3" /> Clear budget
          </button>
        )}
      </div>
    </div>
  );
}
