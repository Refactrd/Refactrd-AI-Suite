"use client";

import { Feather } from "lucide-react";

export function QuillHeader() {
  return (
    <header
      className="border-b px-4 sm:px-8 py-4"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e8e2d9",
      }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            <Feather className="w-4 h-4" style={{ color: "#c9782a" }} strokeWidth={1.5} />
          </div>
          <div>
            <span
              className="text-base font-bold leading-none block"
              style={{
                color: "#1a1a2e",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Quill
            </span>
            <span
              className="text-[10px] leading-none mt-0.5 block"
              style={{ color: "#6b6560" }}
            >
              by Nexus Labs
            </span>
          </div>
        </div>

        {/* Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
          style={{
            backgroundColor: "#1a1a2e",
            color: "#c9782a",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#c9782a" }}
          />
          Demo
        </div>
      </div>
    </header>
  );
}