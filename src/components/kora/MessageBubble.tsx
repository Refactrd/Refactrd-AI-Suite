"use client";

import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { CitationPanel } from "@/components/kora/CitationPanel";
import { AlertCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect, useRef } from "react";

// ─── Typing effect ────────────────────────────────────────────────────────────
// Animates content character by character while streaming.
// When streaming stops, immediately shows full content.

function useTypingEffect(
  messageId: string,
  fullContent: string,
  isStreaming: boolean
): string {
  const [displayed, setDisplayed] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef(0);
  const contentRef = useRef(fullContent);

  // Keep contentRef in sync with latest content
  useEffect(() => {
    contentRef.current = fullContent;
  }, [fullContent]);

  // Reset completely when messageId changes (new message)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    posRef.current = 0;
    setDisplayed("");
    contentRef.current = fullContent;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageId]);

  // Drive the animation
  useEffect(() => {
    if (!isStreaming) {
      // Stream finished - snap to full content immediately
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayed(fullContent);
      posRef.current = fullContent.length;
      return;
    }

    // Animate one character at a time
    const tick = () => {
      const target = contentRef.current;
      if (posRef.current < target.length) {
        posRef.current += 1;
        setDisplayed(target.slice(0, posRef.current));
        timerRef.current = setTimeout(tick, 16);
      } else if (posRef.current < fullContent.length) {
        // More content arrived since last tick
        timerRef.current = setTimeout(tick, 16);
      }
    };

    if (posRef.current < fullContent.length) {
      timerRef.current = setTimeout(tick, 16);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fullContent, isStreaming]);

  return displayed;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.isError;
  const isStreaming = message.isStreaming ?? false;
  const hasCitations = message.citations && message.citations.length > 0;

  const displayedContent = useTypingEffect(
    message.id,
    message.content,
    isStreaming
  );

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(message.timestamp));

  // ─── User bubble ─────────────────────────────────────────────────────────────

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 animate-slide-up">
        <div
          className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm"
          style={{ backgroundColor: "#0F1729" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#FFFFFF" }}>
            {message.content}
          </p>
        </div>
        <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark px-1">
          {formattedTime}
        </span>
      </div>
    );
  }

  // Skip rendering empty assistant bubble - ThinkingIndicator handles this state
  if (!displayedContent && isStreaming) return null;

  // ─── Assistant bubble ─────────────────────────────────────────────────────────

  return (
    <div className="flex items-start gap-3 animate-slide-up">
      {/* Avatar */}
      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-sage-400 dark:bg-sage-600 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Bubble */}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed",
            isError
              ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
              : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
          )}
        >
          {isError && (
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                Notice
              </span>
            </div>
          )}

          <div
            className={cn(
              isError
                ? "text-red-700 dark:text-red-400"
                : "text-text-primary-light dark:text-text-primary-dark"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-4 space-y-1 mb-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-4 space-y-1 mb-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                h1: ({ children }) => (
                  <h1 className="text-base font-semibold mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-semibold mb-1.5">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-medium mb-1">{children}</h3>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded bg-sage-100 dark:bg-sage-900/40 text-sage-800 dark:text-sage-200 text-xs font-mono">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-sage-300 dark:border-sage-700 pl-3 italic opacity-80 mb-2">
                    {children}
                  </blockquote>
                ),
                hr: () => (
                  <hr className="border-border-light dark:border-border-dark my-2" />
                ),
              }}
            >
              {displayedContent}
            </ReactMarkdown>

            {/* Blinking cursor while typing */}
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-sage-500 ml-0.5 animate-pulse-soft align-middle" />
            )}
          </div>
        </div>

        {/* Timestamp - only after done */}
        {!isStreaming && (
          <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark px-1">
            {formattedTime}
          </span>
        )}

        {/* Citations - only after streaming is fully done */}
        {hasCitations && !isStreaming && (
          <CitationPanel citations={message.citations!} />
        )}
      </div>
    </div>
  );
}