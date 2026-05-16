"use client";

import { useState } from "react";
import { Edit3, Check, X, Download, RotateCcw, Palette } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SOWDocument } from "@/app/demo/sow/page";
import { BrandingPanel, Branding } from "@/components/quill/BrandingPanel";

interface SOWViewerProps {
  sow: SOWDocument;
  onEdit: (updated: SOWDocument) => void;
  onStartOver: () => void;
  sessionId: string;
}

// ─── Editable section ─────────────────────────────────────────────────────────

function SOWSection({
  title,
  content,
  onSave,
}: {
  title: string;
  content: string;
  onSave: (content: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  const commit = () => {
    onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(content);
    setEditing(false);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e8e2d9" }}
    >
      <div
        className="flex items-center justify-between px-5 sm:px-6 py-4 border-b"
        style={{ borderColor: "#f0ece6", backgroundColor: "#faf9f7" }}
      >
        <h3
          className="text-sm sm:text-base font-bold"
          style={{
            color: "#1a1a2e",
            fontFamily: "var(--font-playfair), Georgia, serif",
          }}
        >
          {title}
        </h3>
        {!editing ? (
          <button
            onClick={() => { setDraft(content); setEditing(true); }}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "#6b6560" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0ece6";
              e.currentTarget.style.color = "#1a1a2e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b6560";
            }}
          >
            <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={commit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: "#1a1a2e", color: "#ffffff" }}
            >
              <Check className="w-3 h-3" strokeWidth={2} />
              Save
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: "#e8e2d9", color: "#6b6560" }}
            >
              <X className="w-3 h-3" strokeWidth={2} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="px-5 sm:px-6 py-5">
        {editing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={12}
            className="w-full text-sm outline-none resize-none leading-relaxed"
            style={{
              backgroundColor: "#f7f5f0",
              border: "1.5px solid #c9782a",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "#1a1a2e",
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
            autoFocus
          />
        ) : (
          <div className="text-sm leading-relaxed" style={{ color: "#1a1a2e" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold" style={{ color: "#1a1a2e" }}>
                    {children}
                  </strong>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 mb-3">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-2 mb-3 ml-4 list-decimal">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2 leading-relaxed list-none">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                      style={{ backgroundColor: "#c9782a" }}
                    />
                    <span>{children}</span>
                  </li>
                ),
                h3: ({ children }) => (
                  <h3
                    className="text-sm font-bold mt-4 mb-2"
                    style={{
                      color: "#1a1a2e",
                      fontFamily: "var(--font-playfair), Georgia, serif",
                    }}
                  >
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4
                    className="text-xs font-bold uppercase tracking-wider mt-3 mb-1.5"
                    style={{ color: "#6b6560" }}
                  >
                    {children}
                  </h4>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Matched packages strip ───────────────────────────────────────────────────

function MatchedPackages({
  packages,
}: {
  packages: SOWDocument["matchedPackages"];
}) {
  if (!packages || packages.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{ backgroundColor: "#1a1a2e", border: "1px solid #2a2a3e" }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-4"
        style={{ color: "#c9782a" }}
      >
        Matched service packages
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {packages.map((pkg) => {
          const rateStr =
            pkg.rate_type === "fixed"
              ? `$${pkg.rate_min?.toLocaleString()}`
              : pkg.rate_type === "monthly"
              ? `$${pkg.rate_min?.toLocaleString()}/mo`
              : pkg.rate_max
              ? `$${pkg.rate_min?.toLocaleString()} – $${pkg.rate_max?.toLocaleString()}`
              : `$${pkg.rate_min?.toLocaleString()}`;

          return (
            <div
              key={pkg.id}
              className="rounded-xl p-3 sm:p-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#e8e2d9" }}
              >
                {pkg.name}
              </p>
              <p className="text-xs font-bold" style={{ color: "#c9782a" }}>
                {rateStr}
              </p>
              {pkg.duration_weeks_min && (
                <p
                  className="text-[10px] mt-1"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {pkg.duration_weeks_min}
                  {pkg.duration_weeks_max &&
                  pkg.duration_weeks_max !== pkg.duration_weeks_min
                    ? `–${pkg.duration_weeks_max}`
                    : ""}{" "}
                  weeks
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SOWViewer({
  sow,
  onEdit,
  onStartOver,
  sessionId,
}: SOWViewerProps) {
  const [showBrandingPanel, setShowBrandingPanel] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (branding: Branding) => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sow/export-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sow, sessionId, branding }),
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sow.clientName.replace(/\s+/g, "-")}-Scope-of-Work.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setShowBrandingPanel(false);
    } catch {
      alert("PDF export failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateSection = (key: keyof SOWDocument, content: string) => {
    onEdit({
      ...sow,
      [key]: {
        ...(sow[key] as { title: string; content: string }),
        content,
      },
    });
  };

  const sections: Array<{
    key: keyof SOWDocument;
    section: { title: string; content: string };
  }> = [
    { key: "executiveSummary", section: sow.executiveSummary },
    { key: "scopeOfWork", section: sow.scopeOfWork },
    { key: "phasingAndTimeline", section: sow.phasingAndTimeline },
    { key: "deliverables", section: sow.deliverables },
    { key: "pricingTiers", section: sow.pricingTiers },
    { key: "exclusions", section: sow.exclusions },
    { key: "assumptions", section: sow.assumptions },
    { key: "paymentTerms", section: sow.paymentTerms },
  ];

  return (
    <>
      {showBrandingPanel && (
        <BrandingPanel
          clientName={sow.clientName}
          sessionId={sessionId}
          sow={sow}
          onClose={() => setShowBrandingPanel(false)}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      )}

      <div className="space-y-5 sm:space-y-6">
        {/* SOW header */}
        <div
          className="rounded-2xl px-5 sm:px-6 py-5"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #2a2040 100%)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: "#c9782a" }}
              >
                Scope of Work
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{
                  color: "#f7f5f0",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                }}
              >
                {sow.clientName}
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(247,245,240,0.6)" }}
              >
                {sow.projectType} · Prepared by {sow.preparedBy}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onStartOver}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "rgba(247,245,240,0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="hidden sm:inline">Start over</span>
              </button>

              <button
                onClick={() => setShowBrandingPanel(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#e8e2d9", border: "1px solid rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
              >
                <Palette className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Customise PDF</span>
              </button>

              <button
                onClick={() => setShowBrandingPanel(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: "#c9782a", color: "#ffffff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#b8671f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#c9782a";
                }}
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Matched packages */}
        <MatchedPackages packages={sow.matchedPackages} />

        {/* SOW sections */}
        {sections.map(({ key, section }) => (
          <SOWSection
            key={key}
            title={section.title}
            content={section.content}
            onSave={(content) => updateSection(key, content)}
          />
        ))}

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <button
            onClick={onStartOver}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#6b6560" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6560")}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
            Start a new SOW
          </button>

          <button
            onClick={() => setShowBrandingPanel(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ backgroundColor: "#1a1a2e", color: "#ffffff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c9782a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1a1a2e";
            }}
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}