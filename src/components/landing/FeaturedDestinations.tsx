"use client";

import Link from "next/link";
import { FEATURED_DESTINATIONS } from "@/lib/constants";

export default function FeaturedDestinations() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Popular destinations
        </h2>
        <p className="mt-3 text-base text-[var(--text-secondary)] max-w-lg mx-auto">
          Click a destination to start exploring with our AI travel assistant
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {FEATURED_DESTINATIONS.map((dest) => (
          <Link
            key={dest.name}
            href={`/chat?destination=${encodeURIComponent(dest.name)}`}
            className="group relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-tertiary)] transition-all duration-300"
          >
            {/* Gradient placeholder background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10" />

            {/* Destination image */}
            <img
              src={dest.image}
              alt={dest.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{dest.emoji}</span>
                <h3 className="text-xl font-bold text-white">{dest.name}</h3>
              </div>
              <p className="text-white/70 text-sm mt-1 group-hover:text-white/90 transition-colors">
                Explore tours & activities
              </p>
            </div>

            {/* Hover arrow */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
