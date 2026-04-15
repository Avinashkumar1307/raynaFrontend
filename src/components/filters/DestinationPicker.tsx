"use client";

import { useState, useMemo } from "react";
import { SUPPORTED_DESTINATIONS } from "@/lib/constants";
import { Search, X } from "lucide-react";

interface Props {
  value: string | null;
  onChange: (destination: string | null) => void;
  onClose: () => void;
}

export default function DestinationPicker({ value, onChange, onClose }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return SUPPORTED_DESTINATIONS.slice(0, 12);
    const q = search.toLowerCase();
    return SUPPORTED_DESTINATIONS.filter((d) => d.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="absolute top-full left-0 mt-2 w-[340px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--input-bg)] rounded-xl">
          <Search className="size-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
            autoFocus
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-3 max-h-[280px] overflow-y-auto">
        {value && (
          <button
            onClick={() => { onChange(null); onClose(); }}
            className="w-full text-left px-3 py-2 mb-2 text-xs font-medium text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
          >
            Clear destination
          </button>
        )}
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((dest) => (
            <button
              key={dest.name}
              onClick={() => { onChange(dest.name); onClose(); }}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all text-center ${
                value === dest.name
                  ? "bg-[var(--brand-accent)]/10 ring-1 ring-[var(--brand-accent)]"
                  : "hover:bg-[var(--bg-card)] hover:shadow-sm"
              }`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-card)]">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-[11px] font-medium text-[var(--text-primary)] leading-tight">
                {dest.emoji} {dest.name}
              </span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-xs text-[var(--text-tertiary)] py-6">No destinations found</p>
        )}
      </div>
    </div>
  );
}
