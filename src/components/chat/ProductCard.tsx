"use client";

import type { ProductCard as ProductCardType, ProductCardType as CardType } from "@/lib/types";

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

const categoryColors: Record<CardType, string> = {
  tour_carousel: "from-blue-600 to-blue-700",
  holiday_carousel: "from-emerald-600 to-emerald-700",
  cruise_carousel: "from-cyan-600 to-cyan-700",
  yacht_carousel: "from-violet-600 to-violet-700",
};

const buttonColors: Record<CardType, string> = {
  tour_carousel: "from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800",
  holiday_carousel: "from-emerald-600 to-emerald-700 group-hover:from-emerald-500 group-hover:to-emerald-600",
  cruise_carousel: "from-cyan-600 to-cyan-700 group-hover:from-cyan-500 group-hover:to-cyan-600",
  yacht_carousel: "from-violet-600 to-violet-700 group-hover:from-violet-500 group-hover:to-violet-600",
};

export default function ProductCard({ card, cardType }: Props) {
  const hasDiscount =
    card.originalPrice && card.currentPrice && card.originalPrice > card.currentPrice;
  const discountPct = hasDiscount
    ? Math.round(((card.originalPrice - card.currentPrice) / card.originalPrice) * 100)
    : 0;

  const bookingUrl = card.url || "https://www.raynatours.com";

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-64 sm:w-72 snap-center rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-sm hover:shadow-lg hover:border-gray-400/30 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative h-36 sm:h-40 w-full bg-gray-100 overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="h-full w-full flex flex-col items-center justify-center text-xs text-[var(--text-secondary)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700"
          style={{ display: card.image ? "none" : "flex" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mb-2 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <span className="font-medium">{categoryLabels[cardType]}</span>
          <span className="text-center px-2">{card.location}</span>
        </div>

        {/* Category badge */}
        <div
          className={`absolute top-2 right-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gradient-to-r ${categoryColors[cardType]}`}
        >
          {categoryLabels[cardType]}
        </div>

        {/* Discount badge */}
        {discountPct > 0 ? (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            -{discountPct}%
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
        <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {card.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--text-secondary)] truncate max-w-[65%]">
            {card.location}
          </div>
          {card.duration ? (
            <div className="text-xs font-medium text-[var(--text-secondary)]">
              {card.duration}
            </div>
          ) : null}
        </div>

        {typeof card.rating === "number" ? (
          <div className="text-xs font-medium text-gray-700 dark:text-gray-400">
            ★ {card.rating.toFixed(1)}
            {card.reviewCount ? (
              <span className="text-[var(--text-secondary)] font-normal ml-1">
                ({card.reviewCount})
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <div className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            {card.currency} {card.currentPrice}
          </div>
          {hasDiscount ? (
            <div className="text-xs text-[var(--text-secondary)] line-through opacity-60">
              {card.currency} {card.originalPrice}
            </div>
          ) : null}
        </div>

        {/* Amenities (holidays) */}
        {card.amenities && card.amenities.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {card.amenities.map((a) => (
              <span
                key={a}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40"
              >
                {a}
              </span>
            ))}
          </div>
        ) : null}

        {/* Highlights (tours) */}
        {!card.amenities?.length && card.highlights && card.highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {card.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}

        {/* CTA */}
        <div className="mt-3">
          <span
            className={`inline-flex items-center justify-center w-full text-xs font-semibold text-white bg-gradient-to-r ${buttonColors[cardType]} rounded-lg py-2`}
          >
            {cardType === "tour_carousel" ? "View Details" : "Book Now"}
          </span>
        </div>
      </div>
    </a>
  );
}
