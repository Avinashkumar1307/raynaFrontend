"use client";

import { useEffect, useRef, useState } from "react";
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
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
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
      className={`group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
          : "hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {/* Chat icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-4 h-4 mt-0.5 shrink-0 transition-colors ${
          isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>

      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs font-medium truncate leading-snug text-[var(--text-primary)]">
          {conversation.title}
        </p>
        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 opacity-70">
          {formatRelativeTime(conversation.updated_at)}
        </p>
      </div>

      {/* Delete button — visible on hover */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded-lg hover:bg-[var(--border-color)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
    <div className="flex items-start gap-2.5 px-3 py-2.5 animate-pulse">
      <div className="w-4 h-4 rounded-md bg-[var(--bg-card)] mt-0.5 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 bg-[var(--bg-card)] rounded-full w-4/5" />
        <div className="h-2 bg-[var(--bg-card)] rounded-full w-1/3" />
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const pendingConversation = conversations.find(
    (c) => c.session_id === pendingDeleteId
  );

  // Close on outside click (mobile only — desktop sidebar is always visible)
  useEffect(() => {
    if (!isOpen) return;

    // Small delay so the opening click doesn't immediately close it
    const timer = setTimeout(() => {
      function handleOutside(e: MouseEvent) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target as Node)
        ) {
          onClose();
        }
      }
      document.addEventListener("mousedown", handleOutside);
      cleanup = () => document.removeEventListener("mousedown", handleOutside);
    }, 100);

    let cleanup = () => {};
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [isOpen, onClose]);

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setPendingDeleteId(sessionId); // open confirmation modal
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      onDeleteConversation(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      {/* Delete confirmation modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPendingDeleteId(null)}
          />
          {/* Modal card */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-(--bg-primary) border border-(--border-color) shadow-2xl p-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-[var(--text-primary)] text-center mb-1">
              Delete conversation?
            </h3>

            {pendingConversation && (
              <p className="text-xs text-[var(--text-secondary)] text-center mb-1 px-2 truncate">
                &ldquo;{pendingConversation.title}&rdquo;
              </p>
            )}

            <p className="text-xs text-[var(--text-secondary)] text-center mb-6 opacity-70">
              This will permanently remove this chat. This cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        className={[
          // Base layout
          "flex flex-col",
          // Mobile: fixed overlay drawer
          "fixed inset-y-0 left-0 z-50 w-72",
          // Desktop: static column in flex row
          "md:relative md:inset-auto md:z-auto md:w-64 md:shrink-0",
          // Theme
          "bg-[var(--bg-secondary)] border-r border-[var(--border-color)]",
          "transition-colors duration-300",
          // Slide animation (mobile only, overridden on md+)
          "transform transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <p className="text-xs font-bold text-[var(--text-primary)] tracking-tight">
              Chat History
            </p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all text-xs font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Section label */}
        {conversations.length > 0 && (
          <div className="px-4 pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] opacity-60">
              Recent
            </p>
          </div>
        )}

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 scrollbar-thin">
          {!isAvailable ? (
            <div className="px-3 py-8 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[var(--bg-card)] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[var(--text-secondary)]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 8.485-7.875 15.75-15.75 15.75a.75.75 0 01-.75-.75V6.375m16.5 0v12.75a.75.75 0 01-.75.75H4.5m15.75-13.5a.75.75 0 00-.75-.75H5.25a.75.75 0 00-.75.75v.75h16.5v-.75z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">History unavailable</p>
              <p className="text-[10px] text-[var(--text-secondary)] opacity-60 mt-1">
                Configure MongoDB to enable
              </p>
            </div>
          ) : isLoading && conversations.length === 0 ? (
            <div className="space-y-0.5 pt-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[var(--bg-card)] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[var(--text-secondary)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">No chats yet</p>
              <p className="text-[10px] text-[var(--text-secondary)] opacity-60 mt-1">
                Start chatting to see history here
              </p>
            </div>
          ) : (
            <>
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.session_id}
                  conversation={conv}
                  isActive={conv.session_id === currentSessionId}
                  onSelect={() => onSelectConversation(conv.session_id)}
                  onDelete={(e) => handleDelete(e, conv.session_id)}
                />
              ))}

              {hasMore && (
                <button
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-40 text-center"
                >
                  {isLoading ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border-color)]">
          <a
            href="https://raynatours.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors opacity-60 hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            raynatours.com
          </a>
        </div>
      </aside>
    </>
  );
}
