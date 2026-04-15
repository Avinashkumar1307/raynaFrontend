"use client";

import type { TourCard as TourCardType, SavedItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SaveButton from "@/components/ui/SaveButton";
import { cn } from "@/lib/utils";

interface Props {
  card: TourCardType;
}

function formatPrice(price: number): string {
  return price >= 1000 ? price.toLocaleString() : price.toString();
}

export default function TourCard({ card }: Props) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(String(card.id));

  const hasDiscount =
    card.originalPrice && card.currentPrice && card.originalPrice > card.currentPrice;

  const savedItem: SavedItem = {
    id: String(card.id),
    title: card.title,
    image: card.image,
    location: card.location,
    category: card.category,
    price: card.currentPrice,
    originalPrice: card.originalPrice ?? undefined,
    currency: card.currency,
    url: card.url,
    duration: card.duration,
    type: "tour",
    rating: card.rating,
    reviewCount: card.reviewCount,
    highlights: card.highlights,
    savedAt: 0,
  };

  function handleCartClick(e: React.MouseEvent) {
    e.preventDefault();
    if (inCart) {
      removeItem(String(card.id));
    } else {
      addItem({
        id: String(card.id),
        title: card.title,
        image: card.image,
        location: card.location,
        category: card.category,
        price: card.currentPrice,
        originalPrice: card.originalPrice ?? undefined,
        currency: card.currency,
        url: card.url,
        duration: card.duration,
        type: "tour",
      });
    }
  }

  return (
    <div className="group flex-shrink-0 w-[240px] sm:w-[280px] snap-center rounded-2xl overflow-hidden bg-card ring-1 ring-foreground/10 hover:ring-foreground/20 shadow-sm hover:shadow-lg transition-all duration-300 hover-lift">
      {/* Image */}
      <div className="relative h-32 sm:h-36 w-full bg-muted overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.style.background = "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted)) 100%)";
            }}
          />
        ) : null}
        <div
          className="h-full w-full flex flex-col items-center justify-center text-xs text-muted-foreground bg-muted"
          style={{ display: card.image ? "none" : "flex" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 mb-2 text-muted-foreground">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span className="font-medium">{card.category || "Tour"}</span>
          <span className="text-center px-2">{card.location}</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {card.discountPercentage ? (
            <Badge variant="secondary" className="bg-white text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md border-0">
              -{card.discountPercentage}%
            </Badge>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1.5">
            <SaveButton item={savedItem} />
            <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-0.5 rounded-full border-0">
              {card.isNew ? "New" : "Tour"}
            </Badge>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          {card.location ? (
            <span className="flex items-center gap-1 text-white text-xs font-medium drop-shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span className="truncate max-w-[140px]">{card.location}</span>
            </span>
          ) : null}
          {typeof card.rating === "number" && card.rating > 0 ? (
            <Badge variant="secondary" className="bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-md border-0">
              <span className="text-amber-400">★</span>
              {card.rating.toFixed(1)}
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="text-[12px] font-bold text-card-foreground line-clamp-2 leading-tight min-h-[32px]">
          {card.title}
        </h3>

        {/* Price */}
        <div className="flex items-end justify-between pt-2 border-t border-border">
          <div>
            {hasDiscount ? (
              <span className="text-[11px] text-muted-foreground line-through block mb-0.5">
                {card.currency} {formatPrice(card.originalPrice ?? 0)}
              </span>
            ) : null}
            <span className="text-base font-extrabold text-card-foreground">
              {card.currency} {formatPrice(card.currentPrice)}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium pb-0.5">per person</span>
        </div>

        {/* Highlights */}
        {card.highlights && card.highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {card.highlights.slice(0, 3).map((h) => (
              <Badge key={h} variant="outline" className="text-[10px] px-2 py-0 rounded-full font-medium h-auto">
                {h}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            variant={inCart ? "ghost" : "outline"}
            size="sm"
            onClick={handleCartClick}
            className={cn(
              "flex-1 rounded-xl text-[12px] font-semibold h-8 transition-all duration-200",
              inCart
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-red-500/10 hover:text-red-500"
                : "hover:bg-[var(--brand-accent)]/10 hover:text-[var(--brand-accent)]"
            )}
          >
            {inCart ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Add to Cart
              </>
            )}
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-xl text-[12px] font-semibold h-8"
            render={<a href={card.url} target="_blank" rel="noopener noreferrer" />}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
