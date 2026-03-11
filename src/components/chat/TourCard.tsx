"use client";

import type { TourCard as TourCardType } from "@/lib/types";

interface Props {
  card: TourCardType;
}

export default function TourCard({ card }: Props) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-64 sm:w-72 snap-center rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-tertiary)] shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 sm:h-48 w-full bg-[var(--bg-card)] overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="h-full w-full flex flex-col items-center justify-center text-xs text-[var(--text-secondary)] bg-[var(--bg-card)]"
          style={{ display: card.image ? "none" : "flex" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-[var(--text-tertiary)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span className="font-medium">{card.category || "Tour"}</span>
          <span className="text-center px-2">{card.location}</span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Discount badge */}
        {card.discountPercentage ? (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            -{card.discountPercentage}%
          </div>
        ) : null}

        {/* New badge */}
        {card.isNew ? (
          <div className="absolute top-3 right-3 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
            New
          </div>
        ) : null}

        {/* Location on image */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white/90 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span className="truncate max-w-[180px] font-medium drop-shadow-sm">{card.location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
          {card.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          {typeof card.rating === "number" ? (
            <span className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              {card.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-[var(--border-color)]">
          <span className="text-base font-bold text-[var(--text-primary)]">
            {card.currency} {card.currentPrice}
          </span>
          {card.originalPrice ? (
            <span className="text-xs text-[var(--text-tertiary)] line-through">
              {card.currency} {card.originalPrice}
            </span>
          ) : null}
          <span className="ml-auto text-[10px] text-[var(--text-tertiary)]">per person</span>
        </div>

        {/* Highlights */}
        {card.highlights && card.highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {card.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-medium"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </a>
  );
}
