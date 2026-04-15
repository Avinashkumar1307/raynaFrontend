"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Destinations", href: "#destinations" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Why Rayna", href: "#why-rayna" },
  { label: "Reviews", href: "#testimonials" },
];

export default function LandingHeader() {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] shadow-sm"
          : "bg-transparent"
      }`}
    >
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-card)]/50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/chat"
            className="hidden sm:inline-flex px-5 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start Chatting
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-[var(--accent-green)] hover:bg-[var(--accent-green)]/5 rounded-xl transition-colors"
            >
              Start Chatting
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
