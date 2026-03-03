"use client";

import { useEffect, useRef } from "react";
import type { ConversationSummary } from "@/lib/types";

interface HistorySidebarProps {
  conversations: ConversationSummary[];
  currentSessionId: string | null;
  isLoading: boolean;
  hasMore: boolean;
  isOpen: boolean;
  isAvailable: boolean;
  onClose: () => void;
  onSelectConversation: (sessionId: string) => void;
  onDeleteConversation: (sessionId: string) => void;
  onNewChat: () => void;
  onLoadMore: () => void;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: {
  conversation: ConversationSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-white/15 text-white"
          : "hover:bg-white/10 text-white/80 hover:text-white"
      }`}
    >
      {/* Chat icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/50"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight">
          {conversation.title}
        </p>
        <p className="text-xs text-white/40 mt-0.5">
          {formatRelativeTime(conversation.updated_at)}
        </p>
      </div>

      {/* Delete button — visible on hover */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded hover:bg-white/20 transition-all text-white/60 hover:text-white"
        title="Delete conversation"
        aria-label="Delete conversation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}

function SkeletonItem() {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 animate-pulse">
      <div className="w-4 h-4 rounded bg-white/10 mt-0.5 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-white/10 rounded w-4/5" />
        <div className="h-2.5 bg-white/10 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function HistorySidebar({
  conversations,
  currentSessionId,
  isLoading,
  hasMore,
  isOpen,
  isAvailable,
  onClose,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  onLoadMore,
}: HistorySidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  // Close on outside click (mobile)
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    onDeleteConversation(sessionId);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col w-72
          bg-gradient-to-b from-gray-900 to-black
          border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          md:relative md:inset-auto md:z-auto md:w-64 md:translate-x-0 md:flex md:flex-shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Rayna Tours</h1>
            <p className="text-xs text-white/50">AI Travel Assistant</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {!isAvailable ? (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-white/40">History unavailable</p>
              <p className="text-xs text-white/30 mt-1">Configure MongoDB to enable</p>
            </div>
          ) : isLoading && conversations.length === 0 ? (
            <div className="space-y-0.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 mx-auto text-white/20 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <p className="text-xs text-white/40">No conversations yet</p>
              <p className="text-xs text-white/30 mt-0.5">Start chatting to see history</p>
            </div>
          ) : (
            <>
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.session_id}
                  conversation={conv}
                  isActive={conv.session_id === currentSessionId}
                  onSelect={() => {
                    onSelectConversation(conv.session_id);
                    onClose();
                  }}
                  onDelete={(e) => handleDelete(e, conv.session_id)}
                />
              ))}

              {hasMore && (
                <button
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-xs text-white/50 hover:text-white/80 transition-colors disabled:opacity-40"
                >
                  {isLoading ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10">
          <a
            href="https://raynatours.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            raynatours.com
          </a>
        </div>
      </aside>
    </>
  );
}
