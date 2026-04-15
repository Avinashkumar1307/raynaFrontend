"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, MapPin, Sparkles, Globe } from "lucide-react";

const POPULAR = ["Dubai", "Singapore", "Thailand", "Bali", "Turkey"];

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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 dark:from-amber-600/20 dark:via-orange-600/10 dark:to-[var(--bg-primary)]" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-[var(--bg-card)]/80 backdrop-blur-sm border border-white/20 dark:border-[var(--border-color)] mb-8 animate-[staggerIn_0.5s_ease-out_both]">
          <Sparkles className="size-4 text-amber-700 dark:text-amber-400" />
          <span className="text-sm font-medium text-gray-800 dark:text-[var(--text-secondary)]">
            AI-Powered Travel Planning
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-[var(--text-primary)] leading-[0.95] animate-[staggerIn_0.5s_ease-out_both]" style={{ animationDelay: "100ms" }}>
          Travel
          <br />
          <span className="italic bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            differently.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-gray-800/80 dark:text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed animate-[staggerIn_0.5s_ease-out_both]" style={{ animationDelay: "200ms" }}>
          Discover tours, activities, and travel packages with our AI assistant.
          Just ask, and we&apos;ll plan the perfect trip.
        </p>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-xl mx-auto animate-[staggerIn_0.5s_ease-out_both]" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center bg-white dark:bg-[var(--bg-card)] rounded-2xl border border-white/50 dark:border-[var(--border-color)] shadow-2xl shadow-black/10 overflow-hidden transition-shadow focus-within:shadow-2xl focus-within:shadow-amber-500/10">
            <div className="pl-4">
              <Search className="size-5 text-gray-400 dark:text-[var(--text-tertiary)]" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where would you like to go?"
              className="flex-1 px-3 py-4 text-base bg-transparent text-gray-900 dark:text-[var(--text-primary)] placeholder-gray-400 dark:placeholder-[var(--text-tertiary)] focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 m-1.5 rounded-xl bg-gray-900 dark:bg-[var(--text-primary)] text-white dark:text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Explore
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>

        {/* Popular destinations */}
        <div className="mt-6 flex items-center justify-center flex-wrap gap-2 animate-[staggerIn_0.5s_ease-out_both]" style={{ animationDelay: "400ms" }}>
          <span className="text-xs text-gray-700/60 dark:text-[var(--text-tertiary)] font-medium">
            Popular:
          </span>
          {POPULAR.map((dest) => (
            <Link
              key={dest}
              href={`/chat?destination=${encodeURIComponent(dest)}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/30 dark:bg-[var(--bg-card)]/60 backdrop-blur-sm text-gray-800 dark:text-[var(--text-secondary)] hover:bg-white/50 dark:hover:bg-[var(--bg-card)] transition-colors border border-white/20 dark:border-[var(--border-color)]"
            >
              <MapPin className="size-3" />
              {dest}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex items-center justify-center gap-4 animate-[staggerIn_0.5s_ease-out_both]" style={{ animationDelay: "500ms" }}>
          <Link
            href="/chat"
            className="px-8 py-3.5 rounded-xl bg-gray-900 dark:bg-[var(--text-primary)] text-white dark:text-[var(--bg-primary)] font-semibold text-base hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
          >
            <Sparkles className="size-4" />
            Start chatting
          </Link>
          <a
            href="https://www.raynatours.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl border-2 border-gray-900/20 dark:border-[var(--border-color)] text-gray-900 dark:text-[var(--text-primary)] font-semibold text-base hover:bg-gray-900/5 dark:hover:bg-[var(--bg-card)] transition-colors flex items-center gap-2"
          >
            <Globe className="size-4" />
            Browse tours
          </a>
        </div>
      </div>
    </section>
  );
}
