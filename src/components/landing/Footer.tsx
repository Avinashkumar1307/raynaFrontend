"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { SUPPORTED_DESTINATIONS } from "@/lib/constants";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src={theme === "dark" ? "/rayna_logo_dark.png" : "/raynatourslogo.webp"}
                alt="Rayna Tours"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mb-4">
              Your AI-powered travel companion. Discover, plan, and book amazing tours and activities worldwide.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <Sparkles className="size-4 text-amber-500" />
              Try AI Assistant
            </Link>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">
              Destinations
            </h4>
            <ul className="space-y-2.5">
              {SUPPORTED_DESTINATIONS.slice(0, 7).map((dest) => (
                <li key={dest.name}>
                  <Link
                    href={`/chat?destination=${encodeURIComponent(dest.name)}`}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">
              Quick links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/chat" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  AI Chat Assistant
                </Link>
              </li>
              <li>
                <a href="https://www.raynatours.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Browse Tours
                </a>
              </li>
              <li>
                <a href="https://www.raynatours.com/about" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  About Rayna Tours
                </a>
              </li>
              <li>
                <a href="https://www.raynatours.com/contact" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://www.raynatours.com/blog" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Travel Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://www.raynatours.com/faq" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="https://www.raynatours.com/terms" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="https://www.raynatours.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://www.raynatours.com/cancellation-policy" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} Rayna Tours. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
            <Sparkles className="size-3 text-amber-500" />
            Powered by AI
          </div>
        </div>
      </div>
    </footer>
  );
}
