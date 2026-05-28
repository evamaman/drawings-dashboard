"use client";

import { motion } from "framer-motion";
import { installations } from "@/lib/mock-data";
import { MapPin, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function InstallationStatus() {
  const topInstallations = installations.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
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
            Installations
          </h3>
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
            Status & activity
          </p>
        </div>
        <Link
          href="/installations"
          style={{ fontSize: "12px", color: "#00d4ff" }}
          className="hover:opacity-80 transition-opacity"
        >
          View all →
        </Link>
      </div>

      {/* Summary badges */}
      <div className="flex gap-2 mb-5">
        {[
          { label: "Online", count: 5, color: "#10b981" },
          { label: "Warning", count: 1, color: "#f59e0b" },
          { label: "Offline", count: 1, color: "#ef4444" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{
              background: `${s.color}10`,
              border: `1px solid ${s.color}20`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: s.color }}
            />
            <span style={{ fontSize: "12px", color: s.color, fontWeight: 500 }}>
              {s.count} {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Installation list */}
      <div className="space-y-2">
        {topInstallations.map((inst, i) => (
          <motion.div
            key={inst.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.4 }}
            className="flex items-center gap-3 p-3 rounded-xl group cursor-default transition-all"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            {/* Status icon */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  inst.status === "online"
                    ? "rgba(16,185,129,0.1)"
                    : inst.status === "warning"
                    ? "rgba(245,158,11,0.1)"
                    : "rgba(239,68,68,0.1)",
                border:
                  inst.status === "online"
                    ? "1px solid rgba(16,185,129,0.2)"
                    : inst.status === "warning"
                    ? "1px solid rgba(245,158,11,0.2)"
                    : "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {inst.status === "online" ? (
                <Wifi size={14} style={{ color: "#10b981" }} strokeWidth={1.75} />
              ) : inst.status === "warning" ? (
                <AlertTriangle size={14} style={{ color: "#f59e0b" }} strokeWidth={1.75} />
              ) : (
                <WifiOff size={14} style={{ color: "#ef4444" }} strokeWidth={1.75} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
                {inst.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin size={10} style={{ color: "#2d4a6e" }} />
                <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                  {inst.city}, {inst.country}
                </span>
              </div>
            </div>

            {/* Drawings today */}
            <div className="text-right flex-shrink-0">
              <p style={{ fontSize: "14px", color: "#e8f0fe", fontWeight: 600 }}>
                {inst.drawingsToday}
              </p>
              <p style={{ fontSize: "10px", color: "#2d4a6e" }}>today</p>
            </div>

            {/* Devices */}
            <div
              className="flex-shrink-0 px-2 py-1 rounded-md"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                {inst.devicesOnline}/{inst.devices}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
