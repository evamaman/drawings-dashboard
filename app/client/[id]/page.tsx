"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  PenTool, Share2, Clock, Zap,
  CalendarDays, TrendingUp, Building2, Globe, BarChart2, Activity,
} from "lucide-react";
import ClientDashboardLayout from "@/components/layout/ClientDashboardLayout";
import Header from "@/components/layout/Header";
import KpiCard from "@/components/analytics/KpiCard";
import EcosystemChart from "@/components/analytics/EcosystemChart";
import AnimalRanking from "@/components/analytics/AnimalRanking";
import HourlyChart from "@/components/analytics/HourlyChart";
import TimelineChart from "@/components/analytics/TimelineChart";
import { fetchClientStats, fetchAllClients } from "@/lib/db";
import { ECOSYSTEM_MAP, ANIMALS, formatDuration, DRAWING_COUNT_TOTALS } from "@/lib/real-data";
import type { ClientDetail } from "@/lib/real-data";
import type { Client } from "@/lib/mock-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function initials(name: string) {
  return name.split(/[\s\-_]/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "#050c18" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
          <Activity size={20} style={{ color: "#00d4ff" }} />
        </div>
        <p style={{ fontSize: "14px", color: "#4a6a9c" }}>Chargement des données…</p>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [meta, setMeta] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchClientStats(id), fetchAllClients()]).then(([stats, clients]) => {
      const foundMeta = clients.find((c) => String(c.id) === id) ?? null;
      setMeta(foundMeta);
      if (stats) {
        setClient(stats);
      } else if (foundMeta) {
        // Minimal client from meta + drawing count — no detailed analytics
        setClient({
          id,
          name: foundMeta.name,
          webDrawings: 0,
          totalDrawings: DRAWING_COUNT_TOTALS[id] ?? 0,
          sharedDrawings: 0,
          avgCompletionSec: null,
          byEcosystem: {},
          topAnimals: [],
          byHour: {},
          timeline: [],
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!client) return notFound();

  // ─── Derived values ──────────────────────────────────────────────────────────

  const hasFullAnalytics = client.timeline.length > 0 || client.topAnimals.length > 0;
  const color = "#00d4ff";

  const sortedTimeline = [...client.timeline].sort((a, b) => (a.date > b.date ? 1 : -1));
  const peakDay = sortedTimeline.reduce<{ date: string; count: number } | null>(
    (a, b) => (!a || b.count > a.count ? b : a), null
  );
  const peakDayLabel = peakDay ? fmtShort(peakDay.date) : null;

  const today = new Date().toISOString().split("T")[0];
  const drawingsToday = sortedTimeline.find((d) => d.date === today)?.count ?? 0;

  const hourEntries = Object.entries(client.byHour).sort((a, b) => b[1] - a[1]);
  const peakHour = hourEntries[0] ?? null;
  const avgPerHour = hourEntries.length > 0
    ? Math.round(hourEntries.reduce((s, [, v]) => s + v, 0) / hourEntries.length)
    : 0;

  const shareRate = client.webDrawings > 0
    ? Math.round((client.sharedDrawings / client.webDrawings) * 100) : 0;

  const topAnimal = client.topAnimals[0] ?? null;
  const topAnimalInfo = topAnimal ? ANIMALS[topAnimal[0]] : null;

  const ecoEntries = Object.entries(client.byEcosystem).sort((a, b) => b[1] - a[1]);
  const topEco = ecoEntries[0] ?? null;
  const topEcoInfo = topEco ? ECOSYSTEM_MAP[topEco[0]] : null;
  const topEcoColor = topEcoInfo?.color ?? color;

  // ─── KPIs ────────────────────────────────────────────────────────────────────

  const kpis = [
    {
      label: "Total dessins",
      value: client.totalDrawings,
      sub: "Toutes bornes confondues",
      icon: PenTool,
      color,
      highlight: true,
    },
    {
      label: "Dessins aujourd'hui",
      value: drawingsToday,
      sub: drawingsToday > 0 ? `${drawingsToday} ce jour` : "Aucun pour l'instant",
      icon: CalendarDays,
      color: "#00c9a7",
    },
    {
      label: "Moy. par heure",
      value: avgPerHour,
      sub: peakHour ? `Pic à ${peakHour[0]}h` : "Par heure active",
      icon: BarChart2,
      color: "#f97316",
    },
    {
      label: "Durée moyenne",
      value: client.avgCompletionSec != null ? formatDuration(client.avgCompletionSec) : "—",
      sub: "Par dessin",
      icon: Clock,
      color: "#f59e0b",
    },
    {
      label: "Dessins partagés",
      value: client.sharedDrawings,
      sub: `${shareRate}% de partage`,
      icon: Share2,
      color: "#a78bfa",
    },
    {
      label: "Pic journalier",
      value: peakDay?.count ?? 0,
      sub: peakDayLabel ?? "—",
      icon: TrendingUp,
      color: "#ec4899",
    },
  ];

  // ─── Client highlights (mirrors "Faits marquants" du global) ─────────────────

  const highlights = [
    topAnimalInfo && {
      label: "Animal phare",
      value: `${topAnimalInfo.emoji} ${topAnimalInfo.name}`,
      sub: `${topAnimal![1]} dessins`,
      icon: Zap,
      color: topEcoColor,
    },
    topEco && topEcoInfo && {
      label: "#1 Écosystème",
      value: `${topEcoInfo.emoji} ${topEco[0]}`,
      sub: `${topEco[1]} dessins`,
      icon: Globe,
      color: topEcoInfo.color,
    },
    peakHour && {
      label: "Heure de pointe",
      value: `${peakHour[0]}h`,
      sub: `${peakHour[1]} dessins`,
      icon: BarChart2,
      color: "#f97316",
    },
    peakDay && {
      label: "Meilleur jour",
      value: peakDayLabel!,
      sub: `${peakDay.count} dessins`,
      icon: CalendarDays,
      color: "#a78bfa",
    },
  ].filter(Boolean) as { label: string; value: string; sub: string; icon: React.ElementType; color: string }[];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <ClientDashboardLayout client={client}>
      <Header
        title={client.name}
        subtitle={`Client #${client.id} · Analytics Drawings`}
      />

      <div className="flex-1 p-8 space-y-10">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl p-7"
          style={{
            background: `linear-gradient(135deg, ${color}09 0%, ${topEcoColor}06 50%, rgba(129,140,248,0.06) 100%)`,
            border: `1px solid ${color}12`,
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 100% at 100% 50%, ${color}06, transparent)` }} />

          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1 min-w-0">
              {/* Status row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="status-dot-online" />
                  <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 500 }}>
                    {meta?.isActive !== false ? "Actif" : "Inactif"}
                  </span>
                </div>
                <span style={{ color: "#2d4a6e", fontSize: "12px" }}>·</span>
                <span style={{ fontSize: "12px", color: "#4a6a9c" }}>
                  {ecoEntries.length} écosystème{ecoEntries.length > 1 ? "s" : ""}
                </span>
                <span style={{ color: "#2d4a6e", fontSize: "12px" }}>·</span>
                <span style={{ fontSize: "12px", color: "#4a6a9c" }}>Plateforme Wild Immersion Drawings</span>
                <span className="ml-2 px-2 py-0.5 rounded-md"
                  style={{ fontSize: "10px", color, background: `${color}15`, border: `1px solid ${color}25`, fontWeight: 600, letterSpacing: "0.05em" }}>
                  {`#${client.id}`}
                </span>
                {!hasFullAnalytics && (
                  <span className="px-2 py-0.5 rounded-md"
                    style={{ fontSize: "10px", color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", fontWeight: 600 }}>
                    ANALYTICS LIMITÉS
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-base font-bold"
                  style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                  {initials(client.name)}
                </div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#e8f0fe", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  {client.name} —{" "}
                  <span style={{ color }}>Analytics</span>
                </h1>
              </div>

              <p style={{ fontSize: "14px", color: "#7b96c2", maxWidth: "520px", lineHeight: 1.6 }}>
                Tableau de bord exclusif de votre installation Drawings.{" "}
                <strong style={{ color: "#c8d8f0" }}>{client.totalDrawings.toLocaleString()} dessins</strong>{" "}
                capturés sur vos bornes
                {topAnimalInfo && <>, espèce phare : <strong style={{ color: topEcoColor }}>{topAnimalInfo.emoji} {topAnimalInfo.name}</strong></>}.
              </p>
            </div>

            {/* Quick stats */}
            <div className="hidden lg:grid grid-cols-3 gap-3 flex-shrink-0">
              {[
                { label: "Total dessins", value: client.totalDrawings.toLocaleString(), color },
                { label: "Dessins web", value: client.webDrawings.toString(), color: "#00c9a7" },
                { label: "Partagés", value: client.sharedDrawings.toString(), color: "#a78bfa" },
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

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.label} {...kpi} index={i} />
          ))}
        </div>

        {/* ── Timeline + Client Highlights ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Timeline */}
          <div className="xl:col-span-2 glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>
                  Activité de votre installation
                </h3>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
                  {sortedTimeline.length > 0
                    ? `${fmtShort(sortedTimeline[0].date)} — ${fmtShort(sortedTimeline[sortedTimeline.length - 1].date)} · ${client.totalDrawings.toLocaleString()} dessins`
                    : "Aucune donnée disponible"}
                </p>
              </div>
              <span style={{ fontSize: "11px", color, background: `${color}15`, padding: "3px 8px", borderRadius: "6px", border: `1px solid ${color}20` }}>
                {client.totalDrawings.toLocaleString()} total
              </span>
            </div>
            <TimelineChart data={sortedTimeline} color={color} height={190} />
          </div>

          {/* Client highlights */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
              Faits marquants
            </h3>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
              Records de votre installation
            </p>
            <div className="space-y-3">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div key={h.label} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: `${h.color}08`, border: `1px solid ${h.color}18` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${h.color}15` }}>
                      <Icon size={14} style={{ color: h.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "10px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {h.label}
                      </p>
                      <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 600, marginTop: "1px" }} className="truncate">
                        {h.value}
                      </p>
                    </div>
                    <span style={{ fontSize: "11px", color: h.color, fontWeight: 600, flexShrink: 0, background: `${h.color}15`, padding: "2px 6px", borderRadius: "4px" }}>
                      {h.sub.split(" ")[0]}
                    </span>
                  </div>
                );
              })}

              {/* Installation info footer */}
              {meta && (
                <div className="mt-2 pt-3 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <Building2 size={11} style={{ color: "#4a6a9c" }} />
                    <span style={{ fontSize: "11px", color: "#4a6a9c" }}>Client depuis</span>
                    <span style={{ fontSize: "11px", color: "#7b96c2", fontWeight: 500, marginLeft: "auto" }}>
                      {new Date(meta.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {meta.expiresAt && (
                    <div className="flex items-center gap-2">
                      <CalendarDays size={11} style={{ color: "#4a6a9c" }} />
                      <span style={{ fontSize: "11px", color: "#4a6a9c" }}>Accès jusqu'au</span>
                      <span style={{ fontSize: "11px", color: "#7b96c2", fontWeight: 500, marginLeft: "auto" }}>
                        {new Date(meta.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Analytics: Ecosystem · Animals · Hourly ── */}
        <section>
          <div className="mb-6">
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
              Analytics détaillés — {client.webDrawings} dessins web enregistrés
            </h2>
            <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "4px" }}>
              Distribution par écosystème, animal et heure · Source : WebDrawing.csv
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* Ecosystem */}
            {ecoEntries.length > 0 && (
              <div className="glass-card p-6 rounded-2xl">
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Par écosystème</h3>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
                  {ecoEntries.length} écosystème{ecoEntries.length > 1 ? "s" : ""} · {client.webDrawings} dessins web
                </p>
                <EcosystemChart data={client.byEcosystem} title="" />
              </div>
            )}

            {/* Animals */}
            {client.topAnimals.length > 0 && (
              <div className="glass-card p-6 rounded-2xl">
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Par animal</h3>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
                  Espèces les plus dessinées sur votre installation
                </p>
                <AnimalRanking data={client.topAnimals} title="" limit={8} />
              </div>
            )}

            {/* Hourly */}
            {hourEntries.length > 0 && (
              <div className="glass-card p-6 rounded-2xl">
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Par heure</h3>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "16px" }}>
                  Distribution horaire · Votre installation
                </p>
                <HourlyChart data={client.byHour} color={color} title="" />
                {peakHour && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { label: "Pic", value: `${peakHour[0]}h`, sub: `${peakHour[1]} dessins`, color },
                      ...(hourEntries[1] ? [{ label: "2ème", value: `${hourEntries[1][0]}h`, sub: `${hourEntries[1][1]} dessins`, color: "#00c9a7" }] : []),
                      ...(hourEntries[2] ? [{ label: "3ème", value: `${hourEntries[2][0]}h`, sub: `${hourEntries[2][1]} dessins`, color: "#a78bfa" }] : []),
                    ].map((s) => (
                      <div key={s.label} className="text-center p-2.5 rounded-xl"
                        style={{ background: `${s.color}0d`, border: `1px solid ${s.color}18` }}>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: s.color }}>{s.value}</p>
                        <p style={{ fontSize: "9px", color: "#4a6a9c", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                        <p style={{ fontSize: "10px", color: "#2d4a6e", marginTop: "1px" }}>{s.sub}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* ── Dessins partagés (shared_drawing.csv) ── */}
        {client.topSharedAnimals && client.topSharedAnimals.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
                Dessins partagés — {client.sharedDrawings} partages
              </h2>
              <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "4px" }}>
                Animaux et écosystèmes les plus partagés · Source : shared_drawing.csv
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl">
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Animaux les plus partagés</h3>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>Espèces partagées par les visiteurs</p>
                <AnimalRanking data={client.topSharedAnimals} title="" limit={8} />
              </div>
              {client.sharedByEcosystem && Object.keys(client.sharedByEcosystem).length > 0 && (
                <div className="glass-card p-6 rounded-2xl">
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>Partages par écosystème</h3>
                  <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>{Object.keys(client.sharedByEcosystem).length} écosystèmes · {client.sharedDrawings} dessins partagés</p>
                  <EcosystemChart data={client.sharedByEcosystem} title="" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Sessions web (WebVisitorSession.csv) ── */}
        {client.sessionCount != null && (
          <section>
            <div className="mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
                Sessions web — {client.sessionCount} sessions
              </h2>
              <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "4px" }}>
                Source : WebVisitorSession.csv
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Sessions totales", value: client.sessionCount.toString(), color: "#00d4ff" },
                { label: "Dessins / session", value: client.avgDrawingsPerSession?.toFixed(1) ?? "—", color: "#a78bfa" },
                { label: "Durée session", value: "2h", color: "#f59e0b" },
                { label: "Dessins web", value: client.webDrawings.toString(), color: "#10b981" },
              ].map((s) => (
                <div key={s.label} className="glass-card p-4 rounded-xl text-center">
                  <p style={{ fontSize: "22px", fontWeight: 800, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "4px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </ClientDashboardLayout>
  );
}
