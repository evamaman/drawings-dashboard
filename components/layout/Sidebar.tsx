"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart2, Leaf, Database, Activity, Footprints } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_MAIN = [
  { href: "/",           label: "Vue globale",  icon: LayoutDashboard },
  { href: "/clients",    label: "Clients",       icon: Users },
  { href: "/analytics",  label: "Analytics",     icon: BarChart2 },
]

const NAV_EXPLORE = [
  { href: "/animals",    label: "Animaux",      icon: Footprints },
  { href: "/ecosystems", label: "Écosystèmes",  icon: Leaf },
  { href: "/activity",   label: "Activité",     icon: Activity },
  { href: "/data",       label: "Données",      icon: Database },
]

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: typeof LayoutDashboard }) {
  const pathname = usePathname()
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all")}
      style={{
        background: active ? "rgba(0,212,255,0.09)" : "transparent",
        border: active ? "1px solid rgba(0,212,255,0.15)" : "1px solid transparent",
        color: active ? "#00d4ff" : "#4a6a9c",
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)" }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent" }}
    >
      <Icon size={14} strokeWidth={active ? 2 : 1.75} />
      <span style={{ fontSize: "13px", fontWeight: active ? 600 : 400 }}>{label}</span>
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside
      className="flex flex-col w-52 h-screen sticky top-0 flex-shrink-0"
      style={{
        background: "rgba(5,12,24,0.97)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Brand */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)" }}>
            <span style={{ fontSize: "13px" }}>🎨</span>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#e8f0fe", lineHeight: 1.2 }}>Drawings</p>
            <p style={{ fontSize: "10px", color: "#2d4a6e", lineHeight: 1.2 }}>Wild Immersion</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Main */}
        <div className="space-y-0.5">
          {NAV_MAIN.map((item) => <NavItem key={item.href} {...item} />)}
        </div>

        {/* Separator */}
        <div>
          <p style={{ fontSize: "9px", fontWeight: 600, color: "#1a2d4a", textTransform: "uppercase", letterSpacing: "0.1em", paddingLeft: "12px", marginBottom: "6px" }}>
            Explorer
          </p>
          <div className="space-y-0.5">
            {NAV_EXPLORE.map((item) => <NavItem key={item.href} {...item} />)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
          <p style={{ fontSize: "10px", color: "#10b981" }}>Supabase connecté</p>
        </div>
      </div>
    </aside>
  )
}
