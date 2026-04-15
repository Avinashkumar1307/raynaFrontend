"use client";

import { useState, useMemo } from "react";
import { useTrip } from "@/context/TripContext";
import { useSaved } from "@/context/SavedContext";
import { CartProvider } from "@/context/CartContext";
import TripSidebar from "@/components/trip/TripSidebar";
import TripHeader from "@/components/trip/TripHeader";
import DayTimeline from "@/components/trip/DayTimeline";
import TripCostSummary from "@/components/trip/TripCostSummary";
import SavedDrawer from "@/components/layout/SavedDrawer";
import GoogleMapProvider from "@/components/map/GoogleMapProvider";
import MapView from "@/components/map/MapView";
import DaySelector from "@/components/map/DaySelector";
import RoutePolyline from "@/components/map/RoutePolyline";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, Map, Calendar, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MapPin } from "@/lib/types";

// Default coordinates for destinations (cities + countries)
const DEST_COORDS: Record<string, { lat: number; lng: number }> = {
  // Countries
  "india": { lat: 28.6139, lng: 77.209 },
  "thailand": { lat: 13.7563, lng: 100.5018 },
  "indonesia": { lat: -8.3405, lng: 115.092 },
  "turkey": { lat: 41.0082, lng: 28.9784 },
  "france": { lat: 48.8566, lng: 2.3522 },
  "uk": { lat: 51.5074, lng: -0.1278 },
  "england": { lat: 51.5074, lng: -0.1278 },
  "usa": { lat: 40.7128, lng: -74.006 },
  "japan": { lat: 35.6762, lng: 139.6503 },
  "egypt": { lat: 30.0444, lng: 31.2357 },
  "uae": { lat: 25.2048, lng: 55.2708 },
  "oman": { lat: 23.5880, lng: 58.3829 },
  "italy": { lat: 41.9028, lng: 12.4964 },
  "spain": { lat: 40.4168, lng: -3.7038 },
  "greece": { lat: 37.9838, lng: 23.7275 },
  "australia": { lat: -33.8688, lng: 151.2093 },
  "malaysia": { lat: 3.139, lng: 101.6869 },
  "sri lanka": { lat: 6.9271, lng: 79.8612 },
  "nepal": { lat: 27.7172, lng: 85.324 },
  "china": { lat: 39.9042, lng: 116.4074 },
  "south korea": { lat: 37.5665, lng: 126.978 },
  "germany": { lat: 52.52, lng: 13.405 },
  "switzerland": { lat: 46.9481, lng: 7.4474 },
  "mexico": { lat: 19.4326, lng: -99.1332 },
  "brazil": { lat: -22.9068, lng: -43.1729 },
  "morocco": { lat: 33.9716, lng: -6.8498 },
  "south africa": { lat: -33.9249, lng: 18.4241 },
  "philippines": { lat: 14.5995, lng: 120.9842 },
  // Cities
  "dubai": { lat: 25.2048, lng: 55.2708 },
  "abu dhabi": { lat: 24.4539, lng: 54.3773 },
  "singapore": { lat: 1.3521, lng: 103.8198 },
  "bangkok": { lat: 13.7563, lng: 100.5018 },
  "bali": { lat: -8.3405, lng: 115.092 },
  "istanbul": { lat: 41.0082, lng: 28.9784 },
  "paris": { lat: 48.8566, lng: 2.3522 },
  "london": { lat: 51.5074, lng: -0.1278 },
  "new york": { lat: 40.7128, lng: -74.006 },
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "cairo": { lat: 30.0444, lng: 31.2357 },
  "maldives": { lat: 3.2028, lng: 73.2207 },
  "goa": { lat: 15.2993, lng: 74.124 },
  "delhi": { lat: 28.6139, lng: 77.209 },
  "new delhi": { lat: 28.6139, lng: 77.209 },
  "mumbai": { lat: 19.076, lng: 72.8777 },
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  "chennai": { lat: 13.0827, lng: 80.2707 },
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "hyderabad": { lat: 17.385, lng: 78.4867 },
  "jaipur": { lat: 26.9124, lng: 75.7873 },
  "kerala": { lat: 10.8505, lng: 76.2711 },
  "muscat": { lat: 23.5880, lng: 58.3829 },
  "phuket": { lat: 7.8804, lng: 98.3923 },
  "vietnam": { lat: 14.0583, lng: 108.2772 },
  "rome": { lat: 41.9028, lng: 12.4964 },
  "barcelona": { lat: 41.3874, lng: 2.1686 },
  "athens": { lat: 37.9838, lng: 23.7275 },
  "sydney": { lat: -33.8688, lng: 151.2093 },
  "kuala lumpur": { lat: 3.139, lng: 101.6869 },
  "hong kong": { lat: 22.3193, lng: 114.1694 },
  "seoul": { lat: 37.5665, lng: 126.978 },
  "berlin": { lat: 52.52, lng: 13.405 },
  "amsterdam": { lat: 52.3676, lng: 4.9041 },
  "zurich": { lat: 47.3769, lng: 8.5417 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  "miami": { lat: 25.7617, lng: -80.1918 },
  "cancun": { lat: 21.1619, lng: -86.8515 },
  "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "marrakech": { lat: 31.6295, lng: -7.9811 },
};

function getDestCoords(destination: string) {
  const key = destination.toLowerCase().trim();
  // Exact match
  if (DEST_COORDS[key]) return DEST_COORDS[key];
  // Partial match (e.g. "New Delhi, India" matches "new delhi")
  for (const [name, coords] of Object.entries(DEST_COORDS)) {
    if (key.includes(name) || name.includes(key)) return coords;
  }
  // Default fallback to center of world
  return { lat: 20, lng: 0 };
}

function TripPlannerContent() {
  const { activeTrip, createTrip } = useTrip();
  const { totalSaved } = useSaved();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Deterministic offset for pins without coordinates
  function offsetCoord(base: number, index: number, seed: number) {
    const angle = ((index * 137.5 + seed) % 360) * (Math.PI / 180);
    const radius = 0.005 + (index % 3) * 0.003;
    return base + Math.cos(angle) * radius;
  }

  // Build map pins from selected day's activities, hotel, and flight
  const mapData = useMemo(() => {
    if (!activeTrip) return { pins: [], path: [] };

    const dayToShow = selectedDayId
      ? activeTrip.days.find((d) => d.id === selectedDayId)
      : activeTrip.days[0];

    if (!dayToShow) return { pins: [], path: [] };

    const destCoords = getDestCoords(activeTrip.destination);
    const pins: MapPin[] = [];

    // Activity pins
    dayToShow.activities.forEach((activity, i) => {
      pins.push({
        id: activity.id,
        lat: activity.lat || offsetCoord(destCoords.lat, i, 1),
        lng: activity.lng || offsetCoord(destCoords.lng, i, 2),
        title: activity.title,
        description: [activity.location, activity.duration, activity.notes].filter(Boolean).join(" · "),
        type: "activities" as const,
        image: activity.image,
        price: activity.price,
        currency: activity.currency,
        time: activity.startTime || `Stop ${i + 1}`,
      });
    });

    // Hotel pin
    if (dayToShow.hotel) {
      const h = dayToShow.hotel;
      pins.push({
        id: h.id,
        lat: h.lat || offsetCoord(destCoords.lat, pins.length, 3),
        lng: h.lng || offsetCoord(destCoords.lng, pins.length, 4),
        title: h.name,
        description: `${h.location} · $${h.pricePerNight}/night`,
        type: "hotels" as const,
        image: h.image,
        price: h.pricePerNight,
        currency: h.currency,
      });
    }

    const path = pins.map((p) => ({ lat: p.lat, lng: p.lng }));
    return { pins, path };
  }, [activeTrip, selectedDayId]);

  const destCenter = activeTrip ? getDestCoords(activeTrip.destination) : undefined;

  return (
    <main className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <SavedDrawer isOpen={savedOpen} onClose={() => setSavedOpen(false)} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <TripSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[var(--text-secondary)]"
            >
              <Menu className="size-5" />
            </Button>
            <h1 className="text-base font-semibold text-[var(--text-primary)]">Trip Planner</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSavedOpen(true)}
              className="rounded-xl text-xs h-8 gap-1 relative"
            >
              <Heart className="size-3.5" />
              Saved
              {totalSaved > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalSaved}
                </span>
              )}
            </Button>
            <Button
              variant={showMap ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="rounded-xl text-xs h-8 gap-1"
            >
              <Map className="size-3.5" />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
        </div>

        {activeTrip ? (
          <div className="flex-1 flex min-h-0">
            {/* Itinerary panel */}
            <div className={`flex flex-col ${showMap ? "w-full lg:w-1/2" : "w-full"} min-w-0 min-h-0 overflow-hidden border-r border-[var(--border-color)]`}>
              <TripHeader />
              <div className="flex-1 min-h-0 overflow-y-auto">
                <DayTimeline />
              </div>
              <TripCostSummary />
            </div>

            {/* Map panel */}
            {showMap && (
              <div className="hidden lg:flex lg:w-1/2 flex-col min-h-0">
                {activeTrip.days.length > 0 && (
                  <DaySelector
                    days={activeTrip.days}
                    selectedDayId={selectedDayId || activeTrip.days[0]?.id || null}
                    onSelectDay={setSelectedDayId}
                  />
                )}
                <div className="flex-1">
                  <GoogleMapProvider>
                    <MapView
                      pins={mapData.pins}
                      center={destCenter}
                      zoom={13}
                      showFilters={false}
                    />
                  </GoogleMapProvider>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-[var(--bg-card)] flex items-center justify-center mb-4">
              <Calendar className="size-9 text-[var(--text-tertiary)]" strokeWidth={1.2} />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Plan Your Trip</h2>
            <p className="text-sm text-[var(--text-tertiary)] mt-1.5 max-w-xs">
              Create a trip to start adding activities, hotels, and flights day by day
            </p>
            <Button
              onClick={() => createTrip("My Trip", "Dubai")}
              className="mt-4 rounded-xl gap-1.5"
            >
              <Plus className="size-4" />
              Create First Trip
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TripPlannerPage() {
  return (
    <CartProvider>
      <TripPlannerContent />
    </CartProvider>
  );
}
