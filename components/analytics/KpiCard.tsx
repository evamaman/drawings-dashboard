"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  icon: React.ElementType;
  color?: string;
  index?: number;
  highlight?: boolean;
}

function fmt(v: string | number) {
  if (typeof v === "number") {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
    return v.toLocaleString();
  }
  return v;
}

export default function KpiCard({ label, value, sub, trend, icon: Icon, color = "#00d4ff", index = 0, highlight }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="relative overflow-hidden p-5 rounded-2xl group cursor-default"
      style={{
        background: highlight ? `linear-gradient(135deg, ${color}14, ${color}08)` : "rgba(9,20,34,0.8)",
        border: highlight ? `1px solid ${color}30` : "1px solid rgba(255,255,255,0.06)",
        boxShadow: highlight
          ? `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${color}15`
          : "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      {/* Ambient glow on hover */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse, ${color}18 0%, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon size={16} style={{ color }} strokeWidth={1.75} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              background: trend >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${trend >= 0 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}>
            {trend >= 0
              ? <TrendingUp size={10} style={{ color: "#10b981" }} />
              : <TrendingDown size={10} style={{ color: "#ef4444" }} />}
            <span style={{ fontSize: "11px", fontWeight: 600, color: trend >= 0 ? "#10b981" : "#ef4444" }}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          </div>
        )}
      </div>

      <p style={{ fontSize: "26px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {fmt(value)}
      </p>
      <p style={{ fontSize: "13px", color: "#7b96c2", marginTop: "4px", fontWeight: 500 }}>{label}</p>
      {sub && <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "3px" }}>{sub}</p>}

      <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
    </motion.div>
  );
}
