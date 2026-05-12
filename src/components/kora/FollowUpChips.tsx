"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface FollowUpChipsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function FollowUpChips({ questions, onSelect }: FollowUpChipsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-3 space-y-2 animate-fade-in">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark px-1">
        Follow up
      </p>
      <div className="flex flex-col gap-1.5">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className={cn(
              "group flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left text-xs",
              "bg-surface-light dark:bg-surface-dark",
              "border border-border-light dark:border-border-dark",
              "hover:border-sage-300 dark:hover:border-sage-700",
              "hover:bg-sage-50/50 dark:hover:bg-sage-900/20",
              "transition-all duration-150"
            )}
          >
            <span className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors">
              {q}
            </span>
            <ArrowUpRight
              className="w-3 h-3 flex-shrink-0 text-text-muted-light dark:text-text-muted-dark group-hover:text-sage-500 dark:group-hover:text-sage-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150"
            />
          </button>
        ))}
      </div>
    </div>
  );
}