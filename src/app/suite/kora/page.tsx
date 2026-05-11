import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { KoraAdminPanel } from "@/components/suite/KoraAdminPanel";

export default async function KoraAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/suite/login");

  const { data: documents } = await supabase
    .from("documents")
    .select("id, name, status, chunk_count, created_at, updated_at")
    .order("created_at", { ascending: false });

  const { data: stats } = await supabase
    .from("suite_stats")
    .select("*")
    .single();

  return (
    <KoraAdminPanel
      initialDocuments={documents ?? []}
      totalQueries={Number(stats?.total_queries ?? 0)}
      queriesThisWeek={Number(stats?.queries_this_week ?? 0)}
      avgLatency={stats?.avg_latency_ms ? Number(stats.avg_latency_ms) : null}
    />
  );
}