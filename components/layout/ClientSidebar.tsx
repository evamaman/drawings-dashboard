"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, PenTool, Globe, Search, ArrowLeft } from "lucide-react";
import { ClientDetail } from "@/lib/real-data";

interface ClientSidebarProps {
  client: ClientDetail;
  onOpenSearch?: () => void;
}

function initials(name: string) {
  return name.split(/[\s\-_]/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

export default function ClientSidebar({ client, onOpenSearch }: ClientSidebarProps) {
  const pathname = usePathname();
  const color = "#00d4ff";

  const navItems = [
    { href: `/client/${client.id}`, label: "Vue d'ensemble", icon: BarChart3 },
    { href: `/client/${client.id}/drawings`, label: "Dessins", icon: PenTool },
    { href: `/client/${client.id}/ecosystems`, label: "Écosystèmes", icon: Globe },
  ];

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col"
      style={{
        width: "var(--sidebar-width, 260px)",
        background: "linear-gradient(180deg, #060e1c 0%, #030810 100%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Back to global */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <Link href="/global"
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all group"
          style={{ color: "#4a6a9c" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#7b96c2"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#4a6a9c"; }}
        >
          <ArrowLeft size={13} />
          <span style={{ fontSize: "12px", fontWeight: 500 }}>Wild Immersion Global</span>
        </Link>
      </div>

      {/* Client header */}
      <div className="flex-shrink-0 px-5 pt-3 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
          >
            {initials(client.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#4a6a9c", letterSpacing: "0.1em" }}>
              Client #{client.id}
            </p>
            <p className="text-sm font-semibold leading-tight truncate" style={{ color: "#e8f0fe" }}>
              {client.name}
            </p>
          </div>
        </div>

        {/* Powered by */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
            <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="#00d4ff" opacity="0.4" />
            <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#00d4ff" />
          </svg>
          <span style={{ fontSize: "11px", color: "#4a6a9c" }}>Powered by</span>
          <span style={{ fontSize: "11px", color: "#7b96c2", fontWeight: 600 }}>Wild Immersion</span>
        </div>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={13} style={{ color: "#4a6a9c", flexShrink: 0 }} />
          <span style={{ color: "#4a6a9c", fontSize: "13px", flex: 1, textAlign: "left" }}>Rechercher…</span>
          <kbd style={{ fontSize: "10px", color: "#2d4a6e", background: "rgba(255,255,255,0.04)", padding: "2px 5px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.06)" }}>⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 mt-2">
        <p className="px-3 mb-2 uppercase tracking-widest" style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e" }}>
          Mon dashboard
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${isActive ? "active" : ""}`}>
                <Icon size={16} strokeWidth={isActive ? 2 : 1.75} style={{ color: isActive ? color : "inherit", flexShrink: 0 }} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="client-nav-indicator"
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ background: `${color}08` }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Stats footer */}
      <div className="flex-shrink-0 mx-3 mb-4 p-3 rounded-xl space-y-2"
        style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-xs mb-2" style={{ color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Mes stats
        </p>
        {[
          { label: "Total dessins", value: client.totalDrawings.toLocaleString(), color },
          { label: "Dessins web", value: client.webDrawings.toString(), color: "#00c9a7" },
          { label: "Partagés", value: client.sharedDrawings.toString(), color: "#a78bfa" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span style={{ color: "#4a6a9c", fontSize: "11px", flex: 1 }}>{s.label}</span>
            <span style={{ color: s.color, fontSize: "12px", fontWeight: 600 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Client identity */}
      <div className="flex-shrink-0 px-3 pb-5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}25`, color }}>
            {initials(client.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p style={{ color: "#e8f0fe", fontSize: "13px", fontWeight: 500 }} className="truncate">{client.name}</p>
            <p style={{ color: "#4a6a9c", fontSize: "11px" }}>Client #{client.id}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
