"use client";

import { useState, useEffect } from "react";

const fallbackMessages = [
  "Just a sec...",
  "Thinking...",
  "Looking into it...",
  "Finding the best options...",
  "Almost there...",
];

interface TypingIndicatorProps {
  status?: string | null;
}

export default function TypingIndicator({ status }: TypingIndicatorProps) {
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Only cycle through fallback messages when no real status is provided
  useEffect(() => {
    if (status) return;
    const interval = setInterval(() => {
      setFallbackIndex((prev) => (prev + 1) % fallbackMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [status]);

  const displayText = status || fallbackMessages[fallbackIndex];
  const key = status || `fallback-${fallbackIndex}`;

  return (
    <div className="flex justify-start message-enter">
      <div className="flex items-center gap-2 py-2">
        <div className="w-4 h-4 relative flex items-center justify-center">
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-ping opacity-40 absolute" />
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full relative" />
        </div>
        <span className="text-sm text-[var(--text-secondary)] animate-fade-in" key={key}>
          {displayText}
        </span>
      </div>
    </div>
  );
}
