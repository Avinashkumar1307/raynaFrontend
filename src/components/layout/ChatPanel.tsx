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
  // Voice functionality
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  isPlaying?: boolean;
  isTTSLoading?: boolean;
    onStopSpeaking?: () => void;
  ttsSupported?: boolean;
  speechSupported?: boolean;
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
  voiceEnabled = false,
  onToggleVoice,
  isPlaying = false,
  isTTSLoading = false,
    onStopSpeaking,
  ttsSupported = false,
  speechSupported = false,
}: ChatPanelProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  // When conversation switches (load from history / new chat), clear any leftover animation
  useEffect(() => {
    setAnimatingIndex(null);
  }, [conversationKey]);

  // Only animate when sendMessage produces a new reply — NOT when loading history
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
            <img 
              src={theme === 'dark' ? '/rayna_logo_dark.png' : '/raynatourslogo.webp'} 
              alt="Rayna Tours Logo" 
              className="w-full h-auto" 
            />
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
          {/* Voice Control Button */}
          {ttsSupported && onToggleVoice && (
            <div className="relative">
              <button
                onClick={isPlaying ? onStopSpeaking : onToggleVoice}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                  voiceEnabled
                    ? isPlaying
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : isTTSLoading
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
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
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                ) : isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : voiceEnabled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.78V9.97c0-.99.71-1.78 1.59-1.78h2.24z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.78V9.97c0-.99.71-1.78 1.59-1.78h2.24z" />
                  </svg>
                )}
              </button>
              {voiceEnabled && !isPlaying && !isTTSLoading && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
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
      <ChatInput 
        onSend={onSendMessage} 
        disabled={isLoading}
        voiceEnabled={voiceEnabled}
        isPlaying={isPlaying}
        isTTSLoading={isTTSLoading}
      />
      
      {/* Voice Status Bar */}
      <VoiceStatus
        voiceEnabled={voiceEnabled || false}
        isPlaying={isPlaying || false}
        isTTSLoading={isTTSLoading || false}
        ttsSupported={ttsSupported || false}
        speechSupported={speechSupported || false}
      />
    </div>
  );
}
