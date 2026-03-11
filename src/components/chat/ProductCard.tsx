"use client";

import type {
  ProductCard as ProductCardType,
  ProductCardType as CardType,
} from "@/lib/types";

interface Props {
  card: ProductCardType;
  cardType: CardType;
}

const categoryLabels: Record<CardType, string> = {
  tour_carousel: "Tour",
  holiday_carousel: "Holiday",
  cruise_carousel: "Cruise",
  yacht_carousel: "Yacht",
};

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString();
  }
  return price.toString();
}

export default function ProductCard({ card, cardType }: Props) {
  const label = categoryLabels[cardType] || "Tour";
  const hasDiscount =
    card.originalPrice &&
    card.currentPrice &&
    card.originalPrice > card.currentPrice;
  const discountPct = hasDiscount
    ? Math.round(
        ((card.originalPrice - card.currentPrice) / card.originalPrice) * 100
      )
    : 0;
  const bookingUrl = card.url || "https://www.raynatours.com";

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-[400px] snap-center rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-tertiary)] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-40 w-full bg-[var(--bg-card)] overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.style.background =
                "linear-gradient(135deg, #222 0%, #333 50%, #222 100%)";
            }}
          />
        ) : null}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {discountPct > 0 ? (
            <span className="bg-white text-black text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
              -{discountPct}%
            </span>
          ) : (
            <span />
          )}
          <span className="bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full">
            {label}
          </span>
        </div>

        {/* Bottom info on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          {card.location ? (
            <span className="flex items-center gap-1 text-white text-xs font-medium drop-shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span className="truncate max-w-[140px]">{card.location}</span>
            </span>
          ) : null}
          {typeof card.rating === "number" && card.rating > 0 ? (
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-md">
              <span className="text-amber-400">★</span>
              {card.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <h3 className="text-[13px] font-bold text-[var(--text-primary)] line-clamp-2 leading-tight min-h-[36px]">
          {card.title}
        </h3>

        {card.duration ? (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="font-medium">{card.duration}</span>
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-end justify-between pt-2 border-t border-[var(--border-color)]">
          <div>
            {hasDiscount ? (
              <span className="text-[11px] text-[var(--text-tertiary)] line-through block mb-0.5">
                {card.currency} {formatPrice(card.originalPrice)}
              </span>
            ) : null}
            <span className="text-lg font-extrabold text-[var(--text-primary)]">
              {card.currency} {formatPrice(card.currentPrice)}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-tertiary)] font-medium pb-0.5">
            per person
          </span>
        </div>

        {/* Amenities */}
        {card.amenities && card.amenities.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {card.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-medium border border-[var(--border-color)]"
              >
                {a}
              </span>
            ))}
            {card.amenities.length > 4 ? (
              <span className="text-[10px] px-2 py-0.5 text-[var(--text-tertiary)] font-medium">
                +{card.amenities.length - 4} more
              </span>
            ) : null}
          </div>
        ) : null}

        {!card.amenities?.length && card.highlights && card.highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {card.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-medium border border-[var(--border-color)]"
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
