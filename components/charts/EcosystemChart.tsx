"use client"

import { motion } from "framer-motion"
import { ECOSYSTEM_BY_NAME, CHART_COLORS } from "@/lib/constants"
import { DataGuard } from "@/components/ui/EmptyState"

type EcosystemChartProps = {
  byEcosystem: Record<string, number>
}

export function EcosystemChart({ byEcosystem }: EcosystemChartProps) {
  const data = Object.entries(byEcosystem).sort((a, b) => b[1] - a[1])
  const hasData = data.length > 0
  const max = data[0]?.[1] ?? 1
  const total = data.reduce((sum, [, v]) => sum + v, 0)

  return (
    <DataGuard
      hasData={hasData}
      height={200}
      title="Aucun écosystème enregistré"
      message="Pas de données par écosystème pour ce client."
    >
      <div className="space-y-3">
        {data.map(([name, count], i) => {
          const eco = ECOSYSTEM_BY_NAME[name]
          const color = eco?.color ?? CHART_COLORS[i % CHART_COLORS.length]
          const emoji = eco?.emoji ?? "🌍"
          const pct = (count / max) * 100
          const share = Math.round((count / total) * 100)

          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "13px" }}>{emoji}</span>
                  <span style={{ fontSize: "13px", color: "#7b96c2", fontWeight: 500 }}>
                    {name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "11px", color: "#2d4a6e" }}>
                    {share}%
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color }}>
                    {count.toLocaleString("fr-FR")}
                  </span>
                </div>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color, opacity: 0.75 }}
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
