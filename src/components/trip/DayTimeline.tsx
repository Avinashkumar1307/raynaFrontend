"use client";

import { useTrip } from "@/context/TripContext";
import DayCard from "./DayCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DayTimeline() {
  const { activeTrip, addDay } = useTrip();

  if (!activeTrip) return null;

  return (
    <div className="space-y-4 px-4 sm:px-6 py-4">
      {activeTrip.days.map((day, index) => (
        <div key={day.id} className="relative">
          {/* Timeline connector */}
          {index < activeTrip.days.length - 1 && (
            <div className="absolute left-[35px] top-[60px] bottom-[-16px] w-0.5 bg-[var(--border-color)]" />
          )}
          <DayCard
            day={day}
            tripId={activeTrip.id}
            destination={activeTrip.destination}
            isExpanded={index === 0}
          />
        </div>
      ))}

      <Button
        variant="outline"
        onClick={() => addDay(activeTrip.id)}
        className="w-full rounded-xl text-xs font-medium h-10 gap-1.5 border-dashed border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--brand-accent)] hover:border-[var(--brand-accent)]"
      >
        <Plus className="size-3.5" />
        Add Day {activeTrip.days.length + 1}
      </Button>
    </div>
  );
}
