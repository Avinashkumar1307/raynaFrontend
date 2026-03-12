"use client";

import { useState, useEffect } from "react";
import type { Message } from "@/lib/types";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import NewChatButton from "@/components/chat/NewChatButton";
import QuickPrompts from "@/components/ui/QuickPrompts";
import ThemeToggle from "@/components/ui/ThemeToggle";
import VoiceStatus from "@/components/ui/VoiceStatus";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/context/CartContext";

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  shouldScrollToBottom: boolean;
  shouldAnimateNewMessage: boolean;
  conversationKey: number;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onScrollConsumed: () => void;
  onAnimationConsumed: () => void;
  onOpenSidebar: () => void;
  onOpenContextSidebar?: () => void;
  onOpenCart?: () => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  isPlaying?: boolean;
  isTTSLoading?: boolean;
  onStopSpeaking?: () => void;
  ttsSupported?: boolean;
  speechSupported?: boolean;
  streamStatus?: string | null;
}

export default function ChatPanel({
  messages,
  isLoading,
  error,
  shouldScrollToBottom,
  shouldAnimateNewMessage,
  conversationKey,
  onSendMessage,
  onClearChat,
  onScrollConsumed,
  onAnimationConsumed,
  onOpenSidebar,
  onOpenContextSidebar,
  onOpenCart,
  voiceEnabled = false,
  onToggleVoice,
  isPlaying = false,
  isTTSLoading = false,
  onStopSpeaking,
  ttsSupported = false,
  speechSupported = false,
  streamStatus,
}: ChatPanelProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const { totalItems } = useCart();

  useEffect(() => {
    setAnimatingIndex(null);
  }, [conversationKey]);

  useEffect(() => {
    if (!shouldAnimateNewMessage) return;
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "assistant") {
      setAnimatingIndex(messages.length - 1);
      onAnimationConsumed();
    }
  }, [shouldAnimateNewMessage, messages, onAnimationConsumed]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Open chat history"
            title="Chat history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <div className="w-20 sm:w-24">
            <img
              src={theme === 'dark' ? '/rayna_logo_dark.png' : '/raynatourslogo.webp'}
              alt="Rayna Tours"
              className="w-full h-auto"
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Voice response button — commented out for now
          {ttsSupported && onToggleVoice && (
            <button
              onClick={isPlaying ? onStopSpeaking : onToggleVoice}
              className={`p-2 rounded-lg transition-all ${
                voiceEnabled
                  ? isPlaying
                    ? 'bg-red-500/10 text-red-500'
                    : isTTSLoading
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'hover:bg-[var(--bg-card)] text-[var(--text-secondary)]'
              }`}
              title={
                isPlaying
                  ? 'Stop speaking'
                  : voiceEnabled
                  ? 'Voice responses enabled - Click to disable'
                  : 'Voice responses disabled - Click to enable'
              }
            >
              {isTTSLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
              ) : isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : voiceEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.78V9.97c0-.99.71-1.78 1.59-1.78h2.24z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.78V9.97c0-.99.71-1.78 1.59-1.78h2.24z" />
                </svg>
              )}
            </button>
          )}
          */}
          {onOpenContextSidebar && (
            <button
              onClick={onOpenContextSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Show tours"
              title="Explore tours"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
            </button>
          )}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Open cart"
              title="My cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {totalItems}
                </span>
              )}
            </button>
          )}
          <ThemeToggle />
          <NewChatButton onClear={onClearChat} disabled={isLoading} />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <QuickPrompts onSelect={onSendMessage} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList
              messages={messages}
              animatingIndex={animatingIndex}
              shouldScrollToBottom={shouldScrollToBottom}
              onScrollTriggered={onScrollConsumed}
              onSendMessage={onSendMessage}
              isLoading={isLoading}
            />
            {isLoading && (
              <div className="px-4 sm:px-6 md:px-8 py-2">
                <div className="max-w-2xl mx-auto">
                  <TypingIndicator status={streamStatus} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error bar */}
      {error && (
        <div className="px-4 sm:px-6 py-2.5 bg-red-500/10">
          <p className="text-xs sm:text-sm text-red-400 max-w-2xl mx-auto">{error}</p>
        </div>
      )}

      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading}
        voiceEnabled={voiceEnabled}
        isPlaying={isPlaying}
        isTTSLoading={isTTSLoading}
      />

      {/* VoiceStatus — commented out for now
      <VoiceStatus
        voiceEnabled={voiceEnabled || false}
        isPlaying={isPlaying || false}
        isTTSLoading={isTTSLoading || false}
        ttsSupported={ttsSupported || false}
        speechSupported={speechSupported || false}
      />
      */}
    </div>
  );
}
