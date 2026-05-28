"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "./Sidebar"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#050c18" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Mobile top bar — hamburger only visible on <lg */}
        <div
          className="flex items-center gap-3 px-4 py-3 lg:hidden flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(5,12,24,0.97)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#7b96c2",
            }}
            aria-label="Ouvrir le menu"
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "13px" }}>🎨</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8f0fe" }}>Drawings</span>
            <span style={{ fontSize: "11px", color: "#2d4a6e" }}>— Wild Immersion</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
