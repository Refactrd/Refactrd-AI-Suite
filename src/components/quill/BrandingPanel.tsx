"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, X, Check } from "lucide-react";

export interface Branding {
  font: string;
  colourPreset: string;
  fontSize: string;
  customPrimary: string;
  customAccent: string;
}

interface BrandingPanelProps {
  clientName: string;
  sessionId: string;
  sow: object;
  onClose: () => void;
  onDownload: (branding: Branding) => Promise<void>;
  isDownloading: boolean;
}

const FONTS = [
  { key: "playfair", name: "Playfair Display", style: "Georgia, serif" },
  { key: "inter", name: "Inter", style: "system-ui, sans-serif" },
  { key: "lato", name: "Lato", style: "system-ui, sans-serif" },
  { key: "merriweather", name: "Merriweather", style: "Georgia, serif" },
  { key: "montserrat", name: "Montserrat", style: "system-ui, sans-serif" },
  { key: "raleway", name: "Raleway", style: "system-ui, sans-serif" },
  { key: "nunito", name: "Nunito", style: "system-ui, sans-serif" },
  { key: "josefin", name: "Josefin Sans", style: "system-ui, sans-serif" },
  { key: "cormorant", name: "Cormorant Garamond", style: "Georgia, serif" },
  { key: "dm_serif", name: "DM Serif Display", style: "Georgia, serif" },
];

const COLOUR_PRESETS = [
  {
    key: "obsidian",
    name: "Obsidian & Copper",
    primary: "#1a1a2e",
    accent: "#c9782a",
    bg: "#f7f5f0",
  },
  {
    key: "midnight",
    name: "Midnight & Electric",
    primary: "#0d1117",
    accent: "#58a6ff",
    bg: "#f6f8fa",
  },
  {
    key: "forest",
    name: "Forest & Gold",
    primary: "#1c3d2e",
    accent: "#d4a843",
    bg: "#f8f9f4",
  },
  {
    key: "crimson",
    name: "Crimson & Cream",
    primary: "#7b1e2e",
    accent: "#e8c547",
    bg: "#fdf8f0",
  },
  {
    key: "slate",
    name: "Slate & Coral",
    primary: "#1e2d3d",
    accent: "#e8533a",
    bg: "#f4f6f9",
  },
  {
    key: "plum",
    name: "Plum & Mint",
    primary: "#3b1f4e",
    accent: "#2ec4b6",
    bg: "#f7f4fb",
  },
  {
    key: "charcoal",
    name: "Charcoal & Emerald",
    primary: "#1f2937",
    accent: "#059669",
    bg: "#f9fafb",
  },
  {
    key: "navy",
    name: "Navy & Amber",
    primary: "#0f1f3d",
    accent: "#f59e0b",
    bg: "#f8f9fb",
  },
  {
    key: "espresso",
    name: "Espresso & Sage",
    primary: "#2c1810",
    accent: "#6b9e78",
    bg: "#faf8f5",
  },
  {
    key: "minimal",
    name: "Minimal Black",
    primary: "#111111",
    accent: "#555555",
    bg: "#ffffff",
  },
];

export function BrandingPanel({
  clientName,
  onClose,
  onDownload,
  isDownloading,
}: BrandingPanelProps) {
  const [branding, setBranding] = useState<Branding>({
    font: "playfair",
    colourPreset: "obsidian",
    fontSize: "medium",
    customPrimary: "",
    customAccent: "",
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in on mount
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const selectedPreset =
    COLOUR_PRESETS.find((p) => p.key === branding.colourPreset) ??
    COLOUR_PRESETS[0];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(26,26,46,0.5)",
          opacity: visible ? 1 : 0,
          backdropFilter: "blur(2px)",
        }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="flex flex-col w-full max-w-sm h-full overflow-hidden transition-transform duration-300 ease-out"
        style={{
          backgroundColor: "#ffffff",
          borderLeft: "1px solid #e8e2d9",
          boxShadow: "-8px 0 40px rgba(26,26,46,0.15)",
          transform: visible ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: "#e8e2d9", backgroundColor: "#faf9f7" }}
        >
          <div>
            <h3
              className="text-base font-bold"
              style={{
                color: "#1a1a2e",
                fontFamily: "var(--font-playfair), Georgia, serif",
              }}
            >
              Customise PDF
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#6b6560" }}>
              Choose palette, font, and size
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
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
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Panel body - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">

          {/* Preview strip */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid #e8e2d9" }}
          >
            <div
              className="px-4 py-4 space-y-2"
              style={{ backgroundColor: selectedPreset.primary }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: selectedPreset.accent }}
              >
                Scope of Work
              </p>
              <p
                className="text-base font-bold leading-tight"
                style={{ color: "#ffffff" }}
              >
                {clientName}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                Prepared by Nexus Labs
              </p>
            </div>
            <div className="px-4 py-3 space-y-1.5" style={{ backgroundColor: selectedPreset.bg }}>
              {[0.12, 0.08, 0.06].map((op, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    height: i === 0 ? "8px" : "6px",
                    width: i === 2 ? "60%" : "100%",
                    backgroundColor: selectedPreset.primary,
                    opacity: op,
                  }}
                />
              ))}
              <div
                className="w-8 h-1 rounded-full mt-2"
                style={{ backgroundColor: selectedPreset.accent }}
              />
            </div>
          </div>

          {/* Colour palettes */}
          <div className="space-y-3">
            <label
              className="text-[10px] font-bold uppercase tracking-widest block"
              style={{ color: "#6b6560" }}
            >
              Colour Palette
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COLOUR_PRESETS.map((preset) => {
                const isSelected = branding.colourPreset === preset.key;
                return (
                  <button
                    key={preset.key}
                    onClick={() =>
                      setBranding((b) => ({ ...b, colourPreset: preset.key }))
                    }
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                    style={{
                      border: `1.5px solid ${isSelected ? preset.accent : "#e8e2d9"}`,
                      backgroundColor: isSelected ? preset.primary + "08" : "#faf9f7",
                    }}
                  >
                    {/* Swatch */}
                    <div className="flex-shrink-0 flex rounded-lg overflow-hidden" style={{ width: "28px", height: "28px" }}>
                      <div className="w-1/2 h-full" style={{ backgroundColor: preset.primary }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] font-semibold leading-tight truncate"
                        style={{ color: "#1a1a2e" }}
                      >
                        {preset.name.split(" & ")[0]}
                      </p>
                      <p
                        className="text-[10px] leading-tight"
                        style={{ color: "#9a9490" }}
                      >
                        & {preset.name.split(" & ")[1]}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: preset.accent }}
                      >
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font selection */}
          <div className="space-y-3">
            <label
              className="text-[10px] font-bold uppercase tracking-widest block"
              style={{ color: "#6b6560" }}
            >
              Font
            </label>
            <div className="space-y-1.5">
              {FONTS.map((font) => {
                const isSelected = branding.font === font.key;
                return (
                  <button
                    key={font.key}
                    onClick={() => setBranding((b) => ({ ...b, font: font.key }))}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                    style={{
                      backgroundColor: isSelected ? "#1a1a2e" : "#faf9f7",
                      border: `1.5px solid ${isSelected ? "#1a1a2e" : "#e8e2d9"}`,
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{
                        fontFamily: font.style,
                        color: isSelected ? "#ffffff" : "#1a1a2e",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {font.name}
                    </span>
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5"
                        style={{ color: "#c9782a" }}
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font size */}
          <div className="space-y-3">
            <label
              className="text-[10px] font-bold uppercase tracking-widest block"
              style={{ color: "#6b6560" }}
            >
              Font Size
            </label>
            <div className="flex gap-2">
              {[
                { key: "small", name: "Small", desc: "10pt" },
                { key: "medium", name: "Medium", desc: "12pt" },
                { key: "large", name: "Large", desc: "14pt" },
              ].map((size) => {
                const isSelected = branding.fontSize === size.key;
                return (
                  <button
                    key={size.key}
                    onClick={() =>
                      setBranding((b) => ({ ...b, fontSize: size.key }))
                    }
                    className="flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-150"
                    style={{
                      backgroundColor: isSelected ? "#1a1a2e" : "#faf9f7",
                      border: `1.5px solid ${isSelected ? "#1a1a2e" : "#e8e2d9"}`,
                    }}
                  >
                    <span
                      className="font-semibold"
                      style={{
                        fontSize: size.key === "small" ? "11px" : size.key === "medium" ? "13px" : "15px",
                        color: isSelected ? "#ffffff" : "#1a1a2e",
                      }}
                    >
                      {size.name}
                    </span>
                    <span
                      className="text-[10px] mt-0.5"
                      style={{ color: isSelected ? "rgba(255,255,255,0.5)" : "#9a9490" }}
                    >
                      {size.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Panel footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: "#e8e2d9", backgroundColor: "#faf9f7" }}
        >
          <button
            onClick={handleClose}
            className="text-sm font-medium transition-colors"
            style={{ color: "#6b6560" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6560")}
          >
            Cancel
          </button>

          <button
            onClick={() => onDownload(branding)}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: isDownloading ? "#e8e2d9" : "#1a1a2e",
              color: isDownloading ? "#9a9490" : "#ffffff",
              cursor: isDownloading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isDownloading)
                e.currentTarget.style.backgroundColor = "#c9782a";
            }}
            onMouseLeave={(e) => {
              if (!isDownloading)
                e.currentTarget.style.backgroundColor = "#1a1a2e";
            }}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}