"use client";

import { Polyline } from "react-leaflet";

interface Props {
  path: { lat: number; lng: number }[];
  color?: string;
}

export default function RoutePolylineInner({ path, color = "#3b82f6" }: Props) {
  if (path.length < 2) return null;

  const positions: [number, number][] = path.map((p) => [p.lat, p.lng]);

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color,
        weight: 3,
        opacity: 0.8,
      }}
    />
  );
}
