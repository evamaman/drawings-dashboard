"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, PenTool, Users } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { Card, CardHeader } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { fetchAnimalsPageData } from "@/lib/supabase/queries"
import type { ClientAnimalData } from "@/lib/supabase/queries"
import { formatNumber, initials } from "@/lib/utils"
import { ANIMAL_BY_KEY, ECOSYSTEM_BY_ID, CHART_COLORS, ANIMALS } from "@/lib/constants"
import type { GlobalStats } from "@/lib/types"

export default function AnimalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const key = decodeURIComponent(params.key as string)

  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [clientAnimalData, setClientAnimalData] = useState<ClientAnimalData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnimalsPageData().then(({ globalStats, clientAnimalData }) => {
      setGlobalStats(globalStats)
      setClientAnimalData(clientAnimalData)
      setLoading(false)
    })
  }, [])

  const animal = ANIMAL_BY_KEY[key]
  const eco = animal ? ECOSYSTEM_BY_ID[animal.ecosystemId] : null
  const color = eco?.color ?? "#4a6a9c"

  // Global drawing count for this animal
  const globalCount = (globalStats?.byAnimal ?? []).find(([k]) => k === key)?.[1] ?? null

  // Clients that drew this animal + their counts
  const clientsWithAnimal = clientAnimalData
    .map(({ clientId, clientName, topAnimals }) => {
      const entry = topAnimals.find(([k]) => k === key)
      return entry ? { clientId, clientName, count: entry[1] } : null
    })
    .filter(Boolean) as { clientId: number; clientName: string; count: number }[]

  clientsWithAnimal.sort((a, b) => b.count - a.count)

  // Sibling animals in the same ecosystem
  const siblings = ANIMALS.filter((a) => a.ecosystemId === animal?.ecosystemId && a.key !== key)

  if (!loading && !animal) {
    return (
      <DashboardLayout>
        <Header title="Animal introuvable"
          actions={<button onClick={() => router.push("/animals")} className="flex items-center gap-1.5"
            style={{ color: "#4a6a9c", fontSize: "13px" }}><ArrowLeft size={14} /> Animaux</button>} />
        <div className="flex-1 p-4 md:p-8">
          <Card><EmptyState icon="🔍" title="Animal introuvable" message={`Aucun animal avec la clé "${key}".`} /></Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Header
        eyebrow="Animal"
        title={loading ? "Chargement…" : animal?.name ?? ""}
        subtitle={eco ? `${eco.emoji} ${eco.name}` : ""}
        actions={
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/animals")} className="flex items-center gap-1.5 transition-colors"
              style={{ color: "#4a6a9c", fontSize: "13px" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#00d4ff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4a6a9c")}>
              <ArrowLeft size={14} /> Animaux
            </button>
            {eco && (
              <button onClick={() => router.push("/ecosystems")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                style={{ background: `${color}12`, border: `1px solid ${color}25`, color, fontSize: "12px" }}>
                {eco.emoji} {eco.name}
              </button>
            )}
          </div>
        }
      />

      <div className="flex-1 p-4 md:p-8 space-y-5 md:space-y-6">
        {loading ? (
          <div className="space-y-6">
            <Skeleton height={160} rounded="lg" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Skeleton height={200} rounded="lg" />
              <Skeleton height={200} rounded="lg" />
            </div>
          </div>
        ) : animal ? (
          <>
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(9,20,34,0.8)", border: `1px solid ${color}25` }}>
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${color}, ${color}22)` }} />
              <div className="p-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <span style={{ fontSize: "52px", lineHeight: 1 }}>{animal.emoji}</span>
                  <div>
                    <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
                      {animal.name}
                    </h2>
                    <p style={{ fontSize: "12px", color: "#2d4a6e", marginTop: "3px", fontFamily: "monospace" }}>
                      {animal.key}
                    </p>
                    {eco && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <span style={{ fontSize: "13px" }}>{eco.emoji}</span>
                        <span style={{ fontSize: "12px", color, fontWeight: 500 }}>{eco.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drawing count */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 justify-end mb-1" style={{ color: "#2d4a6e" }}>
                    <PenTool size={10} />
                    <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      Dessins web
                    </span>
                  </div>
                  {globalCount !== null ? (
                    <>
                      <p style={{ fontSize: "38px", fontWeight: 700, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {formatNumber(globalCount)}
                      </p>
                      <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "3px" }}>
                        {clientsWithAnimal.length} client{clientsWithAnimal.length !== 1 ? "s" : ""}
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: "22px", color: "#2d4a6e", fontWeight: 600 }}>—</p>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Clients breakdown */}
              <Card>
                <CardHeader
                  title="Par client"
                  subtitle={clientsWithAnimal.length > 0
                    ? `${clientsWithAnimal.length} client${clientsWithAnimal.length > 1 ? "s" : ""} ont dessiné cet animal`
                    : "Aucun comptage par client disponible"}
                />
                {clientsWithAnimal.length === 0 ? (
                  <EmptyState compact icon="📊" title="Pas de données par client" />
                ) : (
                  <div className="space-y-3">
                    {clientsWithAnimal.map(({ clientId, clientName, count }, i) => {
                      const clientColor = CHART_COLORS[clientId % CHART_COLORS.length]
                      const pct = (count / clientsWithAnimal[0].count) * 100
                      return (
                        <div key={clientId}>
                          <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: `${clientColor}18`, color: clientColor, fontSize: "10px" }}>
                              {initials(clientName)}
                            </div>
                            <button onClick={() => router.push(`/client/${clientId}`)}
                              className="flex-1 text-left flex items-center gap-1 group">
                              <span style={{ fontSize: "12px", color: "#7b96c2" }}
                                className="group-hover:text-white transition-colors">
                                {clientName}
                              </span>
                              <ArrowRight size={10} className="opacity-0 group-hover:opacity-100" style={{ color: clientColor }} />
                            </button>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#e8f0fe" }}>
                              {formatNumber(count)}
                            </span>
                          </div>
                          <div className="h-1 rounded-full ml-8 overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.04)" }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: clientColor, opacity: 0.7 }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, delay: i * 0.07 }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>

              {/* Ecosystem siblings */}
              <Card>
                <CardHeader
                  title={`Autres animaux — ${eco?.name ?? "écosystème"}`}
                  subtitle={`${siblings.length} espèces dans le même écosystème`}
                />
                {siblings.length === 0 ? (
                  <EmptyState compact title="Aucun autre animal dans cet écosystème" />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {siblings.map((sib) => {
                      const sibCount = (globalStats?.byAnimal ?? []).find(([k]) => k === sib.key)?.[1] ?? null
                      return (
                        <button key={sib.key}
                          onClick={() => router.push(`/animals/${encodeURIComponent(sib.key)}`)}
                          className="flex items-center gap-2 p-2.5 rounded-xl text-left transition-all group"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${color}10`
                            e.currentTarget.style.border = `1px solid ${color}25`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.02)"
                            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)"
                          }}>
                          <span style={{ fontSize: "16px" }}>{sib.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate" style={{ fontSize: "11px", fontWeight: 500, color: "#e8f0fe" }}>
                              {sib.name}
                            </p>
                            <p style={{ fontSize: "10px", color: "#2d4a6e" }}>
                              {sibCount !== null ? formatNumber(sibCount) : "—"}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </Card>
            </div>

            {/* Global ranking context */}
            {globalCount !== null && globalStats?.byAnimal && globalStats.byAnimal.length > 0 && (
              <Card>
                <CardHeader title="Popularité globale" subtitle="Position dans le classement des animaux les plus dessinés" />
                <div className="space-y-2.5">
                  {globalStats.byAnimal.slice(0, 8).map(([k, count], i) => {
                    const a = ANIMAL_BY_KEY[k]
                    const isCurrentAnimal = k === key
                    const maxCount = globalStats.byAnimal[0][1]
                    const pct = (count / maxCount) * 100
                    const rankColor = isCurrentAnimal ? color : "#2d4a6e"
                    return (
                      <div key={k}
                        className={isCurrentAnimal ? "p-2 rounded-xl" : ""}
                        style={isCurrentAnimal ? { background: `${color}08`, border: `1px solid ${color}20` } : {}}>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: "11px", color: rankColor, fontWeight: isCurrentAnimal ? 700 : 400, width: "16px" }}>
                            {i + 1}
                          </span>
                          <span style={{ fontSize: "14px" }}>{a?.emoji ?? "🐾"}</span>
                          <span style={{ fontSize: "12px", color: isCurrentAnimal ? "#e8f0fe" : "#7b96c2", flex: 1 }}>
                            {a?.name ?? k}
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: isCurrentAnimal ? color : "#4a6a9c" }}>
                            {formatNumber(count)}
                          </span>
                        </div>
                        <div className="h-1 rounded-full ml-8 overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.04)" }}>
                          <motion.div className="h-full rounded-full"
                            style={{ background: isCurrentAnimal ? color : "#2d4a6e", opacity: isCurrentAnimal ? 0.8 : 0.5 }}
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, delay: i * 0.04 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
