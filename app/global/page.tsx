"use client";

import { motion } from "framer-motion";
import {
  PenTool, Share2, Clock, Monitor, Users, Zap,
  Building2, Leaf, TrendingUp, Calendar,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import KpiCard from "@/components/analytics/KpiCard";
import EcosystemChart from "@/components/analytics/EcosystemChart";
import AnimalRanking from "@/components/analytics/AnimalRanking";
import HourlyChart from "@/components/analytics/HourlyChart";
import TimelineChart from "@/components/analytics/TimelineChart";
import ClientRanking from "@/components/analytics/ClientRanking";
import ClientCard from "@/components/analytics/ClientCard";
import {
  GLOBAL_TOTAL_DRAWINGS,
  GLOBAL_SHARED_DRAWINGS,
  GLOBAL_WEB_DRAWINGS,
  GLOBAL_AVG_COMPLETION_SEC,
  GLOBAL_BY_ECOSYSTEM,
  GLOBAL_BY_ANIMAL,
  GLOBAL_BY_HOUR,
  GLOBAL_TIMELINE,
  CLIENT_RANKING,
  CLIENT_DETAILS,
  formatDuration,
} from "@/lib/real-data";

// ─── Derived constants ────────────────────────────────────────────────────────

const PEAK_DAY = GLOBAL_TIMELINE.reduce((a, b) => (b.count > a.count ? b : a));
const PEAK_DAY_LABEL = new Date(PEAK_DAY.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

const TOP_ECOSYSTEM = Object.entries(GLOBAL_BY_ECOSYSTEM).sort((a, b) => b[1] - a[1])[0];
const TOP_CLIENT = CLIENT_RANKING[0];

// Clients with full analytics, ordered by totalDrawings desc
const FEATURED_CLIENTS = Object.values(CLIENT_DETAILS)
  .sort((a, b) => b.totalDrawings - a.totalDrawings);

const kpis = [
  {
    label: "Total dessins",
    value: GLOBAL_TOTAL_DRAWINGS,
    sub: "Toutes installations",
    icon: PenTool,
    color: "#00d4ff",
    highlight: true,
  },
  {
    label: "Dessins web",
    value: GLOBAL_WEB_DRAWINGS,
    sub: "Via l'app navigateur",
    icon: Monitor,
    color: "#00c9a7",
  },
  {
    label: "Partagés",
    value: GLOBAL_SHARED_DRAWINGS,
    sub: `Via shared_drawing.csv`,
    icon: Share2,
    color: "#a78bfa",
  },
  {
    label: "Durée moyenne",
    value: formatDuration(GLOBAL_AVG_COMPLETION_SEC),
    sub: "Par dessin (web)",
    icon: Clock,
    color: "#f59e0b",
  },
  {
    label: "Clients actifs",
    value: CLIENT_RANKING.length,
    sub: `${FEATURED_CLIENTS.length} avec analytics`,
    icon: Users,
    color: "#10b981",
  },
  {
    label: "Pic journalier",
    value: PEAK_DAY.count,
    sub: PEAK_DAY_LABEL,
    icon: TrendingUp,
    color: "#ec4899",
  },
];

// ─── Platform Highlights ──────────────────────────────────────────────────────

const PLATFORM_INSIGHTS = [
  {
    label: "#1 Client",
    value: TOP_CLIENT.name,
    sub: `${TOP_CLIENT.totalDrawings.toLocaleString()} dessins`,
    icon: Building2,
    color: "#00d4ff",
  },
  {
    label: "#1 Écosystème",
    value: `🪸 ${TOP_ECOSYSTEM[0]}`,
    sub: `${TOP_ECOSYSTEM[1]} dessins web`,
    icon: Leaf,
    color: "#f97316",
  },
  {
    label: "#1 Animal",
    value: "🦪 Clam",
    sub: `${GLOBAL_BY_ANIMAL[0][1]} dessins`,
    icon: Zap,
    color: "#f59e0b",
  },
  {
    label: "Meilleur jour",
    value: PEAK_DAY_LABEL,
    sub: `${PEAK_DAY.count} dessins`,
    icon: Calendar,
    color: "#a78bfa",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function GlobalDashboardPage() {
  return (
    <DashboardLayout>
      <Header
        title="Platform Analytics"
        subtitle="Wild Immersion — Vue interne consolidée · Tous clients"
      />

      <div className="flex-1 p-8 space-y-10">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl p-7"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.09) 0%, rgba(0,201,167,0.06) 50%, rgba(129,140,248,0.06) 100%)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 100% at 100% 50%, rgba(0,212,255,0.06), transparent)" }} />

          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1 min-w-0">
              {/* Status row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="status-dot-online" />
                  <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 500 }}>Opérationnel</span>
                </div>
                <span style={{ color: "#2d4a6e", fontSize: "12px" }}>·</span>
                <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{CLIENT_RANKING.length} clients actifs</span>
                <span style={{ color: "#2d4a6e", fontSize: "12px" }}>·</span>
                <span style={{ fontSize: "12px", color: "#4a6a9c" }}>Plateforme Wild Immersion Drawings</span>
                <span
                  className="ml-2 px-2 py-0.5 rounded-md"
                  style={{ fontSize: "10px", color: "#00d4ff", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", fontWeight: 600, letterSpacing: "0.05em" }}
                >
                  ADMIN INTERNE
                </span>
              </div>

              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#e8f0fe", letterSpacing: "-0.03em", marginBottom: "10px", lineHeight: 1.1 }}>
                Wild Immersion —{" "}
                <span className="gradient-text-cyan">Platform Analytics</span>
              </h1>
              <p style={{ fontSize: "14px", color: "#7b96c2", maxWidth: "520px", lineHeight: 1.6 }}>
                Vue agrégée de l'ensemble de la plateforme Drawings.{" "}
                <strong style={{ color: "#c8d8f0" }}>{GLOBAL_TOTAL_DRAWINGS.toLocaleString()} dessins</strong> capturés
                sur {CLIENT_RANKING.length} installations client. Sélectionnez un client pour accéder à son dashboard individuel.
              </p>
            </div>

            {/* Quick stats */}
            <div className="hidden lg:grid grid-cols-3 gap-3 flex-shrink-0">
              {[
                { label: "Total dessins", value: GLOBAL_TOTAL_DRAWINGS.toLocaleString(), color: "#00d4ff" },
                { label: "Dessins web", value: GLOBAL_WEB_DRAWINGS.toString(), color: "#00c9a7" },
                { label: "Clients", value: CLIENT_RANKING.length.toString(), color: "#10b981" },
              ].map((s) => (
                <div key={s.label} className="text-center px-5 py-4 rounded-xl"
                  style={{ background: "rgba(5,12,24,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ fontSize: "24px", fontWeight: 800, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "4px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── KPI Cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.label} {...kpi} index={i} />
          ))}
        </div>

        {/* ── Timeline + Platform Highlights ───────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Timeline */}
          <div className="xl:col-span-2 glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>Activité globale de la plateforme</h3>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
                  Juil. 2025 — Mai 2026 · {GLOBAL_TOTAL_DRAWINGS.toLocaleString()} dessins · Tous clients confondus
                </p>
              </div>
              <span style={{ fontSize: "11px", color: "#00d4ff", background: "rgba(0,212,255,0.1)", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(0,212,255,0.15)" }}>
                {GLOBAL_TOTAL_DRAWINGS.toLocaleString()} total
              </span>
            </div>
            <TimelineChart data={GLOBAL_TIMELINE} color="#00d4ff" height={190} />
          </div>

          {/* Platform insights */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Faits marquants</h3>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>Records de la plateforme</p>
            <div className="space-y-3">
              {PLATFORM_INSIGHTS.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.label}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: `${insight.color}08`, border: `1px solid ${insight.color}18` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${insight.color}15` }}>
                      <Icon size={14} style={{ color: insight.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "10px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {insight.label}
                      </p>
                      <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 600, marginTop: "1px" }} className="truncate">
                        {insight.value}
                      </p>
                    </div>
                    <span style={{ fontSize: "11px", color: insight.color, fontWeight: 600, flexShrink: 0, background: `${insight.color}15`, padding: "2px 6px", borderRadius: "4px" }}>
                      {insight.sub.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Clients Section ───────────────────────────────────────────────── */}
        <section>
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
                Clients — Vue d'ensemble de la plateforme
              </h2>
              <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "4px" }}>
                {CLIENT_RANKING.length} clients ·{" "}
                <span style={{ color: "#00d4ff" }}>{FEATURED_CLIENTS.length} avec analytics complets</span> (cliquez pour accéder au dashboard client)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "11px", color: "#4a6a9c", background: "rgba(255,255,255,0.04)", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.07)" }}>
                {GLOBAL_TOTAL_DRAWINGS.toLocaleString()} dessins au total
              </span>
            </div>
          </div>

          {/* Divider label */}
          <div className="flex items-center gap-3 mb-4">
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontSize: "10px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Analytics complets disponibles
            </span>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* Featured client cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {FEATURED_CLIENTS.map((client, i) => (
              <ClientCard
                key={client.id}
                client={client}
                platformTotal={GLOBAL_TOTAL_DRAWINGS}
                index={i}
              />
            ))}
          </div>

          {/* Divider label */}
          <div className="flex items-center gap-3 mb-4">
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontSize: "10px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Classement complet — {CLIENT_RANKING.length} clients
            </span>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* Full ranking table */}
          <div className="glass-card p-6 rounded-2xl">
            <ClientRanking clients={CLIENT_RANKING} limit={CLIENT_RANKING.length} title="" />
          </div>
        </section>

        {/* ── Platform Analytics ───────────────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
              Analytics détaillés — {GLOBAL_WEB_DRAWINGS} dessins web
            </h2>
            <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "4px" }}>
              Basé sur {GLOBAL_WEB_DRAWINGS} enregistrements WebDrawing.csv (clients 59, 60, 61, 62, 63) · Écosystème, animal, heure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* Ecosystem */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Par écosystème</h3>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
                {Object.keys(GLOBAL_BY_ECOSYSTEM).length} écosystèmes · {GLOBAL_WEB_DRAWINGS} dessins web
              </p>
              <EcosystemChart data={GLOBAL_BY_ECOSYSTEM} title="" />
            </div>

            {/* Animals */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Par animal</h3>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
                Espèces les plus dessinées sur la plateforme
              </p>
              <AnimalRanking data={GLOBAL_BY_ANIMAL} title="" limit={8} />
            </div>

            {/* Hourly */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Par heure</h3>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "16px" }}>
                Distribution horaire · Tous clients confondus
              </p>
              <HourlyChart data={GLOBAL_BY_HOUR} color="#00d4ff" title="" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Pic", value: "14h", sub: "164 dessins", color: "#00d4ff" },
                  { label: "Matin", value: "11h", sub: "78 dessins", color: "#00c9a7" },
                  { label: "Soir", value: "19h", sub: "94 dessins", color: "#a78bfa" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2.5 rounded-xl"
                    style={{ background: `${s.color}0d`, border: `1px solid ${s.color}18` }}>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: s.color }}>{s.value}</p>
                    <p style={{ fontSize: "9px", color: "#4a6a9c", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                    <p style={{ fontSize: "10px", color: "#2d4a6e", marginTop: "1px" }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
