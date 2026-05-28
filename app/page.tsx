"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PenTool, Share2, Globe, Clock, Search, ArrowRight } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { KpiCard } from "@/components/ui/KpiCard"
import { Card, CardHeader } from "@/components/ui/Card"
import { KpiCardSkeleton, ChartSkeleton } from "@/components/ui/Skeleton"
import { HourlyChart } from "@/components/charts/HourlyChart"
import { TimelineChart } from "@/components/charts/TimelineChart"
import { AnimalChart } from "@/components/charts/AnimalChart"
import { EcosystemChart } from "@/components/charts/EcosystemChart"
import { fetchGlobalPageData } from "@/lib/supabase/queries"
import { formatNumber, formatDuration, initials } from "@/lib/utils"
import { ECOSYSTEM_BY_ID, CHART_COLORS } from "@/lib/constants"
import type { GlobalStats, Client, DbDrawingCount } from "@/lib/types"

// ─── Types ────────────────────────────────────────────────────────────────────

type PageData = {
  globalStats: GlobalStats | null
  clients: Client[]
  drawingCounts: DbDrawingCount[]
}

// ─── Client row ───────────────────────────────────────────────────────────────

function ClientRow({
  client,
  total,
  rank,
  onClick,
}: {
  client: Client
  total: number | null
  rank: number
  onClick: () => void
}) {
  const color = CHART_COLORS[(rank - 1) % CHART_COLORS.length]
  const ecos = client.ecosystemIds
    .map((id) => ECOSYSTEM_BY_ID[id])
    .filter(Boolean)
    .slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(rank * 0.025, 0.5) }}
      onClick={onClick}
      className="grid items-center px-5 py-3.5 cursor-pointer group transition-all"
      style={{
        gridTemplateColumns: "32px 2fr 2fr 1fr 40px",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Rank */}
      <span style={{ fontSize: "12px", color: "#2d4a6e", fontWeight: 600 }}>
        {total !== null ? rank : "—"}
      </span>

      {/* Name + avatar */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}
        >
          {initials(client.name)}
        </div>
        <span
          className="truncate"
          style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}
        >
          {client.name}
        </span>
      </div>

      {/* Ecosystems */}
      <div className="flex flex-wrap gap-1">
        {ecos.map((eco) => (
          <span key={eco.id} title={eco.name} style={{ fontSize: "13px" }}>
            {eco.emoji}
          </span>
        ))}
        {client.ecosystemIds.length === 0 && (
          <span style={{ fontSize: "11px", color: "#2d4a6e" }}>—</span>
        )}
      </div>

      {/* Total drawings */}
      <span
        style={{
          fontSize: "13px",
          fontWeight: total !== null ? 600 : 400,
          color: total !== null ? "#e8f0fe" : "#2d4a6e",
        }}
      >
        {total !== null ? formatNumber(total) : "—"}
      </span>

      {/* Arrow */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
        <ArrowRight size={14} style={{ color: "#00d4ff" }} />
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

  // Build a lookup: clientId → total drawings
  const countById = useMemo(() => {
    if (!data) return {}
    return Object.fromEntries(data.drawingCounts.map((c) => [c.client_id, c.total]))
  }, [data])

  // Merge clients with their drawing counts, sorted by total desc
  const rankedClients = useMemo(() => {
    if (!data) return []
    return [...data.clients]
      .sort((a, b) => {
        const ta = countById[a.id] ?? -1
        const tb = countById[b.id] ?? -1
        return tb - ta
      })
  }, [data, countById])

  // Filtered by search
  const filtered = useMemo(() => {
    if (!search.trim()) return rankedClients
    const q = search.toLowerCase()
    return rankedClients.filter((c) => c.name.toLowerCase().includes(q))
  }, [rankedClients, search])

  // Rank only applies to clients that have drawing data
  let rankCounter = 0
  const withRank = filtered.map((c) => {
    const total = countById[c.id] ?? null
    if (total !== null) rankCounter++
    return { client: c, total, rank: total !== null ? rankCounter : null }
  })

  const stats = data?.globalStats
  const totalClients = data?.clients.length ?? 0
  const clientsWithData = data?.drawingCounts.length ?? 0

  return (
    <DashboardLayout>
      <Header
        title="Vue globale"
        subtitle={
          loading
            ? "Chargement…"
            : `${totalClients} clients · ${clientsWithData} avec données · ${formatNumber(stats?.totalDrawings ?? 0)} dessins`
        }
      />

      <div className="flex-1 p-8 space-y-6">

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          ) : (
            <>
              <KpiCard
                label="Total dessins"
                value={formatNumber(stats?.totalDrawings ?? 0)}
                sub="tous clients confondus"
                icon={PenTool}
                color="#00d4ff"
                delay={0}
              />
              <KpiCard
                label="Dessins web"
                value={formatNumber(stats?.webDrawings ?? 0)}
                sub={`${Math.round(((stats?.webDrawings ?? 0) / (stats?.totalDrawings || 1)) * 100)}% du total`}
                icon={Globe}
                color="#00c9a7"
                delay={0.07}
              />
              <KpiCard
                label="Dessins partagés"
                value={formatNumber(stats?.sharedDrawings ?? 0)}
                sub={`${Math.round(((stats?.sharedDrawings ?? 0) / (stats?.totalDrawings || 1)) * 100)}% du total`}
                icon={Share2}
                color="#818cf8"
                delay={0.14}
              />
              <KpiCard
                label="Durée moyenne"
                value={stats ? formatDuration(stats.avgCompletionSec) : "—"}
                sub="par dessin web"
                icon={Clock}
                color="#f59e0b"
                delay={0.21}
              />
            </>
          )}
        </div>

        {/* ── Timeline + Heures ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {loading ? (
              <ChartSkeleton height={200} />
            ) : (
              <Card>
                <CardHeader
                  title="Timeline des dessins"
                  subtitle="Activité journalière enregistrée"
                />
                <TimelineChart timeline={stats?.timeline ?? []} height={200} />
              </Card>
            )}
          </div>

          <div>
            {loading ? (
              <ChartSkeleton height={200} />
            ) : (
              <Card>
                <CardHeader
                  title="Dessins par heure"
                  subtitle="Distribution horaire (dessins web)"
                />
                <HourlyChart byHour={stats?.byHour ?? {}} height={200} />
              </Card>
            )}
          </div>
        </div>

        {/* ── Animaux + Écosystèmes ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ChartSkeleton height={260} />
              <ChartSkeleton height={260} />
            </>
          ) : (
            <>
              <Card>
                <CardHeader
                  title="Top animaux"
                  subtitle="Animaux les plus dessinés (dessins web)"
                />
                <AnimalChart topAnimals={stats?.byAnimal ?? []} />
              </Card>

              <Card>
                <CardHeader
                  title="Par écosystème"
                  subtitle="Répartition des dessins web"
                />
                <EcosystemChart byEcosystem={stats?.byEcosystem ?? {}} />
              </Card>
            </>
          )}
        </div>

        {/* ── Classement clients ── */}
        <Card padding="sm">
          {/* Header + search */}
          <div className="flex items-center justify-between px-3 pt-2 pb-4">
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>
                Clients
              </h3>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
                {loading ? "…" : `${filtered.length} résultats`}
              </p>
            </div>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#4a6a9c" }}
              />
              <input
                type="text"
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  paddingLeft: "30px",
                  paddingRight: "12px",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#e8f0fe",
                  outline: "none",
                  width: "200px",
                }}
              />
            </div>
          </div>

          {/* Table header */}
          <div
            className="grid px-5 py-2"
            style={{
              gridTemplateColumns: "32px 2fr 2fr 1fr 40px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {["#", "Client", "Expériences", "Dessins", ""].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: "10px",
                  color: "#2d4a6e",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div className="px-5 py-8 text-center">
              <p style={{ fontSize: "13px", color: "#4a6a9c" }}>Chargement…</p>
            </div>
          ) : withRank.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p style={{ fontSize: "13px", color: "#4a6a9c" }}>Aucun client trouvé</p>
            </div>
          ) : (
            withRank.map(({ client, total, rank }) => (
              <ClientRow
                key={client.id}
                client={client}
                total={total}
                rank={rank ?? 0}
                onClick={() => router.push(`/client/${client.id}`)}
              />
            ))
          )}
        </Card>

      </div>
    </DashboardLayout>
  )
}
