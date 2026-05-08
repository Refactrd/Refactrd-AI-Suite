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
    <main className="relative flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
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
        {/* History sidebar */}
        <div
          className={cn(
            "flex-shrink-0 border-r border-border-light dark:border-border-dark",
            "bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md",
            "transition-all duration-300 overflow-hidden",
            historyOpen ? "w-72" : "w-0"
          )}
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

        {/* Main chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 animate-fade-in">
              <div className="text-center mb-10 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900/40 border border-sage-200 dark:border-sage-800 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse-soft" />
                  <span className="text-xs font-medium text-sage-700 dark:text-sage-300 tracking-wide">
                    Meridian Works Knowledge Base
                  </span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl text-primary-DEFAULT dark:text-primary-dark leading-tight mb-4">
                  Ask Kora anything
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base leading-relaxed">
                  Kora has instant access to Meridian Works policies, guides,
                  and procedures. No more searching, no more waiting.
                </p>
              </div>

              <StarterQuestions
                questions={STARTER_QUESTIONS}
                onSelect={sendMessage}
              />
            </div>
          ) : (
            <MessageThread messages={messages} isLoading={isLoading} />
          )}

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