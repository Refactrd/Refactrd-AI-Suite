"use client";

import { ChatSession } from "@/types";
import { cn } from "@/lib/utils";
import { MessageSquare, Trash2, X, Pencil, Check } from "lucide-react";
import { useState, useRef } from "react";

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onLoadSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClose: () => void;
}

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function SessionItem({
  session,
  isActive,
  onLoad,
  onDelete,
  onRename,
}: {
  session: ChatSession;
  isActive: boolean;
  onLoad: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(session.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(session.title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== session.title) {
      onRename(trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group flex items-start justify-between gap-2 px-3 py-2.5 rounded-lg",
        "transition-colors duration-150",
        !isEditing && "cursor-pointer",
        isActive
          ? "bg-sage-100 dark:bg-sage-900/40"
          : "hover:bg-surface-light dark:hover:bg-surface-dark"
      )}
      onClick={() => !isEditing && onLoad()}
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitEdit}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full text-xs font-medium rounded px-1 py-0.5 outline-none",
              "bg-surface-light dark:bg-surface-dark",
              "border border-sage-300 dark:border-sage-700",
              "text-text-primary-light dark:text-text-primary-dark"
            )}
          />
        ) : (
          <p
            className={cn(
              "text-xs font-medium truncate leading-snug",
              isActive
                ? "text-sage-800 dark:text-sage-200"
                : "text-text-primary-light dark:text-text-primary-dark"
            )}
          >
            {session.title}
          </p>
        )}
        <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-0.5">
          {formatSessionDate(session.updatedAt)} &middot;{" "}
          {session.messages.length} message
          {session.messages.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
        {isEditing ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              commitEdit();
            }}
            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-sage-100 dark:hover:bg-sage-900/40 text-sage-600 dark:text-sage-400 transition-colors"
            aria-label="Save name"
          >
            <Check className="w-3 h-3" />
          </button>
        ) : (
          <>
            <button
              onClick={startEdit}
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                "hover:bg-surface-light dark:hover:bg-border-dark",
                "text-text-muted-light dark:text-text-muted-dark"
              )}
              aria-label="Rename chat"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                "hover:bg-red-100 dark:hover:bg-red-900/30",
                "text-text-muted-light dark:text-text-muted-dark hover:text-red-600 dark:hover:text-red-400"
              )}
              aria-label="Delete chat"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function ChatHistory({
  sessions,
  activeSessionId,
  onLoadSession,
  onDeleteSession,
  onRenameSession,
  onClose,
}: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
        <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          Chat history
        </span>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
        >
          <X className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto py-2">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 px-4 text-center">
            <MessageSquare className="w-6 h-6 text-text-muted-light dark:text-text-muted-dark" />
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              No previous chats yet
            </p>
          </div>
        ) : (
          <ul className="space-y-0.5 px-2">
            {sessions.map((session) => (
              <li key={session.id}>
                <SessionItem
                  session={session}
                  isActive={activeSessionId === session.id}
                  onLoad={() => onLoadSession(session.id)}
                  onDelete={() => onDeleteSession(session.id)}
                  onRename={(title) => onRenameSession(session.id, title)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}