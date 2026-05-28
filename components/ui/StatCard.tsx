"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  accentColor?: string;
  index?: number;
  suffix?: string;
  description?: string;
}

export default function StatCard({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  icon: Icon,
  accentColor = "#00d4ff",
  index = 0,
  suffix,
  description,
}: StatCardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden p-5 rounded-2xl cursor-default group"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.35)",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}22`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accentColor}15`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.35)";
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse, ${accentColor}18 0%, transparent 70%)`,
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}25`,
          }}
        >
          <Icon size={18} style={{ color: accentColor }} strokeWidth={1.75} />
        </div>

        {trend !== undefined && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              background: trendPositive
                ? "rgba(16,185,129,0.1)"
                : trendNegative
                ? "rgba(239,68,68,0.1)"
                : "rgba(74,106,156,0.1)",
              border: trendPositive
                ? "1px solid rgba(16,185,129,0.2)"
                : trendNegative
                ? "1px solid rgba(239,68,68,0.2)"
                : "1px solid rgba(74,106,156,0.2)",
            }}
          >
            {trendPositive ? (
              <TrendingUp size={11} style={{ color: "#10b981" }} />
            ) : trendNegative ? (
              <TrendingDown size={11} style={{ color: "#ef4444" }} />
            ) : (
              <Minus size={11} style={{ color: "#7b96c2" }} />
            )}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: trendPositive ? "#10b981" : trendNegative ? "#ef4444" : "#7b96c2",
              }}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <motion.div
          key={String(value)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.06 + 0.1 }}
          className="flex items-baseline gap-1"
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#e8f0fe",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {typeof value === "number" ? formatNumber(value) : value}
          </span>
          {suffix && (
            <span style={{ fontSize: "14px", color: "#4a6a9c", fontWeight: 500 }}>
              {suffix}
            </span>
          )}
        </motion.div>
      </div>

      {/* Label */}
      <p style={{ fontSize: "13px", color: "#7b96c2", fontWeight: 500 }}>{label}</p>

      {/* Sub value / trend label */}
      {(subValue || trendLabel) && (
        <p style={{ fontSize: "12px", color: "#2d4a6e", marginTop: "6px" }}>
          {subValue || trendLabel}
        </p>
      )}

      {description && (
        <p style={{ fontSize: "11px", color: "#2d4a6e", marginTop: "4px" }}>
          {description}
        </p>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
        }}
      />
    </motion.div>
  );
}
