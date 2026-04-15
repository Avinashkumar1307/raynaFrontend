"use client";

import { X } from "lucide-react";

interface Props {
  startDate: string | null;
  endDate: string | null;
  onChange: (start: string | null, end: string | null) => void;
  onClose: () => void;
}

const presets = [
  { label: "This weekend", getRange: () => getWeekend() },
  { label: "Next week", getRange: () => getNextWeek() },
  { label: "Next month", getRange: () => getNextMonth() },
];

function pad(n: number) { return n.toString().padStart(2, "0"); }
function toISO(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function getWeekend() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const sat = new Date(now);
  sat.setDate(now.getDate() + (6 - dayOfWeek));
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  return { start: toISO(sat), end: toISO(sun) };
}

function getNextWeek() {
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() + (8 - now.getDay()));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return { start: toISO(mon), end: toISO(sun) };
}

function getNextMonth() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  return { start: toISO(start), end: toISO(end) };
}

export default function DatePicker({ startDate, endDate, onChange, onClose }: Props) {
  const today = toISO(new Date());

  return (
    <div className="absolute top-full left-0 mt-2 w-[300px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-[var(--text-secondary)] mb-1.5 block">Start Date</label>
            <input
              type="date"
              value={startDate || ""}
              min={today}
              onChange={(e) => onChange(e.target.value || null, endDate)}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[var(--text-secondary)] mb-1.5 block">End Date</label>
            <input
              type="date"
              value={endDate || ""}
              min={startDate || today}
              onChange={(e) => onChange(startDate, e.target.value || null)}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Quick picks</p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const range = preset.getRange();
                  onChange(range.start, range.end);
                  onClose();
                }}
                className="px-3 py-1.5 bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs font-medium rounded-lg hover:bg-[var(--brand-accent)]/10 hover:text-[var(--brand-accent)] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {(startDate || endDate) && (
          <button
            onClick={() => { onChange(null, null); onClose(); }}
            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
          >
            <X className="size-3" /> Clear dates
          </button>
        )}
      </div>
    </div>
  );
}
