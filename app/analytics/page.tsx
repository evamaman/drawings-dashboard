"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PenTool, Share2, Globe, Clock, ArrowRight } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { KpiCard } from "@/components/ui/KpiCard"
import { Card, CardHeader } from "@/components/ui/Card"
import { KpiCardSkeleton, ChartSkeleton } from "@/components/ui/Skeleton"
import { TimelineChart } from "@/components/charts/TimelineChart"
import { AnimalChart } from "@/components/charts/AnimalChart"
import { EcosystemChart } from "@/components/charts/EcosystemChart"
import { fetchAnalyticsPageData } from "@/lib/supabase/queries"
import { formatNumber, formatDuration, initials } from "@/lib/utils"
import { CHART_COLORS } from "@/lib/constants"
import type { GlobalStats, Client, DbDrawingCount } from "@/lib/types"

export default function AnalyticsPage() {
  const router = useRouter()
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [drawingCounts, setDrawingCounts] = useState<DbDrawingCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsPageData().then(({ globalStats, clients, drawingCounts }) => {
      setGlobalStats(globalStats)
      setClients(clients)
      setDrawingCounts(drawingCounts)
      setLoading(false)
    })
  }, [])

  // Top clients by drawings — with name resolved
  const topClients = useMemo(() => {
    const nameMap = Object.fromEntries(clients.map((c) => [c.id, c.name]))
    return drawingCounts
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((c) => ({ id: c.client_id, name: nameMap[c.client_id] ?? `Client #${c.client_id}`, total: c.total }))
  }, [clients, drawingCounts])

  const maxClientTotal = topClients[0]?.total ?? 1
  const s = globalStats

  return (
    <DashboardLayout>
      <Header title="Analytics" subtitle="Données agrégées — tous clients confondus" />

      <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />) : (
            <>
              <KpiCard label="Total dessins" value={formatNumber(s?.totalDrawings ?? 0)}
                sub="tous types confondus" icon={PenTool} color="#00d4ff" delay={0} />
              <KpiCard label="Dessins web" value={formatNumber(s?.webDrawings ?? 0)}
                sub={`${Math.round(((s?.webDrawings ?? 0) / (s?.totalDrawings || 1)) * 100)}% du total`}
                icon={Globe} color="#00c9a7" delay={0.07} />
              <KpiCard label="Dessins partagés" value={formatNumber(s?.sharedDrawings ?? 0)}
                sub={`${Math.round(((s?.sharedDrawings ?? 0) / (s?.totalDrawings || 1)) * 100)}% du total`}
                icon={Share2} color="#818cf8" delay={0.14} />
              <KpiCard label="Durée moyenne" value={s ? formatDuration(s.avgCompletionSec) : "—"}
                sub="par dessin web" icon={Clock} color="#f59e0b" delay={0.21} />
            </>
          )}
        </div>

        {/* Timeline */}
        {loading ? <ChartSkeleton height={220} /> : (
          <Card>
            <CardHeader title="Timeline des dessins" subtitle={`${s?.timeline.length ?? 0} jours avec activité enregistrée`} />
            <TimelineChart timeline={s?.timeline ?? []} height={220} />
          </Card>
        )}

        {/* Top clients + Écosystèmes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top clients */}
          {loading ? <ChartSkeleton height={340} /> : (
            <Card>
              <CardHeader title="Top clients" subtitle="Par nombre total de dessins" />
              <div className="space-y-2.5">
                {topClients.map((c, i) => {
                  const color = CHART_COLORS[i % CHART_COLORS.length]
                  const pct = (c.total / maxClientTotal) * 100
                  return (
                    <div key={c.id}>
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ background: `${color}15`, color, fontSize: "10px" }}>
                          {i + 1}
                        </div>
                        <button onClick={() => router.push(`/client/${c.id}`)}
                          className="flex-1 text-left flex items-center gap-1 group"
                          style={{ fontSize: "12px", color: "#7b96c2" }}>
                          <span className="group-hover:text-white transition-colors truncate">{c.name}</span>
                          <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
                        </button>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#e8f0fe", flexShrink: 0 }}>
                          {formatNumber(c.total)}
                        </span>
                      </div>
                      <div className="h-1 rounded-full ml-7 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: color, opacity: 0.7 }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Écosystèmes */}
          {loading ? <ChartSkeleton height={340} /> : (
            <Card>
              <CardHeader title="Par écosystème" subtitle="Répartition des dessins web" />
              <EcosystemChart byEcosystem={s?.byEcosystem ?? {}} />
            </Card>
          )}
        </div>

        {/* Top animaux */}
        {loading ? <ChartSkeleton height={280} /> : (
          <Card>
            <CardHeader title="Top animaux" subtitle={`${s?.byAnimal.length ?? 0} animaux différents dessinés via web`} />
            <AnimalChart topAnimals={s?.byAnimal ?? []} limit={10} />
          </Card>
        )}

        {/* Drawing types breakdown */}
        {!loading && s && (
          <Card>
            <CardHeader title="Répartition des dessins" subtitle="Total vs web vs partagés" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Dessins totaux", value: s.totalDrawings, pct: 100, color: "#00d4ff" },
                { label: "Via application web", value: s.webDrawings, pct: Math.round((s.webDrawings / s.totalDrawings) * 100), color: "#00c9a7" },
                { label: "Partagés par les visiteurs", value: s.sharedDrawings, pct: Math.round((s.sharedDrawings / s.totalDrawings) * 100), color: "#818cf8" },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} className="p-4 rounded-xl"
                  style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                  <p style={{ fontSize: "28px", fontWeight: 700, color: item.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {formatNumber(item.value)}
                  </p>
                  <p style={{ fontSize: "11px", color: "#7b96c2", marginTop: "4px" }}>{item.label}</p>
                  <p style={{ fontSize: "22px", fontWeight: 700, color: "#2d4a6e", marginTop: "6px" }}>{item.pct}%</p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
