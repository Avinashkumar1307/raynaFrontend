"use client";

import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { MapPin as MapPinType, MapServiceFilter } from "@/lib/types";
import MapInfoCard from "./MapInfoCard";
import MapFilterBar from "./MapFilterBar";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const typeIconColors: Record<string, string> = {
  activities: "#8b5cf6",
  hotels: "#10b981",
  tours: "#3b82f6",
  restaurants: "#f97316",
};

function createNumberedIcon(index: number, type: string) {
  const color = typeIconColors[type] || "#3b82f6";
  return L.divIcon({
    className: "custom-numbered-marker",
    html: `<div style="background:${color};color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);">${index}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

function createTypeIcon(type: string) {
  const color = typeIconColors[type] || "#3b82f6";
  const emoji = type === "hotels" ? "🏨" : type === "restaurants" ? "🍽" : "📍";
  return L.divIcon({
    className: "custom-type-marker",
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function RecenterMap({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

interface Props {
  pins: MapPinType[];
  center?: { lat: number; lng: number };
  zoom?: number;
  showFilters?: boolean;
  className?: string;
  selectedDayLabel?: string;
}

export default function MapViewInner({
  pins,
  center,
  zoom = 12,
  showFilters = true,
  className = "",
}: Props) {
  const [activeFilter, setActiveFilter] = useState<MapServiceFilter>("all");
  const [selectedPin, setSelectedPin] = useState<MapPinType | null>(null);

  const filteredPins = activeFilter === "all"
    ? pins
    : pins.filter((p) => p.type === activeFilter);

  const mapCenter = center || (pins.length > 0
    ? { lat: pins[0].lat, lng: pins[0].lng }
    : { lat: 25.2048, lng: 55.2708 });

  const handleMarkerClick = useCallback((pin: MapPinType) => {
    setSelectedPin(pin);
  }, []);

  return (
    <div className={`relative flex flex-col h-full ${className}`}>
      {showFilters && (
        <MapFilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
      )}

      <div className="flex-1 rounded-xl overflow-hidden">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={[mapCenter.lat, mapCenter.lng]} zoom={zoom} />
          {filteredPins.map((pin, index) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pin.time ? createNumberedIcon(index + 1, pin.type) : createTypeIcon(pin.type)}
              eventHandlers={{
                click: () => handleMarkerClick(pin),
              }}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong style={{ fontSize: 13 }}>{pin.title}</strong>
                  {pin.time && (
                    <p style={{ margin: "4px 0 2px", fontSize: 11, color: "#6b7280" }}>
                      🕐 {pin.time}
                    </p>
                  )}
                  {pin.description && (
                    <p style={{ margin: "2px 0", fontSize: 11, color: "#6b7280" }}>
                      {pin.description}
                    </p>
                  )}
                  {pin.price != null && pin.price > 0 && (
                    <p style={{ margin: "4px 0 0", fontSize: 12, fontWeight: 600 }}>
                      {pin.currency || "$"}{pin.price}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedPin && (
        <MapInfoCard pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  );
}
