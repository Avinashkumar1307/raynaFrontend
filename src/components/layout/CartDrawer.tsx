"use client";

import { useCart } from "@/context/CartContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(price: number): string {
  return price >= 1000 ? price.toLocaleString() : price.toString();
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, clearCart, totalItems, totalPrice } = useCart();

  const currency = items[0]?.currency ?? "AED";

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] sm:w-[380px] bg-[var(--bg-primary)] border-l border-[var(--border-color)] z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-[var(--accent)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              My Cart
            </h2>
            {totalItems > 0 && (
              <span className="text-[11px] bg-[var(--accent)] text-white font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-14 h-14 text-[var(--text-tertiary)] mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <p className="text-sm font-semibold text-[var(--text-secondary)]">
                Your cart is empty
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Add holidays or tours to get started
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]"
              >
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-card-hover)]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-[var(--text-primary)] line-clamp-2 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 truncate">
                    {item.location}
                  </p>
                  {item.duration && (
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                      {item.duration}
                    </p>
                  )}
                  <p className="text-[13px] font-extrabold text-[var(--text-primary)] mt-1">
                    {item.currency} {formatPrice(item.price)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-red-500 transition-colors self-start"
                  title="Remove"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)] font-medium">
                Total ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span className="text-base font-extrabold text-[var(--text-primary)]">
                {currency} {formatPrice(totalPrice)}
              </span>
            </div>

            <a
              href="https://www.raynatours.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[var(--accent)] hover:opacity-90 text-white text-sm font-bold py-3 rounded-xl transition-opacity"
            >
              Proceed to Booking
            </a>

            <button
              onClick={clearCart}
              className="block w-full text-center text-xs text-[var(--text-tertiary)] hover:text-red-400 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
