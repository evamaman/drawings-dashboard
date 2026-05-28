"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PenTool, Share2, Globe, Clock, Search, ArrowRight } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { KpiCard } from "@/components/ui/KpiCard"
import { Card, CardHeader } from "@/components/ui/Card"
import { KpiCardSkeleton, ChartSkeleton, Skeleton } from "@/components/ui/Skeleton"
import { DataStatusBadge, resolveDataStatus } from "@/components/ui/Badge"
import { TimelineChart } from "@/components/charts/TimelineChart"
import { AnimalChart } from "@/components/charts/AnimalChart"
import { EcosystemChart } from "@/components/charts/EcosystemChart"
import { fetchGlobalPageData } from "@/lib/supabase/queries"
import { formatNumber, formatDuration, initials } from "@/lib/utils"
import { ECOSYSTEM_BY_ID, CHART_COLORS } from "@/lib/constants"
import type { GlobalStats, Client, DbDrawingCount } from "@/lib/types"

type PageData = {
  globalStats: GlobalStats | null
  clients: Client[]
  drawingCounts: DbDrawingCount[]
  detailedIds: Set<number>
}

// ─── Analytics coverage section ───────────────────────────────────────────────

function AnalyticsCoverage({ data }: { data: PageData }) {
  const countIds = new Set(data.drawingCounts.map((c) => c.client_id))
  const full = data.clients.filter((c) => data.detailedIds.has(c.id)).length
  const countOnly = data.clients.filter((c) => countIds.has(c.id) && !data.detailedIds.has(c.id)).length
  const none = data.clients.length - full - countOnly

  const tiles = [
    {
      count: full,
      label: "Analytics complètes",
      sub: "timeline, animaux, écosystèmes",
      color: "#10b981",
      dot: "●",
    },
    {
      count: countOnly,
      label: "Comptage seul",
      sub: "total de dessins uniquement",
      color: "#00d4ff",
      dot: "◐",
    },
    {
      count: none,
      label: "Aucune donnée",
      sub: "client configuré sans activité",
      color: "#4a6a9c",
      dot: "○",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="p-4 rounded-2xl"
          style={{
            background: "rgba(9,20,34,0.8)",
            border: `1px solid ${t.color}20`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: "10px", color: t.color }}>{t.dot}</span>
            <span style={{ fontSize: "11px", color: t.color, fontWeight: 600 }}>{t.label}</span>
          </div>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {t.count}
          </p>
          <p style={{ fontSize: "11px", color: "#2d4a6e", marginTop: "4px" }}>{t.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Client row ───────────────────────────────────────────────────────────────

function ClientRow({
  client, total, rank, hasDetailedStats, onClick,
}: {
  client: Client
  total: number | null
  rank: number
  hasDetailedStats: boolean
  onClick: () => void
}) {
  const color = CHART_COLORS[(rank - 1) % CHART_COLORS.length]
  const ecos = client.ecosystemIds.map((id) => ECOSYSTEM_BY_ID[id]).filter(Boolean).slice(0, 5)
  const dataStatus = resolveDataStatus(hasDetailedStats, total !== null)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(rank * 0.02, 0.4) }}
      onClick={onClick}
      className="grid items-center px-5 py-3 cursor-pointer group transition-all"
      style={{
        gridTemplateColumns: "28px 2fr 1.5fr 1fr 100px 36px",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Rank */}
      <span style={{ fontSize: "11px", color: "#2d4a6e", fontWeight: 600 }}>
        {total !== null ? rank : "—"}
      </span>

      {/* Name */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}
        >
          {initials(client.name)}
        </div>
        <span className="truncate" style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
          {client.name}
        </span>
      </div>

      {/* Ecosystems */}
      <div className="flex flex-wrap gap-1">
        {ecos.map((eco) => (
          <span key={eco.id} title={eco.name} style={{ fontSize: "13px" }}>{eco.emoji}</span>
        ))}
        {client.ecosystemIds.length === 0 && (
          <span style={{ fontSize: "11px", color: "#2d4a6e" }}>—</span>
        )}
      </div>

      {/* Total */}
      <span style={{ fontSize: "13px", fontWeight: total !== null ? 600 : 400, color: total !== null ? "#e8f0fe" : "#2d4a6e" }}>
        {total !== null ? formatNumber(total) : "—"}
      </span>

      {/* Data status */}
      <DataStatusBadge status={dataStatus} />

      {/* Arrow */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
        <ArrowRight size={13} style={{ color: "#00d4ff" }} />
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GlobalDashboard() {
  const router = useRouter()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchGlobalPageData().then((d) => {
      setData(d)
      setLoading(false)
    })
  }, [])

  const countById = useMemo(() => {
    if (!data) return {} as Record<number, number>
    return Object.fromEntries(data.drawingCounts.map((c) => [c.client_id, c.total]))
  }, [data])

  const rankedClients = useMemo(() => {
    if (!data) return []
    return [...data.clients].sort((a, b) => (countById[b.id] ?? -1) - (countById[a.id] ?? -1))
  }, [data, countById])

  const filtered = useMemo(() => {
    if (!search.trim()) return rankedClients
    const q = search.toLowerCase()
    return rankedClients.filter((c) => c.name.toLowerCase().includes(q))
  }, [rankedClients, search])

  let rankCounter = 0
  const withRank = filtered.map((c) => {
    const total = countById[c.id] ?? null
    if (total !== null) rankCounter++
    return {
      client: c,
      total,
      rank: total !== null ? rankCounter : 0,
      hasDetailedStats: data?.detailedIds.has(c.id) ?? false,
    }
  })

  const stats = data?.globalStats

  return (
    <DashboardLayout>
      <Header
        title="Vue globale"
        subtitle={
          loading
            ? "Chargement…"
            : `${data?.clients.length ?? 0} clients · ${formatNumber(stats?.totalDrawings ?? 0)} dessins au total`
        }
      />

      <div className="flex-1 p-8 space-y-8">

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          ) : (
            <>
              <KpiCard label="Total dessins" value={formatNumber(stats?.totalDrawings ?? 0)}
                sub="tous clients confondus" icon={PenTool} color="#00d4ff" delay={0} />
              <KpiCard label="Dessins web" value={formatNumber(stats?.webDrawings ?? 0)}
                sub={`${Math.round(((stats?.webDrawings ?? 0) / (stats?.totalDrawings || 1)) * 100)}% du total`}
                icon={Globe} color="#00c9a7" delay={0.07} />
              <KpiCard label="Dessins partagés" value={formatNumber(stats?.sharedDrawings ?? 0)}
                sub={`${Math.round(((stats?.sharedDrawings ?? 0) / (stats?.totalDrawings || 1)) * 100)}% du total`}
                icon={Share2} color="#818cf8" delay={0.14} />
              <KpiCard label="Durée moyenne" value={stats ? formatDuration(stats.avgCompletionSec) : "—"}
                sub="par dessin web" icon={Clock} color="#f59e0b" delay={0.21} />
            </>
          )}
        </div>

        {/* ── Couverture des analytics ── */}
        <div className="space-y-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Couverture des données
          </p>
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={90} rounded="lg" />)}
            </div>
          ) : (
            <AnalyticsCoverage data={data!} />
          )}
        </div>

        {/* ── Timeline ── */}
        <div className="space-y-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Activité dans le temps
          </p>
          {loading ? <ChartSkeleton height={220} /> : (
            <Card>
              <CardHeader title="Timeline globale" subtitle="Dessins enregistrés jour par jour — tous clients" />
              <TimelineChart timeline={stats?.timeline ?? []} height={220} />
            </Card>
          )}
        </div>

        {/* ── Contenu ── */}
        <div className="space-y-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Contenu dessiné
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {loading ? (
              <><ChartSkeleton height={260} /><ChartSkeleton height={260} /></>
            ) : (
              <>
                <Card>
                  <CardHeader title="Top animaux" subtitle="Les plus dessinés sur dessins web" />
                  <AnimalChart topAnimals={stats?.byAnimal ?? []} />
                </Card>
                <Card>
                  <CardHeader title="Par écosystème" subtitle="Répartition des dessins web" />
                  <EcosystemChart byEcosystem={stats?.byEcosystem ?? {}} />
                </Card>
              </>
            )}
          </div>
        </div>

        {/* ── Clients ── */}
        <div className="space-y-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Tous les clients
          </p>
          <Card padding="sm">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 pt-2 pb-4">
              <p style={{ fontSize: "13px", color: "#4a6a9c" }}>
                {loading ? "…" : <><span style={{ color: "#e8f0fe", fontWeight: 600 }}>{filtered.length}</span> clients</>}
              </p>
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a6a9c" }} />
                <input
                  type="text" placeholder="Rechercher un client…" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    paddingLeft: "28px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px", fontSize: "13px", color: "#e8f0fe", outline: "none", width: "220px",
                  }}
                />
              </div>
            </div>

            {/* Table header */}
            <div className="grid px-5 py-2" style={{ gridTemplateColumns: "28px 2fr 1.5fr 1fr 100px 36px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["#", "Client", "Expériences", "Dessins", "Données", ""].map((h) => (
                <span key={h} style={{ fontSize: "10px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {loading ? (
              <div className="py-8 text-center"><p style={{ fontSize: "13px", color: "#4a6a9c" }}>Chargement…</p></div>
            ) : withRank.length === 0 ? (
              <div className="py-8 text-center"><p style={{ fontSize: "13px", color: "#4a6a9c" }}>Aucun client trouvé</p></div>
            ) : (
              withRank.map(({ client, total, rank, hasDetailedStats }) => (
                <ClientRow key={client.id} client={client} total={total} rank={rank}
                  hasDetailedStats={hasDetailedStats} onClick={() => router.push(`/client/${client.id}`)} />
              ))
            )}
          </Card>
        </div>

      </div>
    </DashboardLayout>
  )
}
