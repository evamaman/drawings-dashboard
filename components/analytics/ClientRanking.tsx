"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ClientRankEntry } from "@/lib/real-data";

interface ClientRankingProps {
  clients: ClientRankEntry[];
  limit?: number;
  title?: string;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function ClientRanking({ clients, limit = 10, title = "Classement clients" }: ClientRankingProps) {
  const top = clients.slice(0, limit);
  const max = top[0]?.totalDrawings ?? 1;

  return (
    <div>
      {title && (
        <p style={{ fontSize: "12px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          {title}
        </p>
      )}
      <div className="space-y-1">
        {top.map((client, i) => {
          const color = "#00d4ff";
          const pct = (client.totalDrawings / max) * 100;
          const row = (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl group"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              }}
            >
              {/* Rank */}
              <span style={{ fontSize: "11px", color: i < 3 ? color : "#2d4a6e", fontWeight: 700, width: "18px", flexShrink: 0, textAlign: "right" }}>
                {i + 1}
              </span>

              {/* Avatar */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}>
                {initials(client.name)}
              </div>

              {/* Name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "13px", color: "#c8d8f0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {client.name}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8f0fe", marginLeft: "8px", flexShrink: 0 }}>
                    {client.totalDrawings.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: "99px" }} />
                  </div>
                </div>
              </div>

              {/* Drill-down arrow */}
              <ArrowUpRight size={14} style={{ color: client.hasDetail ? "#2d4a6e" : "#1a2d45", flexShrink: 0 }} />
            </motion.div>
          );

          return (
            <Link key={client.id} href={`/client/${client.id}`} style={{ display: "block", textDecoration: "none" }}>
              {row}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
