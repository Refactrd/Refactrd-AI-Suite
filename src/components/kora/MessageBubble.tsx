"use client";

import { Message, ApiError } from "@/types";
import { cn } from "@/lib/utils";
import { CitationPanel } from "@/components/kora/CitationPanel";
import { FollowUpChips } from "@/components/kora/FollowUpChips";
import {
  AlertCircle,
  Sparkles,
  Clock,
  ShieldAlert,
  WifiOff,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect, useRef } from "react";

// ─── Error config per code ────────────────────────────────────────────────────

const ERROR_CONFIG: Record<
  ApiError["code"],
  {
    icon: React.ElementType;
    label: string;
    bg: string;
    border: string;
    iconColor: string;
    labelColor: string;
    textColor: string;
  }
> = {
  RATE_LIMITED: {
    icon: Clock,
    label: "Rate limit reached",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
    labelColor: "text-amber-700 dark:text-amber-400",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  ABUSIVE_INPUT: {
    icon: ShieldAlert,
    label: "Professional use only",
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-900",
    iconColor: "text-red-600 dark:text-red-400",
    labelColor: "text-red-700 dark:text-red-400",
    textColor: "text-red-700 dark:text-red-300",
  },
  INPUT_TOO_LONG: {
    icon: AlertCircle,
    label: "Input too long",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600 dark:text-orange-400",
    labelColor: "text-orange-700 dark:text-orange-400",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  UNCLEAR_INPUT: {
    icon: HelpCircle,
    label: "Could not understand",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    labelColor: "text-blue-700 dark:text-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  SERVICE_UNAVAILABLE: {
    icon: WifiOff,
    label: "Service unavailable",
    bg: "bg-gray-50 dark:bg-gray-950/20",
    border: "border-gray-200 dark:border-gray-800",
    iconColor: "text-gray-500 dark:text-gray-400",
    labelColor: "text-gray-600 dark:text-gray-400",
    textColor: "text-gray-600 dark:text-gray-300",
  },
  UNCERTAIN: {
    icon: AlertTriangle,
    label: "Not enough information",
    bg: "bg-sage-50/60 dark:bg-sage-900/20",
    border: "border-sage-200 dark:border-sage-800",
    iconColor: "text-sage-600 dark:text-sage-400",
    labelColor: "text-sage-700 dark:text-sage-400",
    textColor: "text-sage-700 dark:text-sage-300",
  },
};

const DEFAULT_ERROR_CONFIG = ERROR_CONFIG.SERVICE_UNAVAILABLE;

// ─── Typing effect ────────────────────────────────────────────────────────────

function useTypingEffect(
  messageId: string,
  fullContent: string,
  isStreaming: boolean
): string {
  const [displayed, setDisplayed] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef(0);
  const contentRef = useRef(fullContent);

  useEffect(() => {
    contentRef.current = fullContent;
  }, [fullContent]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    posRef.current = 0;
    setDisplayed("");
    contentRef.current = fullContent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageId]);

  useEffect(() => {
    if (!isStreaming) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayed(fullContent);
      posRef.current = fullContent.length;
      return;
    }

    const tick = () => {
      const target = contentRef.current;
      if (posRef.current < target.length) {
        posRef.current += 1;
        setDisplayed(target.slice(0, posRef.current));
        timerRef.current = setTimeout(tick, 16);
      } else if (posRef.current < fullContent.length) {
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

// ─── Error bubble ─────────────────────────────────────────────────────────────

function ErrorBubble({
  message,
  errorCode,
}: {
  message: string;
  errorCode?: ApiError["code"];
}) {
  const config = errorCode
    ? ERROR_CONFIG[errorCode] ?? DEFAULT_ERROR_CONFIG
    : DEFAULT_ERROR_CONFIG;

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed border",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", config.iconColor)} strokeWidth={1.5} />
        <span className={cn("text-xs font-semibold uppercase tracking-wider", config.labelColor)}>
          {config.label}
        </span>
      </div>
      <p className={cn("text-sm leading-relaxed", config.textColor)}>
        {message}
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  onFollowUp: (question: string) => void;
}

export function MessageBubble({ message, onFollowUp }: MessageBubbleProps) {
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

  // ─── User bubble ──────────────────────────────────────────────────────────

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

  // Skip empty streaming bubble
  if (!displayedContent && isStreaming) return null;

  // ─── Assistant bubble ─────────────────────────────────────────────────────

  return (
    <div className="flex items-start gap-3 animate-slide-up">
      {/* Avatar */}
      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-sage-400 dark:bg-sage-600 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Error bubble with distinct styling per error type */}
        {isError ? (
          <ErrorBubble
            message={message.content}
            errorCode={message.errorCode}
          />
        ) : (
          /* Normal answer bubble */
          <div
            className={cn(
              "px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed",
              "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
            )}
          >
            <div className="text-text-primary-light dark:text-text-primary-dark">
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

              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-sage-500 ml-0.5 animate-pulse-soft align-middle" />
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {!isStreaming && (
          <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark px-1">
            {formattedTime}
          </span>
        )}

        {/* Citations */}
        {hasCitations && !isStreaming && !isError && (
          <CitationPanel citations={message.citations!} />
        )}

        {/* Follow-up questions */}
        {!isStreaming && !isError && message.followUps && message.followUps.length > 0 && (
          <FollowUpChips questions={message.followUps} onSelect={onFollowUp} />
        )}
      </div>
    </div>
  );
}