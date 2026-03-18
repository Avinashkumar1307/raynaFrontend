"use client";

import { useEffect, useRef } from "react";
import { FEATURED_DESTINATIONS } from "@/lib/constants";
import type { ContextLandmark } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  X,
  Plus,
  UserPlus,
  Heart,
  Star,
  SlidersHorizontal,
  DollarSign,
} from "lucide-react";

interface ContextSidebarProps {
  destination: string | null;
  landmark?: ContextLandmark | null;
  searchQuery: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSendPrompt: (text: string) => void;
}

export default function ContextSidebar({
  destination,
  landmark,
  searchQuery,
  isOpen,
  onClose,
  onSendPrompt,
}: ContextSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  // Close on outside click (mobile only)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      function handleOutside(e: MouseEvent) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target as Node)
        ) {
          onClose();
        }
      }
      document.addEventListener("mousedown", handleOutside);
      cleanup = () => document.removeEventListener("mousedown", handleOutside);
    }, 100);

    let cleanup = () => {};
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [isOpen, onClose]);

  const trendingDestinations = FEATURED_DESTINATIONS.slice(0, 6);
  const inspirationDestinations = FEATURED_DESTINATIONS.slice(2, 6);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={[
          "flex flex-col",
          "fixed inset-y-0 right-0 z-50 w-80",
          "lg:relative lg:inset-auto lg:z-auto lg:w-96 lg:shrink-0",
          "bg-[var(--bg-secondary)] border-l border-[var(--border-color)]",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Top action bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-[var(--brand-accent)] text-[var(--bg-primary)] rounded-lg text-xs font-semibold px-3 gap-1.5"
            >
              <Plus className="size-3.5" />
              Create a Trip
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs font-medium px-3 gap-1.5 border-[var(--border-color)]"
            >
              <UserPlus className="size-3.5" />
              Invite
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Filter tags row */}
        <div
          className="flex items-center gap-2 px-4 py-3 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {destination && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1.5 text-xs font-medium bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] shrink-0 h-auto gap-1"
            >
              <MapPin className="size-3" />
              {destination}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1.5 text-xs font-medium bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 shrink-0 cursor-pointer h-auto gap-1"
          >
            <DollarSign className="size-3" />
            On a Budget
            <button className="ml-1 hover:text-[var(--text-primary)]">
              <X className="size-3" />
            </button>
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1.5 text-xs font-medium bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] shrink-0 cursor-pointer hover:text-[var(--text-primary)] h-auto gap-1"
          >
            <SlidersHorizontal className="size-3" />
            Filters
          </Badge>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Trending Destinations */}
          <div className="px-4 pt-2 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Trending Destinations
              </h3>
              <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors">
                Explore
              </button>
            </div>

            {/* Horizontal scrollable cards */}
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {trendingDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => {
                    onSendPrompt(`Show me tours in ${dest.name}`);
                    onClose();
                  }}
                  className="relative flex-shrink-0 w-36 h-44 rounded-2xl overflow-hidden group"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      img.parentElement!.style.background =
                        "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Heart & share icons */}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Heart className="size-3.5 text-white" />
                    </div>
                  </div>

                  {/* Emoji badge */}
                  <div className="absolute top-2 left-2">
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-sm">{dest.emoji}</span>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <p className="text-sm font-semibold text-white">
                      {dest.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-white/80">4.4</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Get inspiration section */}
          <div className="px-4 pt-2 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Get inspiration for your next trip
              </h3>
              <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors">
                Explore
              </button>
            </div>

            {/* 2-column card grid */}
            <div className="grid grid-cols-2 gap-3">
              {inspirationDestinations.map((dest) => (
                <button
                  key={`insp-${dest.name}`}
                  onClick={() => {
                    onSendPrompt(`Tours in ${dest.name}`);
                    onClose();
                  }}
                  className="flex flex-col rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all group text-left"
                >
                  <div className="relative h-24 w-full overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = "none";
                        img.parentElement!.style.background =
                          "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Heart className="size-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 rounded-md bg-[var(--bg-card-hover)] text-[var(--text-secondary)] mb-1.5 h-auto font-medium"
                    >
                      {dest.emoji} Hotel
                    </Badge>
                    <p className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                      {dest.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="size-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        4.4
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1 line-clamp-2">
                      Beautiful destination with amazing tours and experiences.
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
