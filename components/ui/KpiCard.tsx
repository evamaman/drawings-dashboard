"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

type KpiCardProps = {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  color: string
  delay?: number
}

export function KpiCard({ label, value, sub, icon: Icon, color, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}28`,
        }}
      >
        <Icon size={16} style={{ color }} strokeWidth={1.75} />
      </div>

      <p
        style={{
          fontSize: "26px",
          fontWeight: 700,
          color: "#e8f0fe",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>

      <p style={{ fontSize: "12px", color: "#7b96c2", marginTop: "5px" }}>
        {label}
      </p>

      {sub && (
        <p style={{ fontSize: "11px", color: "#2d4a6e", marginTop: "2px" }}>
          {sub}
        </p>
      )}
    </motion.div>
  )
}
