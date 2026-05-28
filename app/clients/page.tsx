"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, ArrowRight, Users, BarChart2, PenTool, HelpCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Badge, StatusBadge, DataStatusBadge, resolveClientStatus, resolveDataStatus } from "@/components/ui/Badge"
import { fetchClientsPageData } from "@/lib/supabase/queries"
import { formatNumber, formatDate, initials } from "@/lib/utils"
import { ECOSYSTEM_BY_ID, CHART_COLORS } from "@/lib/constants"
import type { Client, DbDrawingCount } from "@/lib/types"

type DataStatus = "full" | "count-only" | "no-data"
type FilterStatus = "all" | "active" | "inactive" | DataStatus

// ─── Client card ──────────────────────────────────────────────────────────────

function ClientCard({
  client, total, hasDetailedStats, index, onClick,
}: {
  client: Client
  total: number | null
  hasDetailedStats: boolean
  index: number
  onClick: () => void
}) {
  const color = CHART_COLORS[client.id % CHART_COLORS.length]
  const activityStatus = resolveClientStatus(client.isActive, client.expiresAt)
  const dataStatus = resolveDataStatus(hasDetailedStats, total !== null)
  const ecos = client.ecosystemIds.map((id) => ECOSYSTEM_BY_ID[id]).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      onClick={onClick}
      className="p-4 rounded-2xl cursor-pointer group transition-all"
      style={{ background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${color}30`
        e.currentTarget.style.background = "rgba(9,20,34,0.95)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"
        e.currentTarget.style.background = "rgba(9,20,34,0.8)"
      }}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}
          >
            {initials(client.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate" style={{ fontSize: "13px", fontWeight: 600, color: "#e8f0fe" }}>
              {client.name}
            </p>
            <p style={{ fontSize: "10px", color: "#2d4a6e" }}>ID #{client.id}</p>
          </div>
        </div>
        {/* Arrow */}
        <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" style={{ color }} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <StatusBadge status={activityStatus} />
        <DataStatusBadge status={dataStatus} />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <PenTool size={10} style={{ color: "#2d4a6e" }} />
          <span style={{ fontSize: "12px", color: total !== null ? "#e8f0fe" : "#2d4a6e", fontWeight: total !== null ? 600 : 400 }}>
            {total !== null ? formatNumber(total) : "—"} dessins
          </span>
        </div>
        {/* Ecosystem emojis */}
        <div className="flex gap-0.5">
          {ecos.slice(0, 5).map((eco) => (
            <span key={eco.id} title={eco.name} style={{ fontSize: "12px" }}>{eco.emoji}</span>
          ))}
          {ecos.length > 5 && <span style={{ fontSize: "10px", color: "#4a6a9c" }}>+{ecos.length - 5}</span>}
        </div>
      </div>

      {/* Last used */}
      {client.lastUsedAt && (
        <p style={{ fontSize: "10px", color: "#2d4a6e", marginTop: "8px" }}>
          Vu le {formatDate(client.lastUsedAt)}
        </p>
      )}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTERS: { id: FilterStatus; label: string }[] = [
  { id: "all",        label: "Tous" },
  { id: "active",     label: "Actifs" },
  { id: "full",       label: "Analytics complètes" },
  { id: "count-only", label: "Données limitées" },
  { id: "no-data",    label: "Aucune donnée" },
]

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [drawingCounts, setDrawingCounts] = useState<DbDrawingCount[]>([])
  const [detailedIds, setDetailedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [sortBy, setSortBy] = useState<"name" | "drawings" | "ecosystems">("drawings")

  useEffect(() => {
    fetchClientsPageData().then(({ clients, drawingCounts, detailedIds }) => {
      setClients(clients)
      setDrawingCounts(drawingCounts)
      setDetailedIds(detailedIds)
      setLoading(false)
    })
  }, [])

  const countById = useMemo(
    () => Object.fromEntries(drawingCounts.map((c) => [c.client_id, c.total])),
    [drawingCounts]
  )

  const filtered = useMemo(() => {
    let list = [...clients]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q))
    }

    // Filter
    if (filter !== "all") {
      list = list.filter((c) => {
        const actStatus = resolveClientStatus(c.isActive, c.expiresAt)
        const dataStatus = resolveDataStatus(detailedIds.has(c.id), countById[c.id] !== undefined)
        if (filter === "active") return actStatus === "active"
        if (filter === "inactive") return actStatus === "inactive"
        return dataStatus === filter
      })
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "fr")
      if (sortBy === "drawings") return (countById[b.id] ?? -1) - (countById[a.id] ?? -1)
      if (sortBy === "ecosystems") return b.ecosystemIds.length - a.ecosystemIds.length
      return 0
    })

    return list
  }, [clients, search, filter, sortBy, countById, detailedIds])

  // Summary stats
  const full = clients.filter((c) => detailedIds.has(c.id)).length
  const countOnly = clients.filter((c) => countById[c.id] !== undefined && !detailedIds.has(c.id)).length
  const none = clients.length - full - countOnly

  return (
    <DashboardLayout>
      <Header
        title="Clients"
        subtitle={loading ? "Chargement…" : `${clients.length} clients enregistrés`}
      />

      <div className="flex-1 p-8 space-y-6">

        {/* Summary */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: "Total", value: clients.length, color: "#00d4ff" },
              { icon: BarChart2, label: "Analytics complètes", value: full, color: "#10b981" },
              { icon: HelpCircle, label: "Sans données", value: none, color: "#4a6a9c" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: "rgba(9,20,34,0.8)", border: `1px solid ${s.color}20` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <s.icon size={15} style={{ color: s.color }} strokeWidth={1.75} />
                </div>
                <div>
                  <p style={{ fontSize: "22px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "2px" }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a6a9c" }} />
            <input type="text" placeholder="Rechercher un client…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "28px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px",
                background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px",
                fontSize: "13px", color: "#e8f0fe", outline: "none", width: "220px" }} />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: filter === f.id ? "rgba(0,212,255,0.1)" : "transparent",
                  color: filter === f.id ? "#00d4ff" : "#4a6a9c",
                  border: filter === f.id ? "1px solid rgba(0,212,255,0.18)" : "1px solid transparent",
                  fontSize: "11px", fontWeight: 500,
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{ padding: "8px 12px", background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px", fontSize: "13px", color: "#7b96c2", outline: "none", colorScheme: "dark" }}>
            <option value="drawings">Trier : Dessins</option>
            <option value="name">Trier : Nom</option>
            <option value="ecosystems">Trier : Expériences</option>
          </select>

          <p className="ml-auto" style={{ fontSize: "12px", color: "#4a6a9c" }}>
            <span style={{ color: "#e8f0fe", fontWeight: 600 }}>{filtered.length}</span> résultats
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} height={130} rounded="lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</p>
            <p style={{ fontSize: "14px", color: "#7b96c2", fontWeight: 600 }}>Aucun client trouvé</p>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "4px" }}>Modifiez votre recherche ou vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client, i) => (
              <ClientCard
                key={client.id} client={client} total={countById[client.id] ?? null}
                hasDetailedStats={detailedIds.has(client.id)} index={i}
                onClick={() => router.push(`/client/${client.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
