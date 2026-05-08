"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

const MAX_CHARS = 500;

interface InputBarProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export function InputBar({ onSend, isLoading, hasMessages }: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = value.trim().length === 0;
  const canSend = !isEmpty && !isOverLimit && !isLoading;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto resize
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="px-4 pb-6 pt-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-border-light dark:border-border-dark">
      <div className="max-w-2xl mx-auto">
        <div
          className={cn(
            "relative flex items-end gap-3 px-4 py-3 rounded-2xl",
            "bg-surface-light dark:bg-surface-dark",
            "border transition-colors duration-200",
            isOverLimit
              ? "border-red-300 dark:border-red-800"
              : "border-border-light dark:border-border-dark focus-within:border-sage-300 dark:focus-within:border-sage-700"
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              hasMessages
                ? "Ask a follow-up question..."
                : "Ask Kora anything about Meridian Works..."
            }
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent outline-none",
              "text-sm text-text-primary-light dark:text-text-primary-dark",
              "placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark",
              "leading-relaxed max-h-40 py-0.5"
            )}
          />

          {/* Right side: char count + send */}
          <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
            {/* Character counter */}
            {charCount > 400 && (
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  isOverLimit
                    ? "text-red-500 dark:text-red-400"
                    : "text-text-muted-light dark:text-text-muted-dark"
                )}
              >
                {MAX_CHARS - charCount}
              </span>
            )}

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-xl",
                "transition-all duration-200",
                canSend
                  ? "bg-sage-400 dark:bg-sage-600 hover:bg-sage-500 dark:hover:bg-sage-500 text-white cursor-pointer"
                  : "bg-border-light dark:bg-border-dark text-text-muted-light dark:text-text-muted-dark cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              {isLoading ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[10px] text-text-muted-light dark:text-text-muted-dark mt-2.5">
          Kora answers from Meridian Works documents only. Press{" "}
          <kbd className="px-1 py-0.5 rounded bg-border-light dark:bg-border-dark font-mono text-[9px]">
            Enter
          </kbd>{" "}
          to send.
        </p>
      </div>
    </div>
  );
}