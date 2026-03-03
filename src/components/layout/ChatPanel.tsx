"use client";

import { useState, useEffect } from "react";
import type { Message } from "@/lib/types";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import NewChatButton from "@/components/chat/NewChatButton";
import QuickPrompts from "@/components/ui/QuickPrompts";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  shouldScrollToBottom: boolean;
  shouldAnimateNewMessage: boolean;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onScrollConsumed: () => void;
  onAnimationConsumed: () => void;
  onOpenSidebar: () => void;
}

export default function ChatPanel({
  messages,
  isLoading,
  error,
  shouldScrollToBottom,
  shouldAnimateNewMessage,
  onSendMessage,
  onClearChat,
  onScrollConsumed,
  onAnimationConsumed,
  onOpenSidebar,
}: ChatPanelProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  // Only animate when sendMessage produces a new reply — NOT when loading history
  useEffect(() => {
    if (!shouldAnimateNewMessage) return;
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "assistant") {
      setAnimatingIndex(messages.length - 1);
      onAnimationConsumed(); // reset the flag immediately
    }
  }, [shouldAnimateNewMessage, messages, onAnimationConsumed]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar toggle — always visible */}
          <button
            onClick={onOpenSidebar}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Open chat history"
            title="Chat history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>

          <div className="w-20 sm:w-24 md:w-28 rounded-xl flex items-center justify-center flex-shrink-0">
            <img src="/raynatourslogo.webp" alt="Rayna Tours Logo" className="w-full h-auto" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate">
              Rayna AI
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 flex-shrink-0" />
              <p className="text-xs text-[var(--text-secondary)]">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            />
            {isLoading && (
              <div className="px-3 sm:px-4 md:px-6 py-2">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error bar */}
      {error && (
        <div className="px-3 sm:px-4 md:px-6 py-2.5 bg-red-500/10 border-t border-red-500/20">
          <p className="text-xs sm:text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}
