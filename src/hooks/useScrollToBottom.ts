"use client";

import { useEffect, useRef, useCallback } from 'react';

export function useScrollToBottom(dependencies: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    // Cancel any pending scroll frame
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      const element = ref.current;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return ref;
}
