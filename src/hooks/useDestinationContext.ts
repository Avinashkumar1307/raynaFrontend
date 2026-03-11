"use client";

import { useMemo } from "react";
import type { Message, ContextDestination } from "@/lib/types";
import { DESTINATION_NAMES } from "@/lib/constants";

function extractDestination(text: string): string | null {
  const lower = text.toLowerCase();
  for (const dest of DESTINATION_NAMES) {
    if (lower.includes(dest)) {
      // Return properly capitalized version
      return dest.charAt(0).toUpperCase() + dest.slice(1);
    }
  }
  return null;
}

export function useDestinationContext(messages: Message[]) {
  const currentDestination = useMemo<ContextDestination | null>(() => {
    // Walk messages in reverse, find latest user message mentioning a known destination
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === "user") {
        const dest = extractDestination(msg.content);
        if (dest) {
          return { name: dest, detectedFrom: msg.content };
        }
      }
    }
    return null;
  }, [messages]);

  // Extract the latest user search query (keywords without the destination name)
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
