"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ClientDetail, ECOSYSTEM_MAP, formatDuration } from "@/lib/real-data";

function initials(name: string) {
  return name.split(/[\s\-_]/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

interface ClientCardProps {
  client: ClientDetail;
  platformTotal: number;
  index?: number;
}

export default function ClientCard({ client, platformTotal, index = 0 }: ClientCardProps) {
  const color = "#00d4ff";
  const pct = ((client.totalDrawings / platformTotal) * 100).toFixed(1);

  const topEcosystems = Object.entries(client.byEcosystem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => ({
      name,
      emoji: ECOSYSTEM_MAP[name]?.emoji ?? "🌍",
      ecoColor: ECOSYSTEM_MAP[name]?.color ?? color,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
    >
      <Link
        href={`/client/${client.id}`}
        style={{ display: "block", textDecoration: "none" }}
      >
        <div
          className="relative overflow-hidden p-5 rounded-2xl group transition-all duration-200"
          style={{
            background: "rgba(9,20,34,0.7)",
            border: `1px solid rgba(255,255,255,0.07)`,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.border = `1px solid ${color}30`;
            el.style.background = `rgba(9,20,34,0.9)`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.border = "1px solid rgba(255,255,255,0.07)";
            el.style.background = "rgba(9,20,34,0.7)";
          }}
        >
          {/* Hover glow */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(ellipse, ${color}18 0%, transparent 70%)` }}
          />

          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
              >
                {initials(client.name)}
              </div>
              <div className="min-w-0">
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe", lineHeight: 1.2 }} className="truncate">
                  {client.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "#00d4ff", fontSize: "12px" }}>
              <span>Dashboard</span>
              <ArrowUpRight size={13} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Total", value: client.totalDrawings.toLocaleString(), c: color },
              { label: "Web", value: client.webDrawings.toString(), c: "#00c9a7" },
              { label: "Partagés", value: client.sharedDrawings.toString(), c: "#a78bfa" },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: s.c, letterSpacing: "-0.02em" }}>{s.value}</p>
                <p style={{ fontSize: "10px", color: "#4a6a9c", marginTop: "1px" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Ecosystem tags */}
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {topEcosystems.map((eco) => (
              <span key={eco.name}
                style={{
                  fontSize: "10px", color: eco.ecoColor, background: `${eco.ecoColor}12`,
                  border: `1px solid ${eco.ecoColor}20`, padding: "2px 7px", borderRadius: "5px",
                }}>
                {eco.emoji} {eco.name.length > 10 ? eco.name.slice(0, 9) + "…" : eco.name}
              </span>
            ))}
            {Object.keys(client.byEcosystem).length > 3 && (
              <span style={{ fontSize: "10px", color: "#4a6a9c" }}>
                +{Object.keys(client.byEcosystem).length - 3}
              </span>
            )}
          </div>

          {/* Platform share bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: "10px", color: "#4a6a9c" }}>Part de la plateforme</span>
              <span style={{ fontSize: "10px", color, fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(parseFloat(pct) * 3, 100)}%`, height: "100%", background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: "99px" }} />
            </div>
          </div>

          {/* Duration */}
          {client.avgCompletionSec !== null && (
            <div className="mt-3 flex items-center justify-between">
              <span style={{ fontSize: "10px", color: "#4a6a9c" }}>Durée moyenne</span>
              <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>{formatDuration(client.avgCompletionSec)}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
