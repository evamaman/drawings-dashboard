"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usageChartData } from "@/lib/mock-data";

const metrics = [
  { key: "drawings", label: "Drawings", color: "#00d4ff" },
  { key: "sessions", label: "Sessions", color: "#00c9a7" },
  { key: "interactions", label: "Interactions", color: "#818cf8" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(9,20,34,0.95)",
        border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      <p style={{ color: "#4a6a9c", fontSize: "12px", marginBottom: "8px" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span style={{ color: "#7b96c2", fontSize: "12px" }}>{p.name}</span>
          <span style={{ color: "#e8f0fe", fontSize: "13px", fontWeight: 600, marginLeft: 8 }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function UsageChart() {
  const [activeMetrics, setActiveMetrics] = useState(["drawings", "sessions"]);

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-6 rounded-2xl"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>
            Usage Over Time
          </h3>
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
            Last 20 days — May 2026
          </p>
        </div>

        {/* Metric toggles */}
        <div className="flex items-center gap-2">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeMetrics.includes(m.key)
                  ? `${m.color}15`
                  : "rgba(255,255,255,0.03)",
                border: activeMetrics.includes(m.key)
                  ? `1px solid ${m.color}30`
                  : "1px solid rgba(255,255,255,0.06)",
                color: activeMetrics.includes(m.key) ? m.color : "#4a6a9c",
                opacity: activeMetrics.includes(m.key) ? 1 : 0.5,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: m.color }}
              />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={usageChartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              {metrics.map((m) => (
                <linearGradient key={m.key} id={`gradient-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={m.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={m.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#2d4a6e", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fill: "#2d4a6e", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,212,255,0.2)", strokeWidth: 1 }} />
            {metrics.map((m) =>
              activeMetrics.includes(m.key) ? (
                <Area
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  fill={`url(#gradient-${m.key})`}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: m.color,
                    stroke: "#050c18",
                    strokeWidth: 2,
                  }}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
