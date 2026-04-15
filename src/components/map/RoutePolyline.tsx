"use client";

import dynamic from "next/dynamic";

const RoutePolylineInner = dynamic(() => import("./RoutePolylineInner"), { ssr: false });

interface Props {
  path: { lat: number; lng: number }[];
  color?: string;
}

export default function RoutePolyline(props: Props) {
  return <RoutePolylineInner {...props} />;
}
