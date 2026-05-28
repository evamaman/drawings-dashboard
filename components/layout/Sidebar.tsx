"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart2, Leaf, Database, Activity, Footprints, X } from "lucide-react"

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

function NavItem({
  href, label, icon: Icon, onClick,
}: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  onClick?: () => void
}) {
  const pathname = usePathname()
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
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

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const sidebarContent = (
    <aside
      className="flex flex-col w-52 h-full"
      style={{
        background: "rgba(5,12,24,0.97)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
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
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: "#4a6a9c" }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div className="space-y-0.5">
          {NAV_MAIN.map((item) => <NavItem key={item.href} {...item} onClick={onClose} />)}
        </div>
        <div>
          <p style={{ fontSize: "9px", fontWeight: 600, color: "#1a2d4a", textTransform: "uppercase",
            letterSpacing: "0.1em", paddingLeft: "12px", marginBottom: "6px" }}>
            Explorer
          </p>
          <div className="space-y-0.5">
            {NAV_EXPLORE.map((item) => <NavItem key={item.href} {...item} onClick={onClose} />)}
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

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:flex h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar — slide in from left when open */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(2,8,16,0.7)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 left-0 z-50 flex lg:hidden h-full"
            style={{ animation: "slideInLeft 0.2s ease-out" }}>
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}
