"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { fetchGlobalStats, fetchClientRanking } from "@/lib/db";
import type { GlobalStats } from "@/lib/db";
import type { ClientRankEntry } from "@/lib/real-data";
import { ANIMALS } from "@/lib/real-data";
import { formatNumber } from "@/lib/utils";
import { PenTool, Share2, Globe, Clock, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(9,20,34,0.95)",
        border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ color: "#4a6a9c", fontSize: "11px", marginBottom: "4px" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color ?? "#00d4ff", fontSize: "13px", fontWeight: 600 }}>
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value} {p.name}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [ranking, setRanking] = useState<ClientRankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGlobalStats(), fetchClientRanking()]).then(([s, r]) => {
      setStats(s);
      setRanking(r);
      setLoading(false);
    });
  }, []);

  // ── Données dérivées ──────────────────────────────────────────────────────────

  const byHour = stats
    ? Object.entries(stats.by_hour)
        .map(([h, count]) => ({ hour: `${parseInt(h)}h`, count, _key: parseInt(h) }))
        .sort((a, b) => a._key - b._key)
    : [];
  const peakHour = byHour.reduce((m, b) => Math.max(m, b.count), 0) || 1;

  const topAnimals = stats
    ? (stats.by_animal as [string, number][]).slice(0, 8).map(([key, count]) => ({
        name: ANIMALS[key]?.name ?? (key.split("_").pop() ?? key),
        emoji: ANIMALS[key]?.emoji ?? "🐾",
        count,
      }))
    : [];
  const maxAnimal = topAnimals[0]?.count ?? 1;

  const timeline = stats ? stats.timeline.slice(-60).map((t) => ({
    date: t.date.slice(5),
    count: t.count,
  })) : [];

  const topClients = ranking.slice(0, 8);
  const maxClient = topClients[0]?.totalDrawings ?? 1;

  const avgMin = stats ? Math.floor(stats.avg_completion_sec / 60) : 0;
  const avgSec = stats ? Math.round(stats.avg_completion_sec % 60) : 0;
  const avgLabel = stats
    ? avgMin > 0 ? `${avgMin}m ${avgSec}s` : `${avgSec}s`
    : "—";

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <Header title="Analytics" subtitle="Statistiques réelles des dessins Wild Immersion" />

      <div className="flex-1 p-8 space-y-8">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total dessins",
              value: loading ? "…" : formatNumber(stats!.total_drawings),
              sub: "tous clients confondus",
              icon: PenTool,
              color: "#00d4ff",
            },
            {
              label: "Dessins web",
              value: loading ? "…" : formatNumber(stats!.web_drawings),
              sub: loading ? "" : `${Math.round((stats!.web_drawings / stats!.total_drawings) * 100)}% du total`,
              icon: Globe,
              color: "#00c9a7",
            },
            {
              label: "Dessins partagés",
              value: loading ? "…" : formatNumber(stats!.shared_drawings),
              sub: loading ? "" : `${Math.round((stats!.shared_drawings / stats!.total_drawings) * 100)}% du total`,
              icon: Share2,
              color: "#818cf8",
            },
            {
              label: "Durée moyenne",
              value: loading ? "…" : avgLabel,
              sub: "par dessin web",
              icon: Clock,
              color: "#f59e0b",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(9,20,34,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
              >
                <s.icon size={16} style={{ color: s.color }} strokeWidth={1.75} />
              </div>
              <p style={{ fontSize: "24px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p style={{ fontSize: "12px", color: "#7b96c2", marginTop: "2px" }}>{s.label}</p>
              <p style={{ fontSize: "11px", color: "#2d4a6e", marginTop: "2px" }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Ligne 1 : Heure + Top animaux */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Dessins par heure */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
              Dessins par heure
            </h3>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
              Distribution horaire des dessins web
            </p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byHour} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "#2d4a6e", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#2d4a6e", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="count" name="dessins" radius={[4, 4, 0, 0]}>
                    {byHour.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={`rgba(0,212,255,${0.2 + (entry.count / peakHour) * 0.65})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top animaux */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
              Top animaux
            </h3>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
              Animaux les plus dessinés (dessins web)
            </p>
            <div className="space-y-3">
              {topAnimals.map((animal, i) => {
                const colors = ["#00d4ff", "#00c9a7", "#818cf8", "#10b981", "#f59e0b", "#ec4899", "#f97316", "#a78bfa"];
                const color = colors[i % colors.length];
                return (
                  <div key={animal.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "14px" }}>{animal.emoji}</span>
                        <span style={{ fontSize: "13px", color: "#7b96c2", fontWeight: 500 }}>
                          {animal.name}
                        </span>
                      </div>
                      <span style={{ fontSize: "13px", color, fontWeight: 600 }}>
                        {animal.count.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color, opacity: 0.8 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(animal.count / maxAnimal) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.07 + 0.35, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Ligne 2 : Timeline + Top clients */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
              Timeline des dessins
            </h3>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
              60 derniers jours avec activité enregistrée
            </p>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#2d4a6e", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={Math.max(1, Math.floor(timeline.length / 6))}
                  />
                  <YAxis tick={{ fill: "#2d4a6e", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="dessins"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#00d4ff", stroke: "#050c18", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {stats && (
              <div className="mt-3 flex gap-3">
                <div
                  className="p-3 rounded-xl flex-1"
                  style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.1)" }}
                >
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "#00d4ff" }}>
                    {formatNumber(timeline.reduce((a, t) => a + t.count, 0))}
                  </p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c" }}>dessins sur la période</p>
                </div>
                <div
                  className="p-3 rounded-xl flex-1"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "#7b96c2" }}>
                    {Math.round(timeline.reduce((a, t) => a + t.count, 0) / Math.max(timeline.length, 1))}
                  </p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c" }}>moy. / jour actif</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Top clients */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
              Top clients
            </h3>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
              Par nombre total de dessins
            </p>
            <div className="space-y-3">
              {topClients.map((client, i) => {
                const colors = ["#00d4ff", "#00c9a7", "#818cf8", "#10b981", "#f59e0b", "#ec4899", "#f97316", "#a78bfa"];
                return (
                  <div key={client.id}>
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: `${colors[i]}15`, color: colors[i] }}
                      >
                        {i + 1}
                      </div>
                      <span style={{ fontSize: "13px", color: "#7b96c2", flex: 1 }}>
                        {client.name}
                      </span>
                      <span style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 600 }}>
                        {client.totalDrawings.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full ml-8 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: colors[i], opacity: 0.7 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(client.totalDrawings / maxClient) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.07 + 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="mt-4 flex items-center gap-2 p-3 rounded-xl"
              style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.1)" }}
            >
              <TrendingUp size={13} style={{ color: "#00c9a7" }} />
              <p style={{ fontSize: "12px", color: "#4a6a9c" }}>
                <span style={{ color: "#00c9a7", fontWeight: 600 }}>
                  {loading ? "…" : ranking.length}
                </span>{" "}
                clients avec dessins enregistrés
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
