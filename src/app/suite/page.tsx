import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ActivityFeed } from "@/components/suite/ActivityFeed";
import {
  StatsStrip,
  ProjectCard,
  NextProjectPlaceholder,
  SystemStatusPill,
} from "@/components/suite/DashboardCards";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SuiteDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/suite/login");

  const userName = user.email?.split("@")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);

  // Fetch stats
  const { data: stats } = await supabase
    .from("suite_stats")
    .select("*")
    .single();

  // Fetch recent queries
  const { data: recentQueries } = await supabase
    .from("queries")
    .select("id, question, confidence, latency_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const docsIndexed = Number(stats?.documents_indexed ?? 0);
  const totalQueries = Number(stats?.total_queries ?? 0);
  const queriesThisWeek = Number(stats?.queries_this_week ?? 0);
  const avgLatency = stats?.avg_latency_ms ? Number(stats.avg_latency_ms) : null;

  return (
    <div
      className="min-h-screen p-8"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#9aa5b4" }}
            >
              {formatDate()}
            </p>
            <h1
              className="text-3xl font-bold"
              style={{ color: "#1f2a44" }}
            >
              {greeting}, {userName}.
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "#6b7280" }}
            >
              Here is what is happening across your AI Suite today.
            </p>
          </div>
          <SystemStatusPill />
        </div>

        {/* ── Stats strip ── */}
        <StatsStrip
          docsIndexed={docsIndexed}
          totalQueries={totalQueries}
          queriesThisWeek={queriesThisWeek}
          avgLatency={avgLatency}
        />

        {/* ── AI Projects ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-base font-bold"
              style={{ color: "#1f2a44" }}
            >
              AI Projects
            </h2>
            <span
              className="text-xs"
              style={{ color: "#9aa5b4" }}
            >
              1 of 1 live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectCard
              name="Kora"
              category="AI Assistants and Internal Copilots"
              description="An internal knowledge assistant for Meridian Works. Employees ask questions and get instant, sourced answers from company documents, policies, and procedures."
              status="live"
              stats={[
                { label: "Documents", value: docsIndexed.toString() },
                { label: "Queries", value: totalQueries.toString() },
                { label: "This week", value: queriesThisWeek.toString() },
              ]}
              href="/suite/kora"
            />
            <NextProjectPlaceholder />
          </div>
        </div>

        {/* ── Recent activity ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-base font-bold"
              style={{ color: "#1f2a44" }}
            >
              Recent Activity
            </h2>
            <a
              href="/suite/kora"
              className="text-xs font-semibold"
              style={{ color: "#000", textDecoration: "none" }}
            >
              View all in Kora →
            </a>
          </div>
          <ActivityFeed queries={recentQueries ?? []} />
        </div>

      </div>
    </div>
  );
}