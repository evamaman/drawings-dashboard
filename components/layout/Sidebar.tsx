"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  Sparkles,
  MapPin,
  BarChart3,
  Download,
  Settings,
  ChevronRight,
  ChevronLeft,
  Wifi,
  Activity,
  Zap,
  Users,
  Search,
} from "lucide-react";
import { CLIENT_DETAILS } from "@/lib/real-data";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { href: "/global", label: "Global Dashboard", icon: LayoutDashboard },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/drawings", label: "Drawings", icon: Image, badge: "18.7k" },
      { href: "/experiences", label: "Experiences", icon: Sparkles, badge: "5" },
    ],
  },
  {
    label: "Clients",
    items: [
      { href: "/clients", label: "Clients", icon: Users, badge: "55" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { href: "/installations", label: "Installations", icon: MapPin, badge: "23" },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/export", label: "Export & Media", icon: Download },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const liveStats = [
  { label: "Online devices", value: "23/27", icon: Wifi, color: "#10b981" },
  { label: "Active sessions", value: "184", icon: Activity, color: "#00d4ff" },
  { label: "Drawings/min", value: "4.2", icon: Zap, color: "#f59e0b" },
];

export default function Sidebar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();

  // Detect client dashboard context
  const clientMatch = pathname.match(/^\/dashboard\/client\/(\w+)/);
  const clientId = clientMatch?.[1];
  const clientDetail = clientId ? CLIENT_DETAILS[clientId] : null;

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col"
      style={{
        width: "var(--sidebar-width, 260px)",
        background: "linear-gradient(180deg, #060e1c 0%, #030810 100%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Header / Logo */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #00d4ff22 0%, #00c9a720 100%)",
              border: "1px solid rgba(0,212,255,0.25)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                stroke="#00d4ff"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z"
                fill="#00d4ff"
                opacity="0.4"
              />
              <path
                d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="#00d4ff"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "#4a6a9c", letterSpacing: "0.12em" }}
            >
              Wild Immersion
            </p>
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: "#e8f0fe", fontFamily: "var(--font-inter)" }}
            >
              Drawings
            </p>
          </div>
        </div>

        {/* Search button */}
        <button
          onClick={onOpenSearch}
          className="mt-4 w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all group"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Search size={13} style={{ color: "#4a6a9c", flexShrink: 0 }} />
          <span style={{ color: "#4a6a9c", fontSize: "13px", flex: 1, textAlign: "left" }}>
            Rechercher…
          </span>
          <kbd style={{ fontSize: "10px", color: "#2d4a6e", background: "rgba(255,255,255,0.04)", padding: "2px 5px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.06)" }}>
            ⌘K
          </kbd>
        </button>

        {/* Live indicator */}
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <span className="status-dot-online" />
          <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 500 }}>
            System operational
          </span>
          <span className="ml-auto" style={{ color: "#4a6a9c", fontSize: "11px" }}>
            Live
          </span>
        </div>
      </div>

      {/* Client context banner */}
      {clientDetail && (
        <div className="flex-shrink-0 mx-3 mb-1">
          <Link
            href="/global"
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all group"
            style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.15)", textDecoration: "none" }}
          >
            <ChevronLeft size={13} style={{ color: "#00d4ff", flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "10px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Client</p>
              <p style={{ fontSize: "12px", color: "#00d4ff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {clientDetail.name}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5 mt-2">
        {navSections.map((section) => (
          <div key={section.label}>
            <p
              className="px-3 mb-1.5 uppercase tracking-widest"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#2d4a6e",
                letterSpacing: "0.1em",
              }}
            >
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/global"
                    ? pathname === "/global"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("nav-item", isActive && "active")}
                  >
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2 : 1.75}
                      style={{
                        color: isActive ? "#00d4ff" : "inherit",
                        flexShrink: 0,
                      }}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-md"
                        style={{
                          background: isActive
                            ? "rgba(0,212,255,0.15)"
                            : "rgba(255,255,255,0.05)",
                          color: isActive ? "#00d4ff" : "#4a6a9c",
                          fontSize: "11px",
                          fontWeight: 500,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ background: "rgba(0,212,255,0.04)" }}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Live Stats Footer */}
      <div
        className="flex-shrink-0 mx-3 mb-4 p-3 rounded-xl space-y-2"
        style={{
          background: "rgba(9,20,34,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p
          className="text-xs mb-2"
          style={{ color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          Live Metrics
        </p>
        {liveStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-2">
              <Icon size={12} style={{ color: stat.color, flexShrink: 0 }} />
              <span style={{ color: "#4a6a9c", fontSize: "11px", flex: 1 }}>
                {stat.label}
              </span>
              <span style={{ color: stat.color, fontSize: "12px", fontWeight: 600 }}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div
        className="flex-shrink-0 px-3 pb-5"
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #00d4ff20, #00c9a720)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#00d4ff",
            }}
          >
            WI
          </div>
          <div className="min-w-0 flex-1">
            <p style={{ color: "#e8f0fe", fontSize: "13px", fontWeight: 500 }}>
              Wild Immersion
            </p>
            <p style={{ color: "#4a6a9c", fontSize: "11px" }}>Admin</p>
          </div>
          <ChevronRight
            size={14}
            style={{ color: "#2d4a6e" }}
            className="group-hover:text-cyan-400 transition-colors"
          />
        </div>
      </div>
    </aside>
  );
}
