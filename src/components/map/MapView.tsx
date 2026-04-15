"use client";

import dynamic from "next/dynamic";
import type { MapPin as MapPinType, MapServiceFilter } from "@/lib/types";

const MapViewInner = dynamic(() => import("./MapViewInner"), { ssr: false });

interface Props {
  pins: MapPinType[];
  center?: { lat: number; lng: number };
  zoom?: number;
  showFilters?: boolean;
  className?: string;
  selectedDayLabel?: string;
}

export default function MapView(props: Props) {
  return <MapViewInner {...props} />;
}
