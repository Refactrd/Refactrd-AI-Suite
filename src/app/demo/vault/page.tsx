"use client";

import { useState } from "react";
import { useChat, STARTER_QUESTIONS } from "@/hooks/useChat";
import { MessageThread } from "@/components/kora/MessageThread";
import { InputBar } from "@/components/kora/InputBar";
import { StarterQuestions } from "@/components/kora/StarterQuestions";
import { KoraHeader } from "@/components/kora/KoraHeader";
import { ChatHistory } from "@/components/kora/ChatHistory";
import { cn } from "@/lib/utils";

export default function VaultPage() {
  const {
    messages,
    isLoading,
    sessions,
    activeSessionId,
    sendMessage,
    clearChat,
    loadSession,
    deleteSession,
    renameSession,
    hasMessages,
  } = useChat();

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <main className="relative flex flex-col h-screen h-dvh overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-sage-100/40 dark:bg-sage-900/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-sage-200/30 dark:bg-sage-800/10 blur-[100px]" />
      </div>

      {/* Header */}
      <KoraHeader
        onClear={clearChat}
        onToggleHistory={() => setHistoryOpen((prev) => !prev)}
        hasMessages={hasMessages}
        historyOpen={historyOpen}
        sessionCount={sessions.length}
      />

      {/* Body */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Mobile overlay backdrop */}
        {historyOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 sm:hidden"
            onClick={() => setHistoryOpen(false)}
          />
        )}

        {/* History sidebar
            - Mobile: fixed overlay from left, full height
            - Desktop: pushes content */}
        <div
          className={cn(
            "flex-shrink-0 border-r border-border-light dark:border-border-dark",
            "bg-background-light/98 dark:bg-background-dark/98 backdrop-blur-md",
            "transition-all duration-300 overflow-hidden",
            // Mobile: fixed overlay
            "fixed sm:relative inset-y-0 left-0 z-30 sm:z-auto",
            historyOpen ? "w-72" : "w-0"
          )}
          style={{
            // On mobile push below header
            top: historyOpen ? "0" : undefined,
          }}
        >
          {historyOpen && (
            <ChatHistory
              sessions={sessions}
              activeSessionId={activeSessionId}
              onLoadSession={(id) => {
                loadSession(id);
                setHistoryOpen(false);
              }}
              onDeleteSession={deleteSession}
              onRenameSession={renameSession}
              onClose={() => setHistoryOpen(false)}
            />
          )}
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 pb-6 sm:pb-8 animate-fade-in">
              {/* Hero text */}
              <div className="text-center mb-6 sm:mb-10 max-w-lg px-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900/40 border border-sage-200 dark:border-sage-800 mb-4 sm:mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse-soft" />
                  <span className="text-[10px] sm:text-xs font-medium text-sage-700 dark:text-sage-300 tracking-wide">
                    Meridian Works Knowledge Base
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary-DEFAULT dark:text-primary-dark leading-tight mb-3 sm:mb-4">
                  Ask Kora anything
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm sm:text-base leading-relaxed">
                  Kora has instant access to Meridian Works policies, guides,
                  and procedures. No more searching, no more waiting.
                </p>
              </div>

              {/* Starter questions */}
              <StarterQuestions
                questions={STARTER_QUESTIONS}
                onSelect={sendMessage}
              />
            </div>
          ) : (
            <MessageThread
              messages={messages}
              isLoading={isLoading}
              onFollowUp={sendMessage}
            />
          )}

          {/* Input */}
          <InputBar
            onSend={sendMessage}
            isLoading={isLoading}
            hasMessages={hasMessages}
          />
        </div>
      </div>
    </main>
  );
}