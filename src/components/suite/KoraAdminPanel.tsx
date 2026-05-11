"use client";

import { useState, useCallback, useRef } from "react";
import {
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  X,
  MessageSquare,
  Zap,
  Database,
  ExternalLink,
  CloudUpload,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Document {
  id: string;
  name: string;
  status: "queued" | "processing" | "indexed" | "failed";
  chunk_count: number | null;
  created_at: string;
  updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileName(name: string): string {
  return name.replace(/^\d+_/, "").replace(/_/g, " ").replace(/\.txt$|\.pdf$/, "");
}

// ─── Status chip ──────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: Document["status"] }) {
  const config = {
    indexed: {
      label: "Indexed",
      icon: CheckCircle,
      color: "#16a34a",
      bg: "#dcfce7",
    },
    processing: {
      label: "Processing",
      icon: Loader2,
      color: "#d97706",
      bg: "#fef3c7",
      spin: true,
    },
    queued: {
      label: "Queued",
      icon: Clock,
      color: "#0369a1",
      bg: "#e0f2fe",
    },
    failed: {
      label: "Failed",
      icon: AlertCircle,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  }[status];

  const Icon = config.icon;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ backgroundColor: config.bg }}
    >
      <Icon
        style={{ width: "11px", height: "11px", color: config.color }}
        strokeWidth={2}
        className={"spin" in config && config.spin ? "animate-spin" : ""}
      />
      <span
        className="text-[11px] font-semibold"
        style={{ color: config.color, fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        {config.label}
      </span>
    </div>
  );
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  documentName,
  onConfirm,
  onCancel,
}: {
  documentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={onCancel}
      />
      <div
        className="relative rounded-2xl p-6 w-full max-w-sm shadow-xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4"
          style={{ color: "#9aa5b4" }}
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#fef2f2" }}
        >
          <Trash2 className="w-5 h-5" style={{ color: "#dc2626" }} strokeWidth={1.5} />
        </div>

        <h3
          className="text-base font-bold mb-1"
          style={{ color: "#1f2a44", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Delete document?
        </h3>
        <p
          className="text-sm mb-5"
          style={{ color: "#6b7280", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          <span className="font-semibold" style={{ color: "#1f2a44" }}>
            {formatFileName(documentName)}
          </span>{" "}
          and all its indexed chunks will be permanently deleted. Kora will no
          longer be able to answer questions from this document.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "#e6eaf0",
              color: "#1f2a44",
              fontFamily: "var(--font-montserrat), sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontFamily: "var(--font-montserrat), sans-serif",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upload zone ──────────────────────────────────────────────────────────────

function UploadZone({
  onUpload,
  isUploading,
}: {
  onUpload: (file: File) => void;
  isUploading: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  return (
    <div
      className="rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
      style={{
        borderColor: isDragging ? "#a2d2ff" : "#d0d8e4",
        backgroundColor: isDragging ? "rgba(162,210,255,0.06)" : "#f8fafc",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />

      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: isDragging ? "#a2d2ff22" : "#e6eaf0" }}
      >
        {isUploading ? (
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "#1f2a44" }}
            strokeWidth={1.5}
          />
        ) : (
          <CloudUpload
            className="w-6 h-6"
            style={{ color: isDragging ? "#a2d2ff" : "#9aa5b4" }}
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="text-center">
        <p
          className="text-sm font-semibold"
          style={{ color: "#1f2a44", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {isUploading ? "Uploading and ingesting..." : "Drop a file or click to upload"}
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "#9aa5b4", fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          PDF or TXT, up to 10MB
        </p>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

interface KoraAdminPanelProps {
  initialDocuments: Document[];
  totalQueries: number;
  queriesThisWeek: number;
  avgLatency: number | null;
}

export function KoraAdminPanel({
  initialDocuments,
  totalQueries,
  queriesThisWeek,
  avgLatency,
}: KoraAdminPanelProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [reingesting, setReingesting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Document | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const refreshDocuments = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("documents")
      .select("id, name, status, chunk_count, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (data) setDocuments(data);
  };

  // ─── Upload ──────────────────────────────────────────────────────────────────

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/documents/ingest`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Upload failed");
      }

      showToast(`${file.name} ingested successfully.`, "success");
      await refreshDocuments();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      showToast(message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (doc: Document) => {
    setConfirmDelete(null);
    setDeleting(doc.id);
    try {
      const response = await fetch(`/api/suite/documents`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: doc.id }),
      });

      if (!response.ok) throw new Error("Delete failed");

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      showToast(`${formatFileName(doc.name)} deleted.`, "success");
    } catch {
      showToast("Failed to delete document. Please try again.", "error");
    } finally {
      setDeleting(null);
    }
  };

  // ─── Re-ingest ───────────────────────────────────────────────────────────────

  const handleReingest = async (doc: Document) => {
    setReingesting(doc.id);
    try {
      const response = await fetch(
        `${API_URL}/documents/${doc.id}/reingest`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Re-ingest failed");

      showToast(`${formatFileName(doc.name)} re-ingested successfully.`, "success");
      await refreshDocuments();
    } catch {
      showToast("Re-ingest failed. Please try again.", "error");
    } finally {
      setReingesting(null);
    }
  };

  const indexedCount = documents.filter((d) => d.status === "indexed").length;

  return (
    <div
      className="min-h-screen p-8"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
          style={{
            backgroundColor: toast.type === "success" ? "#dcfce7" : "#fef2f2",
            border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4" style={{ color: "#16a34a" }} />
          ) : (
            <AlertCircle className="w-4 h-4" style={{ color: "#dc2626" }} />
          )}
          <p
            className="text-sm font-medium"
            style={{
              color: toast.type === "success" ? "#16a34a" : "#dc2626",
            }}
          >
            {toast.message}
          </p>
        </div>
      )}

      {/* Confirm dialog */}
      {confirmDelete && (
        <ConfirmDialog
          documentName={confirmDelete.name}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#9aa5b4" }}
            >
              AI Projects / Kora
            </p>
            <h1
              className="text-3xl font-bold"
              style={{ color: "#1f2a44" }}
            >
              Kora
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Knowledge Assistant — Meridian Works
            </p>
          </div>

          <a
            href="/demo/vault"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              backgroundColor: "#1f2a44",
              color: "#ffffff",
              textDecoration: "none",
              fontFamily: "var(--font-montserrat), sans-serif",
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

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Documents",
              value: indexedCount.toString(),
              sub: "Indexed and ready",
              icon: Database,
              accent: "#1f2a44",
            },
            {
              label: "Total Queries",
              value: totalQueries.toString(),
              sub: "All time",
              icon: MessageSquare,
              accent: "#6bb5f5",
            },
            {
              label: "This Week",
              value: queriesThisWeek.toString(),
              sub: "Queries last 7 days",
              icon: MessageSquare,
              accent: "#a2d2ff",
            },
            {
              label: "Avg Latency",
              value: avgLatency ? `${avgLatency}ms` : "—",
              sub: "Response time",
              icon: Zap,
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

        {/* ── Upload zone ── */}
        <div>
          <h2
            className="text-base font-bold mb-4"
            style={{ color: "#1f2a44" }}
          >
            Upload Document
          </h2>
          <UploadZone onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* ── Document table ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-base font-bold"
              style={{ color: "#1f2a44" }}
            >
              Knowledge Base
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#9aa5b4" }}>
                {indexedCount} of {documents.length} indexed
              </span>
              <button
                onClick={refreshDocuments}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                style={{ backgroundColor: "#e6eaf0", color: "#1f2a44" }}
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {documents.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d0d8e4",
              }}
            >
              <FileText
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: "#d0d8e4" }}
                strokeWidth={1.5}
              />
              <p
                className="text-sm font-semibold"
                style={{ color: "#9aa5b4" }}
              >
                No documents yet
              </p>
              <p className="text-xs mt-1" style={{ color: "#c4cdd8" }}>
                Upload a PDF or TXT file above to get started.
              </p>
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
                style={{
                  borderColor: "#f1f5f9",
                  backgroundColor: "#f8fafc",
                }}
              >
                {["Document", "Status", "Chunks", "Added", "Actions"].map(
                  (h, i) => (
                    <div
                      key={h}
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        i === 0
                          ? "col-span-4"
                          : i === 4
                          ? "col-span-2 text-right"
                          : "col-span-2"
                      }`}
                      style={{ color: "#9aa5b4" }}
                    >
                      {h}
                    </div>
                  )
                )}
              </div>

              {/* Rows */}
              {documents.map((doc, index) => (
                <div
                  key={doc.id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors"
                  style={{
                    borderBottom:
                      index < documents.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  {/* Name */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: "#e6eaf0" }}
                    >
                      <FileText
                        className="w-4 h-4"
                        style={{ color: "#1f2a44" }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "#1f2a44" }}
                      >
                        {formatFileName(doc.name)}
                      </p>
                      <p
                        className="text-[10px] truncate"
                        style={{ color: "#9aa5b4" }}
                      >
                        {doc.name}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusChip status={doc.status} />
                  </div>

                  {/* Chunks */}
                  <div className="col-span-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#1f2a44" }}
                    >
                      {doc.chunk_count ?? "—"}
                    </p>
                    <p className="text-[10px]" style={{ color: "#9aa5b4" }}>
                      chunks
                    </p>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      {formatDate(doc.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    {/* Re-ingest */}
                    <button
                      onClick={() => handleReingest(doc)}
                      disabled={reingesting === doc.id}
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                      style={{
                        backgroundColor: "#e6eaf0",
                        color: "#1f2a44",
                      }}
                      title="Re-ingest"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1f2a44";
                        e.currentTarget.style.color = "#a2d2ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#e6eaf0";
                        e.currentTarget.style.color = "#1f2a44";
                      }}
                    >
                      {reingesting === doc.id ? (
                        <Loader2
                          className="w-3.5 h-3.5 animate-spin"
                          strokeWidth={2}
                        />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmDelete(doc)}
                      disabled={deleting === doc.id}
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                      style={{
                        backgroundColor: "#e6eaf0",
                        color: "#9aa5b4",
                      }}
                      title="Delete"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fef2f2";
                        e.currentTarget.style.color = "#dc2626";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#e6eaf0";
                        e.currentTarget.style.color = "#9aa5b4";
                      }}
                    >
                      {deleting === doc.id ? (
                        <Loader2
                          className="w-3.5 h-3.5 animate-spin"
                          strokeWidth={2}
                        />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}