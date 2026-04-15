"use client";

import { useRef, useState, useEffect } from "react";
import type { TourCarousel as TourCarouselType } from "@/lib/types";
import TourCard from "./TourCard";
import { Button } from "@/components/ui/button";

interface Props {
  carousel: TourCarouselType;
}

export default function TourCarousel({ carousel }: Props) {
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
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!carousel?.cards || carousel.cards.length === 0) {
    return (
      <div className="mt-3 p-5 text-center text-muted-foreground bg-card rounded-2xl ring-1 ring-foreground/10">
        <p className="text-sm font-medium">No tours available</p>
        <p className="text-xs mt-1 opacity-60">Try a different search or visit our website.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 sm:mt-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-sm font-bold text-foreground">{carousel.title}</h3>
          {carousel.subtitle ? (
            <p className="text-xs text-muted-foreground mt-0.5">{carousel.subtitle}</p>
          ) : null}
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => scrollBy(-320)}
            disabled={!canScrollLeft}
            className="rounded-full"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => scrollBy(320)}
            disabled={!canScrollRight}
            className="rounded-full"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {carousel.cards.map((card, i) => (
          <div key={card.id || i} className="animate-card-in" style={{ animationDelay: `${i * 80}ms` }}>
            <TourCard card={card} />
          </div>
        ))}
      </div>

      {/* Fade edges */}
      {canScrollLeft && (
        <div className="absolute left-0 top-12 bottom-2 w-8 bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none z-10" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-12 bottom-2 w-8 bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none z-10" />
      )}
    </div>
  );
}
