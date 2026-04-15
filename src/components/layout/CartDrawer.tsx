"use client";

import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingCart,
  X,
  MapPin,
  Clock,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(price: number): string {
  return price >= 1000 ? price.toLocaleString() : price.toString();
}

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  tour: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", label: "Tour" },
  holiday: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Holiday" },
  cruise: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", label: "Cruise" },
  yacht: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Yacht" },
};

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, clearCart, totalItems, totalPrice } = useCart();

  const currency = items[0]?.currency ?? "AED";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-[360px] sm:w-[400px] sm:max-w-[400px] p-0 flex flex-col bg-[var(--bg-primary)]"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between px-5 py-4 border-b border-[var(--border-color)] gap-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-green)]/10 flex items-center justify-center">
              <ShoppingBag className="size-4.5 text-[var(--accent-green)]" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-[var(--text-primary)]">
                My Cart
              </SheetTitle>
              {totalItems > 0 && (
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {totalItems} {totalItems === 1 ? "item" : "items"} added
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        {/* Items */}
        <ScrollArea className="flex-1">
          <div className="px-4 py-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mb-4">
                  <ShoppingCart
                    className="size-7 text-[var(--text-tertiary)]"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Your cart is empty
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1.5 max-w-[220px]">
                  Browse tours, holidays, and cruises to add items to your cart
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="mt-4 rounded-xl text-xs font-medium border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Continue Browsing
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => {
                  const typeStyle = typeColors[item.type] || typeColors.tour;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden hover:border-[var(--text-tertiary)]/30 transition-colors animate-[staggerIn_0.4s_ease-out_both]"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Card image section */}
                      <div className="relative h-28 w-full bg-[var(--bg-card-hover)] overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Type badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-semibold border-0 h-auto",
                              typeStyle.bg,
                              typeStyle.text
                            )}
                          >
                            {typeStyle.label}
                          </Badge>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors group"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-3.5 text-white/80 group-hover:text-white" />
                        </button>

                        {/* Price overlay */}
                        <div className="absolute bottom-2.5 right-2.5">
                          <div className="bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1">
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[10px] text-[var(--text-tertiary)] line-through block leading-none mb-0.5">
                                {item.currency} {formatPrice(item.originalPrice)}
                              </span>
                            )}
                            <span className="text-sm font-bold text-[var(--text-primary)]">
                              {item.currency} {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card details */}
                      <div className="p-3">
                        <h4 className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-3 mt-2">
                          {item.location && (
                            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                              <MapPin className="size-3 shrink-0" />
                              <span className="truncate max-w-[120px]">{item.location}</span>
                            </span>
                          )}
                          {item.duration && (
                            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                              <Clock className="size-3 shrink-0" />
                              {item.duration}
                            </span>
                          )}
                        </div>

                        {/* View details link */}
                        <a
                          href={item.url || "https://www.raynatours.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-[var(--accent-green)] hover:underline"
                        >
                          View Details
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {items.length > 0 && (
          <div className="mt-auto border-t border-[var(--border-color)]">
            {/* Summary */}
            <div className="px-5 pt-4 pb-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {currency} {formatPrice(totalPrice)}
                </span>
              </div>
              <Separator className="bg-[var(--border-color)]" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Total
                </span>
                <span className="text-lg font-bold text-[var(--text-primary)]">
                  {currency} {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-4 pt-2 space-y-2.5">
              <a
                href="https://www.raynatours.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                <ShoppingBag className="size-4" />
                Proceed to Booking
              </a>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="w-full text-xs text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/5 rounded-xl gap-1.5"
              >
                <Trash2 className="size-3" />
                Clear cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
