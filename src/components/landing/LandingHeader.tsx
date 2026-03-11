"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LandingHeader() {
  const { theme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-24 sm:w-28">
            <img
              src={theme === "dark" ? "/rayna_logo_dark.png" : "/raynatourslogo.webp"}
              alt="Rayna Tours"
              className="w-full h-auto"
            />
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/chat"
            className="px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start chatting
          </Link>
        </div>
      </div>
    </header>
  );
}
