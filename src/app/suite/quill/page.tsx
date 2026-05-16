import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Feather, ExternalLink, FileText, Clock, ArrowRight } from "lucide-react";

export default async function QuillAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/suite/login");

  // Fetch recent SOW documents
  const { data: recentSOWs } = await supabase
    .from("sow_documents")
    .select("id, client_name, project_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: totalSOWs } = await supabase
    .from("sow_documents")
    .select("*", { count: "exact", head: true });

  const { count: exportedSOWs } = await supabase
    .from("sow_documents")
    .select("*", { count: "exact", head: true })
    .eq("status", "exported");

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    draft: { label: "Draft", bg: "#f3f4f6", color: "#6b7280" },
    generated: { label: "Generated", bg: "#e0f2fe", color: "#0369a1" },
    exported: { label: "Exported", bg: "#dcfce7", color: "#16a34a" },
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#9aa5b4" }}
            >
              AI Projects / Quill
            </p>
            <h1 className="text-3xl font-bold" style={{ color: "#1f2a44" }}>
              Quill
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              SOW and Proposal Generator — Nexus Labs
            </p>
          </div>

          <a
            href="/demo/sow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              backgroundColor: "#1f2a44",
              color: "#ffffff",
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
            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            Open demo
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total SOWs",
              value: (totalSOWs ?? 0).toString(),
              sub: "Generated all time",
              icon: FileText,
              accent: "#1f2a44",
            },
            {
              label: "Exported",
              value: (exportedSOWs ?? 0).toString(),
              sub: "Downloaded as PDF",
              icon: FileText,
              accent: "#a2d2ff",
            },
            {
              label: "Packages",
              value: "7",
              sub: "Nexus Labs pricing tiers",
              icon: Clock,
              accent: "#f59e0b",
            },
          ].map((stat) => (
            <div
              key={stat.label}
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
                  style={{ color: "#9aa5b4" }}
                >
                  {stat.label}
                </span>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: stat.accent + "18" }}
                >
                  <stat.icon
                    style={{ width: "15px", height: "15px", color: stat.accent }}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div>
                <p
                  className="text-3xl font-bold leading-none"
                  style={{ color: "#1f2a44" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-1.5" style={{ color: "#9aa5b4" }}>
                  {stat.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent SOWs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "#1f2a44" }}>
              Recent SOW Documents
            </h2>
          </div>

          {!recentSOWs || recentSOWs.length === 0 ? (
            <div
              className="rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d0d8e4",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#e6eaf0" }}
              >
                <Feather
                  className="w-6 h-6"
                  style={{ color: "#9aa5b4" }}
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1f2a44" }}
                >
                  No SOWs generated yet
                </p>
                <p className="text-xs mt-1" style={{ color: "#9aa5b4" }}>
                  SOWs generated via the demo will appear here.
                </p>
              </div>
              <a
                href="/demo/sow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mt-2"
                style={{
                  backgroundColor: "#1f2a44",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                Generate your first SOW
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d0d8e4",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-12 gap-4 px-5 py-3 border-b"
                style={{ borderColor: "#f1f5f9", backgroundColor: "#f8fafc" }}
              >
                {[
                  { label: "Client", span: "col-span-4" },
                  { label: "Project Type", span: "col-span-4" },
                  { label: "Status", span: "col-span-2" },
                  { label: "Created", span: "col-span-2" },
                ].map((h) => (
                  <div
                    key={h.label}
                    className={`text-[10px] font-bold uppercase tracking-widest ${h.span}`}
                    style={{ color: "#9aa5b4" }}
                  >
                    {h.label}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {recentSOWs.map((sow, index) => {
                const status = statusConfig[sow.status] ?? statusConfig.draft;
                return (
                  <div
                    key={sow.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors"
                    style={{
                      borderBottom:
                        index < recentSOWs.length - 1
                          ? "1px solid #f1f5f9"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Client */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: "#e6eaf0" }}
                      >
                        <Feather
                          className="w-4 h-4"
                          style={{ color: "#1f2a44" }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "#1f2a44" }}
                      >
                        {sow.client_name || "Unknown client"}
                      </p>
                    </div>

                    {/* Project type */}
                    <div className="col-span-4">
                      <p className="text-xs truncate" style={{ color: "#6b7280" }}>
                        {sow.project_type || "—"}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-xs" style={{ color: "#9aa5b4" }}>
                        {formatDate(sow.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coming soon notice */}
        <div
          className="rounded-2xl p-6 flex items-start gap-4"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d0d8e4",
          }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
            style={{ backgroundColor: "#e6eaf0" }}
          >
            <Feather
              className="w-5 h-5"
              style={{ color: "#1f2a44" }}
              strokeWidth={1.5}
            />
          </div>
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: "#1f2a44" }}
            >
              Quill Internal Version Coming Soon
            </p>
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: "#6b7280" }}
            >
              The full internal version will include a live Refactrd pricing database,
              document upload for transcripts, version history, approval workflows,
              and Google Docs export. Currently running as a public POC demo.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}