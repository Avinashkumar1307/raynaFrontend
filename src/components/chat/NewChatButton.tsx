"use client";

interface NewChatButtonProps {
  onClear: () => void;
  disabled: boolean;
}

export default function NewChatButton({ onClear, disabled }: NewChatButtonProps) {
  return (
    <button
      onClick={() => !disabled && onClear()}
      disabled={disabled}
      className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-all px-3 py-1.5 rounded-lg hover:bg-[var(--bg-card)]"
      title="New chat"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span className="hidden sm:inline">New Chat</span>
      <span className="sm:hidden">New</span>
    </button>
  );
}
