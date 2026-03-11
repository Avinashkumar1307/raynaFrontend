"use client";

import MessageBubble from "./MessageBubble";
import type { Message } from "@/lib/types";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import TourCarousel from "./TourCarousel";
import ProductCarousel from "./ProductCarousel";


interface MessageListProps {
  messages: Message[];
  animatingIndex: number | null;
  shouldScrollToBottom?: boolean;
  onScrollTriggered?: () => void;
}

export default function MessageList({
  messages,
  animatingIndex,
  shouldScrollToBottom,
  onScrollTriggered
}: MessageListProps) {
  const containerRef = useScrollToBottom([
    messages.length,
    animatingIndex,
    shouldScrollToBottom,
  ]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6"
      style={{
        maxHeight: '100%',
        scrollBehavior: 'smooth'
      }}
    >
      <div className="flex flex-col gap-6 sm:gap-8 max-w-2xl mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-3">
            <MessageBubble
              message={msg}
              animate={i === animatingIndex}
            />
            {msg.role === "assistant" && msg.productCarousel ? (
              <div className="animate-card-in">
                <ProductCarousel carousel={msg.productCarousel} />
              </div>
            ) : msg.role === "assistant" && msg.tourCarousel ? (
              <div className="animate-card-in">
                <TourCarousel carousel={msg.tourCarousel} />
              </div>
            ) : null}
          </div>
        ))}

        <div style={{ height: '1px', minHeight: '1px' }} />
      </div>
    </div>
  );
}
