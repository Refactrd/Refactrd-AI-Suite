"use client";

import { useState } from "react";
import {
  MessageSquare,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Activity,
} from "lucide-react";

interface Analytics {
  totalQueries: number;
  queriesThisWeek: number;
  queriesThisMonth: number;
  avgLatencyMs: number | null;
  minLatencyMs: number | null;
  maxLatencyMs: number | null;
  highConfidence: number;
  lowConfidence: number;
  uncertainCount: number;
}

interface Query {
  id: string;
  question: string;
  response: string | null;
  confidence: string | null;
  latency_ms: number | null;
  created_at: string;
}

interface DailyData {
  day: string;
  count: number;
}

interface KoraAnalyticsProps {
  analytics: Analytics;
  queries: Query[];
  dailyData: DailyData[];
}

const PAGE_SIZE = 10;
const FONT = "var(--font-montserrat), sans-serif";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return diffMins + "m ago";
  if (diffHours < 24) return diffHours + "h ago";
  if (diffDays === 1) return "Yesterday";
  return diffDays + "d ago";
}

function confidenceConfig(confidence: string | null) {
  switch (confidence) {
    case "high": return { label: "High", icon: CheckCircle, color: "#16a34a", bg: "#dcfce7" };
    case "low": return { label: "Low", icon: AlertCircle, color: "#d97706", bg: "#fef3c7" };
    case "uncertain": return { label: "Uncertain", icon: HelpCircle, color: "#6b7280", bg: "#f3f4f6" };
    default: return { label: "Unknown", icon: HelpCircle, color: "#9aa5b4", bg: "#f4f6f9" };
  }
}

function StatCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub: string; icon: React.ElementType; accent: string }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ backgroundColor: "#ffffff", border: "1px solid #d0d8e4", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9aa5b4", fontFamily: FONT }}>{label}</span>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: accent + "18" }}>
          <Icon style={{ width: "15px", height: "15px", color: accent }} strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold leading-none" style={{ color: "#1f2a44", fontFamily: FONT }}>{value}</p>
        <p className="text-xs mt-1.5" style={{ color: "#9aa5b4", fontFamily: FONT }}>{sub}</p>
      </div>
    </div>
  );
}

function ActivityChart({ dailyData }: { dailyData: DailyData[] }) {
  if (dailyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-sm" style={{ color: "#9aa5b4", fontFamily: FONT }}>No activity data yet</p>
      </div>
    );
  }

  const maxCount = Math.max(...dailyData.map((d) => d.count), 1);
  const days: { date: string; count: number; label: string }[] = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = dailyData.find((item) => item.day?.startsWith(dateStr));
    days.push({ date: dateStr, count: found ? Number(found.count) : 0, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1.5 h-28">
        {days.map((day) => {
          const heightPct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
          const isToday = day.date === new Date().toISOString().split("T")[0];
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
              <div className="absolute bottom-full mb-2 px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" style={{ backgroundColor: "#1f2a44", color: "#ffffff", fontFamily: FONT, left: "50%", transform: "translateX(-50%)" }}>
                {day.label}: {day.count} {day.count === 1 ? "query" : "queries"}
              </div>
              <div className="w-full rounded-t-md transition-all duration-300" style={{ height: Math.max(heightPct, day.count > 0 ? 4 : 0) + "%", backgroundColor: isToday ? "#1f2a44" : day.count > 0 ? "#a2d2ff" : "#e6eaf0", minHeight: day.count > 0 ? "4px" : "2px" }} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5">
        {days.map((day, i) => (
          <div key={day.date} className="flex-1 text-center">
            {(i === 0 || i === 6 || i === 13) && (
              <span className="text-[9px]" style={{ color: "#9aa5b4", fontFamily: FONT }}>{day.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidenceBreakdown({ high, low, uncertain, total }: { high: number; low: number; uncertain: number; total: number }) {
  const items = [
    { label: "High confidence", value: high, color: "#22c55e" },
    { label: "Low confidence", value: low, color: "#f59e0b" },
    { label: "Uncertain", value: uncertain, color: "#9aa5b4" },
  ];
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium" style={{ color: "#4a5568", fontFamily: FONT }}>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: "#1f2a44", fontFamily: FONT }}>{item.value}</span>
                <span className="text-[10px]" style={{ color: "#9aa5b4", fontFamily: FONT }}>{pct}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#e6eaf0" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: pct + "%", backgroundColor: item.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QueryRow({ query, index, isLast }: { query: Query; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const conf = confidenceConfig(query.confidence);
  const Icon = conf.icon;
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #f1f5f9" }}>
      <div
        className="flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors"
        onClick={() => setExpanded((p) => !p)}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8fafc"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
      >
        <span className="text-xs font-bold flex-shrink-0 mt-0.5 w-6 text-right" style={{ color: "#d0d8e4", fontFamily: FONT }}>{index}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug" style={{ color: "#1f2a44", fontFamily: FONT }}>{query.question}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px]" style={{ color: "#9aa5b4", fontFamily: FONT }}>{formatRelative(query.created_at)}</span>
            <span style={{ color: "#d0d8e4" }}>·</span>
            <span className="text-[10px]" style={{ color: "#9aa5b4", fontFamily: FONT }}>{formatDate(query.created_at)} at {formatTime(query.created_at)}</span>
            {query.latency_ms && (<><span style={{ color: "#d0d8e4" }}>·</span><span className="text-[10px]" style={{ color: "#9aa5b4", fontFamily: FONT }}>{query.latency_ms}ms</span></>)}
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: conf.bg }}>
          <Icon style={{ width: "10px", height: "10px", color: conf.color }} strokeWidth={2} />
          <span className="text-[10px] font-semibold" style={{ color: conf.color, fontFamily: FONT }}>{conf.label}</span>
        </div>
      </div>
      {expanded && query.response && (
        <div className="px-5 pb-4" style={{ backgroundColor: "#f8fafc" }}>
          <div className="rounded-xl p-4 text-xs leading-relaxed" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#4a5568", fontFamily: FONT }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#9aa5b4" }}>{"Kora's response"}</p>
            {query.response}
          </div>
        </div>
      )}
    </div>
  );
}

function QueryLog({ queries }: { queries: Query[] }) {
  const [tab, setTab] = useState<"all" | "uncertain">("all");
  const [page, setPage] = useState(1);
  const filtered = tab === "uncertain" ? queries.filter((q) => q.confidence === "uncertain") : queries;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleTabChange = (t: "all" | "uncertain") => { setTab(t); setPage(1); };

  return (
    <div>
      <div className="flex items-center gap-1 mb-4">
        {[{ key: "all", label: "All queries", count: queries.length }, { key: "uncertain", label: "Uncertain", count: queries.filter((q) => q.confidence === "uncertain").length }].map((t) => (
          <button key={t.key} onClick={() => handleTabChange(t.key as "all" | "uncertain")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150" style={{ backgroundColor: tab === t.key ? "#1f2a44" : "transparent", color: tab === t.key ? "#ffffff" : "#9aa5b4", fontFamily: FONT }}>
            {t.label}
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: tab === t.key ? "rgba(162,210,255,0.2)" : "#e6eaf0", color: tab === t.key ? "#a2d2ff" : "#9aa5b4" }}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "uncertain" && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} strokeWidth={1.5} />
          <p className="text-xs leading-relaxed" style={{ color: "#92400e", fontFamily: FONT }}>These are questions Kora could not answer confidently. They represent gaps in your knowledge base. Consider adding documents that cover these topics.</p>
        </div>
      )}

      {paginated.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #d0d8e4" }}>
          <p className="text-sm" style={{ color: "#9aa5b4", fontFamily: FONT }}>{tab === "uncertain" ? "No uncertain queries. Kora is answering everything confidently." : "No queries yet."}</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #d0d8e4", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b" style={{ borderColor: "#f1f5f9", backgroundColor: "#f8fafc" }}>
            <div className="col-span-1" />
            <div className="col-span-8 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#9aa5b4" }}>Question</div>
            <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: "#9aa5b4" }}>Confidence</div>
          </div>
          {paginated.map((query, i) => (<QueryRow key={query.id} query={query} index={(page - 1) * PAGE_SIZE + i + 1} isLast={i === paginated.length - 1} />))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "#f1f5f9" }}>
              <p className="text-xs" style={{ color: "#9aa5b4", fontFamily: FONT }}>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: page === 1 ? "#f4f6f9" : "#e6eaf0", color: page === 1 ? "#c4cdd8" : "#1f2a44", cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: FONT }}>
                  <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />Prev
                </button>
                <span className="text-xs" style={{ color: "#9aa5b4", fontFamily: FONT }}>{page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: page === totalPages ? "#f4f6f9" : "#e6eaf0", color: page === totalPages ? "#c4cdd8" : "#1f2a44", cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: FONT }}>
                  Next<ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function KoraAnalytics({ analytics, queries, dailyData }: KoraAnalyticsProps) {
  const total = analytics.totalQueries;
  return (
    <div className="min-h-screen p-8" style={{ fontFamily: FONT }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <a href="/suite/kora" className="flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: "#9aa5b4", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f2a44")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9aa5b4")}>
                <ArrowLeft className="w-3 h-3" strokeWidth={2} />Kora
              </a>
              <span style={{ color: "#d0d8e4" }}>/</span>
              <span className="text-xs font-semibold" style={{ color: "#9aa5b4" }}>Analytics</span>
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#1f2a44" }}>Kora Analytics</h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Usage patterns, confidence breakdown, and query history</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#ffffff", border: "1px solid #d0d8e4" }}>
            <Activity className="w-3.5 h-3.5 animate-pulse" style={{ color: "#22c55e" }} strokeWidth={2} />
            <span className="text-xs font-semibold" style={{ color: "#16a34a", fontFamily: FONT }}>Live data</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Queries" value={total.toString()} sub="All time" icon={MessageSquare} accent="#1f2a44" />
          <StatCard label="This Week" value={analytics.queriesThisWeek.toString()} sub="Last 7 days" icon={TrendingUp} accent="#a2d2ff" />
          <StatCard label="This Month" value={analytics.queriesThisMonth.toString()} sub="Last 30 days" icon={MessageSquare} accent="#6bb5f5" />
          <StatCard label="Avg Latency" value={analytics.avgLatencyMs ? analytics.avgLatencyMs + "ms" : "—"} sub={analytics.minLatencyMs && analytics.maxLatencyMs ? analytics.minLatencyMs + "ms – " + analytics.maxLatencyMs + "ms range" : "No data yet"} icon={Zap} accent="#f59e0b" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #d0d8e4", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold" style={{ color: "#1f2a44" }}>Query Activity</h2>
                <p className="text-xs mt-0.5" style={{ color: "#9aa5b4" }}>Last 14 days</p>
              </div>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1f2a44" }} />
            </div>
            <ActivityChart dailyData={dailyData} />
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #d0d8e4", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="mb-5">
              <h2 className="text-sm font-bold" style={{ color: "#1f2a44" }}>Confidence Breakdown</h2>
              <p className="text-xs mt-0.5" style={{ color: "#9aa5b4" }}>Across all {total} queries</p>
            </div>
            {total === 0 ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-xs" style={{ color: "#9aa5b4", fontFamily: FONT }}>No queries yet</p>
              </div>
            ) : (
              <ConfidenceBreakdown high={analytics.highConfidence} low={analytics.lowConfidence} uncertain={analytics.uncertainCount} total={total} />
            )}
            {analytics.uncertainCount > 0 && (
              <div className="mt-5 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#d97706" }} strokeWidth={1.5} />
                <p className="text-[11px] leading-snug" style={{ color: "#92400e", fontFamily: FONT }}>{analytics.uncertainCount} question{analytics.uncertainCount > 1 ? "s" : ""} without a confident answer.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-base font-bold" style={{ color: "#1f2a44" }}>Query Log</h2>
            <p className="text-xs mt-0.5" style={{ color: "#9aa5b4" }}>Click any row to see {"Kora's response"}</p>
          </div>
          <QueryLog queries={queries} />
        </div>
      </div>
    </div>
  );
}