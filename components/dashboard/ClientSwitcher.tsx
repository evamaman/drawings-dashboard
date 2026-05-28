"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"
import { fetchClientList } from "@/lib/supabase/queries"
import { formatNumber, initials } from "@/lib/utils"
import { CHART_COLORS } from "@/lib/constants"

type ClientEntry = { id: number; name: string; totalDrawings: number | null }

export function ClientSwitcher({ currentId, currentName }: { currentId: number; currentName: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<ClientEntry[]>([])
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  // Load client list once on mount
  useEffect(() => {
    fetchClientList().then(setClients)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = search.trim()
    ? clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : clients

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
        style={{
          background: open ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(0,212,255,0.25)" : "rgba(255,255,255,0.08)"}`,
          color: open ? "#00d4ff" : "#7b96c2",
          fontSize: "13px",
          fontWeight: 500,
          maxWidth: "200px",
        }}
      >
        <span className="truncate">{currentName}</span>
        <ChevronDown
          size={13}
          style={{
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-50"
          style={{
            width: "260px",
            background: "#0a1628",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
          }}
        >
          {/* Search */}
          <div
            className="px-3 py-2.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#4a6a9c" }}
              />
              <input
                autoFocus
                type="text"
                placeholder="Rechercher un client…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "26px",
                  paddingRight: "10px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e8f0fe",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: "280px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-center" style={{ fontSize: "12px", color: "#4a6a9c" }}>
                Aucun client trouvé
              </p>
            ) : (
              filtered.map((c) => {
                const isCurrent = c.id === currentId
                const color = CHART_COLORS[c.id % CHART_COLORS.length]
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (!isCurrent) router.push(`/client/${c.id}`)
                      setOpen(false)
                      setSearch("")
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all"
                    style={{
                      background: isCurrent ? "rgba(0,212,255,0.08)" : "transparent",
                      borderLeft: isCurrent ? "2px solid #00d4ff" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent)
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent)
                        (e.currentTarget as HTMLElement).style.background = "transparent"
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: `${color}18`, color }}
                    >
                      {initials(c.name)}
                    </div>
                    <span className="flex-1 truncate" style={{ fontSize: "12px", color: isCurrent ? "#00d4ff" : "#e8f0fe" }}>
                      {c.name}
                    </span>
                    {c.totalDrawings !== null && (
                      <span style={{ fontSize: "11px", color: "#2d4a6e", flexShrink: 0 }}>
                        {formatNumber(c.totalDrawings)}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
