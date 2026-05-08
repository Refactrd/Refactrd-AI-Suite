"use client";

import { useState } from "react";
import { Citation } from "@/types";
import { cn } from "@/lib/utils";
import { FileText, ChevronDown } from "lucide-react";

interface CitationPanelProps {
  citations: Citation[];
}

export function CitationPanel({ citations }: CitationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5",
          "bg-sage-50/60 dark:bg-sage-900/20",
          "hover:bg-sage-100/60 dark:hover:bg-sage-900/30",
          "transition-colors duration-150 text-left"
        )}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" strokeWidth={1.5} />
          <span className="text-xs font-medium text-sage-700 dark:text-sage-300">
            {citations.length} source{citations.length > 1 ? "s" : ""} referenced
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-sage-500 dark:text-sage-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Citations list */}
      {isOpen && (
        <div className="divide-y divide-border-light dark:divide-border-dark animate-fade-in">
          {citations.map((citation, index) => (
            <div
              key={index}
              className="px-3 py-3 bg-surface-light dark:bg-surface-dark"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-semibold text-sage-600 dark:text-sage-400 uppercase tracking-wider">
                  {citation.documentName}
                </span>
                {citation.relevanceScore && (
                  <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
                    · {Math.round(citation.relevanceScore * 100)}% match
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed line-clamp-3">
                {citation.chunkContent}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}