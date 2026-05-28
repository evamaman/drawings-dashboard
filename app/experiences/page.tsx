"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { experiences } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  TrendingUp,
  Clock,
  Star,
  PenTool,
  BarChart2,
  Sparkles,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ExperienceCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Hero band */}
      <div
        className="relative px-5 pt-5 pb-4"
        style={{
          background: `linear-gradient(135deg, ${exp.color}15 0%, ${exp.color}08 100%)`,
          borderBottom: `1px solid ${exp.color}15`,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: `${exp.color}15`,
                border: `1px solid ${exp.color}25`,
              }}
            >
              {exp.emoji}
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8f0fe" }}>
                {exp.name}
              </h3>
              <span
                style={{
                  fontSize: "11px",
                  color: exp.color,
                  background: `${exp.color}15`,
                  padding: "1px 7px",
                  borderRadius: "5px",
                  border: `1px solid ${exp.color}20`,
                }}
              >
                {exp.category}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <TrendingUp size={11} style={{ color: "#10b981" }} />
              <span style={{ fontSize: "13px", color: "#10b981", fontWeight: 600 }}>
                +{exp.trend}%
              </span>
            </div>
            <p style={{ fontSize: "10px", color: "#4a6a9c", marginTop: "1px" }}>this month</p>
          </div>
        </div>

        {/* Sparkline */}
        <SparkLine data={exp.monthlyData} color={exp.color} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-0">
        {[
          {
            label: "Interactions",
            value: formatNumber(exp.totalInteractions),
            icon: Users,
          },
          {
            label: "Avg Duration",
            value: exp.avgDuration,
            icon: Clock,
          },
          {
            label: "Drawings",
            value: formatNumber(exp.drawingsGenerated),
            icon: PenTool,
          },
          {
            label: "Rating",
            value: exp.rating.toString(),
            icon: Star,
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="p-4"
            style={{
              borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon size={11} style={{ color: "#2d4a6e" }} />
              <span style={{ fontSize: "10px", color: "#4a6a9c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {stat.label}
              </span>
            </div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#e8f0fe" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "12px", color: "#4a6a9c" }}>Completion rate</span>
          <span style={{ fontSize: "13px", color: exp.color, fontWeight: 600 }}>
            {exp.completionRate}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${exp.color}, ${exp.color}80)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${exp.completionRate}%` }}
            transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperiencesPage() {
  const totalInteractions = experiences.reduce((s, e) => s + e.totalInteractions, 0);
  const avgRating = (experiences.reduce((s, e) => s + e.rating, 0) / experiences.length).toFixed(1);
  const totalDrawings = experiences.reduce((s, e) => s + e.drawingsGenerated, 0);

  return (
    <DashboardLayout>
      <Header title="Experiences" subtitle="5 immersive experiences · performance overview" />

      <div className="flex-1 p-8 space-y-8">
        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Interactions", value: formatNumber(totalInteractions), icon: BarChart2, color: "#00d4ff" },
            { label: "Drawings Generated", value: formatNumber(totalDrawings), icon: PenTool, color: "#00c9a7" },
            { label: "Avg Rating", value: avgRating, icon: Star, color: "#f59e0b" },
            { label: "Active Experiences", value: "5", icon: Sparkles, color: "#818cf8" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(9,20,34,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
              >
                <s.icon size={17} style={{ color: s.color }} strokeWidth={1.75} />
              </div>
              <div>
                <p style={{ fontSize: "20px", color: "#e8f0fe", fontWeight: 700 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#4a6a9c" }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experiences grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>

        {/* Engagement comparison */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(9,20,34,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
            Engagement Comparison
          </h3>
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
            Total interactions per experience — all time
          </p>

          <div className="space-y-4">
            {[...experiences]
              .sort((a, b) => b.totalInteractions - a.totalInteractions)
              .map((exp, i) => {
                const max = experiences[0].totalInteractions;
                const pct = (exp.totalInteractions / max) * 100;
                return (
                  <div key={exp.id} className="flex items-center gap-4">
                    <div className="w-8 text-center" style={{ fontSize: "10px", color: "#4a6a9c" }}>
                      #{i + 1}
                    </div>
                    <span style={{ fontSize: "13px", color: "#7b96c2", width: "180px", flexShrink: 0 }}>
                      {exp.emoji} {exp.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: exp.color, opacity: 0.8 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <span style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 600, width: "60px", textAlign: "right" }}>
                      {formatNumber(exp.totalInteractions)}
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
