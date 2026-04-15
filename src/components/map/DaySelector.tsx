"use client";

import type { TripDay } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, Clock, Building } from "lucide-react";

interface Props {
  days: TripDay[];
  selectedDayId: string | null;
  onSelectDay: (dayId: string) => void;
}

export default function DaySelector({ days, selectedDayId, onSelectDay }: Props) {
  return (
    <div className="flex gap-2 p-3 overflow-x-auto border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      {days.map((day) => {
        const isActive = selectedDayId === day.id;
        const actCount = day.activities.length;
        const firstTime = day.activities[0]?.startTime;
        const lastTime = day.activities[actCount - 1]?.endTime || day.activities[actCount - 1]?.startTime;
        const timeRange = firstTime ? (lastTime && lastTime !== firstTime ? `${firstTime}–${lastTime}` : firstTime) : null;

        return (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            className={cn(
              "flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl text-left transition-all whitespace-nowrap min-w-[90px]",
              isActive
                ? "bg-[var(--brand-accent)] text-white shadow-md"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)]"
            )}
          >
            <span className="text-xs font-bold">Day {day.dayNumber}</span>
            <div className="flex items-center gap-1">
              <MapPin className="size-2.5" />
              <span className="text-[10px]">
                {actCount} {actCount === 1 ? "stop" : "stops"}
                {day.hotel ? " + hotel" : ""}
              </span>
            </div>
            {timeRange && (
              <div className="flex items-center gap-1">
                <Clock className="size-2.5" />
                <span className="text-[10px]">{timeRange}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
