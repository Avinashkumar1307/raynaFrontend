"use client";

import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    location: "United Kingdom",
    text: "The AI chat made planning our Dubai trip so effortless. It recommended the perfect desert safari and Burj Khalifa tour within minutes. Absolutely loved it!",
    rating: 5,
    avatar: "SM",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    name: "James T.",
    location: "Australia",
    text: "I was skeptical about an AI travel assistant, but it nailed every recommendation. Found us an amazing deal on a Singapore city tour that we never would have discovered on our own.",
    rating: 5,
    avatar: "JT",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Priya K.",
    location: "India",
    text: "Booked a Bali package through the chatbot in under 5 minutes. The whole family had an incredible time. Will definitely use Rayna Tours again for our next vacation.",
    rating: 5,
    avatar: "PK",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            What travelers say
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] max-w-lg mx-auto">
            Join millions of happy travelers who planned their trips with Rayna Tours
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative p-6 sm:p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--text-tertiary)]/30 transition-all duration-300 hover:shadow-md flex flex-col group"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Quote className="size-5 text-amber-500" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-[var(--border-color)]">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
