"use client";

import { useMemo } from "react";
import { useTrip } from "@/context/TripContext";
import { MapPin, Building, Plane, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function TripCostSummary() {
  const { activeTrip, getDayTotal, getTripTotal } = useTrip();
  const [showDayBreakdown, setShowDayBreakdown] = useState(false);

  const breakdown = useMemo(() => {
    if (!activeTrip) return null;

    let activitiesTotal = 0;
    let hotelsTotal = 0;
    let flightsTotal = 0;

    activeTrip.days.forEach((day) => {
      activitiesTotal += day.activities.reduce((sum, a) => sum + a.price, 0);
      hotelsTotal += day.hotel?.pricePerNight ?? 0;
      flightsTotal += day.flight?.price ?? 0;
    });

    const grandTotal = activitiesTotal + hotelsTotal + flightsTotal;

    return { activitiesTotal, hotelsTotal, flightsTotal, grandTotal };
  }, [activeTrip]);

  if (!activeTrip || !breakdown || breakdown.grandTotal === 0) return null;

  return (
    <div className="px-4 sm:px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      {/* Category breakdown */}
      <div className="space-y-1.5 mb-2">
        {breakdown.activitiesTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
              <MapPin className="size-3 text-emerald-500" />
              Activities ({activeTrip.days.reduce((sum, d) => sum + d.activities.length, 0)})
            </span>
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              AED {breakdown.activitiesTotal.toLocaleString()}
            </span>
          </div>
        )}
        {breakdown.hotelsTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
              <Building className="size-3 text-blue-500" />
              Hotels ({activeTrip.days.filter((d) => d.hotel).length} {activeTrip.days.filter((d) => d.hotel).length === 1 ? "night" : "nights"})
            </span>
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              AED {breakdown.hotelsTotal.toLocaleString()}
            </span>
          </div>
        )}
        {breakdown.flightsTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
              <Plane className="size-3 text-purple-500" />
              Flights ({activeTrip.days.filter((d) => d.flight).length})
            </span>
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              AED {breakdown.flightsTotal.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Day-by-day toggle */}
      {activeTrip.days.length > 1 && (
        <button
          onClick={() => setShowDayBreakdown(!showDayBreakdown)}
          className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors mb-2"
        >
          {showDayBreakdown ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          {showDayBreakdown ? "Hide" : "Show"} daily breakdown
        </button>
      )}

      {showDayBreakdown && (
        <div className="space-y-1 mb-2 pl-1 border-l-2 border-[var(--border-color)] ml-1">
          {activeTrip.days.map((day) => {
            const dayTotal = getDayTotal(day);
            if (dayTotal === 0) return null;
            return (
              <div key={day.id} className="flex items-center justify-between pl-2">
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  Day {day.dayNumber}
                  <span className="ml-1 opacity-60">
                    {[
                      day.activities.length > 0 && `${day.activities.length} act.`,
                      day.hotel && "hotel",
                      day.flight && "flight",
                    ].filter(Boolean).join(" + ")}
                  </span>
                </span>
                <span className="text-[10px] font-medium text-[var(--text-tertiary)]">
                  AED {dayTotal.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Grand total */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
        <span className="text-sm font-semibold text-[var(--text-primary)]">Trip Total</span>
        <span className="text-base font-bold text-[var(--text-primary)]">
          AED {breakdown.grandTotal.toLocaleString()}
        </span>
      </div>

      {/* Per person if travelers > 1 */}
      {activeTrip.travelers > 1 && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-[var(--text-tertiary)]">
            Per person ({activeTrip.travelers} travelers)
          </span>
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
            AED {Math.round(breakdown.grandTotal / activeTrip.travelers).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
