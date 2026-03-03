"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import type { ConversationSummary } from "@/lib/types";

export function useHistory() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchConversations = useCallback(async (reset = false) => {
    setIsLoading(true);
    const page = reset ? 1 : currentPage;
    try {
      const data = await api.getConversations(page);
      if (reset) {
        setConversations(data.conversations);
        setCurrentPage(1);
      } else {
        setConversations((prev) => [...prev, ...data.conversations]);
      }
      setHasMore(page < data.pagination.pages);
      setIsAvailable(true);
    } catch (err) {
      // DB not connected — hide history gracefully
      if (err instanceof Error && err.message.includes("503")) {
        setIsAvailable(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // Load on mount
  useEffect(() => {
    fetchConversations(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  const loadMore = useCallback(() => {
    setCurrentPage((p) => p + 1);
  }, []);

  // Fetch next page when currentPage increments past 1
  useEffect(() => {
    if (currentPage > 1) {
      fetchConversations(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const deleteConversation = useCallback(async (sessionId: string) => {
    try {
      await api.deleteConversation(sessionId);
      setConversations((prev) => prev.filter((c) => c.session_id !== sessionId));
    } catch {
      // Ignore — let the UI handle optimistically
    }
  }, []);

  return {
    conversations,
    isLoading,
    hasMore,
    isAvailable,
    refresh,
    loadMore,
    deleteConversation,
  };
}
