"use client";

interface Props {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export default function SuggestionChips({ suggestions, onSelect, disabled }: Props) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 ml-10 stagger-in">
      {suggestions.map((text) => (
        <button
          key={text}
          disabled={disabled}
          onClick={() => onSelect(text)}
          className="px-4 py-2 rounded-full text-xs font-medium border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-[1.02] hover:shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
