"use client";

import { Sparkles, Shield, Zap, Headphones, RefreshCw, MapPin } from "lucide-react";

const FEATURES = [
  {
    title: "AI-powered recommendations",
    description:
      "Our smart assistant learns your preferences and suggests tours tailored to your style, budget, and interests.",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Best price guarantee",
    description:
      "We match or beat any competitor's price. Find it cheaper elsewhere? We'll refund the difference.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Instant booking",
    description:
      "No waiting, no callbacks. Book tours and activities instantly with real-time availability and confirmation.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "24/7 customer support",
    description:
      "Our dedicated support team is available around the clock — before, during, and after your trip.",
    icon: Headphones,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Free cancellation",
    description:
      "Plans change, we get it. Most of our tours offer free cancellation up to 24 hours before the experience.",
    icon: RefreshCw,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Local expertise",
    description:
      "We work with trusted local guides and operators to deliver authentic, high-quality experiences at every destination.",
    icon: MapPin,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

export default function WhyRayna() {
  return (
    <section id="why-rayna" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-3">
            Why choose us
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            Travel with confidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Rayna Tours is trusted by millions of travelers worldwide. Here&apos;s why.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-tertiary)]/30 transition-all duration-300 group hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`size-6 ${feature.color}`} />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
