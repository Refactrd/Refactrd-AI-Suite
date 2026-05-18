"use client";

import { useState, useEffect } from "react";
import { QuillHeader } from "@/components/quill/QuillHeader";
import { DiscoveryInput } from "@/components/quill/DiscoveryInput";
import { ExtractionReview } from "@/components/quill/ExtractionReview";
import { SOWViewer } from "@/components/quill/SOWViewer";
import { Feather } from "lucide-react";

export type ExtractionResult = {
  clientName: string;
  industry: string;
  companySize: string;
  problemStatement: string;
  projectType: string;
  keyRequirements: string[];
  timelineSignals: string;
  budgetSignals: string;
  successMetrics: string[];
  additionalNotes: string;
};

export type SOWSection = {
  title: string;
  content: string;
};

export type SOWDocument = {
  executiveSummary: SOWSection;
  scopeOfWork: SOWSection;
  phasingAndTimeline: SOWSection;
  deliverables: SOWSection;
  pricingTiers: SOWSection;
  exclusions: SOWSection;
  assumptions: SOWSection;
  paymentTerms: SOWSection;
  matchedPackages: Array<{
    id: string;
    name: string;
    rate_min: number;
    rate_max?: number;
    rate_type: string;
    duration_weeks_min?: number;
    duration_weeks_max?: number;
    category: string;
  }>;
  clientName: string;
  projectType: string;
  preparedBy: string;
};

export type QuillStep = "input" | "extracting" | "review" | "generating" | "sow";

// ─── Session storage helpers ──────────────────────────────────────────────────

const SESSION_KEY = "quill_session";

function saveSession(data: {
  step: QuillStep;
  notes: string;
  extraction: ExtractionResult | null;
  sow: SOWDocument | null;
}) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {}
}

function loadSession(): {
  step: QuillStep;
  notes: string;
  extraction: ExtractionResult | null;
  sow: SOWDocument | null;
} | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

// ─── Generation loading screen ────────────────────────────────────────────────

function GeneratingScreen({ clientName }: { clientName: string }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Matching service packages to your project...",
    "Drafting executive summary...",
    "Defining scope and deliverables...",
    "Structuring phasing and timeline...",
    "Calculating investment tiers...",
    "Finalising assumptions and terms...",
    "Polishing the document...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "#1a1a2e" }}
        >
          <Feather
            className="w-8 h-8 animate-pulse"
            style={{ color: "#c9782a" }}
            strokeWidth={1.5}
          />
        </div>
        <div
          className="absolute -inset-1 rounded-2xl animate-ping opacity-20"
          style={{ backgroundColor: "#c9782a" }}
        />
      </div>

      <div className="space-y-2">
        <h2
          className="text-2xl font-bold"
          style={{
            color: "#1a1a2e",
            fontFamily: "var(--font-playfair), Georgia, serif",
          }}
        >
          Generating SOW for {clientName}
        </h2>
        <p className="text-sm h-6 transition-all duration-500" style={{ color: "#6b6560" }}>
          {steps[currentStep]}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentStep ? "24px" : "6px",
              height: "6px",
              backgroundColor: i === currentStep ? "#c9782a" : "#e8e2d9",
            }}
          />
        ))}
      </div>

      <p className="text-xs" style={{ color: "#9a9490" }}>
        This takes about 20 to 30 seconds
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SowPage() {
  const [step, setStep] = useState<QuillStep>("input");
  const [notes, setNotes] = useState("");
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [sow, setSow] = useState<SOWDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(
    () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  );
  const [hydrated, setHydrated] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      // Don't restore extracting or generating states - those are transient
      if (saved.step === "extracting" || saved.step === "generating") {
        setStep("input");
        setNotes(saved.notes || "");
      } else {
        setStep(saved.step);
        setNotes(saved.notes || "");
        setExtraction(saved.extraction);
        setSow(saved.sow);
      }
    }
    setHydrated(true);
  }, []);

  // Save session whenever state changes
  useEffect(() => {
    if (!hydrated) return;
    if (step === "input" && !notes && !extraction && !sow) return;
    saveSession({ step, notes, extraction, sow });
  }, [step, notes, extraction, sow, hydrated]);

  const handleExtract = async (discoveryNotes: string) => {
    setNotes(discoveryNotes);
    setStep("extracting");
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sow/extract`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: discoveryNotes }),
        }
      );

      if (!response.ok) throw new Error("Extraction failed. Please try again.");

      const data = await response.json();
      setExtraction(data);
      setStep("review");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setStep("input");
    }
  };

  const handleGenerate = async () => {
    if (!extraction) return;
    setStep("generating");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sow/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ extraction, notes, sessionId }),
        }
      );

      if (!response.ok) throw new Error("Generation failed. Please try again.");

      const data = await response.json();
      setSow(data);
      setStep("sow");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "SOW generation failed.";
      setError(message);
      setStep("review");
    }
  };

  const handleStartOver = () => {
    clearSession();
    setStep("input");
    setExtraction(null);
    setSow(null);
    setNotes("");
    setError(null);
  };

  if (!hydrated) return null;

  return (
    <main
      className="min-h-screen min-h-dvh"
      style={{ backgroundColor: "#f7f5f0", fontFamily: "var(--font-inter), Inter, sans-serif" }}
    >
      <QuillHeader />

      <div
        className={
          step === "sow"
            ? "max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10"
            : "max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14"
        }
      >
        {(step === "input" || step === "extracting") && (
          <DiscoveryInput
            initialNotes={notes}
            onExtract={handleExtract}
            isExtracting={step === "extracting"}
            error={error}
          />
        )}

        {step === "review" && extraction && (
          <ExtractionReview
            extraction={extraction}
            onEdit={setExtraction}
            onBack={handleStartOver}
            onGenerate={handleGenerate}
            notes={notes}
          />
        )}

        {step === "generating" && extraction && (
          <GeneratingScreen clientName={extraction.clientName} />
        )}

        {step === "sow" && sow && (
          <SOWViewer
            sow={sow}
            onEdit={setSow}
            onStartOver={handleStartOver}
            sessionId={sessionId}
          />
        )}
      </div>
    </main>
  );
}