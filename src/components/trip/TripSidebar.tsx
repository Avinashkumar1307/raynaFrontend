"use client";

import { useState } from "react";
import { useTrip } from "@/context/TripContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MapPin, Calendar, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TripSidebar({ isOpen, onClose }: Props) {
  const { trips, activeTrip, createTrip, deleteTrip, setActiveTrip } = useTrip();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDest, setNewDest] = useState("");

  function handleCreate() {
    if (!newName.trim() || !newDest.trim()) return;
    createTrip(newName.trim(), newDest.trim());
    setNewName("");
    setNewDest("");
    setShowCreate(false);
  }

  return (
    <aside
      className={cn(
        "fixed md:relative inset-y-0 left-0 z-30 w-[280px] bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <h2 className="text-sm font-bold text-[var(--text-primary)]">My Trips</h2>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowCreate(!showCreate)}
          className="text-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/10"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="px-4 py-3 border-b border-[var(--border-color)] space-y-2 bg-[var(--bg-card)]">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Trip name"
            className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
            autoFocus
          />
          <input
            type="text"
            value={newDest}
            onChange={(e) => setNewDest(e.target.value)}
            placeholder="Destination"
            className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!newName.trim() || !newDest.trim()}
              className="flex-1 rounded-xl text-xs h-8"
            >
              Create Trip
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreate(false)}
              className="rounded-xl text-xs h-8 text-[var(--text-secondary)]"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Trip list */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mb-3">
              <Calendar className="size-6 text-[var(--text-tertiary)]" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">No trips yet</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 max-w-[180px]">
              Create your first trip to start planning
            </p>
            <Button
              size="sm"
              onClick={() => setShowCreate(true)}
              className="mt-3 rounded-xl text-xs gap-1"
            >
              <Plus className="size-3" /> Create Trip
            </Button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {trips.map((trip) => (
              <div
                key={trip.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTrip(trip.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveTrip(trip.id); }}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-xl transition-all group cursor-pointer",
                  activeTrip?.id === trip.id
                    ? "bg-[var(--brand-accent)]/10 ring-1 ring-[var(--brand-accent)]/30"
                    : "hover:bg-[var(--bg-card)]"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{trip.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="size-3 text-[var(--text-tertiary)]" />
                      <span className="text-[11px] text-[var(--text-secondary)] truncate">{trip.destination}</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                      {trip.days.length} {trip.days.length === 1 ? "day" : "days"} &middot; {trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
