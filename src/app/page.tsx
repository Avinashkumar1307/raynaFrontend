"use client";

import { useState, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { useHistory } from "@/hooks/useHistory";
import ChatPanel from "@/components/layout/ChatPanel";
import HistorySidebar from "@/components/layout/HistorySidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    loadConversation,
    currentSessionId,
    conversationKey,
    shouldScrollToBottom,
    shouldAnimateNewMessage,
    consumeScrollTrigger,
    consumeAnimationTrigger,
  } = useChat();

  const {
    conversations,
    isLoading: historyLoading,
    hasMore,
    isAvailable,
    refresh,
    loadMore,
    deleteConversation,
  } = useHistory();

  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
      // Refresh sidebar list so updated_at / new conversations appear
      refresh();
    },
    [sendMessage, refresh]
  );

  const handleSelectConversation = useCallback(
    async (sessionId: string) => {
      await loadConversation(sessionId);
      setSidebarOpen(false);
    },
    [loadConversation]
  );

  const handleDeleteConversation = useCallback(
    async (sessionId: string) => {
      await deleteConversation(sessionId);
      // If we deleted the active conversation, start fresh
      if (sessionId === currentSessionId) {
        clearChat();
      }
    },
    [deleteConversation, currentSessionId, clearChat]
  );

  const handleNewChat = useCallback(() => {
    clearChat();
    setSidebarOpen(false);
  }, [clearChat]);

  return (
    <main className="flex h-screen bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300">
      <HistorySidebar
        conversations={conversations}
        currentSessionId={currentSessionId}
        isLoading={historyLoading}
        hasMore={hasMore}
        isOpen={sidebarOpen}
        isAvailable={isAvailable}
        onClose={() => setSidebarOpen(false)}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
        onLoadMore={loadMore}
      />

      <div className="flex-1 min-w-0 flex flex-col h-full">
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          error={error}
          conversationKey={conversationKey}
          shouldScrollToBottom={shouldScrollToBottom}
          shouldAnimateNewMessage={shouldAnimateNewMessage}
          onSendMessage={handleSendMessage}
          onClearChat={handleNewChat}
          onScrollConsumed={consumeScrollTrigger}
          onAnimationConsumed={consumeAnimationTrigger}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </div>
    </main>
  );
}
