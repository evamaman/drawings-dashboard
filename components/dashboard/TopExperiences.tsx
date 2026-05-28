"use client";

import { motion } from "framer-motion";
import { experiences } from "@/lib/mock-data";
import { TrendingUp, Star } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function TopExperiences() {
  const top = experiences.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="p-6 rounded-2xl"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>
            Top Experiences
          </h3>
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
            By engagement this month
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {top.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 + 0.45 }}
            className="p-3 rounded-xl group cursor-default transition-all"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              {/* Rank + emoji */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                style={{
                  background: `${exp.color}15`,
                  border: `1px solid ${exp.color}25`,
                }}
              >
                {exp.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
                  {exp.name}
                </p>
                <p style={{ fontSize: "11px", color: "#4a6a9c" }}>{exp.category}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 600 }}>
                  {formatNumber(exp.totalInteractions)}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp size={10} style={{ color: "#10b981" }} />
                  <span style={{ fontSize: "10px", color: "#10b981" }}>+{exp.trend}%</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: exp.color, opacity: 0.7 }}
                initial={{ width: 0 }}
                animate={{ width: `${exp.completionRate}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 + 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ fontSize: "10px", color: "#2d4a6e" }}>
                {exp.completionRate}% completion
              </span>
              <div className="flex items-center gap-1">
                <Star size={9} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                <span style={{ fontSize: "10px", color: "#4a6a9c" }}>{exp.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
