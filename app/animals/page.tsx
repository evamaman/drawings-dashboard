"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { Skeleton } from "@/components/ui/Skeleton"
import { fetchAnimalsPageData } from "@/lib/supabase/queries"
import type { ClientAnimalData } from "@/lib/supabase/queries"
import { formatNumber } from "@/lib/utils"
import { ANIMALS, ECOSYSTEMS, ECOSYSTEM_BY_ID } from "@/lib/constants"
import type { GlobalStats } from "@/lib/types"

// ─── Animal card ──────────────────────────────────────────────────────────────

function AnimalCard({
  animal, drawingCount, clientCount, index, onClick,
}: {
  animal: typeof ANIMALS[0]
  drawingCount: number | null
  clientCount: number
  index: number
  onClick: () => void
}) {
  const eco = ECOSYSTEM_BY_ID[animal.ecosystemId]
  const color = eco?.color ?? "#4a6a9c"
  const hasData = drawingCount !== null && drawingCount > 0

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.018, 0.4) }}
      onClick={onClick}
      className="text-left rounded-2xl overflow-hidden group transition-all w-full"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: `1px solid ${hasData ? color + "25" : "rgba(255,255,255,0.06)"}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${color}50`
        e.currentTarget.style.background = "rgba(9,20,34,0.97)"
        e.currentTarget.style.transform = "translateY(-1px)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${hasData ? color + "25" : "rgba(255,255,255,0.06)"}`
        e.currentTarget.style.background = "rgba(9,20,34,0.8)"
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      {/* Accent bar — only for animals with data */}
      <div style={{
        height: "2px",
        background: hasData ? `linear-gradient(90deg, ${color}, ${color}22)` : "transparent",
      }} />

      <div className="p-4">
        {/* Emoji + ecosystem */}
        <div className="flex items-start justify-between mb-3">
          <span style={{ fontSize: "28px", lineHeight: 1 }}>{animal.emoji}</span>
          {eco && (
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
              style={{
                background: `${color}12`,
                border: `1px solid ${color}20`,
                fontSize: "10px",
                color,
              }}
            >
              {eco.emoji} {eco.name.split(" ")[0]}
            </span>
          )}
        </div>

        {/* Name */}
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe", marginBottom: "2px" }}>
          {animal.name}
        </p>
        <p style={{ fontSize: "10px", color: "#2d4a6e", marginBottom: "10px" }}>
          {animal.key}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div>
            {hasData ? (
              <p style={{ fontSize: "16px", fontWeight: 700, color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                {formatNumber(drawingCount!)}
              </p>
            ) : (
              <p style={{ fontSize: "13px", color: "#2d4a6e" }}>— dessins</p>
            )}
            <p style={{ fontSize: "10px", color: "#2d4a6e", marginTop: "1px" }}>
              {hasData ? "dessins web" : "pas de données web"}
            </p>
          </div>
          {clientCount > 0 && (
            <p style={{ fontSize: "10px", color: "#4a6a9c" }}>
              {clientCount} client{clientCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnimalsPage() {
  const router = useRouter()
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [clientAnimalData, setClientAnimalData] = useState<ClientAnimalData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [ecoFilter, setEcoFilter] = useState<number | null>(null)
  const [sort, setSort] = useState<"popularity" | "name" | "ecosystem">("popularity")

  useEffect(() => {
    fetchAnimalsPageData().then(({ globalStats, clientAnimalData }) => {
      setGlobalStats(globalStats)
      setClientAnimalData(clientAnimalData)
      setLoading(false)
    })
  }, [])

  // Build lookup: animalKey → drawing count
  const countByKey = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    ;(globalStats?.byAnimal ?? []).forEach(([key, count]) => { map[key] = count })
    return map
  }, [globalStats])

  // Build lookup: animalKey → how many clients drew it
  const clientCountByKey = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    clientAnimalData.forEach(({ topAnimals }) => {
      topAnimals.forEach(([key]) => {
        map[key] = (map[key] ?? 0) + 1
      })
    })
    return map
  }, [clientAnimalData])

  const filtered = useMemo(() => {
    let list = [...ANIMALS]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.key.toLowerCase().includes(q))
    }
    if (ecoFilter !== null) {
      list = list.filter((a) => a.ecosystemId === ecoFilter)
    }
    list.sort((a, b) => {
      if (sort === "popularity") return (countByKey[b.key] ?? 0) - (countByKey[a.key] ?? 0)
      if (sort === "name") return a.name.localeCompare(b.name, "fr")
      if (sort === "ecosystem") return a.ecosystemId - b.ecosystemId
      return 0
    })
    return list
  }, [search, ecoFilter, sort, countByKey])

  const withData = ANIMALS.filter((a) => countByKey[a.key] > 0).length
  const totalDrawings = Object.values(countByKey).reduce((a, b) => a + b, 0)

  return (
    <DashboardLayout>
      <Header
        title="Animaux"
        subtitle={loading ? "Chargement…" : `${ANIMALS.length} espèces · ${withData} avec données web`}
      />

      <div className="flex-1 p-4 md:p-8 space-y-5 md:space-y-6">

        {/* Summary */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Espèces au total", value: ANIMALS.length, color: "#00d4ff" },
              { label: "Avec dessins web", value: withData, color: "#10b981" },
              { label: "Dessins web au total", value: formatNumber(totalDrawings), color: "#818cf8", isString: true },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} className="p-4 rounded-2xl"
                style={{ background: "rgba(9,20,34,0.8)", border: `1px solid ${s.color}20` }}>
                <p style={{ fontSize: "26px", fontWeight: 700, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "4px" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a6a9c" }} />
            <input type="text" placeholder="Rechercher un animal…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "28px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px",
                background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px", fontSize: "13px", color: "#e8f0fe", outline: "none", width: "220px" }} />
          </div>

          {/* Ecosystem filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap"
            style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <button onClick={() => setEcoFilter(null)}
              className="px-2.5 py-1.5 rounded-lg transition-all"
              style={{
                background: ecoFilter === null ? "rgba(0,212,255,0.1)" : "transparent",
                color: ecoFilter === null ? "#00d4ff" : "#4a6a9c",
                border: ecoFilter === null ? "1px solid rgba(0,212,255,0.18)" : "1px solid transparent",
                fontSize: "11px", fontWeight: 500,
              }}>
              Tous
            </button>
            {ECOSYSTEMS.map((eco) => (
              <button key={eco.id} onClick={() => setEcoFilter(eco.id === ecoFilter ? null : eco.id)}
                className="px-2.5 py-1.5 rounded-lg transition-all"
                style={{
                  background: ecoFilter === eco.id ? `${eco.color}15` : "transparent",
                  color: ecoFilter === eco.id ? eco.color : "#4a6a9c",
                  border: ecoFilter === eco.id ? `1px solid ${eco.color}30` : "1px solid transparent",
                  fontSize: "13px",
                }}
                title={eco.name}>
                {eco.emoji}
              </button>
            ))}
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
            style={{ padding: "8px 12px", background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px", fontSize: "13px", color: "#7b96c2", outline: "none", colorScheme: "dark" }}>
            <option value="popularity">Trier : Popularité</option>
            <option value="name">Trier : Nom</option>
            <option value="ecosystem">Trier : Écosystème</option>
          </select>

          <p className="ml-auto" style={{ fontSize: "12px", color: "#4a6a9c" }}>
            <span style={{ color: "#e8f0fe", fontWeight: 600 }}>{filtered.length}</span> animaux
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} height={140} rounded="lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p style={{ fontSize: "32px", marginBottom: "10px" }}>🔍</p>
            <p style={{ fontSize: "14px", color: "#7b96c2", fontWeight: 600 }}>Aucun animal trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((animal, i) => (
              <AnimalCard
                key={animal.key}
                animal={animal}
                drawingCount={countByKey[animal.key] ?? null}
                clientCount={clientCountByKey[animal.key] ?? 0}
                index={i}
                onClick={() => router.push(`/animals/${encodeURIComponent(animal.key)}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
