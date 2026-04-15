"use client";

import { useState } from "react";
import { useTrip } from "@/context/TripContext";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  MapPin,
  Star,
  Building,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tripId: string;
  dayId: string;
  destination: string;
  onClose: () => void;
}

type Tab = "suggestions" | "manual";

const DUMMY_HOTELS: Record<string, Array<{
  name: string;
  location: string;
  pricePerNight: number;
  image: string;
  stars: number;
}>> = {
  default: [
    { name: "Grand Luxury Hotel", location: "City Center", pricePerNight: 220, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop", stars: 5 },
    { name: "Comfort Inn & Suites", location: "Downtown", pricePerNight: 120, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop", stars: 4 },
    { name: "Budget Stay Express", location: "Near Airport", pricePerNight: 65, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=200&fit=crop", stars: 3 },
    { name: "Boutique Garden Hotel", location: "Old Town", pricePerNight: 175, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop", stars: 4 },
  ],
  dubai: [
    { name: "Atlantis The Palm", location: "Palm Jumeirah", pricePerNight: 450, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=200&fit=crop", stars: 5 },
    { name: "Burj Al Arab", location: "Jumeirah Beach", pricePerNight: 1200, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&h=200&fit=crop", stars: 5 },
    { name: "Rove Downtown", location: "Downtown Dubai", pricePerNight: 95, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop", stars: 3 },
    { name: "JW Marriott Marquis", location: "Business Bay", pricePerNight: 280, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop", stars: 5 },
  ],
  paris: [
    { name: "Hotel Le Marais", location: "Le Marais District", pricePerNight: 320, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop", stars: 4 },
    { name: "Ritz Paris", location: "Place Vendome", pricePerNight: 950, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop", stars: 5 },
    { name: "Ibis Eiffel Tower", location: "Near Eiffel Tower", pricePerNight: 110, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=200&fit=crop", stars: 3 },
    { name: "Hotel Montmartre", location: "Montmartre", pricePerNight: 195, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop", stars: 4 },
  ],
  london: [
    { name: "The Savoy", location: "Strand", pricePerNight: 580, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop", stars: 5 },
    { name: "Premier Inn Westminster", location: "Westminster", pricePerNight: 130, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=200&fit=crop", stars: 3 },
    { name: "The Langham", location: "Regent Street", pricePerNight: 420, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop", stars: 5 },
    { name: "Hub by Premier Inn", location: "Covent Garden", pricePerNight: 90, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop", stars: 3 },
  ],
  tokyo: [
    { name: "Park Hyatt Tokyo", location: "Shinjuku", pricePerNight: 500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop", stars: 5 },
    { name: "Shinjuku Granbell", location: "Kabukicho", pricePerNight: 85, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=200&fit=crop", stars: 3 },
    { name: "Aman Tokyo", location: "Otemachi", pricePerNight: 750, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop", stars: 5 },
    { name: "Dormy Inn Asakusa", location: "Asakusa", pricePerNight: 70, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop", stars: 3 },
  ],
  bali: [
    { name: "Four Seasons Ubud", location: "Ubud", pricePerNight: 600, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop", stars: 5 },
    { name: "Alila Seminyak", location: "Seminyak", pricePerNight: 250, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop", stars: 5 },
    { name: "Kuta Beach Hotel", location: "Kuta", pricePerNight: 45, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=200&fit=crop", stars: 3 },
    { name: "The Mulia Nusa Dua", location: "Nusa Dua", pricePerNight: 380, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop", stars: 5 },
  ],
};

function getHotelsForDestination(destination: string) {
  const key = destination.toLowerCase().trim();
  for (const [name, hotels] of Object.entries(DUMMY_HOTELS)) {
    if (name !== "default" && (key.includes(name) || name.includes(key))) {
      return hotels;
    }
  }
  return DUMMY_HOTELS.default;
}

export default function HotelPicker({ tripId, dayId, destination, onClose }: Props) {
  const { setHotel } = useTrip();
  const [activeTab, setActiveTab] = useState<Tab>("suggestions");
  const [manualName, setManualName] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [manualPrice, setManualPrice] = useState("");

  const hotels = getHotelsForDestination(destination);

  function handleAddFromSuggestion(hotel: (typeof hotels)[0]) {
    setHotel(tripId, dayId, {
      name: hotel.name,
      image: hotel.image,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight,
      currency: "AED",
    });
    onClose();
  }

  function handleAddManual() {
    if (!manualName.trim()) return;
    setHotel(tripId, dayId, {
      name: manualName.trim(),
      location: manualLocation.trim() || destination,
      pricePerNight: Number(manualPrice) || 0,
      currency: "AED",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Building className="size-4 text-[var(--brand-accent)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Add Hotel</h3>
          </div>
          <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab("suggestions")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors",
              activeTab === "suggestions"
                ? "text-[var(--brand-accent)] border-b-2 border-[var(--brand-accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Star className="size-3.5" /> Suggested Hotels
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
          {activeTab === "suggestions" ? (
            <div className="p-4 space-y-2">
              {hotels.map((hotel, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-accent)]/30 transition-colors"
                >
                  <img src={hotel.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{hotel.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-0.5">
                        <MapPin className="size-2.5" /> {hotel.location}
                      </span>
                      <span className="text-[10px] text-amber-500 flex items-center gap-0.5">
                        {Array.from({ length: hotel.stars }).map((_, s) => (
                          <Star key={s} className="size-2 fill-current" />
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-bold text-[var(--text-primary)]">AED {hotel.pricePerNight}</p>
                    <p className="text-[9px] text-[var(--text-tertiary)]">/night</p>
                    <button
                      onClick={() => handleAddFromSuggestion(hotel)}
                      className="mt-1 flex items-center gap-0.5 text-[10px] font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent)]/80"
                    >
                      <Plus className="size-3" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Hotel name *"
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
              <input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="Price per night (AED)"
                min={0}
                className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
              />
              <Button
                onClick={handleAddManual}
                disabled={!manualName.trim()}
                className="w-full rounded-xl text-xs h-9"
              >
                <Plus className="size-3 mr-1" /> Add Hotel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
