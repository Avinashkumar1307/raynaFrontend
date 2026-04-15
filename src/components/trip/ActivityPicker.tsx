"use client";

import { useState } from "react";
import { useSaved } from "@/context/SavedContext";
import { useTrip } from "@/context/TripContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  MapPin,
  Clock,
  Heart,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tripId: string;
  dayId: string;
  onClose: () => void;
}

type Tab = "saved" | "manual";

export default function ActivityPicker({ tripId, dayId, onClose }: Props) {
  const { items: savedItems } = useSaved();
  const { addActivity } = useTrip();
  const [activeTab, setActiveTab] = useState<Tab>(savedItems.length > 0 ? "saved" : "manual");

  // Manual form state
  const [manualTitle, setManualTitle] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [manualDuration, setManualDuration] = useState("");

  function handleAddFromSaved(item: (typeof savedItems)[0]) {
    addActivity(tripId, dayId, {
      title: item.title,
      image: item.image,
      location: item.location,
      price: item.price,
      currency: item.currency,
      duration: item.duration,
      type: item.type === "holiday" ? "activity" : item.type,
    });
    onClose();
  }

  function handleAddManual() {
    if (!manualTitle.trim()) return;
    addActivity(tripId, dayId, {
      title: manualTitle.trim(),
      location: manualLocation.trim(),
      price: Number(manualPrice) || 0,
      currency: "AED",
      startTime: manualTime || undefined,
      duration: manualDuration || undefined,
      type: "activity",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Add Activity</h3>
          <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab("saved")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors",
              activeTab === "saved"
                ? "text-[var(--brand-accent)] border-b-2 border-[var(--brand-accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Heart className="size-3.5" /> From Saved
            {savedItems.length > 0 && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-auto">{savedItems.length}</Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors",
              activeTab === "manual"
                ? "text-[var(--brand-accent)] border-b-2 border-[var(--brand-accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <PenLine className="size-3.5" /> Add Manually
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[360px] overflow-y-auto">
          {activeTab === "saved" ? (
            <div className="p-4">
              {savedItems.length === 0 ? (
                <div className="text-center py-10">
                  <Heart className="size-8 text-[var(--text-tertiary)] mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-[var(--text-tertiary)]">No saved items yet</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] mt-1">Save tours from chat to add them here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-accent)]/30 transition-colors"
                    >
                      {item.image ? (
                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[var(--bg-card)] flex items-center justify-center flex-shrink-0">
                          <MapPin className="size-4 text-[var(--text-tertiary)]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-0.5">
                            <MapPin className="size-2.5" /> {item.location}
                          </span>
                          {item.duration && (
                            <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-0.5">
                              <Clock className="size-2.5" /> {item.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs font-bold text-[var(--text-primary)]">AED {item.price}</p>
                        <button
                          onClick={() => handleAddFromSaved(item)}
                          className="mt-1 flex items-center gap-0.5 text-[10px] font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent)]/80"
                        >
                          <Plus className="size-3" /> Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Activity name *"
                className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                autoFocus
              />
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Location"
                className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  placeholder="Price (AED)"
                  min={0}
                  className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                />
                <input
                  type="time"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                />
              </div>
              <input
                type="text"
                value={manualDuration}
                onChange={(e) => setManualDuration(e.target.value)}
                placeholder="Duration (e.g. 2 hours)"
                className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
              />
              <Button
                onClick={handleAddManual}
                disabled={!manualTitle.trim()}
                className="w-full rounded-xl text-xs h-9"
              >
                <Plus className="size-3 mr-1" /> Add Activity
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
