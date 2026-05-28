"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, MinusCircle, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { Card, CardHeader } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { DataStatusBadge, resolveDataStatus } from "@/components/ui/Badge"
import { fetchDataPageData } from "@/lib/supabase/queries"
import type { ClientStatsMeta } from "@/lib/supabase/queries"
import { formatNumber, formatDate, initials } from "@/lib/utils"
import { CHART_COLORS } from "@/lib/constants"
import type { Client, DbDrawingCount, GlobalStats } from "@/lib/types"

const METRICS = [
  { key: "total_drawings", label: "Total dessins",   icon: "🎨" },
  { key: "web_drawings",   label: "Dessins web",     icon: "🌐" },
  { key: "shared",         label: "Partagés",        icon: "🔗" },
  { key: "by_ecosystem",   label: "Par écosystème",  icon: "🌿" },
  { key: "top_animals",    label: "Par animal",      icon: "🐾" },
  { key: "timeline",       label: "Timeline",        icon: "📅" },
]

export default function DataPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [drawingCounts, setDrawingCounts] = useState<DbDrawingCount[]>([])
  const [detailedIds, setDetailedIds] = useState<Set<number>>(new Set())
  const [statsMeta, setStatsMeta] = useState<ClientStatsMeta[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDataPageData().then(({ clients, drawingCounts, detailedIds, statsMeta, globalStats }) => {
      setClients(clients)
      setDrawingCounts(drawingCounts)
      setDetailedIds(detailedIds)
      setStatsMeta(statsMeta)
      setGlobalStats(globalStats)
      setLoading(false)
    })
  }, [])

  const countById = Object.fromEntries(drawingCounts.map((c) => [c.client_id, c.total]))
  const metaById = Object.fromEntries(statsMeta.map((m) => [m.client_id, m]))

  const full = clients.filter((c) => detailedIds.has(c.id)).length
  const countOnly = clients.filter((c) => countById[c.id] !== undefined && !detailedIds.has(c.id)).length
  const none = clients.length - full - countOnly

  const sortedClients = [...clients].sort((a, b) => {
    const aFull = detailedIds.has(a.id) ? 2 : countById[a.id] !== undefined ? 1 : 0
    const bFull = detailedIds.has(b.id) ? 2 : countById[b.id] !== undefined ? 1 : 0
    return bFull - aFull || (countById[b.id] ?? -1) - (countById[a.id] ?? -1)
  })

  return (
    <DashboardLayout>
      <Header title="Données" subtitle="Couverture et disponibilité des analytics par client" />

      <div className="flex-1 p-8 space-y-8">

        {/* Coverage summary */}
        <div className="grid grid-cols-3 gap-4">
          {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={90} rounded="lg" />) : [
            { label: "Analytics complètes", count: full, icon: CheckCircle, color: "#10b981",
              sub: "timeline · animaux · écosystèmes" },
            { label: "Comptage seul", count: countOnly, icon: MinusCircle, color: "#00d4ff",
              sub: "total de dessins uniquement" },
            { label: "Aucune donnée", count: none, icon: Circle, color: "#4a6a9c",
              sub: "client sans activité enregistrée" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} className="p-5 rounded-2xl"
              style={{ background: "rgba(9,20,34,0.8)", border: `1px solid ${item.color}20` }}>
              <div className="flex items-center gap-2 mb-3">
                <item.icon size={14} style={{ color: item.color }} />
                <span style={{ fontSize: "12px", color: item.color, fontWeight: 600 }}>{item.label}</span>
              </div>
              <p style={{ fontSize: "32px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {item.count}
              </p>
              <p style={{ fontSize: "11px", color: "#2d4a6e", marginTop: "4px" }}>{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Last sync */}
        {!loading && globalStats?.updatedAt && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
            <Clock size={13} style={{ color: "#00d4ff" }} />
            <span style={{ fontSize: "12px", color: "#4a6a9c" }}>
              Dernière mise à jour des statistiques globales :{" "}
              <span style={{ color: "#00d4ff", fontWeight: 600 }}>
                {formatDate(globalStats.updatedAt)}
              </span>
            </span>
          </div>
        )}

        {/* Client data matrix */}
        <div className="space-y-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Matrice de disponibilité par client
          </p>
          <Card padding="sm">
            {/* Table header */}
            <div className="grid px-5 py-3"
              style={{ gridTemplateColumns: "2fr 90px 1fr " + METRICS.map(() => "52px").join(" "), borderBottom: "1px solid rgba(255,255,255,0.05)", gap: "8px" }}>
              {["Client", "Statut", "Dessins", ...METRICS.map((m) => m.icon)].map((h, i) => (
                <span key={i} style={{ fontSize: "10px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}
                  title={METRICS[i - 3]?.label}>
                  {h}
                </span>
              ))}
            </div>

            {loading ? (
              <div className="py-8 px-5 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={36} rounded="lg" />)}
              </div>
            ) : (
              sortedClients.map((client, i) => {
                const total = countById[client.id] ?? null
                const meta = metaById[client.id]
                const hasFull = detailedIds.has(client.id)
                const hasCount = total !== null
                const dataStatus = resolveDataStatus(hasFull, hasCount)
                const color = CHART_COLORS[client.id % CHART_COLORS.length]

                const availability = [
                  hasCount,   // total_drawings
                  hasFull,    // web_drawings
                  hasFull,    // shared
                  hasFull,    // by_ecosystem
                  hasFull,    // top_animals
                  hasFull,    // timeline
                ]

                return (
                  <motion.div key={client.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.015, 0.3) }}
                    className="grid items-center px-5 py-2.5"
                    style={{ gridTemplateColumns: "2fr 90px 1fr " + METRICS.map(() => "52px").join(" "), gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>

                    {/* Name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: `${color}18`, color, fontSize: "10px" }}>
                        {initials(client.name)}
                      </div>
                      <span className="truncate" style={{ fontSize: "12px", color: "#e8f0fe" }}>{client.name}</span>
                    </div>

                    {/* Status */}
                    <DataStatusBadge status={dataStatus} />

                    {/* Total */}
                    <span style={{ fontSize: "12px", color: hasCount ? "#e8f0fe" : "#2d4a6e", fontWeight: hasCount ? 600 : 400 }}>
                      {hasCount ? formatNumber(total!) : "—"}
                    </span>

                    {/* Metric availability */}
                    {availability.map((available, j) => (
                      <span key={j} style={{ fontSize: "14px" }} title={available ? "Disponible" : "Non disponible"}>
                        {available ? "✓" : "·"}
                      </span>
                    ))}
                  </motion.div>
                )
              })
            )}
          </Card>
        </div>

        {/* Clients with full analytics — quick recap */}
        {!loading && statsMeta.length > 0 && (
          <div className="space-y-3">
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Clients avec analytics complètes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {statsMeta.map((meta, i) => {
                const client = clients.find((c) => c.id === meta.client_id)
                const color = CHART_COLORS[meta.client_id % CHART_COLORS.length]
                return (
                  <motion.div key={meta.client_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }} className="p-4 rounded-2xl"
                    style={{ background: "rgba(9,20,34,0.8)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${color}18`, color }}>
                        {initials(client?.name ?? `#${meta.client_id}`)}
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#e8f0fe" }}>
                        {client?.name ?? `Client #${meta.client_id}`}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Total", value: formatNumber(meta.total_drawings) },
                        { label: "Web", value: formatNumber(meta.web_drawings) },
                        { label: "Partagés", value: formatNumber(meta.shared_drawings) },
                      ].map((s) => (
                        <div key={s.label}>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "#e8f0fe" }}>{s.value}</p>
                          <p style={{ fontSize: "10px", color: "#4a6a9c" }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: "10px", color: "#2d4a6e", marginTop: "8px" }}>
                      Mis à jour {formatDate(meta.updated_at)}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
