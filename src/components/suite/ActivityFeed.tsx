"use client";

import { MessageSquare, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

interface Query {
  id: string;
  question: string;
  confidence: string | null;
  latency_ms: number | null;
  created_at: string;
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

function ConfidenceBadge({ confidence }: { confidence: string | null }) {
  if (!confidence) return null;

  const config = {
    high: {
      icon: CheckCircle,
      label: "High",
      color: "#16a34a",
      bg: "#dcfce7",
    },
    low: {
      icon: AlertCircle,
      label: "Low",
      color: "#d97706",
      bg: "#fef3c7",
    },
    uncertain: {
      icon: HelpCircle,
      label: "Uncertain",
      color: "#6b7280",
      bg: "#f3f4f6",
    },
  }[confidence] ?? {
    icon: HelpCircle,
    label: confidence,
    color: "#6b7280",
    bg: "#f3f4f6",
  };

  const Icon = config.icon;

  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: config.bg }}
    >
      <Icon style={{ width: "10px", height: "10px", color: config.color }} strokeWidth={2} />
      <span
        className="text-[10px] font-semibold"
        style={{ color: config.color, fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        {config.label}
      </span>
    </div>
  );
}

export function ActivityFeed({ queries }: { queries: Query[] }) {
  if (queries.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #d0d8e4",
        }}
      >
        <MessageSquare
          style={{ width: "24px", height: "24px", color: "#d0d8e4", margin: "0 auto 8px" }}
          strokeWidth={1.5}
        />
        <p
          className="text-sm"
          style={{ color: "#9aa5b4", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          No queries yet. Activity will appear here once users start asking Kora questions.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #d0d8e4",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {queries.map((query, index) => (
        <div
          key={query.id}
          className="flex items-start gap-4 px-5 py-4 transition-colors duration-150"
          style={{
            borderBottom: index < queries.length - 1 ? "1px solid #f1f5f9" : "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8fafc";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
          }}
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e6eaf0",
            }}
          >
            <MessageSquare
              style={{ width: "14px", height: "14px", color: "#1f2a44" }}
              strokeWidth={1.5}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p
                className="text-sm font-medium leading-snug truncate"
                style={{
                  color: "#1f2a44",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                {query.question}
              </p>
              <span
                className="text-[10px] flex-shrink-0 mt-0.5"
                style={{
                  color: "#9aa5b4",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                {formatRelativeTime(query.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5">
              <span
                className="text-[10px]"
                style={{
                  color: "#9aa5b4",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                Kora
              </span>
              {query.latency_ms && (
                <>
                  <span style={{ color: "#d0d8e4" }}>·</span>
                  <span
                    className="text-[10px]"
                    style={{
                      color: "#9aa5b4",
                      fontFamily: "var(--font-montserrat), sans-serif",
                    }}
                  >
                    {query.latency_ms}ms
                  </span>
                </>
              )}
              {query.confidence && (
                <>
                  <span style={{ color: "#d0d8e4" }}>·</span>
                  <ConfidenceBadge confidence={query.confidence} />
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}