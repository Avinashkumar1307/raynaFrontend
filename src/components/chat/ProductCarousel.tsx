"use client";

import { useRef, useState, useEffect } from "react";
import type { ProductCarousel as ProductCarouselType } from "@/lib/types";
import ProductCard from "./ProductCard";

interface Props {
  carousel: ProductCarouselType;
}

export default function ProductCarousel({ carousel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [carousel.cards.length]);

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!carousel?.cards || carousel.cards.length === 0) {
    return (
      <div className="mt-3 p-5 text-center text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
        <p className="text-sm font-medium">No results available</p>
        <p className="text-xs mt-1 text-[var(--text-tertiary)]">
          Try a different search or visit our website.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 sm:mt-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            {carousel.title}
          </h3>
          {carousel.totalResults ? (
            <span className="text-[11px] text-[var(--text-tertiary)] bg-[var(--bg-card)] px-2.5 py-0.5 rounded-full border border-[var(--border-color)] font-medium">
              {carousel.totalResults}{" "}
              {carousel.totalResults !== 1 ? "packages" : "package"}
            </span>
          ) : null}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            disabled={!canScrollLeft}
            className="h-8 w-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-card)] hover:border-[var(--text-tertiary)] hover:shadow-sm"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-[var(--text-secondary)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            disabled={!canScrollRight}
            className="h-8 w-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-card)] hover:border-[var(--text-tertiary)] hover:shadow-sm"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-[var(--text-secondary)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {carousel.cards.map((card, i) => (
          <div
            key={card.id || i}
            className="animate-card-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <ProductCard card={card} cardType={carousel.type} />
          </div>
        ))}
      </div>

      {/* Fade edges for scroll indication */}
      {canScrollLeft ? (
        <div className="absolute left-0 top-12 bottom-2 w-8 bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none z-10" />
      ) : null}
      {canScrollRight ? (
        <div className="absolute right-0 top-12 bottom-2 w-8 bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none z-10" />
      ) : null}
    </div>
  );
}
