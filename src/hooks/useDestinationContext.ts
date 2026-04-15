"use client";

import { useMemo } from "react";
import type { Message, ContextDestination, ContextLandmark } from "@/lib/types";
import { DESTINATION_NAMES, LANDMARKS } from "@/lib/constants";

function extractDestination(text: string): string | null {
  const lower = text.toLowerCase();
  const sorted = [...DESTINATION_NAMES].sort((a, b) => b.length - a.length);
  for (const dest of sorted) {
    if (lower.includes(dest)) {
      return dest
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }
  return null;
}

function extractLandmark(text: string): ContextLandmark | null {
  const lower = text.toLowerCase();
  // Sort by name length descending so "Sheikh Zayed Mosque" matches before "Sheikh"
  const sorted = [...LANDMARKS].sort((a, b) => b.name.length - a.name.length);
  for (const lm of sorted) {
    if (lower.includes(lm.name.toLowerCase())) {
      return { name: lm.name, city: lm.city, mapQuery: lm.mapQuery, emoji: lm.emoji, nearbyLabel: lm.nearbyLabel };
    }
  }
  return null;
}

export function useDestinationContext(messages: Message[]) {
  // Landmark takes priority — if a specific attraction is mentioned, use it for precise map pinning
  const currentLandmark = useMemo<ContextLandmark | null>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const lm = extractLandmark(messages[i].content);
      if (lm) return lm;
    }
    return null;
  }, [messages]);

  const currentDestination = useMemo<ContextDestination | null>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const dest = extractDestination(msg.content);
      if (dest) return { name: dest, detectedFrom: msg.content };
    }
    return null;
  }, [messages]);

  const searchQuery = useMemo<string | null>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === "user" && msg.content.trim().length > 0) {
        return msg.content.trim();
      }
    }
    return null;
  }, [messages]);

  return { currentDestination, currentLandmark, searchQuery };
}
