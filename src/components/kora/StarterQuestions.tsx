"use client";

import { StarterQuestion } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface StarterQuestionsProps {
  questions: StarterQuestion[];
  onSelect: (question: string) => void;
}

export function StarterQuestions({ questions, onSelect }: StarterQuestionsProps) {
  return (
    <div className="w-full max-w-2xl">
      <p className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-4 text-center">
        Try asking
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => onSelect(q.question)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={cn(
              "group relative flex items-start justify-between gap-3 p-4 rounded-xl text-left",
              "bg-surface-light dark:bg-surface-dark",
              "border border-border-light dark:border-border-dark",
              "hover:border-sage-300 dark:hover:border-sage-700",
              "hover:bg-sage-50/50 dark:hover:bg-sage-900/20",
              "transition-all duration-200 animate-slide-up",
              "cursor-pointer"
            )}
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-sage-600 dark:text-sage-400 uppercase tracking-wider">
                {q.label}
              </span>
              <span className="text-sm text-text-primary-light dark:text-text-primary-dark leading-snug">
                {q.question}
              </span>
            </div>
            <ArrowUpRight
              className={cn(
                "w-4 h-4 flex-shrink-0 mt-0.5",
                "text-text-muted-light dark:text-text-muted-dark",
                "group-hover:text-sage-500 dark:group-hover:text-sage-400",
                "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                "transition-all duration-200"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}