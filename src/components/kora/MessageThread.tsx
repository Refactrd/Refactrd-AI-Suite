"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { MessageBubble } from "@/components/kora/MessageBubble";
import { ThinkingIndicator } from "@/components/kora/ThinkingIndicator";

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  onFollowUp: (question: string) => void;
}

export function MessageThread({ messages, onFollowUp }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastMessage = messages[messages.length - 1];

  // Show thinking dots only when the last assistant message has no content yet
  const showThinking =
    lastMessage?.role === "assistant" &&
    lastMessage?.isStreaming === true &&
    lastMessage?.content === "";

  // Filter out the empty streaming placeholder from the rendered list
  // It will be represented by ThinkingIndicator instead
  const visibleMessages = messages.filter(
    (m) => !(m.isStreaming && m.content === "" && m.role === "assistant")
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {visibleMessages.map((message) => (
          <MessageBubble key={message.id} message={message} onFollowUp={onFollowUp}/>
        ))}

        {showThinking && <ThinkingIndicator />}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}