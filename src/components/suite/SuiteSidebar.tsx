"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  LayoutDashboard,
  MessageSquareText,
  Settings,
  LogOut,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState, useEffect } from "react";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/suite",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Kora",
    href: "/suite/kora",
    icon: MessageSquareText,
    exact: false,
    badge: "Live",
  },
  {
    label: "Settings",
    href: "/suite/settings",
    icon: Settings,
    exact: false,
  },
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({
  label,
  children,
  show,
}: {
  label: string;
  children: React.ReactNode;
  show: boolean;
}) {
  return (
    <div className="relative flex items-center w-full">
      {children}
      {show && (
        <div
          className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap z-[100] pointer-events-none"
          style={{
            backgroundColor: "#1f2a44",
            color: "#e6eaf0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
        >
          {label}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
            style={{ borderRightColor: "#1f2a44" }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SuiteSidebarProps {
  userEmail: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SuiteSidebar({ userEmail }: SuiteSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Persist collapsed state across navigation
  useEffect(() => {
    const stored = localStorage.getItem("suite_sidebar_collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("suite_sidebar_collapsed", String(!prev));
      return !prev;
    });
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/suite/login");
    router.refresh();
  };

  const initials = userEmail.split("@")[0].slice(0, 2).toUpperCase();
  const width = collapsed ? "72px" : "240px";

  return (
    <aside
      className="flex flex-col min-h-screen flex-shrink-0 border-r relative"
      style={{
        width,
        minWidth: width,
        backgroundColor: "#ffffff",
        borderColor: "#d0d8e4",
        transition: "width 260ms cubic-bezier(0.4,0,0.2,1), min-width 260ms cubic-bezier(0.4,0,0.2,1)",
        overflow: "visible",
      }}
    >
      {/* ── Logo header ── */}
      <div
        className="flex items-center justify-center border-b flex-shrink-0"
        style={{
          borderColor: "#d0d8e4",
          height: collapsed ? "72px" : "70px",
          minHeight: collapsed ? "72px" : "70px",
          transition: "height 260ms cubic-bezier(0.4,0,0.2,1), min-height 260ms cubic-bezier(0.4,0,0.2,1)",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {collapsed ? (
          /* Collapsed: small icon mark in brand square */
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: "50px", height: "50px",  backgroundColor: "#1f2a44", minWidth: "50px" }}
          >
            <Image
              src="/images/refactrd-small-logo.png"
              alt="Refactrd"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
        ) : (
          /* Expanded: big logo + AI Suite label stacked */
          <div className="flex items-center">
            <Image
              src="/images/Refactrd-logo-short.png"
              alt="Refactrd"
              width={150}
              height={36}
              className="object-contain"
              
            />
          </div>
        )}
      </div>

      {/* ── Toggle button ── */}
      <button
        onClick={toggleCollapsed}
        className="absolute flex items-center justify-center rounded-full border transition-all duration-200 z-50"
        style={{
          top: collapsed ? "36px" : "48px",
          right: "-13px",
          width: "26px",
          height: "26px",
          backgroundColor: "#ffffff",
          borderColor: "#d0d8e4",
          color: "#9aa5b4",
          boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
          transform: "translateY(-50%)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1f2a44";
          e.currentTarget.style.color = "#a2d2ff";
          e.currentTarget.style.borderColor = "#1f2a44";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ffffff";
          e.currentTarget.style.color = "#9aa5b4";
          e.currentTarget.style.borderColor = "#d0d8e4";
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen className="w-3 h-3" strokeWidth={2} />
        ) : (
          <PanelLeftClose className="w-3 h-3" strokeWidth={2} />
        )}
      </button>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 overflow-hidden px-2">
        {/* Section label */}
        {!collapsed && (
          <p
            className="text-[10px] font-bold uppercase tracking-widest px-2 mb-3 whitespace-nowrap"
            style={{ color: "#9aa5b4" }}
          >
            Navigation
          </p>
        )}
        {collapsed && <div className="mb-3 h-4" />}

        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact ?? false);
            const Icon = item.icon;
            const isHovered = hoveredItem === item.href;

            return (
              <Tooltip
                key={item.href}
                label={item.label}
                show={collapsed && isHovered}
              >
                <button
                  onClick={() => router.push(item.href)}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center rounded-xl transition-all duration-150 w-full overflow-hidden"
                  style={{
                    height: "40px",
                    backgroundColor: active ? "#1f2a44" : "transparent",
                    color: active ? "#ffffff" : "#4a5568",
                    padding: collapsed ? "0" : "0 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                  onMouseOver={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "#e6eaf0";
                      e.currentTarget.style.color = "#1f2a44";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#4a5568";
                    }
                  }}
                >
                  <Icon
                    className="flex-shrink-0"
                    style={{ width: "16px", height: "16px", minWidth: "16px" }}
                    strokeWidth={active ? 2 : 1.5}
                  />

                  {!collapsed && (
                    <div
                      className="flex items-center justify-between flex-1 ml-2.5 overflow-hidden"
                      style={{
                        opacity: collapsed ? 0 : 1,
                        transition: "opacity 150ms ease",
                      }}
                    >
                      <span
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ml-2"
                          style={{
                            backgroundColor: active ? "#a2d2ff22" : "#1f2a4415",
                            color: active ? "#a2d2ff" : "#1f2a44",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* AI Projects section */}
        <div className="mt-5">
          {!collapsed && (
            <p
              className="text-[10px] font-bold uppercase tracking-widest px-2 mb-3 whitespace-nowrap"
              style={{ color: "#9aa5b4" }}
            >
              AI Projects
            </p>
          )}
          {collapsed && <div className="mb-3 h-4" />}

          <Tooltip
            label="Kora — Knowledge Assistant"
            show={collapsed && hoveredItem === "kora-project"}
          >
            <button
              onClick={() => router.push("/suite/kora")}
              onMouseEnter={() => setHoveredItem("kora-project")}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center rounded-xl transition-all duration-150 w-full overflow-hidden"
              style={{
                height: "40px",
                padding: collapsed ? "0" : "0 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                color: "#4a5568",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e6eaf0";
                e.currentTarget.style.color = "#1f2a44";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#4a5568";
              }}
            >
              <div
                className="flex items-center justify-center rounded-md flex-shrink-0"
                style={{ width: "24px", height: "24px", minWidth: "24px", backgroundColor: "#1f2a4415" }}
              >
                <Sparkles style={{ width: "12px", height: "12px", color: "#1f2a44" }} strokeWidth={1.5} />
              </div>

              {!collapsed && (
                <div
                  className="flex items-center justify-between flex-1 ml-2.5 overflow-hidden"
                  style={{ opacity: collapsed ? 0 : 1, transition: "opacity 150ms ease" }}
                >
                  <div className="text-left min-w-0">
                    <p
                      className="text-xs font-semibold leading-none whitespace-nowrap"
                      style={{ color: "#1f2a44", fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      Kora
                    </p>
                    <p className="text-[10px] mt-0.5 whitespace-nowrap" style={{ color: "#9aa5b4" }}>
                      Knowledge Assistant
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase whitespace-nowrap ml-2 flex-shrink-0"
                    style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                  >
                    Live
                  </span>
                </div>
              )}
            </button>
          </Tooltip>
        </div>
      </nav>

      {/* ── User + logout ── */}
      <div
        className="border-t flex-shrink-0 px-2 py-3 space-y-1"
        style={{ borderColor: "#d0d8e4" }}
      >
        <Tooltip
          label={userEmail}
          show={collapsed && hoveredItem === "user"}
        >
          <div
            className="flex items-center rounded-xl overflow-hidden w-full"
            style={{
              height: "44px",
              padding: collapsed ? "0" : "0 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              backgroundColor: "#e6eaf0",
              cursor: "default",
            }}
            onMouseEnter={() => setHoveredItem("user")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold"
              style={{
                width: "28px",
                height: "28px",
                minWidth: "28px",
                backgroundColor: "#1f2a44",
                color: "#a2d2ff",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              {initials}
            </div>

            {!collapsed && (
              <div
                className="ml-2.5 min-w-0 overflow-hidden"
                style={{ opacity: collapsed ? 0 : 1, transition: "opacity 150ms ease" }}
              >
                <p
                  className="text-xs font-semibold truncate leading-none whitespace-nowrap"
                  style={{ color: "#1f2a44", fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {userEmail.split("@")[0]}
                </p>
                <p className="text-[10px] mt-0.5 truncate whitespace-nowrap" style={{ color: "#9aa5b4" }}>
                  {userEmail}
                </p>
              </div>
            )}
          </div>
        </Tooltip>

        <Tooltip
          label="Sign out"
          show={collapsed && hoveredItem === "logout"}
        >
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className="flex items-center rounded-xl transition-all duration-150 w-full overflow-hidden"
            style={{
              height: "36px",
              padding: collapsed ? "0" : "0 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              color: "#9aa5b4",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#fee2e2";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#9aa5b4";
            }}
          >
            <LogOut style={{ width: "15px", height: "15px", minWidth: "15px" }} strokeWidth={1.5} />
            {!collapsed && (
              <span
                className="text-xs font-medium whitespace-nowrap ml-2.5"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Sign out
              </span>
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}