"use client";

import Link from "next/link";
import { MessageSquare, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Tell us where you want to go",
    description:
      "Simply type your dream destination or travel idea. Our AI understands natural language — just chat like you would with a travel expert.",
    icon: MessageSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    number: "02",
    title: "Get personalized recommendations",
    description:
      "Our AI searches through thousands of tours, activities, and packages to find the perfect match for your interests, budget, and schedule.",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    number: "03",
    title: "Book and enjoy your trip",
    description:
      "Review details, compare options, and book directly. We handle everything so you can focus on making memories.",
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            Plan your trip in 3 simple steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            No more endless browsing. Just tell us what you want and let our AI do the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative group">
                {/* Connector line (desktop only) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[80%] border-t-2 border-dashed border-[var(--border-color)]" />
                )}

                <div className="relative bg-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border-color)] hover:border-[var(--text-tertiary)]/30 transition-all duration-300 hover:shadow-lg h-full">
                  {/* Number badge */}
                  <div className="absolute -top-3.5 left-8 px-3.5 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-bold rounded-full">
                    Step {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center mt-2 mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`size-7 ${step.color}`} />
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
          >
            Try it now
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
