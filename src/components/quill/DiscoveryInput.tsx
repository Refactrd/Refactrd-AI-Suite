"use client";

import { useState, useEffect } from "react";
import { Feather, Loader2, Sparkles, RotateCcw, AlertCircle, Info } from "lucide-react";
import { SWIFTHAUL_EXAMPLE } from "@/components/quill/exampleNotes";

const MAX_CHARS = 3000;

interface DiscoveryInputProps {
  initialNotes?: string;
  onExtract: (notes: string) => void;
  isExtracting: boolean;
  error: string | null;
}

export function DiscoveryInput({
  initialNotes,
  onExtract,
  isExtracting,
  error,
}: DiscoveryInputProps) {
  const [notes, setNotes] = useState(initialNotes || SWIFTHAUL_EXAMPLE);
  const [isExample, setIsExample] = useState(!initialNotes || initialNotes === SWIFTHAUL_EXAMPLE);

  useEffect(() => {
    if (initialNotes && initialNotes !== SWIFTHAUL_EXAMPLE) {
      setNotes(initialNotes);
      setIsExample(false);
    }
  }, [initialNotes]);

  const handleClear = () => {
    setNotes("");
    setIsExample(false);
  };

  const handleRestoreExample = () => {
    setNotes(SWIFTHAUL_EXAMPLE);
    setIsExample(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setNotes(val);
      setIsExample(val === SWIFTHAUL_EXAMPLE);
    }
  };

  const charCount = notes.trim().length;
  const canExtract = charCount >= 100 && charCount <= MAX_CHARS && !isExtracting;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.85;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: "#1a1a2e08",
            border: "1px solid #e8e2d9",
            color: "#6b6560",
          }}
        >
          <Feather className="w-3 h-3" style={{ color: "#c9782a" }} strokeWidth={1.5} />
          Discovery notes to client-ready proposal in minutes
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{
            color: "#1a1a2e",
            fontFamily: "var(--font-playfair), Georgia, serif",
          }}
        >
          Turn your notes into
          <br />
          <span style={{ color: "#c9782a" }}>a professional SOW</span>
        </h1>

        <p
          className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
          style={{ color: "#6b6560" }}
        >
          Paste your discovery call notes below. Quill reads them, extracts the
          key details, and generates a structured scope of work you can edit and
          download.
        </p>
      </div>

      {/* Example banner */}
      {isExample && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{
            backgroundColor: "#fff8f0",
            border: "1px solid #f0d5b5",
          }}
        >
          <Info
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#c9782a" }}
            strokeWidth={1.5}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>
              This is a sample discovery note
            </p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6b6560" }}>
              SwiftHaul Logistics is a fictional example to show you what good
              discovery notes look like. Clear the field and paste your own
              notes to generate a real SOW.
            </p>
          </div>
          <button
            onClick={handleClear}
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "#1a1a2e", color: "#ffffff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c9782a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1a1a2e";
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Input card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8e2d9",
          boxShadow: "0 2px 16px rgba(26,26,46,0.06)",
        }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-4 sm:px-5 py-3 border-b"
          style={{ borderColor: "#e8e2d9", backgroundColor: "#faf9f7" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isExample ? "#c9782a" : "#1a1a2e" }}
            />
            <span className="text-xs font-semibold" style={{ color: "#6b6560" }}>
              {isExample
                ? "SwiftHaul Logistics — Sample notes"
                : notes.length > 0
                ? "Your discovery notes"
                : "Empty — paste your notes below"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isExample && notes.length > 0 && (
              <button
                onClick={handleRestoreExample}
                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: "#6b6560" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f7f5f0";
                  e.currentTarget.style.color = "#1a1a2e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b6560";
                }}
              >
                <RotateCcw className="w-3 h-3" strokeWidth={2} />
                <span className="hidden sm:inline">Restore example</span>
              </button>
            )}
            {notes.length > 0 && !isExample && (
              <button
                onClick={handleClear}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: "#6b6560" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f7f5f0";
                  e.currentTarget.style.color = "#1a1a2e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b6560";
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder={
            "Paste your discovery call notes here...\n\nInclude:\n- Client name and company\n- Their current situation and pain points\n- Goals and success metrics\n- Timeline and budget signals"
          }
          rows={16}
          className="w-full px-4 sm:px-5 py-4 outline-none resize-none text-sm leading-relaxed"
          style={{
            backgroundColor: "#ffffff",
            color: "#1a1a2e",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            caretColor: "#c9782a",
            opacity: isExample ? 0.75 : 1,
          }}
          disabled={isExtracting}
        />

        {/* Card footer */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t"
          style={{ borderColor: "#e8e2d9", backgroundColor: "#faf9f7" }}
        >
          {/* Character count */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono font-semibold"
              style={{
                color: isOverLimit
                  ? "#dc2626"
                  : isNearLimit
                  ? "#c9782a"
                  : "#9a9490",
              }}
            >
              {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
            </span>
            {charCount < 100 && charCount > 0 && (
              <span className="text-xs" style={{ color: "#c9782a" }}>
                Need {100 - charCount} more characters to analyse
              </span>
            )}
            {charCount === 0 && (
              <span className="text-xs" style={{ color: "#9a9490" }}>
                Minimum 100 characters
              </span>
            )}
            {isOverLimit && (
              <span className="text-xs" style={{ color: "#dc2626" }}>
                Over limit by {charCount - MAX_CHARS} characters
              </span>
            )}
          </div>

          {/* Analyse button */}
          <button
            onClick={() => canExtract && onExtract(notes)}
            disabled={!canExtract}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: canExtract ? "#1a1a2e" : "#e8e2d9",
              color: canExtract ? "#ffffff" : "#9a9490",
              cursor: canExtract ? "pointer" : "not-allowed",
            }}
            onMouseEnter={(e) => {
              if (canExtract) e.currentTarget.style.backgroundColor = "#c9782a";
            }}
            onMouseLeave={(e) => {
              if (canExtract) e.currentTarget.style.backgroundColor = "#1a1a2e";
            }}
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                Analysing notes...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                Analyse notes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <AlertCircle
            className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500"
            strokeWidth={1.5}
          />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Extraction loading */}
      {isExtracting && (
        <div className="text-center space-y-3 py-4">
          <div className="flex items-center justify-center gap-2">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: "#c9782a", animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
          <p className="text-sm font-medium" style={{ color: "#6b6560" }}>
            Reading your notes and extracting key details...
          </p>
        </div>
      )}

      {/* How it works */}
      {!isExtracting && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
          {[
            {
              step: "01",
              label: "Paste notes",
              desc: "Drop in your raw discovery call notes",
            },
            {
              step: "02",
              label: "Review extraction",
              desc: "Verify what Quill pulled from your notes",
            },
            {
              step: "03",
              label: "Download SOW",
              desc: "Edit sections and export a branded PDF",
            },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-1.5 sm:space-y-2">
              <span
                className="text-xs font-bold"
                style={{
                  color: "#c9782a",
                  fontFamily: "var(--font-playfair), serif",
                }}
              >
                {item.step}
              </span>
              <p
                className="text-xs font-semibold"
                style={{ color: "#1a1a2e" }}
              >
                {item.label}
              </p>
              <p
                className="text-xs leading-relaxed hidden sm:block"
                style={{ color: "#6b6560" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}