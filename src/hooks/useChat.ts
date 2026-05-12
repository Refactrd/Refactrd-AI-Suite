"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Message,
  ChatState,
  ApiError,
  Citation,
  ChatSession,
  SerializedMessage,
} from "@/types";
import { streamKoraQuery, fetchFollowUps } from "@/lib/api";

export const STARTER_QUESTIONS = [
  {
    id: "1",
    label: "Leave Policy",
    question:
      "How many days of annual leave are Meridian Works employees entitled to?",
  },
  {
    id: "2",
    label: "Onboarding",
    question: "What does the onboarding process look like for a new hire?",
  },
  {
    id: "3",
    label: "Performance Reviews",
    question: "How does the performance review process work at Meridian Works?",
  },
  {
    id: "4",
    label: "Remote Work",
    question: "What is the remote work policy at Meridian Works?",
  },
  {
    id: "5",
    label: "Disciplinary Process",
    question: "What happens if an employee raises a grievance?",
  },
  {
    id: "6",
    label: "Benefits",
    question: "What benefits and perks do Meridian Works employees receive?",
  },
];

const ERROR_MESSAGES: Record<ApiError["code"], string> = {
  RATE_LIMITED:
    "You have reached the query limit for this hour. Please try again later.",
  INPUT_TOO_LONG:
    "Your question is too long. Please keep it under 500 characters.",
  ABUSIVE_INPUT:
    "This assistant is designed for professional use. Please rephrase your question.",
  UNCLEAR_INPUT:
    "I could not understand that question. Could you rephrase it with more detail?",
  SERVICE_UNAVAILABLE:
    "Kora is temporarily unavailable. Please try again in a moment.",
  UNCERTAIN:
    "I don't have enough information in Meridian Works' documents to answer this accurately. Please check with your line manager or the People & Culture team.",
};

const STORAGE_KEY = "kora_chat_sessions";
const ACTIVE_SESSION_KEY = "kora_active_session";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function serializeMessages(messages: Message[]): SerializedMessage[] {
  return messages
    .filter((m) => !m.isStreaming)
    .map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      citations: m.citations,
      isError: m.isError,
      errorCode: m.errorCode,
      confidence: m.confidence,
      timestamp: m.timestamp.toISOString(),
      followUps: m.followUps,
    }));
}

function deserializeMessages(serialized: SerializedMessage[]): Message[] {
  return serialized.map((m) => ({
    ...m,
    timestamp: new Date(m.timestamp),
    isStreaming: false,
  }));
}

function generateSessionTitle(firstQuestion: string): string {
  return firstQuestion.length > 50
    ? firstQuestion.slice(0, 50) + "..."
    : firstQuestion;
}

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
}

function loadActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
}

function saveActiveSessionId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_SESSION_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch {}
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const conversationId = useRef<string>(generateId());
  const abortRef = useRef<boolean>(false);

  useEffect(() => {
    const savedSessions = loadSessions();
    const savedActiveId = loadActiveSessionId();
    setSessions(savedSessions);

    if (savedActiveId) {
      const activeSession = savedSessions.find((s) => s.id === savedActiveId);
      if (activeSession && activeSession.messages.length > 0) {
        setState((prev) => ({
          ...prev,
          messages: deserializeMessages(activeSession.messages),
        }));
        setActiveSessionId(savedActiveId);
        conversationId.current = savedActiveId;
      }
    }
  }, []);

  const persistSession = useCallback(
    (messages: Message[], sessionId: string) => {
      if (messages.length === 0) return;
      const serialized = serializeMessages(messages);
      if (serialized.length === 0) return;

      const firstUserMessage = messages.find((m) => m.role === "user");
      const title = firstUserMessage
        ? generateSessionTitle(firstUserMessage.content)
        : "New conversation";

      setSessions((prev) => {
        const existing = prev.find((s) => s.id === sessionId);
        let updated: ChatSession[];

        if (existing) {
          updated = prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: serialized,
                  updatedAt: new Date().toISOString(),
                }
              : s,
          );
        } else {
          const newSession: ChatSession = {
            id: sessionId,
            title,
            messages: serialized,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          updated = [newSession, ...prev].slice(0, 20);
        }

        saveSessions(updated);
        return updated;
      });
    },
    [],
  );

  const updateLastAssistantMessage = useCallback(
    (updater: (message: Message) => Message) => {
      setState((prev) => {
        const messages = [...prev.messages];
        const lastIndex = messages.length - 1;
        if (lastIndex >= 0 && messages[lastIndex].role === "assistant") {
          messages[lastIndex] = updater(messages[lastIndex]);
        }
        return { ...prev, messages };
      });
    },
    [],
  );

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || state.isLoading) return;

      abortRef.current = false;

      // Track the assistant message ID so follow-ups target the right message
      const assistantMessageId = generateId();

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: question.trim(),
        timestamp: new Date(),
      };

      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        citations: [],
        isStreaming: true,
        timestamp: new Date(),
      };

      const currentSessionId = conversationId.current;

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage, assistantMessage],
        isLoading: true,
        error: null,
      }));

      if (!activeSessionId) {
        setActiveSessionId(currentSessionId);
        saveActiveSessionId(currentSessionId);
      }

      // Accumulate the full response text so we can pass it to follow-ups
      let accumulatedContent = "";

      await streamKoraQuery(
        { question: question.trim(), conversationId: currentSessionId },

        // onChunk
        (chunk: string) => {
          if (abortRef.current) return;
          accumulatedContent += chunk;
          updateLastAssistantMessage((msg) => ({
            ...msg,
            content: msg.content + chunk,
          }));
        },

        // onCitations
        (citations: Citation[]) => {
          if (abortRef.current) return;
          updateLastAssistantMessage((msg) => ({ ...msg, citations }));
        },

        // onError
        (error: ApiError) => {
          if (abortRef.current) return;
          const errorMessage =
            ERROR_MESSAGES[error.code] ||
            "Something went wrong. Please try again.";
          updateLastAssistantMessage((msg) => ({
            ...msg,
            content: errorMessage,
            isStreaming: false,
            isError: true,
            errorCode: error.code,
            confidence: "uncertain",
          }));
          setState((prev) => {
            persistSession(prev.messages, currentSessionId);
            return { ...prev, isLoading: false };
          });
        },

        // onDone
        async () => {
          if (abortRef.current) return;

          // Mark streaming as done and persist
          updateLastAssistantMessage((msg) => ({ ...msg, isStreaming: false }));
          setState((prev) => {
            persistSession(prev.messages, currentSessionId);
            return { ...prev, isLoading: false };
          });

          // Fetch follow-ups once using the accumulated content
          // Use the assistantMessageId captured in closure to target exact message
          if (!accumulatedContent) return;

          try {
            const followUps = await fetchFollowUps(
              question.trim(),
              accumulatedContent,
            );
            if (abortRef.current) return;
            if (followUps.length === 0) return;

            setState((prev) => {
              const msgs = [...prev.messages];
              const idx = msgs.findIndex((m) => m.id === assistantMessageId);
              if (idx === -1) return prev;
              msgs[idx] = { ...msgs[idx], followUps };
              return { ...prev, messages: msgs };
            });
          } catch {
            // Follow-ups are non-critical, never throw
          }
        },
      );
    },
    [
      state.isLoading,
      updateLastAssistantMessage,
      activeSessionId,
      persistSession,
    ],
  );

  const loadSession = useCallback((sessionId: string) => {
    const savedSessions = loadSessions();
    const session = savedSessions.find((s) => s.id === sessionId);
    if (!session) return;

    abortRef.current = true;
    conversationId.current = sessionId;
    setActiveSessionId(sessionId);
    saveActiveSessionId(sessionId);

    setState({
      messages: deserializeMessages(session.messages),
      isLoading: false,
      error: null,
    });
  }, []);

  const clearChat = useCallback(() => {
    abortRef.current = true;
    const newSessionId = generateId();
    conversationId.current = newSessionId;
    setActiveSessionId(null);
    saveActiveSessionId(null);
    setState({ messages: [], isLoading: false, error: null });
  }, []);

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== sessionId);
        saveSessions(updated);
        return updated;
      });
      if (activeSessionId === sessionId) clearChat();
    },
    [activeSessionId, clearChat],
  );

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === sessionId
          ? { ...s, title: newTitle, updatedAt: new Date().toISOString() }
          : s,
      );
      saveSessions(updated);
      return updated;
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sessions,
    activeSessionId,
    sendMessage,
    clearChat,
    loadSession,
    deleteSession,
    renameSession,
    hasMessages: state.messages.length > 0,
  };
}