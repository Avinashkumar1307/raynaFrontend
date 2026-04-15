"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <div className="flex items-start gap-3 message-enter">
      <Avatar className="size-7 shrink-0 border border-[var(--border-color)] shadow-sm">
        <AvatarFallback className="bg-[var(--bg-card)] text-[var(--text-secondary)] text-[10px] font-bold">
          R
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-3 py-2">
        {/* Animated typing dots */}
        <div className="flex items-center gap-1">
          <span className="typing-dot size-1.5 rounded-full bg-[var(--text-tertiary)]" />
          <span className="typing-dot size-1.5 rounded-full bg-[var(--text-tertiary)]" />
          <span className="typing-dot size-1.5 rounded-full bg-[var(--text-tertiary)]" />
        </div>

        <span className="text-sm text-[var(--text-secondary)] animate-fade-in" key={key}>
          {displayText}
        </span>
      </div>
    </div>
  );
}
