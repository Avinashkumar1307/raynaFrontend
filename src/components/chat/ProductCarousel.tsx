"use client";

import { useRef } from "react";
import type { ProductCarousel as ProductCarouselType } from "@/lib/types";
import ProductCard from "./ProductCard";

interface Props {
  carousel: ProductCarouselType;
}

export default function ProductCarousel({ carousel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!carousel?.cards || carousel.cards.length === 0) {
    return (
      <div className="mt-2 sm:mt-3 p-4 text-center text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
        <div className="text-2xl mb-2">🎠</div>
        <p className="text-sm">No results available at the moment.</p>
        <p className="text-xs mt-1">Please try a different search or visit our website.</p>
      </div>
    );
  }

  return (
    <div className="mt-2 sm:mt-3">
      <div className="flex items-baseline justify-between mb-2 px-1">
        <div className="min-w-0 flex-1 mr-2">
          <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
            {carousel.title}
          </div>
          {carousel.totalResults ? (
            <div className="text-[10px] text-[var(--text-secondary)] ml-0">
              {carousel.totalResults} result{carousel.totalResults !== 1 ? "s" : ""} found
            </div>
          ) : null}
        </div>
        <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => scrollBy(-280)}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm hover:bg-[var(--bg-card)] flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(280)}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm hover:bg-[var(--bg-card)] flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory px-1 py-1 scrollbar-thin -mx-1"
      >
        {carousel.cards.map((card) => (
          <ProductCard key={card.id} card={card} cardType={carousel.type} />
        ))}
      </div>
    </div>
  );
}
