"use client";

import { Users, Map, Globe, Star } from "lucide-react";

const STATS = [
  { value: "2M+", label: "Happy travelers", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { value: "10K+", label: "Tours & activities", icon: Map, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "14+", label: "Destinations", icon: Globe, color: "text-orange-500", bg: "bg-orange-500/10" },
  { value: "4.8", label: "Average rating", icon: Star, suffix: "/5", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-tertiary)]/30 transition-all duration-300 hover:shadow-md group"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-base text-[var(--text-secondary)] font-normal">
                      {stat.suffix}
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)] font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
