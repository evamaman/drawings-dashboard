"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, Calendar, RefreshCw, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { Card, CardHeader } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { DataStatusBadge, resolveDataStatus } from "@/components/ui/Badge"
import { fetchActivityPageData } from "@/lib/supabase/queries"
import type { ClientStatsMeta } from "@/lib/supabase/queries"
import { formatNumber, formatDate, initials } from "@/lib/utils"
import { CHART_COLORS } from "@/lib/constants"
import type { Client, GlobalStats } from "@/lib/types"

export default function ActivityPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [statsMeta, setStatsMeta] = useState<ClientStatsMeta[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityPageData().then(({ clients, statsMeta, globalStats }) => {
      setClients(clients)
      setStatsMeta(statsMeta)
      setGlobalStats(globalStats)
      setLoading(false)
    })
  }, [])

  // Clients with last_used_at, sorted by most recent
  const recentlyActive = clients
    .filter((c) => c.lastUsedAt)
    .sort((a, b) => new Date(b.lastUsedAt!).getTime() - new Date(a.lastUsedAt!).getTime())

  // Clients sorted by creation date (most recent first)
  const recentlyCreated = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  // Stats meta sorted by updated_at
  const recentlyUpdated = [...statsMeta]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  const metaById = Object.fromEntries(statsMeta.map((m) => [m.client_id, m]))

  return (
    <DashboardLayout>
      <Header title="Activité" subtitle="Dernière activité enregistrée sur la plateforme" />

      <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">

        {/* Last sync banner */}
        {!loading && globalStats?.updatedAt && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl"
            style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.12)" }}>
            <RefreshCw size={15} style={{ color: "#00d4ff" }} />
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#00d4ff" }}>
                Données globales synchronisées
              </p>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "1px" }}>
                Dernière mise à jour : {formatDate(globalStats.updatedAt)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Summary counts */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Clients actifs", value: clients.filter((c) => c.isActive).length, color: "#10b981", icon: CheckCircle },
              { label: "Récemment utilisés", value: recentlyActive.length, color: "#00d4ff", icon: Clock },
              { label: "Analytics à jour", value: statsMeta.length, color: "#818cf8", icon: RefreshCw },
              { label: "Ajoutés récemment", value: clients.filter((c) => {
                const d = new Date(c.createdAt)
                return Date.now() - d.getTime() < 90 * 86_400_000
              }).length, color: "#f59e0b", icon: Calendar },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: "rgba(9,20,34,0.8)", border: `1px solid ${s.color}20` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <s.icon size={14} style={{ color: s.color }} strokeWidth={1.75} />
                </div>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "#e8f0fe", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "2px" }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recently active clients */}
          <Card>
            <CardHeader
              title="Dernières utilisations"
              subtitle={recentlyActive.length > 0 ? `${recentlyActive.length} clients avec activité enregistrée` : ""}
            />
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={48} rounded="lg" />)}</div>
            ) : recentlyActive.length === 0 ? (
              <div className="py-8 text-center">
                <p style={{ fontSize: "24px", marginBottom: "8px" }}>📭</p>
                <p style={{ fontSize: "13px", color: "#4a6a9c" }}>Aucune donnée de dernière utilisation disponible</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentlyActive.map((client, i) => {
                  const color = CHART_COLORS[client.id % CHART_COLORS.length]
                  const meta = metaById[client.id]
                  return (
                    <motion.div key={client.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }} className="flex items-center gap-3 py-2.5 px-1">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: `${color}18`, color }}>
                        {initials(client.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: "12px", fontWeight: 600, color: "#e8f0fe" }}>{client.name}</p>
                        {meta && <p style={{ fontSize: "10px", color: "#4a6a9c" }}>{formatNumber(meta.total_drawings)} dessins</p>}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock size={10} style={{ color: "#2d4a6e" }} />
                        <span style={{ fontSize: "11px", color: "#4a6a9c" }}>{formatDate(client.lastUsedAt!)}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Analytics updates */}
          <Card>
            <CardHeader
              title="Mises à jour des analytics"
              subtitle={`${recentlyUpdated.length} clients avec analytics synchronisées`}
            />
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={48} rounded="lg" />)}</div>
            ) : (
              <div className="space-y-1">
                {recentlyUpdated.map((meta, i) => {
                  const client = clients.find((c) => c.id === meta.client_id)
                  const color = CHART_COLORS[meta.client_id % CHART_COLORS.length]
                  return (
                    <motion.div key={meta.client_id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }} className="flex items-center gap-3 py-2.5 px-1">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: `${color}18`, color }}>
                        {initials(client?.name ?? `#${meta.client_id}`)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: "12px", fontWeight: 600, color: "#e8f0fe" }}>
                          {client?.name ?? `Client #${meta.client_id}`}
                        </p>
                        <p style={{ fontSize: "10px", color: "#4a6a9c" }}>
                          {formatNumber(meta.total_drawings)} · {formatNumber(meta.web_drawings)} web
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <RefreshCw size={10} style={{ color: "#2d4a6e" }} />
                        <span style={{ fontSize: "11px", color: "#4a6a9c" }}>{formatDate(meta.updated_at)}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Recently created clients */}
        <div className="space-y-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Clients récemment ajoutés
          </p>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={72} rounded="lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentlyCreated.map((client, i) => {
                const color = CHART_COLORS[client.id % CHART_COLORS.length]
                return (
                  <motion.div key={client.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} className="p-3 rounded-xl"
                    style={{ background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${color}18`, color, fontSize: "10px" }}>
                        {initials(client.name)}
                      </div>
                      <span className="truncate" style={{ fontSize: "11px", fontWeight: 600, color: "#e8f0fe" }}>
                        {client.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: "10px", color: "#4a6a9c" }}>{formatDate(client.createdAt)}</span>
                      <DataStatusBadge status={resolveDataStatus(false, false)} />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
