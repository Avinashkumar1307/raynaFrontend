"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/chat");
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 dark:from-amber-600/20 dark:via-orange-600/10 dark:to-[var(--bg-primary)]" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-[var(--text-primary)] leading-[0.95]">
          Travel
          <br />
          <span className="italic">differently.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-gray-800/80 dark:text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Rayna Tours brings the world to you. Explore tours, activities, and travel packages with our AI travel assistant.
        </p>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-xl mx-auto">
          <div className="flex items-center bg-white dark:bg-[var(--bg-card)] rounded-2xl border border-gray-200 dark:border-[var(--border-color)] shadow-lg overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where would you like to go?"
              className="flex-1 px-5 py-4 text-base bg-transparent text-gray-900 dark:text-[var(--text-primary)] placeholder-gray-400 dark:placeholder-[var(--text-tertiary)] focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-gray-900 dark:bg-[var(--text-primary)] text-white dark:text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Explore
            </button>
          </div>
        </form>

        {/* CTAs */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href="/chat"
            className="px-8 py-3.5 rounded-full bg-gray-900 dark:bg-[var(--text-primary)] text-white dark:text-[var(--bg-primary)] font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
          >
            Start chatting
          </Link>
          <a
            href="https://www.raynatours.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full border-2 border-gray-900/20 dark:border-[var(--border-color)] text-gray-900 dark:text-[var(--text-primary)] font-semibold text-base hover:bg-gray-900/5 dark:hover:bg-[var(--bg-card)] transition-colors"
          >
            Browse tours
          </a>
        </div>
      </div>
    </section>
  );
}
