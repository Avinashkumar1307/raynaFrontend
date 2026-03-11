"use client";

import type { TourCard, ProductCard } from "@/lib/types";

interface TourCardProps {
  card: TourCard;
}

interface ProductCardProps {
  card: ProductCard;
}

export function ContextTourCardItem({ card }: TourCardProps) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-3 rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors group"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--bg-card)] shrink-0">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-snug">
          {card.title}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
          {typeof card.rating === "number" && (
            <span className="flex items-center gap-0.5">
              <span className="text-amber-500">★</span> {card.rating.toFixed(1)}
            </span>
          )}
          {card.duration && <span>{card.duration}</span>}
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {card.currency} {card.currentPrice}
          </span>
          {card.originalPrice ? (
            <span className="text-[10px] text-[var(--text-tertiary)] line-through">
              {card.currency} {card.originalPrice}
            </span>
          ) : null}
        </div>
      </div>

      {/* Arrow */}
      <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[var(--text-tertiary)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>
    </a>
  );
}

export function ContextProductCardItem({ card }: ProductCardProps) {
  const bookingUrl = card.url || "https://www.raynatours.com";

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-3 rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors group"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--bg-card)] shrink-0">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-snug">
          {card.title}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
          {card.location && <span className="truncate">{card.location}</span>}
          {card.duration && <span>· {card.duration}</span>}
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {card.currency} {card.currentPrice}
          </span>
          {card.originalPrice && card.originalPrice > card.currentPrice ? (
            <span className="text-[10px] text-[var(--text-tertiary)] line-through">
              {card.currency} {card.originalPrice}
            </span>
          ) : null}
        </div>
      </div>

      {/* Arrow */}
      <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[var(--text-tertiary)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>
    </a>
  );
}
