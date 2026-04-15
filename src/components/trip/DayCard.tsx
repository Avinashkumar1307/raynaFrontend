"use client";

import { useState } from "react";
import type { TripDay } from "@/lib/types";
import { useTrip } from "@/context/TripContext";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Building,
  Plane,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ActivityPicker from "./ActivityPicker";
import HotelPicker from "./HotelPicker";
import FlightPicker from "./FlightPicker";

interface Props {
  day: TripDay;
  tripId: string;
  destination: string;
  isExpanded?: boolean;
}

export default function DayCard({ day, tripId, destination, isExpanded: defaultExpanded = true }: Props) {
  const { removeDay, removeActivity, setHotel, setFlight, getDayTotal } = useTrip();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showPicker, setShowPicker] = useState(false);
  const [showHotelPicker, setShowHotelPicker] = useState(false);
  const [showFlightPicker, setShowFlightPicker] = useState(false);

  const dayTotal = getDayTotal(day);

  return (
    <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] overflow-hidden">
      {/* Day header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded(!expanded); }}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-accent)]/10 flex items-center justify-center">
            <span className="text-sm font-bold text-[var(--brand-accent)]">D{day.dayNumber}</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Day {day.dayNumber}</p>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              {day.activities.length} {day.activities.length === 1 ? "activity" : "activities"}
              {day.hotel && " + Hotel"}
              {day.flight && " + Flight"}
              {dayTotal > 0 && ` · AED ${dayTotal.toLocaleString()}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); removeDay(tripId, day.id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="size-3.5" />
          </button>
          {expanded ? <ChevronUp className="size-4 text-[var(--text-tertiary)]" /> : <ChevronDown className="size-4 text-[var(--text-tertiary)]" />}
        </div>
      </div>

      {/* Day content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Activities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Activities</h4>
              <button
                onClick={() => setShowPicker(true)}
                className="flex items-center gap-1 text-[11px] font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent)]/80"
              >
                <Plus className="size-3" /> Add
              </button>
            </div>

            {day.activities.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-xs text-[var(--text-tertiary)]">No activities added yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPicker(true)}
                  className="mt-2 rounded-xl text-[11px] h-7 gap-1"
                >
                  <Plus className="size-3" /> Add Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {day.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] group"
                  >
                    {activity.image ? (
                      <img src={activity.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[var(--brand-accent)]/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="size-4 text-[var(--brand-accent)]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {activity.startTime && (
                          <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-tertiary)]">
                            <Clock className="size-2.5" /> {activity.startTime}
                          </span>
                        )}
                        {activity.duration && (
                          <span className="text-[10px] text-[var(--text-tertiary)]">{activity.duration}</span>
                        )}
                      </div>
                    </div>
                    {activity.price > 0 && (
                      <span className="text-xs font-bold text-[var(--text-primary)] flex-shrink-0">
                        AED {activity.price}
                      </span>
                    )}
                    <button
                      onClick={() => removeActivity(tripId, day.id, activity.id)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 transition-all flex-shrink-0"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hotel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="size-3" /> Hotel
              </h4>
              {!day.hotel && (
                <button
                  onClick={() => setShowHotelPicker(true)}
                  className="flex items-center gap-1 text-[11px] font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent)]/80"
                >
                  <Plus className="size-3" /> Add
                </button>
              )}
            </div>
            {day.hotel ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] group">
                {day.hotel.image ? (
                  <img src={day.hotel.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Building className="size-4 text-blue-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{day.hotel.name}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                    {day.hotel.location}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs font-bold text-[var(--text-primary)]">AED {day.hotel.pricePerNight}</span>
                  <p className="text-[9px] text-[var(--text-tertiary)]">/night</p>
                </div>
                <button
                  onClick={() => setHotel(tripId, day.id, null)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 transition-all flex-shrink-0"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowHotelPicker(true)}
                className="w-full py-3 rounded-xl border border-dashed border-[var(--border-color)] text-[11px] text-[var(--text-tertiary)] hover:border-[var(--brand-accent)]/50 hover:text-[var(--brand-accent)] transition-colors flex items-center justify-center gap-1.5"
              >
                <Building className="size-3.5" />
                Add Hotel for this day
              </button>
            )}
          </div>

          {/* Flight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                <Plane className="size-3" /> Flight
              </h4>
              {!day.flight && (
                <button
                  onClick={() => setShowFlightPicker(true)}
                  className="flex items-center gap-1 text-[11px] font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent)]/80"
                >
                  <Plus className="size-3" /> Add
                </button>
              )}
            </div>
            {day.flight ? (
              <div className="px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[var(--brand-accent)]">
                    {day.flight.airline || "Flight"} {day.flight.flightNumber || ""}
                  </span>
                  <button
                    onClick={() => setFlight(tripId, day.id, null)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 transition-all"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-[12px] font-bold text-[var(--text-primary)]">{day.flight.departureTime || "--:--"}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">{day.flight.departure}</p>
                  </div>
                  <div className="flex-1 flex items-center px-1">
                    <div className="flex-1 h-px bg-[var(--border-color)]" />
                    <Plane className="size-3 text-[var(--text-tertiary)] mx-1 rotate-90" />
                    <div className="flex-1 h-px bg-[var(--border-color)]" />
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-[var(--text-primary)]">{day.flight.arrivalTime || "--:--"}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">{day.flight.arrival}</p>
                  </div>
                  <span className="text-xs font-bold text-[var(--text-primary)] ml-2">AED {day.flight.price}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowFlightPicker(true)}
                className="w-full py-3 rounded-xl border border-dashed border-[var(--border-color)] text-[11px] text-[var(--text-tertiary)] hover:border-[var(--brand-accent)]/50 hover:text-[var(--brand-accent)] transition-colors flex items-center justify-center gap-1.5"
              >
                <Plane className="size-3.5" />
                Add Flight for this day
              </button>
            )}
          </div>

          {/* Day total */}
          {dayTotal > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Day Total</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                AED {dayTotal.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Pickers */}
      {showPicker && (
        <ActivityPicker
          tripId={tripId}
          dayId={day.id}
          onClose={() => setShowPicker(false)}
        />
      )}
      {showHotelPicker && (
        <HotelPicker
          tripId={tripId}
          dayId={day.id}
          destination={destination}
          onClose={() => setShowHotelPicker(false)}
        />
      )}
      {showFlightPicker && (
        <FlightPicker
          tripId={tripId}
          dayId={day.id}
          destination={destination}
          onClose={() => setShowFlightPicker(false)}
        />
      )}
    </div>
  );
}
