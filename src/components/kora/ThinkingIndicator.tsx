"use client";

import { Sparkles } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      {/* Kora avatar */}
      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-sage-400 dark:bg-sage-600 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
      </div>

      {/* Thinking dots */}
      <div className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl rounded-tl-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
        <span
          className="w-1.5 h-1.5 rounded-full bg-sage-400 dark:bg-sage-500 animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "900ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-sage-400 dark:bg-sage-500 animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "900ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-sage-400 dark:bg-sage-500 animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "900ms" }}
        />
      </div>
    </div>
  );
}