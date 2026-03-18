"use client";

import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-[var(--text-secondary)]"
        aria-label="Toggle theme"
      >
        <Moon className="size-4 sm:size-5" />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          />
        }
      >
        {theme === "dark" ? (
          <Sun className="size-4 sm:size-5" />
        ) : (
          <Moon className="size-4 sm:size-5" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      </TooltipContent>
    </Tooltip>
  );
}
