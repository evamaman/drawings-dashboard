"use client";

import { motion } from "framer-motion";
import {
  PenTool,
  Wifi,
  WifiOff,
  Trophy,
  MapPin,
  Sparkles,
} from "lucide-react";
import { recentActivities } from "@/lib/mock-data";

function ActivityIcon({ type, color }: { type: string; color: string }) {
  const iconMap: Record<string, React.ElementType> = {
    drawing_created: PenTool,
    installation_online: Wifi,
    installation_offline: WifiOff,
    milestone: Trophy,
  };
  const Icon = iconMap[type] ?? Sparkles;

  return (
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}25`,
      }}
    >
      <Icon size={14} style={{ color }} strokeWidth={1.75} />
    </div>
  );
}

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="p-6 rounded-2xl flex flex-col"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.35)",
        height: "100%",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>
            Live Activity
          </h3>
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
            Real-time events
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="status-dot-online" />
          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 500 }}>Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 -mr-2 pr-2">
        {recentActivities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="flex items-start gap-3 p-3 rounded-xl group cursor-default transition-all"
            style={{ transition: "background 0.15s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            <ActivityIcon type={activity.type} color={activity.color} />

            <div className="flex-1 min-w-0">
              {activity.type === "drawing_created" && (
                <>
                  <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
                    {activity.user}{" "}
                    <span style={{ color: "#4a6a9c", fontWeight: 400 }}>created a drawing</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} style={{ color: "#2d4a6e" }} />
                      <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                        {activity.location}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        color: activity.color,
                        background: `${activity.color}12`,
                        padding: "1px 6px",
                        borderRadius: "4px",
                        border: `1px solid ${activity.color}20`,
                      }}
                    >
                      {activity.experience}
                    </span>
                  </div>
                </>
              )}

              {activity.type === "installation_online" && (
                <>
                  <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
                    Installation{" "}
                    <span style={{ color: "#10b981" }}>back online</span>
                  </p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "2px" }}>
                    {activity.device} · {activity.location}
                  </p>
                </>
              )}

              {activity.type === "installation_offline" && (
                <>
                  <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
                    Installation{" "}
                    <span style={{ color: "#ef4444" }}>went offline</span>
                  </p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "2px" }}>
                    {activity.device} · {activity.location}
                  </p>
                </>
              )}

              {activity.type === "milestone" && (
                <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
                  {activity.label}
                </p>
              )}
            </div>

            <span
              style={{ fontSize: "11px", color: "#2d4a6e", flexShrink: 0, marginTop: "2px" }}
            >
              {activity.time}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
