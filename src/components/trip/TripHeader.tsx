"use client";

import { useState } from "react";
import { useTrip } from "@/context/TripContext";
import { MapPin, Calendar, Users, Pencil, Check } from "lucide-react";

export default function TripHeader() {
  const { activeTrip, updateTrip, getTripTotal } = useTrip();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");

  if (!activeTrip) return null;

  const total = getTripTotal(activeTrip);

  function handleSaveName() {
    if (name.trim() && activeTrip) {
      updateTrip(activeTrip.id, { name: name.trim() });
    }
    setEditingName(false);
  }

  function startEditing() {
    setName(activeTrip!.name);
    setEditingName(true);
  }

  return (
    <div className="px-4 sm:px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="flex items-center gap-2 mb-2">
        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              className="flex-1 text-lg font-bold bg-transparent border-b-2 border-[var(--brand-accent)] text-[var(--text-primary)] outline-none pb-0.5"
              autoFocus
            />
            <button onClick={handleSaveName} className="text-[var(--brand-accent)]">
              <Check className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[var(--text-primary)]">{activeTrip.name}</h1>
            <button
              onClick={startEditing}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Pencil className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {activeTrip.destination}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {activeTrip.days.length} {activeTrip.days.length === 1 ? "day" : "days"}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          {activeTrip.travelers} traveler{activeTrip.travelers !== 1 ? "s" : ""}
        </span>
        {total > 0 && (
          <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
            AED {total.toLocaleString()} total
          </span>
        )}
      </div>
    </div>
  );
}
