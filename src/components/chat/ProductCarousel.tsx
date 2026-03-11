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
      <div className="mt-3 p-4 text-center text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
        <p className="text-sm">No results available at the moment.</p>
        <p className="text-xs mt-1 text-[var(--text-tertiary)]">Please try a different search or visit our website.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 sm:mt-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {carousel.title}
          </h3>
          {carousel.totalResults ? (
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              {carousel.totalResults} result{carousel.totalResults !== 1 ? "s" : ""}
            </p>
          ) : null}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => scrollBy(-300)}
            className="h-8 w-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] flex items-center justify-center transition-colors text-sm"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(300)}
            className="h-8 w-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] flex items-center justify-center transition-colors text-sm"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin pb-3"
      >
        {carousel.cards.map((card, i) => (
          <div key={card.id} className="animate-card-in" style={{ animationDelay: `${i * 80}ms` }}>
            <ProductCard card={card} cardType={carousel.type} />
          </div>
        ))}
      </div>
    </div>
  );
}
