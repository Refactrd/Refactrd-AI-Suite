"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ─── Carousel slides ──────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 1,
    headline: "Build smarter operations",
    subline: "AI systems that work while your team focuses on what matters.",
    gradient: "from-[#1f2a44] via-[#2a3f6f] to-[#1a3a5c]",
    shape1: "bg-[#a2d2ff]/20",
    shape2: "bg-[#a2d2ff]/10",
    shape3: "bg-[#1f2a44]/60",
  },
  {
    id: 2,
    headline: "Intelligence at every layer",
    subline: "From workflow automation to full agentic systems, we engineer the future.",
    gradient: "from-[#0f1f3d] via-[#1f2a44] to-[#162238]",
    shape1: "bg-[#a2d2ff]/15",
    shape2: "bg-[#6bb5f5]/15",
    shape3: "bg-[#0f1f3d]/70",
  },
  {
    id: 3,
    headline: "Your team's unfair advantage",
    subline: "Custom AI assistants, copilots, and pipelines built for African businesses.",
    gradient: "from-[#1a2a44] via-[#243350] to-[#1f3060]",
    shape1: "bg-[#a2d2ff]/25",
    shape2: "bg-[#7ec8e3]/10",
    shape3: "bg-[#1a2a44]/50",
  },
];

// ─── Time config ──────────────────────────────────────────────────────────────

type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

const TIME_CONFIG: Record<
  TimeOfDay,
  {
    greeting: string;
    tagline: string;
    emoji: string;
    ambientColor: string;
    glassAccent: string;
    pulseColor: string;
    label: string;
  }
> = {
  dawn: {
    greeting: "Early bird, are we?",
    tagline: "The best ideas come before the world wakes up.",
    emoji: "🌅",
    ambientColor: "rgba(255, 200, 120, 0.07)",
    glassAccent: "rgba(255, 200, 120, 0.12)",
    pulseColor: "#f59e0b",
    label: "Dawn",
  },
  morning: {
    greeting: "Good morning.",
    tagline: "A great time for coffee and the Suite.",
    emoji: "☕",
    ambientColor: "rgba(162, 210, 255, 0.07)",
    glassAccent: "rgba(162, 210, 255, 0.12)",
    pulseColor: "#38bdf8",
    label: "Morning",
  },
  afternoon: {
    greeting: "Good afternoon.",
    tagline: "Peak hours. Let's make them count.",
    emoji: "⚡",
    ambientColor: "rgba(100, 160, 255, 0.06)",
    glassAccent: "rgba(100, 160, 255, 0.10)",
    pulseColor: "#a2d2ff",
    label: "Afternoon",
  },
  evening: {
    greeting: "Good evening.",
    tagline: "Winding down or just getting started?",
    emoji: "🌆",
    ambientColor: "rgba(180, 130, 255, 0.07)",
    glassAccent: "rgba(180, 130, 255, 0.12)",
    pulseColor: "#a78bfa",
    label: "Evening",
  },
  night: {
    greeting: "Burning the midnight oil?",
    tagline: "The Suite never sleeps. Neither do the best builders.",
    emoji: "🌙",
    ambientColor: "rgba(80, 60, 160, 0.07)",
    glassAccent: "rgba(80, 60, 160, 0.10)",
    pulseColor: "#818cf8",
    label: "Night",
  },
};

// ─── Live clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { time, date };
}

// ─── Typing text ──────────────────────────────────────────────────────────────

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 38);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="inline-block w-0.5 h-5 ml-0.5 align-middle animate-pulse"
          style={{ backgroundColor: "#a2d2ff" }}
        />
      )}
    </span>
  );
}

// ─── Greeting glass card ──────────────────────────────────────────────────────

function GreetingCard({
  config,
  timeOfDay,
}: {
  config: (typeof TIME_CONFIG)[TimeOfDay];
  timeOfDay: TimeOfDay;
}) {
  const { time, date } = LiveClock();

  return (
    <div
      className="w-full max-w-[400px] rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.30) 100%)`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: `0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
      }}
    >
      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${config.glassAccent} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        {/* Left: greeting + tagline */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: config.pulseColor }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#9aa5b4" }}
            >
              {config.label}
            </span>
          </div>

          <h2
            className="text-lg font-bold leading-snug mb-1"
            style={{
              color: "#1f2a44",
              fontFamily: "var(--font-montserrat), sans-serif",
              minHeight: "28px",
            }}
          >
            <TypingText text={config.greeting} />
          </h2>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "#6b7280" }}
          >
            {config.tagline}
          </p>
        </div>

        {/* Right: clock + emoji */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span className="text-2xl mb-1">{config.emoji}</span>
          <p
            className="text-xl font-bold tabular-nums leading-none"
            style={{
              color: "#1f2a44",
              fontFamily: "var(--font-montserrat), sans-serif",
            }}
          >
            {time}
          </p>
          <p
            className="text-[10px] mt-1 text-right"
            style={{ color: "#9aa5b4", maxWidth: "110px" }}
          >
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Carousel panel ───────────────────────────────────────────────────────────

function CarouselPanel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
        setAnimating(false);
      }, 500);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[current];

  return (
    <div
      className={cn(
        "hidden lg:flex flex-col relative overflow-hidden flex-shrink-0",
        `bg-gradient-to-br ${slide.gradient}`,
        "transition-all duration-700"
      )}
      style={{ width: "50%" }}
    >
      <div className={cn("absolute w-[500px] h-[500px] rounded-full blur-[100px]", slide.shape1, "top-[-100px] left-[-100px] transition-all duration-700")} />
      <div className={cn("absolute w-[350px] h-[350px] rounded-full blur-[70px]", slide.shape2, "bottom-[80px] right-[-80px] transition-all duration-700")} />
      <div className={cn("absolute w-[250px] h-[250px] rounded-full blur-[50px]", slide.shape3, "top-[40%] left-[35%] transition-all duration-700")} />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(162,210,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(162,210,255,1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full p-12">
        <div>
          <Image
            src="/images/refactrd-logo.png"
            alt="Refactrd"
            width={180}
            height={48}
            priority
            className="object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        <div className="flex items-center justify-center flex-1 py-8">
          <div className="relative flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border animate-spin" style={{ borderColor: "rgba(162,210,255,0.2)", animationDuration: "25s" }} />
            <div className="absolute w-44 h-44 rounded-full border animate-spin" style={{ borderColor: "rgba(162,210,255,0.3)", animationDuration: "15s", animationDirection: "reverse" }} />
            <div className="absolute w-24 h-24 rounded-full border animate-spin" style={{ borderColor: "rgba(162,210,255,0.4)", animationDuration: "8s" }} />
            <div className="absolute flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(162,210,255,0.1)" }}>
                <div className="w-7 h-7 rounded-full" style={{ backgroundColor: "rgba(162,210,255,0.4)" }} />
              </div>
            </div>
            <div className="absolute w-2.5 h-2.5 rounded-full animate-spin" style={{ backgroundColor: "#a2d2ff", top: "0", left: "50%", transformOrigin: "50% 128px", animationDuration: "8s", boxShadow: "0 0 8px #a2d2ff" }} />
            <div className="absolute w-2 h-2 rounded-full animate-spin" style={{ backgroundColor: "#a2d2ff88", top: "50%", left: "0", transformOrigin: "88px 50%", animationDuration: "12s", animationDirection: "reverse" }} />
          </div>
        </div>

        <div
          className="space-y-4 transition-all duration-500"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)" }}
        >
          <h2 className="text-4xl font-bold leading-tight" style={{ color: "#e6eaf0", fontFamily: "var(--font-montserrat), sans-serif" }}>
            {slide.headline}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(230,234,240,0.65)" }}>
            {slide.subline}
          </p>
          <div className="flex items-center gap-2 pt-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "28px" : "7px",
                  height: "7px",
                  backgroundColor: i === current ? "#a2d2ff" : "rgba(162,210,255,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main login page ──────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");
  const [mounted, setMounted] = useState(false);
  const [statusDots, setStatusDots] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(getTimeOfDay(hour));
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setStatusDots((d) => (d + 1) % 4), 700);
    return () => clearInterval(interval);
  }, []);

  const config = TIME_CONFIG[timeOfDay];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    router.push("/suite");
    router.refresh();
  };

  return (
    <main
      className="flex min-h-screen"
      style={{
        backgroundColor: "#e6eaf0",
        fontFamily: "var(--font-montserrat), sans-serif",
      }}
    >
      <CarouselPanel />

      {/* Right panel */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{
          minWidth: 0,
          background: mounted
            ? `radial-gradient(ellipse at top right, ${config.ambientColor} 0%, transparent 55%), #e6eaf0`
            : "#e6eaf0",
          transition: "background 1.2s ease",
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 gap-5">

          {/* Greeting glass card */}
          {mounted && (
            <GreetingCard config={config} timeOfDay={timeOfDay} />
          )}

          {/* Login card */}
          <div className="w-full max-w-[400px]">
            <div
              className="rounded-2xl p-7"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d0d8e4",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-5"
                style={{ color: "#9aa5b4" }}
              >
                Sign in to continue
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "#1f2a44" }}
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@refactrd.com"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "#f4f6f9",
                      border: "1.5px solid #d0d8e4",
                      color: "#1f2a44",
                      fontFamily: "var(--font-montserrat), sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#a2d2ff";
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(162,210,255,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d0d8e4";
                      e.target.style.backgroundColor = "#f4f6f9";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "#1f2a44" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "#f4f6f9",
                        border: "1.5px solid #d0d8e4",
                        color: "#1f2a44",
                        fontFamily: "var(--font-montserrat), sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#a2d2ff";
                        e.target.style.backgroundColor = "#ffffff";
                        e.target.style.boxShadow = "0 0 0 3px rgba(162,210,255,0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#d0d8e4";
                        e.target.style.backgroundColor = "#f4f6f9";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "#9aa5b4" }}
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                        : <Eye className="w-4 h-4" strokeWidth={1.5} />
                      }
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
                  >
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: isLoading || !email || !password ? "#d0d8e4" : "#1f2a44",
                    color: isLoading || !email || !password ? "#9aa5b4" : "#ffffff",
                    cursor: isLoading || !email || !password ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-montserrat), sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && email && password) {
                      e.currentTarget.style.backgroundColor = "#a2d2ff";
                      e.currentTarget.style.color = "#1f2a44";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && email && password) {
                      e.currentTarget.style.backgroundColor = "#1f2a44";
                      e.currentTarget.style.color = "#ffffff";
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in to Suite"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* System status — subtle footer treatment */}
          <div className="w-full max-w-[400px] flex items-center justify-between px-1">
            <div className="flex items-center gap-4">
              {["AI Engine", "Knowledge Base", "API"].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "#22c55e" }}
                  />
                  <span className="text-[10px]" style={{ color: "#9aa5b4" }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[10px]" style={{ color: "#c4cdd8" }}>
              All systems operational{".".repeat(statusDots)}
            </span>
          </div>

          {/* Footer */}
          <p className="text-center text-xs" style={{ color: "#9aa5b4" }}>
            Refactrd Suite is for internal use only.{" "}
            <a
              href="https://refactrd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
              style={{ color: "#1f2a44" }}
            >
              refactrd.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}