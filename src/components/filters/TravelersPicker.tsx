"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  onChange: (count: number) => void;
  onClose: () => void;
}

export default function TravelersPicker({ value, onChange, onClose }: Props) {
  return (
    <div className="absolute top-full left-0 mt-2 w-[240px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Travelers</p>
            <p className="text-[11px] text-[var(--text-tertiary)]">Number of people</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange(Math.max(1, value - 1))}
              disabled={value <= 1}
              className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] disabled:opacity-30 disabled:hover:border-[var(--border-color)] disabled:hover:text-[var(--text-secondary)] transition-colors"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="text-lg font-bold text-[var(--text-primary)] min-w-[24px] text-center">
              {value}
            </span>
            <button
              onClick={() => onChange(Math.min(20, value + 1))}
              disabled={value >= 20}
              className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] disabled:opacity-30 transition-colors"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-[var(--brand-accent)] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    </div>
  );
}
