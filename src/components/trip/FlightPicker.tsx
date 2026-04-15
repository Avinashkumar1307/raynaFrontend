"use client";

import { useState } from "react";
import { useTrip } from "@/context/TripContext";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  Plane,
  Clock,
  PenLine,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tripId: string;
  dayId: string;
  destination: string;
  onClose: () => void;
}

type Tab = "suggestions" | "manual";

const DUMMY_FLIGHTS: Record<string, Array<{
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  duration: string;
}>> = {
  default: [
    { airline: "Emirates", flightNumber: "EK201", departure: "Home", arrival: "Destination", departureTime: "08:00", arrivalTime: "14:30", price: 650, duration: "6h 30m" },
    { airline: "Qatar Airways", flightNumber: "QR445", departure: "Home", arrival: "Destination", departureTime: "22:15", arrivalTime: "05:45", price: 580, duration: "7h 30m" },
    { airline: "Etihad", flightNumber: "EY302", departure: "Home", arrival: "Destination", departureTime: "14:00", arrivalTime: "20:00", price: 520, duration: "6h" },
    { airline: "FlyDubai", flightNumber: "FZ120", departure: "Home", arrival: "Destination", departureTime: "06:30", arrivalTime: "12:00", price: 320, duration: "5h 30m" },
  ],
  dubai: [
    { airline: "Emirates", flightNumber: "EK501", departure: "DEL", arrival: "DXB", departureTime: "02:30", arrivalTime: "04:45", price: 380, duration: "3h 45m" },
    { airline: "FlyDubai", flightNumber: "FZ434", departure: "BOM", arrival: "DXB", departureTime: "09:15", arrivalTime: "11:30", price: 250, duration: "3h 15m" },
    { airline: "Air India", flightNumber: "AI995", departure: "DEL", arrival: "DXB", departureTime: "17:00", arrivalTime: "19:30", price: 310, duration: "3h 30m" },
    { airline: "IndiGo", flightNumber: "6E1403", departure: "BLR", arrival: "DXB", departureTime: "06:00", arrivalTime: "08:30", price: 220, duration: "4h 30m" },
  ],
  paris: [
    { airline: "Air France", flightNumber: "AF142", departure: "JFK", arrival: "CDG", departureTime: "19:00", arrivalTime: "08:30", price: 720, duration: "7h 30m" },
    { airline: "Delta", flightNumber: "DL264", departure: "ATL", arrival: "CDG", departureTime: "17:30", arrivalTime: "07:45", price: 650, duration: "8h 15m" },
    { airline: "Emirates", flightNumber: "EK073", departure: "DXB", arrival: "CDG", departureTime: "08:15", arrivalTime: "13:00", price: 550, duration: "7h 15m" },
    { airline: "British Airways", flightNumber: "BA304", departure: "LHR", arrival: "CDG", departureTime: "10:00", arrivalTime: "12:20", price: 180, duration: "1h 20m" },
  ],
  london: [
    { airline: "British Airways", flightNumber: "BA117", departure: "JFK", arrival: "LHR", departureTime: "19:00", arrivalTime: "07:00", price: 680, duration: "7h" },
    { airline: "Emirates", flightNumber: "EK029", departure: "DXB", arrival: "LHR", departureTime: "07:30", arrivalTime: "11:45", price: 520, duration: "7h 15m" },
    { airline: "Virgin Atlantic", flightNumber: "VS4", departure: "JFK", arrival: "LHR", departureTime: "21:30", arrivalTime: "09:30", price: 590, duration: "7h" },
    { airline: "Ryanair", flightNumber: "FR812", departure: "DUB", arrival: "STN", departureTime: "07:00", arrivalTime: "08:20", price: 45, duration: "1h 20m" },
  ],
  tokyo: [
    { airline: "ANA", flightNumber: "NH110", departure: "LAX", arrival: "NRT", departureTime: "11:30", arrivalTime: "15:30", price: 850, duration: "11h" },
    { airline: "Japan Airlines", flightNumber: "JL005", departure: "SFO", arrival: "NRT", departureTime: "14:00", arrivalTime: "17:30", price: 780, duration: "10h 30m" },
    { airline: "Emirates", flightNumber: "EK318", departure: "DXB", arrival: "NRT", departureTime: "02:30", arrivalTime: "17:30", price: 690, duration: "9h 30m" },
    { airline: "Singapore Airlines", flightNumber: "SQ638", departure: "SIN", arrival: "NRT", departureTime: "08:00", arrivalTime: "16:00", price: 420, duration: "7h" },
  ],
  bali: [
    { airline: "Singapore Airlines", flightNumber: "SQ942", departure: "SIN", arrival: "DPS", departureTime: "08:00", arrivalTime: "10:50", price: 280, duration: "2h 50m" },
    { airline: "Garuda Indonesia", flightNumber: "GA841", departure: "KUL", arrival: "DPS", departureTime: "14:30", arrivalTime: "17:40", price: 195, duration: "3h 10m" },
    { airline: "Emirates", flightNumber: "EK398", departure: "DXB", arrival: "DPS", departureTime: "03:00", arrivalTime: "16:00", price: 550, duration: "9h" },
    { airline: "AirAsia", flightNumber: "QZ506", departure: "SIN", arrival: "DPS", departureTime: "16:00", arrivalTime: "18:55", price: 120, duration: "2h 55m" },
  ],
};

function getFlightsForDestination(destination: string) {
  const key = destination.toLowerCase().trim();
  for (const [name, flights] of Object.entries(DUMMY_FLIGHTS)) {
    if (name !== "default" && (key.includes(name) || name.includes(key))) {
      return flights;
    }
  }
  return DUMMY_FLIGHTS.default;
}

export default function FlightPicker({ tripId, dayId, destination, onClose }: Props) {
  const { setFlight } = useTrip();
  const [activeTab, setActiveTab] = useState<Tab>("suggestions");
  const [manualAirline, setManualAirline] = useState("");
  const [manualFlightNo, setManualFlightNo] = useState("");
  const [manualDeparture, setManualDeparture] = useState("");
  const [manualArrival, setManualArrival] = useState("");
  const [manualDepTime, setManualDepTime] = useState("");
  const [manualArrTime, setManualArrTime] = useState("");
  const [manualPrice, setManualPrice] = useState("");

  const flights = getFlightsForDestination(destination);

  function handleAddFromSuggestion(flight: (typeof flights)[0]) {
    setFlight(tripId, dayId, {
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departure: flight.departure,
      arrival: flight.arrival,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      currency: "AED",
    });
    onClose();
  }

  function handleAddManual() {
    if (!manualDeparture.trim() || !manualArrival.trim()) return;
    setFlight(tripId, dayId, {
      airline: manualAirline.trim() || undefined,
      flightNumber: manualFlightNo.trim() || undefined,
      departure: manualDeparture.trim(),
      arrival: manualArrival.trim(),
      departureTime: manualDepTime || undefined,
      arrivalTime: manualArrTime || undefined,
      price: Number(manualPrice) || 0,
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
            <Plane className="size-4 text-[var(--brand-accent)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Add Flight</h3>
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
            <Plane className="size-3.5" /> Suggested Flights
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
              {flights.map((flight, i) => (
                <div
                  key={i}
                  className="px-3 py-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-accent)]/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[var(--brand-accent)]">
                      {flight.airline}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">{flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{flight.departureTime}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">{flight.departure}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-1 px-2">
                      <div className="flex-1 h-px bg-[var(--border-color)]" />
                      <div className="flex flex-col items-center">
                        <Plane className="size-3 text-[var(--text-tertiary)] rotate-90" />
                        <span className="text-[9px] text-[var(--text-tertiary)] mt-0.5">{flight.duration}</span>
                      </div>
                      <div className="flex-1 h-px bg-[var(--border-color)]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{flight.arrivalTime}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">{flight.arrival}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">AED {flight.price}</span>
                    <button
                      onClick={() => handleAddFromSuggestion(flight)}
                      className="flex items-center gap-0.5 text-[10px] font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent)]/80"
                    >
                      <Plus className="size-3" /> Add Flight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualAirline}
                  onChange={(e) => setManualAirline(e.target.value)}
                  placeholder="Airline"
                  className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                  autoFocus
                />
                <input
                  type="text"
                  value={manualFlightNo}
                  onChange={(e) => setManualFlightNo(e.target.value)}
                  placeholder="Flight #"
                  className="w-28 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                />
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={manualDeparture}
                  onChange={(e) => setManualDeparture(e.target.value)}
                  placeholder="From *"
                  className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                />
                <ArrowRight className="size-4 text-[var(--text-tertiary)] flex-shrink-0" />
                <input
                  type="text"
                  value={manualArrival}
                  onChange={(e) => setManualArrival(e.target.value)}
                  placeholder="To *"
                  className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-[var(--text-tertiary)] mb-1 block">Departure</label>
                  <input
                    type="time"
                    value={manualDepTime}
                    onChange={(e) => setManualDepTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-[var(--text-tertiary)] mb-1 block">Arrival</label>
                  <input
                    type="time"
                    value={manualArrTime}
                    onChange={(e) => setManualArrTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                  />
                </div>
              </div>
              <input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="Price (AED)"
                min={0}
                className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
              />
              <Button
                onClick={handleAddManual}
                disabled={!manualDeparture.trim() || !manualArrival.trim()}
                className="w-full rounded-xl text-xs h-9"
              >
                <Plus className="size-3 mr-1" /> Add Flight
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
