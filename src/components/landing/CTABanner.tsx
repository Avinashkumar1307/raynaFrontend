"use client";

import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 dark:from-amber-500 dark:via-orange-500 dark:to-orange-600 p-10 sm:p-16 text-center">
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Ready to plan your
            <br />
            next adventure?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-800/80 max-w-xl mx-auto">
            Chat with our AI travel assistant and discover personalized tours, activities, and packages for your dream trip.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-colors shadow-xl"
            >
              Start chatting now
            </Link>
            <a
              href="https://www.raynatours.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-4 rounded-full border-2 border-gray-900/20 text-gray-900 font-semibold text-base hover:bg-gray-900/5 transition-colors"
            >
              Browse all tours
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
