"use client";

import Link from "next/link";
import { FEATURED_DESTINATIONS } from "@/lib/constants";
import { Heart, Star, ArrowUpRight } from "lucide-react";

export default function FeaturedDestinations() {
  return (
    <section id="destinations" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-3">
            Explore
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Popular Destinations
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] max-w-lg">
            Click a destination to start exploring with our AI travel assistant
          </p>
        </div>
        <Link
          href="/chat"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-colors"
        >
          View All
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {FEATURED_DESTINATIONS.map((dest, index) => (
          <Link
            key={dest.name}
            href={`/chat?destination=${encodeURIComponent(dest.name)}`}
            className={`group relative rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-transparent transition-all duration-300 hover:shadow-xl ${
              index === 0 ? "sm:row-span-2 h-64 sm:h-full" : "h-52 sm:h-60"
            }`}
          >
            {/* Gradient placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10" />

            {/* Image */}
            <img
              src={dest.image}
              alt={dest.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Top icons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="size-4 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="size-4 text-white" />
              </div>
            </div>

            {/* Emoji badge */}
            <div className="absolute top-3 left-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <span className="text-lg">{dest.emoji}</span>
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{dest.name}</h3>
                  <p className="text-white/60 text-sm mt-0.5 group-hover:text-white/80 transition-colors">
                    Explore tours & activities
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm">
                  <Star className="size-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-white">4.8</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
