"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Compass, Building2, Plane, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const PROMPTS = [
  {
    text: "Discover where to go next",
    description: "What's the best island in Hawaii for a family vacation? Include a comparison...",
    icon: Compass,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    text: "Explore Hotels in This Area",
    description: "Can you show me a list of the best five-star hotels in...",
    icon: Building2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    text: "Flights",
    description: "Find me flights from SFO to Patagonia via Buenos...",
    icon: Plane,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    text: "Looking for a place?",
    description: "Can you show me a list of the best five-star hotels in...",
    icon: Search,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
      <div className="w-full max-w-lg">
        {/* Greeting */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">
          Hey there, <span className="text-[var(--accent-green)]">Traveler</span>
        </h1>
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2">
          Where do you want to travel?
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md">
          I&apos;m your travel assistant. Ready when you are with tips, plans, and more!
        </p>

        {/* 2x2 Prompt Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {PROMPTS.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <Card
                key={prompt.text}
                onClick={() => onSelect(prompt.text)}
                className={cn(
                  "cursor-pointer border border-[var(--border-color)] bg-[var(--bg-card)]",
                  "hover:bg-[var(--bg-card-hover)] transition-all duration-200",
                  "hover:shadow-md hover:scale-[1.02] py-0 ring-0",
                  "animate-[staggerIn_0.4s_ease-out_both]"
                )}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CardContent className="flex items-start gap-3 px-4 py-4">
                  <div className={cn("p-2.5 rounded-xl shrink-0", prompt.bg)}>
                    <Icon className={cn("size-5", prompt.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                      {prompt.text}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-2 leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Refresh Prompt */}
        <div className="flex justify-center">
          <button className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group">
            <RefreshCw className="size-3.5 group-hover:rotate-180 transition-transform duration-500" />
            Refresh Prompt
          </button>
        </div>
      </div>
    </div>
  );
}
