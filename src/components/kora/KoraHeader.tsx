"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, RotateCcw, Sparkles, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface KoraHeaderProps {
  onClear: () => void;
  onToggleHistory: () => void;
  hasMessages: boolean;
  historyOpen: boolean;
  sessionCount: number;
}

export function KoraHeader({
  onClear,
  onToggleHistory,
  hasMessages,
  historyOpen,
  sessionCount,
}: KoraHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sage-400 dark:bg-sage-600">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-lg leading-none text-primary-DEFAULT dark:text-primary-dark">
            Kora
          </span>
          <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark leading-none mt-0.5 tracking-wide">
            Meridian Works
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* History toggle */}
        <button
          onClick={onToggleHistory}
          className={cn(
            "relative flex items-center justify-center w-8 h-8 rounded-lg",
            "transition-all duration-200",
            historyOpen
              ? "bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-800"
              : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-light dark:hover:bg-surface-dark border border-transparent hover:border-border-light dark:hover:border-border-dark"
          )}
          aria-label="Chat history"
        >
          <History className="w-4 h-4" strokeWidth={1.5} />
          {sessionCount > 0 && !historyOpen && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-sage-400 dark:bg-sage-600 text-white text-[9px] font-bold">
              {sessionCount > 9 ? "9+" : sessionCount}
            </span>
          )}
        </button>

        {/* New chat */}
        {hasMessages && (
          <button
            onClick={onClear}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
              "text-text-secondary-light dark:text-text-secondary-dark",
              "hover:bg-surface-light dark:hover:bg-surface-dark",
              "border border-transparent hover:border-border-light dark:hover:border-border-dark",
              "transition-all duration-200"
            )}
          >
            <RotateCcw className="w-3 h-3" />
            New chat
          </button>
        )}

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg",
              "text-text-secondary-light dark:text-text-secondary-dark",
              "hover:bg-surface-light dark:hover:bg-surface-dark",
              "border border-transparent hover:border-border-light dark:hover:border-border-dark",
              "transition-all duration-200"
            )}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </header>
  );
}