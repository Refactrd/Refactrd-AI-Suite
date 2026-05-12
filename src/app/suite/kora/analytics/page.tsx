import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { KoraAnalytics } from "@/components/suite/KoraAnalytics";

export default async function KoraAnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/suite/login");

  // Fetch analytics summary
  const { data: analytics } = await supabase
    .from("kora_analytics")
    .select("*")
    .single();

  // Fetch all queries for the log
  const { data: queries } = await supabase
    .from("queries")
    .select("id, question, response, confidence, latency_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch queries by day for the last 14 days
  const { data: dailyData } = await supabase.rpc("queries_by_day");

  return (
    <KoraAnalytics
      analytics={{
        totalQueries: Number(analytics?.total_queries ?? 0),
        queriesThisWeek: Number(analytics?.queries_this_week ?? 0),
        queriesThisMonth: Number(analytics?.queries_this_month ?? 0),
        avgLatencyMs: analytics?.avg_latency_ms ? Number(analytics.avg_latency_ms) : null,
        minLatencyMs: analytics?.min_latency_ms ? Number(analytics.min_latency_ms) : null,
        maxLatencyMs: analytics?.max_latency_ms ? Number(analytics.max_latency_ms) : null,
        highConfidence: Number(analytics?.high_confidence ?? 0),
        lowConfidence: Number(analytics?.low_confidence ?? 0),
        uncertainCount: Number(analytics?.uncertain_count ?? 0),
      }}
      queries={queries ?? []}
      dailyData={dailyData ?? []}
    />
  );
}