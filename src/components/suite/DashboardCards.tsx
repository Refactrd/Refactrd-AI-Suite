"use client";

import {
  Brain,
  FileText,
  MessageSquare,
  Zap,
  ArrowRight,
  Circle,
} from "lucide-react";

// ─── Stat card ────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #d0d8e4",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "#9aa5b4", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {label}
        </span>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ backgroundColor: accent + "18" }}
        >
          <Icon
            style={{ width: "15px", height: "15px", color: accent }}
            strokeWidth={1.5}
          />
        </div>
      </div>
      <div>
        <p
          className="text-3xl font-bold leading-none"
          style={{ color: "#1f2a44", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {value}
        </p>
        <p
          className="text-xs mt-1.5"
          style={{ color: "#9aa5b4", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

export function ProjectCard({
  name,
  category,
  description,
  status,
  stats,
  href,
}: {
  name: string;
  category: string;
  description: string;
  status: "live" | "building" | "planned";
  stats: { label: string; value: string }[];
  href: string;
}) {
  const statusConfig = {
    live: { label: "Live", bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
    building: { label: "Building", bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
    planned: { label: "Planned", bg: "#e0f2fe", color: "#0369a1", dot: "#38bdf8" },
  }[status];

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #d0d8e4",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(31,42,68,0.10)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#a2d2ff";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#d0d8e4";
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
            style={{ color: "#9aa5b4", fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {category}
          </span>
          <h3
            className="text-lg font-bold"
            style={{ color: "#1f2a44", fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {name}
          </h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: statusConfig.bg }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: statusConfig.dot }}
          />
          <span
            className="text-[10px] font-bold"
            style={{ color: statusConfig.color, fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "#6b7280", fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        {description}
      </p>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-3 rounded-xl p-4"
        style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p
              className="text-base font-bold leading-none"
              style={{ color: "#1f2a44", fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {s.value}
            </p>
            <p
              className="text-[10px] mt-1"
              style={{ color: "#9aa5b4", fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href={href}
        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          backgroundColor: "#1f2a44",
          color: "#ffffff",
          fontFamily: "var(--font-montserrat), sans-serif",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#a2d2ff";
          e.currentTarget.style.color = "#1f2a44";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1f2a44";
          e.currentTarget.style.color = "#ffffff";
        }}
      >
        Open admin panel
        <ArrowRight style={{ width: "14px", height: "14px" }} strokeWidth={2} />
      </a>
    </div>
  );
}

// ─── Next project placeholder ─────────────────────────────────────────────────

export function NextProjectPlaceholder() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border-2 border-dashed"
      style={{ borderColor: "#d0d8e4", minHeight: "280px" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: "#f4f6f9" }}
      >
        <Brain
          style={{ width: "18px", height: "18px", color: "#9aa5b4" }}
          strokeWidth={1.5}
        />
      </div>
      <div className="text-center">
        <p
          className="text-sm font-semibold"
          style={{ color: "#9aa5b4", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Next project
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "#c4cdd8", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          SOW Generator coming soon
        </p>
      </div>
    </div>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────

export function StatsStrip({
  docsIndexed,
  totalQueries,
  queriesThisWeek,
  avgLatency,
}: {
  docsIndexed: number;
  totalQueries: number;
  queriesThisWeek: number;
  avgLatency: number | null;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="AI Projects"
        value="1"
        sub="Kora live"
        icon={Brain}
        accent="#1f2a44"
      />
      <StatCard
        label="Documents"
        value={docsIndexed.toString()}
        sub="Indexed in Kora"
        icon={FileText}
        accent="#a2d2ff"
      />
      <StatCard
        label="Total Queries"
        value={totalQueries.toString()}
        sub={`${queriesThisWeek} this week`}
        icon={MessageSquare}
        accent="#6bb5f5"
      />
      <StatCard
        label="Avg Latency"
        value={avgLatency ? `${avgLatency}ms` : "—"}
        sub="Across all queries"
        icon={Zap}
        accent="#f59e0b"
      />
    </div>
  );
}

// ─── System status pill ───────────────────────────────────────────────────────

export function SystemStatusPill() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{ backgroundColor: "#ffffff", border: "1px solid #d0d8e4" }}
    >
      <Circle
        className="w-2 h-2 fill-green-500 text-green-500 animate-pulse"
        strokeWidth={0}
      />
      <span
        className="text-xs font-semibold"
        style={{ color: "#16a34a", fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        All systems operational
      </span>
    </div>
  );
}