"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, Edit3, Check, X, Loader2, Sparkles } from "lucide-react";
import { ExtractionResult } from "@/app/demo/sow/page";

interface ExtractionReviewProps {
  extraction: ExtractionResult;
  onEdit: (updated: ExtractionResult) => void;
  onBack: () => void;
  onGenerate: () => void;
  notes: string;
}

function EditableField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onChange(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "#6b6560" }}
        >
          {label}
        </span>
        {!editing && (
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="flex items-center gap-1 text-[10px] font-medium transition-colors"
            style={{ color: "#c9782a" }}
          >
            <Edit3 className="w-3 h-3" strokeWidth={1.5} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{
                backgroundColor: "#f7f5f0",
                border: "1.5px solid #c9782a",
                color: "#1a1a2e",
                fontFamily: "Inter, sans-serif",
              }}
              autoFocus
            />
          ) : (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#f7f5f0",
                border: "1.5px solid #c9782a",
                color: "#1a1a2e",
                fontFamily: "Inter, sans-serif",
              }}
              autoFocus
            />
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={commit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{ backgroundColor: "#1a1a2e", color: "#ffffff" }}
            >
              <Check className="w-3 h-3" strokeWidth={2} />
              Save
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: "#e8e2d9", color: "#6b6560" }}
            >
              <X className="w-3 h-3" strokeWidth={2} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed" style={{ color: "#1a1a2e" }}>
          {value || <span style={{ color: "#9a9490" }}>Not detected</span>}
        </p>
      )}
    </div>
  );
}

function EditableList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items.join("\n"));

  const commit = () => {
    const updated = draft
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(updated);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(items.join("\n"));
    setEditing(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "#6b6560" }}
        >
          {label}
        </span>
        {!editing && (
          <button
            onClick={() => { setDraft(items.join("\n")); setEditing(true); }}
            className="flex items-center gap-1 text-[10px] font-medium"
            style={{ color: "#c9782a" }}
          >
            <Edit3 className="w-3 h-3" strokeWidth={1.5} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.max(3, items.length + 1)}
            placeholder="One item per line"
            className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
            style={{
              backgroundColor: "#f7f5f0",
              border: "1.5px solid #c9782a",
              color: "#1a1a2e",
              fontFamily: "Inter, sans-serif",
            }}
            autoFocus
          />
          <p className="text-[10px]" style={{ color: "#6b6560" }}>One item per line</p>
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
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: "#c9782a" }}
              />
              <span className="text-sm leading-relaxed" style={{ color: "#1a1a2e" }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExtractionReview({
  extraction,
  onEdit,
  onBack,
  onGenerate,
}: ExtractionReviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const update = (key: keyof ExtractionResult, value: string | string[]) => {
    onEdit({ ...extraction, [key]: value });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    onGenerate();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium mb-3 transition-colors"
            style={{ color: "#6b6560" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6560")}
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            Back to notes
          </button>
          <h2
            className="text-2xl font-bold"
            style={{
              color: "#1a1a2e",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            Review extracted details
          </h2>
          <p className="text-sm mt-1" style={{ color: "#6b6560" }}>
            Quill read your notes and pulled these key details. Edit anything that looks off before generating the SOW.
          </p>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a" }}
        >
          <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
          Extracted
        </div>
      </div>

      {/* Extraction card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8e2d9",
          boxShadow: "0 2px 16px rgba(26,26,46,0.06)",
        }}
      >
        {/* Client info section */}
        <div
          className="px-6 py-5 border-b"
          style={{ borderColor: "#f0ece6", backgroundColor: "#faf9f7" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9782a" }}
          >
            Client Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <EditableField
              label="Client name"
              value={extraction.clientName}
              onChange={(v) => update("clientName", v)}
            />
            <EditableField
              label="Industry"
              value={extraction.industry}
              onChange={(v) => update("industry", v)}
            />
            <EditableField
              label="Company size"
              value={extraction.companySize}
              onChange={(v) => update("companySize", v)}
            />
          </div>
        </div>

        {/* Project section */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "#f0ece6" }}>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9782a" }}
          >
            Project Details
          </p>
          <div className="space-y-5">
            <EditableField
              label="Project type"
              value={extraction.projectType}
              onChange={(v) => update("projectType", v)}
            />
            <EditableField
              label="Problem statement"
              value={extraction.problemStatement}
              onChange={(v) => update("problemStatement", v)}
              multiline
            />
            <EditableList
              label="Key requirements"
              items={extraction.keyRequirements}
              onChange={(v) => update("keyRequirements", v)}
            />
          </div>
        </div>

        {/* Signals section */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "#f0ece6" }}>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9782a" }}
          >
            Signals
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <EditableField
              label="Timeline signals"
              value={extraction.timelineSignals}
              onChange={(v) => update("timelineSignals", v)}
            />
            <EditableField
              label="Budget signals"
              value={extraction.budgetSignals}
              onChange={(v) => update("budgetSignals", v)}
            />
          </div>
        </div>

        {/* Success metrics */}
        <div className="px-6 py-5">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9782a" }}
          >
            Success Metrics
          </p>
          <EditableList
            label=""
            items={extraction.successMetrics}
            onChange={(v) => update("successMetrics", v)}
          />
        </div>
      </div>

      {/* Generate button */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs leading-relaxed" style={{ color: "#6b6560" }}>
          Happy with these details? Quill will now match your project to the right service packages and generate a full SOW.
        </p>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0"
          style={{
            backgroundColor: "#1a1a2e",
            color: "#ffffff",
            cursor: isGenerating ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) e.currentTarget.style.backgroundColor = "#c9782a";
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) e.currentTarget.style.backgroundColor = "#1a1a2e";
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              Generating SOW...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              Generate SOW
            </>
          )}
        </button>
      </div>
    </div>
  );
}