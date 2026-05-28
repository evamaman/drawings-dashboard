"use client"

import { motion } from "framer-motion"
import { ANIMAL_BY_KEY } from "@/lib/constants"
import { CHART_COLORS } from "@/lib/constants"
import { DataGuard } from "@/components/ui/EmptyState"

type AnimalChartProps = {
  // Raw animal data: [["Corals_Clam", 119], ["Corals_Clownfish", 104], ...]
  topAnimals: [string, number][]
  limit?: number
}

export function AnimalChart({ topAnimals, limit = 8 }: AnimalChartProps) {
  const data = topAnimals.slice(0, limit)
  const hasData = data.length > 0
  const max = data[0]?.[1] ?? 1

  return (
    <DataGuard
      hasData={hasData}
      height={200}
      title="Aucun animal enregistré"
      message="Pas de données par animal pour ce client."
    >
      <div className="space-y-3">
        {data.map(([key, count], i) => {
          const animal = ANIMAL_BY_KEY[key]
          const name = animal?.name ?? key.split("_").pop() ?? key
          const emoji = animal?.emoji ?? "🐾"
          const color = CHART_COLORS[i % CHART_COLORS.length]
          const pct = (count / max) * 100

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "14px" }}>{emoji}</span>
                  <span style={{ fontSize: "13px", color: "#7b96c2", fontWeight: 500 }}>
                    {name}
                  </span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color }}>
                  {count.toLocaleString("fr-FR")}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color, opacity: 0.8 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </DataGuard>
  )
}
