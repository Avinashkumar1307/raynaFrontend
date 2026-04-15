"use client";

import { useSaved } from "@/context/SavedContext";
import type { SavedItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  item: SavedItem;
  className?: string;
}

export default function SaveButton({ item, className }: Props) {
  const { saveItem, unsaveItem, isSaved } = useSaved();
  const saved = isSaved(item.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      unsaveItem(item.id);
    } else {
      saveItem(item);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
        saved
          ? "bg-red-500/90 text-white scale-110"
          : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white hover:scale-110",
        className
      )}
      aria-label={saved ? "Remove from saved" : "Save item"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="size-3.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
