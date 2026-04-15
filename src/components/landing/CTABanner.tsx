"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Globe } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 dark:from-amber-500 dark:via-orange-500 dark:to-orange-600 p-10 sm:p-16 text-center">
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <Sparkles className="size-7 text-gray-900" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Ready to plan your
            <br />
            next adventure?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-800/80 max-w-xl mx-auto">
            Chat with our AI travel assistant and discover personalized tours, activities, and packages for your dream trip.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-colors shadow-xl flex items-center justify-center gap-2"
            >
              Start chatting now
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="https://www.raynatours.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-gray-900/20 text-gray-900 font-semibold text-base hover:bg-gray-900/5 transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="size-4" />
              Browse all tours
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
