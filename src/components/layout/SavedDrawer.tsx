"use client";

import { useState } from "react";
import { useSaved } from "@/context/SavedContext";
import { useTrip } from "@/context/TripContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  X,
  MapPin,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { key: "all", label: "All" },
  { key: "tour", label: "Tours" },
  { key: "holiday", label: "Holidays" },
  { key: "cruise", label: "Cruises" },
  { key: "yacht", label: "Yachts" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  tour: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", label: "Tour" },
  holiday: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Holiday" },
  cruise: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", label: "Cruise" },
  yacht: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Yacht" },
};

function formatPrice(price: number): string {
  return price >= 1000 ? price.toLocaleString() : price.toString();
}

export default function SavedDrawer({ isOpen, onClose }: Props) {
  const { items, unsaveItem, clearSaved, totalSaved, getSavedByType } = useSaved();
  const { activeTrip, addActivity } = useTrip();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filteredItems = activeTab === "all" ? items : getSavedByType(activeTab);

  function handleAddToTrip(item: (typeof items)[0]) {
    if (!activeTrip || activeTrip.days.length === 0) return;
    const firstDay = activeTrip.days[0];
    addActivity(activeTrip.id, firstDay.id, {
      title: item.title,
      image: item.image,
      location: item.location,
      price: item.price,
      currency: item.currency,
      duration: item.duration,
      type: item.type === "holiday" ? "activity" : item.type,
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-[360px] sm:w-[400px] sm:max-w-[400px] p-0 flex flex-col bg-[var(--bg-primary)]"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between px-5 py-4 border-b border-[var(--border-color)] gap-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart className="size-4.5 text-red-500" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-[var(--text-primary)]">
                Saved Items
              </SheetTitle>
              {totalSaved > 0 && (
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {totalSaved} {totalSaved === 1 ? "item" : "items"} saved
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl"
            aria-label="Close saved"
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex gap-1.5 px-4 py-3 border-b border-[var(--border-color)] overflow-x-auto">
          {tabs.map((tab) => {
            const count = tab.key === "all" ? totalSaved : getSavedByType(tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.key
                    ? "bg-[var(--brand-accent)] text-white"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-80">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Items */}
        <ScrollArea className="flex-1">
          <div className="px-4 py-3">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mb-4">
                  <Heart className="size-7 text-[var(--text-tertiary)]" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  No saved items
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1.5 max-w-[220px]">
                  Tap the heart icon on tours and activities to save them here
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="mt-4 rounded-xl text-xs font-medium border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Continue Browsing
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item, index) => {
                  const typeStyle = typeColors[item.type] || typeColors.tour;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden hover:border-[var(--text-tertiary)]/30 transition-colors animate-[staggerIn_0.4s_ease-out_both]"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="relative h-28 w-full bg-[var(--bg-card-hover)] overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        <div className="absolute top-2.5 left-2.5">
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold border-0 h-auto", typeStyle.bg, typeStyle.text)}
                          >
                            {typeStyle.label}
                          </Badge>
                        </div>

                        <button
                          onClick={() => unsaveItem(item.id)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors group"
                          aria-label="Remove saved item"
                        >
                          <Trash2 className="size-3.5 text-white/80 group-hover:text-white" />
                        </button>

                        <div className="absolute bottom-2.5 right-2.5">
                          <div className="bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1">
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[10px] text-[var(--text-tertiary)] line-through block leading-none mb-0.5">
                                {item.currency} {formatPrice(item.originalPrice)}
                              </span>
                            )}
                            <span className="text-sm font-bold text-[var(--text-primary)]">
                              {item.currency} {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <h4 className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          {item.location && (
                            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                              <MapPin className="size-3 shrink-0" />
                              <span className="truncate max-w-[120px]">{item.location}</span>
                            </span>
                          )}
                          {item.duration && (
                            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                              <Clock className="size-3 shrink-0" />
                              {item.duration}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2.5">
                          {activeTrip && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddToTrip(item)}
                              className="flex-1 rounded-xl text-[11px] font-medium h-7 gap-1 border-[var(--border-color)]"
                            >
                              <Plus className="size-3" />
                              Add to Trip
                            </Button>
                          )}
                          <a
                            href={item.url || "https://www.raynatours.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent-green)] hover:underline"
                          >
                            View Details
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {items.length > 0 && (
          <div className="mt-auto border-t border-[var(--border-color)] px-5 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSaved}
              className="w-full text-xs text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/5 rounded-xl gap-1.5"
            >
              <Trash2 className="size-3" />
              Clear all saved items
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
