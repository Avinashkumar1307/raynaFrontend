"use client";

import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useHistory } from "@/hooks/useHistory";
import { useDestinationContext } from "@/hooks/useDestinationContext";
import ChatPanel from "@/components/layout/ChatPanel";
import HistorySidebar from "@/components/layout/HistorySidebar";
import ContextSidebar from "@/components/layout/ContextSidebar";
import CartDrawer from "@/components/layout/CartDrawer";
import SavedDrawer from "@/components/layout/SavedDrawer";
import { CartProvider } from "@/context/CartContext";

function ChatContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const searchParams = useSearchParams();
  const hasAutoSent = useRef(false);

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    );
  }, []);

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
    voiceEnabled,
    toggleVoice,
    isPlaying,
    isTTSLoading,
    stopSpeaking,
    ttsSupported,
    streamStatus,
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

  const { currentDestination, currentLandmark, searchQuery } =
    useDestinationContext(messages);

  // Auto-send from URL params (?destination=Dubai or ?q=query)
  useEffect(() => {
    if (hasAutoSent.current) return;
    if (messages.length > 0) return;

    const destination = searchParams.get("destination");
    const query = searchParams.get("q");

    if (destination) {
      hasAutoSent.current = true;
      sendMessage(`Show me tours in ${destination}`);
      refresh();
    } else if (query) {
      hasAutoSent.current = true;
      sendMessage(query);
      refresh();
    }
  }, [searchParams, messages.length, sendMessage, refresh]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
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
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SavedDrawer isOpen={savedOpen} onClose={() => setSavedOpen(false)} />
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
          onOpenContextSidebar={() => setRightSidebarOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          onOpenSaved={() => setSavedOpen(true)}
          voiceEnabled={voiceEnabled}
          onToggleVoice={toggleVoice}
          isPlaying={isPlaying}
          isTTSLoading={isTTSLoading}
          onStopSpeaking={stopSpeaking}
          ttsSupported={ttsSupported}
          speechSupported={speechSupported}
          streamStatus={streamStatus}
        />
      </div>

      <ContextSidebar
        destination={currentDestination?.name || null}
        landmark={currentLandmark}
        searchQuery={searchQuery}
        isOpen={rightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
        onSendPrompt={handleSendMessage}
      />
    </main>
  );
}

export default function ChatPage() {
  return (
    <CartProvider>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--text-tertiary)] border-t-[var(--text-primary)]" />
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </CartProvider>
  );
}
