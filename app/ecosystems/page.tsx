"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { Card, CardHeader } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { EcosystemChart } from "@/components/charts/EcosystemChart"
import { AnimalChart } from "@/components/charts/AnimalChart"
import { fetchEcosystemsPageData } from "@/lib/supabase/queries"
import { formatNumber, initials } from "@/lib/utils"
import { ECOSYSTEMS, ANIMALS, ANIMAL_BY_KEY, CHART_COLORS } from "@/lib/constants"
import type { GlobalStats, Client } from "@/lib/types"

export default function EcosystemsPage() {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    fetchEcosystemsPageData().then(({ globalStats, clients }) => {
      setGlobalStats(globalStats)
      setClients(clients)
      setLoading(false)
    })
  }, [])

  // For each ecosystem: clients using it + drawing count + animals
  const ecoData = ECOSYSTEMS.map((eco) => {
    const ecoClients = clients.filter((c) => c.ecosystemIds.includes(eco.id))
    const drawingCount = globalStats?.byEcosystem[eco.name] ?? null
    const animals = ANIMALS.filter((a) => a.ecosystemId === eco.id)
    // Top animals for this ecosystem from global stats
    const topAnimals = (globalStats?.byAnimal ?? []).filter(
      ([key]) => ANIMAL_BY_KEY[key]?.ecosystemId === eco.id
    )
    return { eco, clients: ecoClients, drawingCount, animals, topAnimals }
  })

  const selectedEco = selected !== null ? ecoData.find((e) => e.eco.id === selected) : null

  return (
    <DashboardLayout>
      <Header
        title="Écosystèmes"
        subtitle={`${ECOSYSTEMS.length} expériences immersives Wild Immersion`}
      />

      <div className="flex-1 p-8 space-y-8">

        {/* Overview grid */}
        <div className="space-y-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Aperçu des expériences
          </p>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} height={120} rounded="lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ecoData.map(({ eco, clients: ecoClients, drawingCount, animals }, i) => (
                <motion.button
                  key={eco.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(selected === eco.id ? null : eco.id)}
                  className="p-4 rounded-2xl text-left transition-all"
                  style={{
                    background: selected === eco.id ? `${eco.color}12` : "rgba(9,20,34,0.8)",
                    border: selected === eco.id ? `1px solid ${eco.color}40` : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: "24px" }}>{eco.emoji}</span>
                    {drawingCount !== null && (
                      <span style={{ fontSize: "11px", fontWeight: 600, color: eco.color }}>
                        {formatNumber(drawingCount)} dessins
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
                    {eco.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <p style={{ fontSize: "11px", color: "#4a6a9c" }}>
                      {ecoClients.length} client{ecoClients.length !== 1 ? "s" : ""}
                    </p>
                    <p style={{ fontSize: "11px", color: "#2d4a6e" }}>
                      {animals.length} animaux
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Selected ecosystem detail */}
        {selectedEco && (
          <motion.div
            key={selectedEco.eco.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="p-6 rounded-2xl overflow-hidden"
              style={{ background: "rgba(9,20,34,0.8)", border: `1px solid ${selectedEco.eco.color}30` }}>
              <div style={{ height: "2px", background: `linear-gradient(90deg, ${selectedEco.eco.color}, ${selectedEco.eco.color}33)`, marginBottom: "16px", borderRadius: "2px" }} />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: "36px" }}>{selectedEco.eco.emoji}</span>
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f0fe" }}>
                      {selectedEco.eco.name}
                    </h2>
                    <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
                      {selectedEco.clients.length} clients · {selectedEco.animals.length} animaux
                    </p>
                  </div>
                </div>
                {selectedEco.drawingCount !== null && (
                  <div className="text-right">
                    <p style={{ fontSize: "32px", fontWeight: 700, color: selectedEco.eco.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                      {formatNumber(selectedEco.drawingCount)}
                    </p>
                    <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "2px" }}>dessins web</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Clients using this ecosystem */}
              <Card>
                <CardHeader title="Clients" subtitle={`${selectedEco.clients.length} installations avec cet écosystème`} />
                {selectedEco.clients.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#4a6a9c" }}>Aucun client</p>
                ) : (
                  <div className="space-y-2">
                    {selectedEco.clients.map((c, i) => {
                      const color = CHART_COLORS[c.id % CHART_COLORS.length]
                      return (
                        <div key={c.id} className="flex items-center gap-2.5 py-1">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: `${color}18`, color, fontSize: "10px" }}>
                            {initials(c.name)}
                          </div>
                          <span style={{ fontSize: "12px", color: "#7b96c2" }}>{c.name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>

              {/* Animals */}
              <Card>
                <CardHeader
                  title="Animaux"
                  subtitle={selectedEco.topAnimals.length > 0 ? "Comptages réels (dessins web)" : "Animaux disponibles dans cet écosystème"}
                />
                {selectedEco.topAnimals.length > 0 ? (
                  <AnimalChart topAnimals={selectedEco.topAnimals} limit={6} />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedEco.animals.map((a) => (
                      <span key={a.key} className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                        style={{ background: `${selectedEco.eco.color}10`, border: `1px solid ${selectedEco.eco.color}20` }}>
                        <span style={{ fontSize: "13px" }}>{a.emoji}</span>
                        <span style={{ fontSize: "11px", color: "#7b96c2" }}>{a.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}

        {/* Global distribution */}
        {!loading && globalStats && (
          <div className="space-y-3">
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#2d4a6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Distribution globale des dessins web
            </p>
            <Card>
              <EcosystemChart byEcosystem={globalStats.byEcosystem} />
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
