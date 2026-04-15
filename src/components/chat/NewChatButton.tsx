"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

interface NewChatButtonProps {
  onClear: () => void;
  disabled: boolean;
}

export default function NewChatButton({
  onClear,
  disabled,
}: NewChatButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => !disabled && onClear()}
            disabled={disabled}
            className="gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          />
        }
      >
        <Plus className="size-3.5 sm:size-4" />
        <span className="hidden sm:inline text-xs">New Chat</span>
        <span className="sm:hidden text-xs">New</span>
      </TooltipTrigger>
      <TooltipContent>Start a new conversation</TooltipContent>
    </Tooltip>
  );
}
