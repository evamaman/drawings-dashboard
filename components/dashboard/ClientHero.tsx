"use client"

import { motion } from "framer-motion"
import { CalendarDays, Clock, PenTool } from "lucide-react"
import { StatusBadge, Badge, DataStatusBadge, resolveClientStatus, resolveDataStatus } from "@/components/ui/Badge"
import { formatNumber, formatDate, initials } from "@/lib/utils"
import { ECOSYSTEM_BY_ID, CHART_COLORS } from "@/lib/constants"
import type { ClientWithData } from "@/lib/types"

export function ClientHero({ data }: { data: ClientWithData }) {
  const { client, totalDrawings, detailedStats } = data
  const activityStatus = resolveClientStatus(client.isActive, client.expiresAt)
  const dataStatus = resolveDataStatus(!!detailedStats, totalDrawings !== null)

  const firstEco = client.ecosystemIds[0] ? ECOSYSTEM_BY_ID[client.ecosystemIds[0]] : null
  const accent = firstEco?.color ?? CHART_COLORS[client.id % CHART_COLORS.length]
  const ecos = client.ecosystemIds.map((id) => ECOSYSTEM_BY_ID[id]).filter(Boolean)
  const displayCount = detailedStats?.totalDrawings ?? totalDrawings

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Accent bar */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${accent}, ${accent}33)` }} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-6">

          {/* Left: identity */}
          <div className="flex items-start gap-4 min-w-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold"
              style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent, fontSize: "16px" }}
            >
              {initials(client.name)}
            </div>

            <div className="min-w-0">
              {/* Name + status badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
                  {client.name}
                </h2>
                <StatusBadge status={activityStatus} />
                <DataStatusBadge status={dataStatus} />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span style={{ fontSize: "11px", color: "#2d4a6e" }}>ID #{client.id}</span>
                <div className="flex items-center gap-1">
                  <CalendarDays size={10} style={{ color: "#2d4a6e" }} />
                  <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                    Depuis {formatDate(client.createdAt)}
                  </span>
                </div>
                {client.lastUsedAt && (
                  <div className="flex items-center gap-1">
                    <Clock size={10} style={{ color: "#2d4a6e" }} />
                    <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                      Vu le {formatDate(client.lastUsedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Ecosystems */}
              {ecos.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ecos.slice(0, 6).map((eco) => (
                    <Badge key={eco.id} label={`${eco.emoji} ${eco.name}`} color={eco.color} />
                  ))}
                  {ecos.length > 6 && (
                    <span style={{ fontSize: "11px", color: "#4a6a9c", alignSelf: "center" }}>
                      +{ecos.length - 6} expériences
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: drawings count */}
          {displayCount !== null && (
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-1.5 justify-end mb-1" style={{ color: "#2d4a6e" }}>
                <PenTool size={10} />
                <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Total dessins
                </span>
              </div>
              <p style={{ fontSize: "38px", fontWeight: 700, color: accent, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {formatNumber(displayCount)}
              </p>
              {detailedStats && (
                <div className="mt-1 space-y-0.5">
                  <p style={{ fontSize: "11px", color: "#4a6a9c" }}>
                    {formatNumber(detailedStats.webDrawings)} web · {formatNumber(detailedStats.sharedDrawings)} partagés
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
