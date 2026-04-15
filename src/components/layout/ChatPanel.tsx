"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message } from "@/lib/types";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import NewChatButton from "@/components/chat/NewChatButton";
import QuickPrompts from "@/components/ui/QuickPrompts";
import TopFilterBar from "@/components/filters/TopFilterBar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useFilters } from "@/context/FilterContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Menu, Map, ShoppingCart, Heart } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

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
  onOpenSaved?: () => void;
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
  onOpenSaved,
  voiceEnabled = false,
  isPlaying = false,
  isTTSLoading = false,
  streamStatus,
}: ChatPanelProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const { totalItems } = useCart();
  const { totalSaved } = useSaved();
  const { filters, hasActiveFilters } = useFilters();

  // Enrich message with active filter context
  const handleSendWithFilters = useCallback(
    (content: string) => {
      if (!hasActiveFilters) {
        onSendMessage(content);
        return;
      }
      const parts: string[] = [];
      if (filters.destination) parts.push(`in ${filters.destination}`);
      if (filters.dateRange.start || filters.dateRange.end) {
        const from = filters.dateRange.start || "";
        const to = filters.dateRange.end || "";
        if (from && to) parts.push(`from ${from} to ${to}`);
        else if (from) parts.push(`starting ${from}`);
        else if (to) parts.push(`until ${to}`);
      }
      if (filters.travelers > 1) parts.push(`for ${filters.travelers} travelers`);
      if (filters.budgetRange.min !== null || filters.budgetRange.max !== null) {
        const min = filters.budgetRange.min;
        const max = filters.budgetRange.max;
        if (min !== null && max !== null) parts.push(`with budget $${min}-$${max}`);
        else if (min !== null) parts.push(`with budget $${min}+`);
        else if (max !== null) parts.push(`with budget up to $${max}`);
      }
      const filterSuffix = parts.length > 0 ? ` (${parts.join(", ")})` : "";
      onSendMessage(content + filterSuffix);
    },
    [onSendMessage, filters, hasActiveFilters]
  );

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
      <TooltipProvider>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenSidebar}
                    className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    aria-label="Open chat history"
                  />
                }
              >
                <Menu className="size-5" />
              </TooltipTrigger>
              <TooltipContent>Chat history</TooltipContent>
            </Tooltip>
            <h1 className="text-base font-semibold text-[var(--text-primary)]">
              New Chat
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenContextSidebar && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenContextSidebar}
                      className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      aria-label="Show tours"
                    />
                  }
                >
                  <Map className="size-5" />
                </TooltipTrigger>
                <TooltipContent>Explore tours</TooltipContent>
              </Tooltip>
            )}
            {onOpenSaved && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenSaved}
                      className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      aria-label="Saved items"
                    />
                  }
                >
                  <Heart className="size-5" />
                  {totalSaved > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                      {totalSaved}
                    </span>
                  )}
                </TooltipTrigger>
                <TooltipContent>Saved items</TooltipContent>
              </Tooltip>
            )}
            {onOpenCart && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenCart}
                      className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      aria-label="Open cart"
                    />
                  }
                >
                  <ShoppingCart className="size-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[var(--accent-green)] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                      {totalItems}
                    </span>
                  )}
                </TooltipTrigger>
                <TooltipContent>My cart</TooltipContent>
              </Tooltip>
            )}
            <ThemeToggle />
            <NewChatButton onClear={onClearChat} disabled={isLoading} />
          </div>
        </div>
      </TooltipProvider>

      {/* Filter Bar */}
      <TopFilterBar />

      {/* Messages area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <QuickPrompts onSelect={handleSendWithFilters} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList
              messages={messages}
              animatingIndex={animatingIndex}
              shouldScrollToBottom={shouldScrollToBottom}
              onScrollTriggered={onScrollConsumed}
              onSendMessage={handleSendWithFilters}
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
        <div className="px-4 sm:px-6 py-2.5 bg-destructive/10">
          <p className="text-xs sm:text-sm text-destructive max-w-2xl mx-auto">
            {error}
          </p>
        </div>
      )}

      <ChatInput
        onSend={handleSendWithFilters}
        disabled={isLoading}
        voiceEnabled={voiceEnabled}
        isPlaying={isPlaying}
        isTTSLoading={isTTSLoading}
      />
    </div>
  );
}
