"use client";

const PROMPTS = [
  { text: "Show me Dubai tours", icon: "🏙️" },
  { text: "Desert safari tours in Dubai", icon: "🐪" },
  { text: "Singapore city attractions", icon: "🇸🇬" },
  { text: "Thailand tour packages", icon: "🏝️" },
  { text: "Turkey travel experiences", icon: "🕌" },
  { text: "What destinations do you cover?", icon: "🌍" },
];

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
      <div className="w-24 sm:w-28 md:w-32 mb-6">
        <img src="/raynatourslogo.webp" alt="Rayna Tours" className="w-full h-auto" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-2 text-center">
        Where to today?
      </h1>
      <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-10 text-center max-w-md">
        Ask me anything about travel. Explore tours, activities, and packages across Dubai, Singapore, Thailand & more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt.text}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-3 text-left text-sm px-4 py-3.5 rounded-xl
                       bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]
                       border border-transparent hover:border-[var(--border-color)]
                       transition-all text-[var(--text-primary)] group"
          >
            <span className="text-lg flex-shrink-0">{prompt.icon}</span>
            <span>{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
