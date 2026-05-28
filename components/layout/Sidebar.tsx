"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Vue globale", icon: LayoutDashboard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col w-56 h-screen sticky top-0 flex-shrink-0"
      style={{
        background: "rgba(5,12,24,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Brand */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.25)",
            }}
          >
            <span style={{ fontSize: "13px" }}>🎨</span>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#e8f0fe", lineHeight: 1.2 }}>
              Drawings
            </p>
            <p style={{ fontSize: "10px", color: "#2d4a6e", lineHeight: 1.2 }}>
              Wild Immersion
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all",
                active ? "font-medium" : "hover:bg-white/5"
              )}
              style={{
                background: active ? "rgba(0,212,255,0.1)" : undefined,
                border: active
                  ? "1px solid rgba(0,212,255,0.15)"
                  : "1px solid transparent",
                color: active ? "#00d4ff" : "#4a6a9c",
              }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.75} />
              <span style={{ fontSize: "13px" }}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p style={{ fontSize: "10px", color: "#2d4a6e" }}>
          Données en temps réel
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#10b981" }}
          />
          <p style={{ fontSize: "10px", color: "#10b981" }}>Supabase connecté</p>
        </div>
      </div>
    </aside>
  )
}
