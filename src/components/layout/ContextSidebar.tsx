"use client";

import { useEffect, useRef, useMemo } from "react";
import { FEATURED_DESTINATIONS } from "@/lib/constants";

interface ContextSidebarProps {
  destination: string | null;
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

  // Build the Google Maps embed query from user context
  const mapQuery = useMemo(() => {
    if (searchQuery && destination) {
      return `${searchQuery} ${destination}`;
    }
    if (destination) {
      return `things to do in ${destination}`;
    }
    return null;
  }, [destination, searchQuery]);

  const mapSrc = useMemo(() => {
    if (!mapQuery) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=12`;
  }, [mapQuery]);

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
              {destination ? destination : "Explore Map"}
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
              <div className="relative w-full flex-1" style={{ minHeight: "350px" }}>
                <iframe
                  key={mapSrc}
                  src={mapSrc}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${destination || "location"}`}
                />
              </div>

              {/* Quick actions below map */}
              {destination && (
                <div className="px-4 pt-4 pb-3 border-t border-[var(--border-color)] shrink-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] opacity-60 mb-2">
                    Explore more
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          onSendPrompt(`${action} in ${destination}`);
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
                  src={`https://www.google.com/maps?q=${encodeURIComponent("Dubai tourist attractions")}&output=embed&z=11`}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Default map"
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
