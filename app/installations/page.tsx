"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { installations } from "@/lib/mock-data";
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  MapPin,
  Monitor,
  PenTool,
  Clock,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

const statusMap = {
  online: {
    label: "Online",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    Icon: Wifi,
    dotCls: "status-dot-online",
  },
  offline: {
    label: "Offline",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    Icon: WifiOff,
    dotCls: "status-dot-offline",
  },
  warning: {
    label: "Warning",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    Icon: AlertTriangle,
    dotCls: "status-dot-warning",
  },
};

export default function InstallationsPage() {
  const onlineCount = installations.filter((i) => i.status === "online").length;
  const warningCount = installations.filter((i) => i.status === "warning").length;
  const offlineCount = installations.filter((i) => i.status === "offline").length;
  const totalDevices = installations.reduce((s, i) => s + i.devices, 0);
  const onlineDevices = installations.reduce((s, i) => s + i.devicesOnline, 0);
  const totalToday = installations.reduce((s, i) => s + i.drawingsToday, 0);
  const totalDrawings = installations.reduce((s, i) => s + i.totalDrawings, 0);

  return (
    <DashboardLayout>
      <Header
        title="Installations"
        subtitle={`${installations.length} locations · ${onlineDevices}/${totalDevices} devices online`}
      />

      <div className="flex-1 p-8 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Online locations", value: onlineCount, color: "#10b981", icon: Wifi },
            { label: "Warning", value: warningCount, color: "#f59e0b", icon: AlertTriangle },
            { label: "Offline", value: offlineCount, color: "#ef4444", icon: WifiOff },
            { label: "Drawings today", value: totalToday, color: "#00d4ff", icon: PenTool },
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
                <p style={{ fontSize: "22px", color: "#e8f0fe", fontWeight: 700 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#4a6a9c" }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Installations grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {installations.map((inst, i) => {
            const cfg = statusMap[inst.status as keyof typeof statusMap];
            const StatusIcon = cfg.Icon;
            const devicePct = (inst.devicesOnline / inst.devices) * 100;

            return (
              <motion.div
                key={inst.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl cursor-pointer group"
                style={{
                  background: "rgba(9,20,34,0.8)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      <StatusIcon size={17} style={{ color: cfg.color }} strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8f0fe" }}>
                        {inst.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin size={10} style={{ color: "#2d4a6e" }} />
                        <span style={{ fontSize: "12px", color: "#4a6a9c" }}>
                          {inst.city}, {inst.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    <span className={cfg.dotCls} />
                    <span style={{ fontSize: "12px", color: cfg.color, fontWeight: 500 }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Today", value: inst.drawingsToday.toString(), icon: PenTool },
                    { label: "Total", value: inst.totalDrawings.toLocaleString(), icon: TrendingUp },
                    { label: "Avg session", value: inst.avgSession, icon: Clock },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <s.icon size={11} style={{ color: "#2d4a6e", marginBottom: "4px" }} />
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#e8f0fe" }}>{s.value}</p>
                      <p style={{ fontSize: "10px", color: "#4a6a9c" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Devices */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Monitor size={12} style={{ color: "#4a6a9c" }} />
                      <span style={{ fontSize: "12px", color: "#4a6a9c" }}>
                        {inst.devicesOnline}/{inst.devices} devices online
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: cfg.color, fontWeight: 600 }}>
                      {Math.round(devicePct)}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: cfg.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${devicePct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 + 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Last sync */}
                <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <RefreshCw size={10} style={{ color: "#2d4a6e" }} />
                  <span style={{ fontSize: "11px", color: "#2d4a6e" }}>
                    Last sync: {inst.lastSync}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global device health */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(9,20,34,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
            Network Health Overview
          </h3>
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
            {onlineDevices} of {totalDevices} devices currently reachable
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="h-full flex">
                <motion.div
                  style={{ background: "#10b981" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(onlineDevices / totalDevices) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <motion.div
                  style={{ background: "#f59e0b" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(1 / totalDevices) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {[
                { label: "Online", value: onlineDevices, color: "#10b981" },
                { label: "Warning", value: 1, color: "#f59e0b" },
                { label: "Offline", value: totalDevices - onlineDevices - 1, color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{s.label} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { label: "Total drawings all-time", value: totalDrawings.toLocaleString(), color: "#00d4ff" },
              { label: "Avg drawings/location/day", value: Math.round(totalToday / installations.length).toString(), color: "#00c9a7" },
              { label: "Most active", value: "Oceanopolis", color: "#818cf8" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p style={{ fontSize: "16px", fontWeight: 700, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "2px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
