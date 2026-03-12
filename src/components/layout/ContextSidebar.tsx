"use client";

import { useEffect, useRef, useMemo } from "react";
import { FEATURED_DESTINATIONS } from "@/lib/constants";
import type { ContextLandmark } from "@/lib/types";

interface ContextSidebarProps {
  destination: string | null;
  landmark?: ContextLandmark | null;
  searchQuery: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSendPrompt: (text: string) => void;
}

const QUICK_ACTIONS = [
  "City tours",
  "Desert safari",
  "Water activities",
  "Sightseeing",
  "Adventure tours",
  "Cultural experiences",
];

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

  const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Country-level destinations need a wider zoom (6) vs city (11) vs landmark (15)
  const COUNTRY_LEVEL = new Set([
    "thailand", "malaysia", "turkey", "georgia", "azerbaijan", "oman",
    "india", "egypt", "sri lanka", "nepal", "vietnam", "japan",
    "indonesia", "france", "uk", "usa",
  ]);
  const REGION_LEVEL = new Set([
    "kerala", "rajasthan", "maldives", "mauritius", "bali", "phuket",
    "goa", "munnar",
  ]);

  function getZoom(dest: string): number {
    const d = dest.toLowerCase();
    if (COUNTRY_LEVEL.has(d)) return 6;
    if (REGION_LEVEL.has(d)) return 9;
    return 11; // city default
  }

  // Build map embed URL — always use search mode so multiple attraction pins appear on the map.
  const mapSrc = useMemo(() => {
    // Priority 1: specific landmark — show viewpoints/attractions near it
    if (landmark) {
      const q = `viewpoints near ${landmark.mapQuery}`;
      if (GOOGLE_MAPS_KEY) {
        return `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(q)}&zoom=14`;
      }
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=14`;
    }

    // Priority 2: city/country — show top tourist attractions with pins
    if (destination) {
      const zoom = getZoom(destination);
      const d = destination.toLowerCase();
      const q = COUNTRY_LEVEL.has(d)
        ? `top tourist spots ${destination}`
        : `tourist attractions ${destination}`;
      if (GOOGLE_MAPS_KEY) {
        return `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(q)}&zoom=${zoom}`;
      }
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=${zoom}`;
    }

    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landmark, destination, GOOGLE_MAPS_KEY]);

  // Header label: show landmark name when available, else destination
  const mapLabel = landmark ? `${landmark.emoji} ${landmark.name}` : destination ?? "Explore Map";

  // Quick actions — landmark gets nearby options; country gets broad options; city gets default
  const nearbyActions = landmark
    ? [
        landmark.nearbyLabel,
        `Tours near ${landmark.name}`,
        `Hotels near ${landmark.name}`,
        `Restaurants near ${landmark.name}`,
      ]
    : destination && COUNTRY_LEVEL.has(destination.toLowerCase())
    ? [
        `Best places to visit in ${destination}`,
        `${destination} tour packages`,
        `${destination} beach holidays`,
        `${destination} adventure tours`,
        `${destination} cultural experiences`,
        `${destination} family trips`,
      ]
    : QUICK_ACTIONS;

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
          // Mobile: fixed drawer from right
          "fixed inset-y-0 right-0 z-50 w-80",
          // Desktop: static column
          "lg:relative lg:inset-auto lg:z-auto lg:w-96 lg:shrink-0",
          // Theme
          "bg-[var(--bg-secondary)] border-l border-[var(--border-color)]",
          "transition-transform duration-300 ease-in-out",
          // Desktop always visible, mobile slides
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[var(--accent)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <p className="text-xs font-bold text-[var(--text-primary)] tracking-tight">
              {mapLabel}
            </p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col">
          {mapSrc ? (
            <>
              {/* Map fills available space */}
              <div className="relative w-full flex-1 overflow-hidden" style={{ minHeight: "350px" }}>
                <iframe
                  key={mapSrc}
                  src={mapSrc}
                  className="absolute inset-x-0 top-0 w-full border-0"
                  style={{ height: "calc(100% + 60px)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${destination || "location"}`}
                />
                {/* Overlay to hide "Open in Google Maps" / "View larger map" links */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-10 bg-[var(--bg-secondary)]"
                  style={{ height: "40px", pointerEvents: "none" }}
                />
              </div>

              {/* Quick actions below map */}
              {(destination || landmark) && (
                <div className="px-4 pt-4 pb-3 border-t border-[var(--border-color)] shrink-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] opacity-60 mb-2">
                    {landmark ? `Near ${landmark.name}` : "Explore more"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {nearbyActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          const isCountry = destination && COUNTRY_LEVEL.has(destination.toLowerCase());
                          const prompt = landmark || isCountry
                            ? action
                            : `${action} in ${destination}`;
                          onSendPrompt(prompt);
                          onClose();
                        }}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Default state — no destination detected yet */
            <div className="p-4 space-y-6">
              {/* Default map showing Dubai overview */}
              <div className="relative w-full rounded-xl overflow-hidden" style={{ height: "200px" }}>
                <iframe
                  src={
                    GOOGLE_MAPS_KEY
                      ? `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_KEY}&q=top+tourist+attractions+Dubai&zoom=11`
                      : `https://www.google.com/maps?q=tourist+attractions+Dubai&output=embed&z=11`
                  }
                  className="absolute inset-x-0 top-0 w-full border-0"
                  style={{ height: "calc(100% + 60px)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Default map"
                />
                {/* Overlay to hide "Open in Google Maps" / "View larger map" links */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-10 bg-[var(--bg-secondary)]"
                  style={{ height: "40px", pointerEvents: "none" }}
                />
              </div>

              {/* Get started */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Get started
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Ask about a destination to see it on the map.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.slice(0, 4).map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        onSendPrompt(`${action} in Dubai`);
                        onClose();
                      }}
                      className="text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured destinations */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                  Popular destinations
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {FEATURED_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => {
                        onSendPrompt(`Show me tours in ${dest.name}`);
                        onClose();
                      }}
                      className="relative h-20 rounded-xl overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all group"
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        crossOrigin="anonymous"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          img.parentElement!.style.background =
                            "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                      <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                        <span className="text-sm">{dest.emoji}</span>
                        <span className="text-xs font-semibold text-white">
                          {dest.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
