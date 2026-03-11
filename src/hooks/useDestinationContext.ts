"use client";

import { useMemo } from "react";
import type { Message, ContextDestination } from "@/lib/types";
import { DESTINATION_NAMES } from "@/lib/constants";

function extractDestination(text: string): string | null {
  const lower = text.toLowerCase();
  // Sort by length descending so "Abu Dhabi" matches before "Abu", "New York" before "New", etc.
  const sorted = [...DESTINATION_NAMES].sort((a, b) => b.length - a.length);
  for (const dest of sorted) {
    if (lower.includes(dest)) {
      // Return properly capitalized version
      return dest
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }
  return null;
}

export function useDestinationContext(messages: Message[]) {
  const currentDestination = useMemo<ContextDestination | null>(() => {
    // Walk messages in reverse — check BOTH user and assistant messages
    // to detect the location being discussed right now
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const dest = extractDestination(msg.content);
      if (dest) {
        return { name: dest, detectedFrom: msg.content };
      }
    }
    return null;
  }, [messages]);

  // Extract the latest user search query
  const searchQuery = useMemo<string | null>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === "user" && msg.content.trim().length > 0) {
        return msg.content.trim();
      }
    }
    return null;
  }, [messages]);

  return { currentDestination, searchQuery };
}
