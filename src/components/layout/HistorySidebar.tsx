"use client";

import { useEffect, useRef, useState } from "react";
import type { ConversationSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Plus,
  Trash2,
  MessageSquare,
  Globe,
  X,
  Search,
  SlidersHorizontal,
  Compass,
  Map,
  Settings,
  Heart,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

const NAV_ICONS = [
  { icon: MessageSquare, label: "Chats", href: "/chat", active: true },
  { icon: Compass, label: "Explore", href: "/", active: false },
  { icon: CalendarDays, label: "Trip Planner", href: "/trip-planner", active: false },
  { icon: Map, label: "Map", href: "/trip-planner", active: false },
];

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
      className={cn(
        "group flex items-start gap-3 px-3 py-3 cursor-pointer transition-all duration-150 rounded-xl mx-1",
        isActive
          ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
          : "hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      )}
    >
      {/* Avatar */}
      <div className="size-9 shrink-0 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          {conversation.title.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate text-[var(--text-primary)]">
            {conversation.title}
          </p>
          <span className="text-[10px] text-[var(--text-tertiary)] shrink-0 ml-2">
            {formatRelativeTime(conversation.updated_at)}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
          Can you suggest an exciting trip for me?
        </p>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 shrink-0 self-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        aria-label="Delete conversation"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function SkeletonItem() {
  return (
    <div className="flex items-start gap-3 px-3 py-3 mx-1">
      <Skeleton className="size-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-4/5 rounded-full" />
        <Skeleton className="h-2.5 w-2/3 rounded-full" />
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "trips">("all");

  const pendingConversation = conversations.find(
    (c) => c.session_id === pendingDeleteId
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close on outside click (mobile only)
  useEffect(() => {
    if (!isOpen) return;

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
    setPendingDeleteId(sessionId);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      onDeleteConversation(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      {/* Delete confirmation dialog */}
      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader className="items-center text-center">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-destructive/10 border border-destructive/20 mx-auto mb-2">
              <Trash2 className="size-5 text-destructive" />
            </div>
            <DialogTitle className="text-sm">Delete conversation?</DialogTitle>
            {pendingConversation && (
              <DialogDescription className="text-xs truncate px-2">
                &ldquo;{pendingConversation.title}&rdquo;
              </DialogDescription>
            )}
          </DialogHeader>
          <p className="text-xs text-muted-foreground text-center">
            This will permanently remove this chat. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <DialogClose
              render={
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl text-xs"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl text-xs"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
        className={cn(
          "flex flex-row h-full",
          "fixed inset-y-0 left-0 z-50 w-80",
          "md:relative md:inset-auto md:z-auto md:w-[304px] md:shrink-0 md:h-screen",
          "bg-[var(--bg-secondary)] border-r border-[var(--border-color)]",
          "transition-colors duration-300",
          "transform transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Icon Navigation Strip - desktop only */}
        <TooltipProvider>
          <div className="hidden md:flex flex-col items-center py-4 px-2 gap-2 bg-[var(--icon-strip-bg)] border-r border-[var(--border-color)] w-14 shrink-0">
            {/* Logo icon */}
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-accent)] flex items-center justify-center mb-4">
              <span className="text-[var(--bg-primary)] text-xs font-bold">R</span>
            </div>

            {/* Nav icons */}
            {NAV_ICONS.map(({ icon: Icon, label, href, active }) => (
              <Tooltip key={label}>
                <TooltipTrigger
                  render={
                    <Link
                      href={href}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        active
                          ? "bg-[var(--icon-strip-active)] text-[var(--text-primary)]"
                          : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--icon-strip-active)]"
                      )}
                    />
                  }
                >
                  <Icon className="size-5" strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}

            {/* Bottom spacer and user avatar */}
            <div className="mt-auto">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center">
                <Globe className="size-4 text-[var(--text-tertiary)]" />
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Main Sidebar Content */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Chats
              </h2>
              <Badge
                variant="secondary"
                className="rounded-full text-[11px] px-2 py-0.5 bg-[var(--bg-card)] text-[var(--text-secondary)] h-auto"
              >
                {conversations.length}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                onClick={onNewChat}
                size="sm"
                className="bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-white rounded-lg text-xs font-semibold px-3 gap-1.5"
              >
                New Chat
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onClose}
                className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close sidebar"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-tertiary)] transition-colors"
              />
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors" />
            </div>
          </div>

          {/* Tab filter */}
          <div className="flex gap-2 px-4 pb-3">
            <button
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full transition-colors",
                activeTab === "all"
                  ? "bg-[var(--filter-chip-active-bg)] text-[var(--filter-chip-active-text)]"
                  : "bg-[var(--filter-chip-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full transition-colors",
                activeTab === "trips"
                  ? "bg-[var(--filter-chip-active-bg)] text-[var(--filter-chip-active-text)]"
                  : "bg-[var(--filter-chip-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
              onClick={() => setActiveTab("trips")}
            >
              Trips
            </button>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto py-1">
            {!isAvailable ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mb-4">
                  <Globe className="size-7 text-[var(--text-tertiary)]" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  History unavailable
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1 max-w-[200px]">
                  Configure MongoDB to enable chat history
                </p>
              </div>
            ) : isLoading && conversations.length === 0 ? (
              <div className="space-y-0.5 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonItem key={i} />
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mb-4">
                  <MessageSquare className="size-7 text-[var(--text-tertiary)]" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  No Chat History
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1 max-w-[200px]">
                  {searchTerm ? "No conversations match your search" : "Start a new conversation to see your chat history here"}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-0.5">
                  {filteredConversations.map((conv) => (
                    <ConversationItem
                      key={conv.session_id}
                      conversation={conv}
                      isActive={conv.session_id === currentSessionId}
                      onSelect={() => onSelectConversation(conv.session_id)}
                      onDelete={(e) => handleDelete(e, conv.session_id)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="w-full text-xs text-[var(--text-secondary)] mt-1"
                  >
                    {isLoading ? "Loading..." : "Load more"}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Footer: + New Chat button */}
          <div className="p-3 mt-auto border-t border-[var(--border-color)]">
            <Button
              onClick={onNewChat}
              variant="outline"
              className="w-full justify-center gap-2 rounded-xl text-sm font-medium border-dashed border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] py-2.5"
            >
              <Plus className="size-4" />
              New Chat
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
