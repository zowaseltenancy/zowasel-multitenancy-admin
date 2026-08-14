"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex items-center justify-center size-10 rounded-xl border border-[#DCE8DC] dark:border-white/10 bg-white/90 dark:bg-[#141A22]/90 text-foreground backdrop-blur-md shadow-xs transition-all duration-200 hover:bg-white dark:hover:bg-[#19212D] hover:border-[#438B3E]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#438B3E] cursor-pointer active:scale-95",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="size-4.5 text-[#ED8B00] transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Moon className="size-4.5 text-[#75787B] hover:text-[#438B3E] transition-transform duration-200 rotate-0 scale-100" />
      )}
    </button>
  );
}
