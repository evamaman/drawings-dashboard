"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, PenTool, Share2, Globe, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { KpiCard } from "@/components/ui/KpiCard"
import { Card, CardHeader } from "@/components/ui/Card"
import { KpiCardSkeleton, ChartSkeleton, Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { TimelineChart } from "@/components/charts/TimelineChart"
import { AnimalChart } from "@/components/charts/AnimalChart"
import { EcosystemChart } from "@/components/charts/EcosystemChart"
import { ClientHero } from "@/components/dashboard/ClientHero"
import { ClientSwitcher } from "@/components/dashboard/ClientSwitcher"
import { fetchClientWithData } from "@/lib/supabase/queries"
import { formatNumber, formatDuration } from "@/lib/utils"
import type { ClientWithData } from "@/lib/types"

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "10px",
        fontWeight: 600,
        color: "#2d4a6e",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "10px",
      }}
    >
      {children}
    </p>
  )
}

// ─── Full dashboard (6 clients with detailed stats) ───────────────────────────

function FullDashboard({ data }: { data: ClientWithData }) {
  const stats = data.detailedStats!
  const webShare = Math.round((stats.webDrawings / (stats.totalDrawings || 1)) * 100)
  const sharedShare = Math.round((stats.sharedDrawings / (stats.totalDrawings || 1)) * 100)

  return (
    <div className="space-y-6">
      <ClientHero data={data} />

      {/* KPIs — grouped in two sections */}
      <div className="space-y-3">
        <SectionLabel>Volume de dessins</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <KpiCard
            label="Total dessins"
            value={formatNumber(stats.totalDrawings)}
            sub="depuis l'installation"
            icon={PenTool}
            color="#00d4ff"
            delay={0}
          />
          <KpiCard
            label="Via application web"
            value={formatNumber(stats.webDrawings)}
            sub={`${webShare}% du total`}
            icon={Globe}
            color="#00c9a7"
            delay={0.06}
          />
          <KpiCard
            label="Partagés"
            value={formatNumber(stats.sharedDrawings)}
            sub={`${sharedShare}% du total`}
            icon={Share2}
            color="#818cf8"
            delay={0.12}
          />
        </div>
      </div>

      <div className="space-y-3">
        <SectionLabel>Engagement</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KpiCard
            label="Durée moyenne par dessin"
            value={formatDuration(stats.avgCompletionSec)}
            sub="mesurée sur les dessins web"
            icon={Clock}
            color="#f59e0b"
            delay={0.18}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="p-5 rounded-2xl flex items-center gap-4"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <span style={{ fontSize: "16px" }}>📈</span>
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "#7b96c2" }}>
                Ratio web / total
              </p>
              <p style={{ fontSize: "22px", fontWeight: 700, color: "#10b981", letterSpacing: "-0.02em" }}>
                {webShare}%
              </p>
              <p style={{ fontSize: "11px", color: "#2d4a6e" }}>
                {stats.webDrawings} sur {stats.totalDrawings} dessins
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <SectionLabel>Activité dans le temps</SectionLabel>
        <Card>
          <CardHeader
            title="Timeline"
            subtitle="Dessins enregistrés jour par jour"
          />
          <TimelineChart timeline={stats.timeline} height={220} />
        </Card>
      </div>

      {/* Animaux + Écosystèmes */}
      <div className="space-y-3">
        <SectionLabel>Contenu dessiné</SectionLabel>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Top animaux"
              subtitle={`${stats.topAnimals.length} animaux différents dessinés`}
            />
            <AnimalChart topAnimals={stats.topAnimals} />
          </Card>
          <Card>
            <CardHeader
              title="Par écosystème"
              subtitle={`${Object.keys(stats.byEcosystem).length} écosystèmes actifs`}
            />
            <EcosystemChart byEcosystem={stats.byEcosystem} />
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Count-only (22 clients with just a total) ────────────────────────────────

function CountOnlyDashboard({ data }: { data: ClientWithData }) {
  return (
    <div className="space-y-6">
      <ClientHero data={data} />

      {/* Elegant notice */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-6"
        style={{
          background: "rgba(9,20,34,0.6)",
          border: "1px dashed rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}
          >
            <span style={{ fontSize: "18px" }}>📊</span>
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#7b96c2" }}>
              Analytics détaillées non disponibles
            </p>
            <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "4px", lineHeight: 1.6 }}>
              Ce client possède{" "}
              <span style={{ color: "#e8f0fe", fontWeight: 600 }}>
                {formatNumber(data.totalDrawings!)} dessins
              </span>{" "}
              enregistrés. Les données par heure, par animal et par écosystème
              ne sont pas encore disponibles pour cette installation.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── No data (23 clients with nothing) ───────────────────────────────────────

function NoDataDashboard({ data }: { data: ClientWithData }) {
  return (
    <div className="space-y-6">
      <ClientHero data={data} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-8 text-center"
        style={{
          background: "rgba(9,20,34,0.6)",
          border: "1px dashed rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>📭</div>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#7b96c2" }}>
          Aucune donnée de dessin
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "#4a6a9c",
            marginTop: "6px",
            maxWidth: "340px",
            margin: "6px auto 0",
            lineHeight: 1.6,
          }}
        >
          Ce client est configuré dans le système mais n'a pas encore
          de dessins enregistrés dans la base de données.
        </p>
      </motion.div>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton height={140} rounded="lg" />
      <div>
        <Skeleton height={10} width={120} className="mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
      </div>
      <div>
        <Skeleton height={10} width={100} className="mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
      </div>
      <div>
        <Skeleton height={10} width={140} className="mb-3" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2"><ChartSkeleton height={200} /></div>
          <ChartSkeleton height={200} />
        </div>
      </div>
      <div>
        <Skeleton height={10} width={120} className="mb-3" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartSkeleton height={260} />
          <ChartSkeleton height={260} />
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [data, setData] = useState<ClientWithData | "not-found" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (isNaN(id)) { setData("not-found"); setLoading(false); return }
    fetchClientWithData(id).then((result) => {
      setData(result ?? "not-found")
      setLoading(false)
    })
  }, [id])

  // ── Not found ────────────────────────────────────────────────────────────
  if (!loading && data === "not-found") {
    return (
      <DashboardLayout>
        <Header
          eyebrow="Client"
          title="Client introuvable"
          actions={
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5"
              style={{ color: "#4a6a9c", fontSize: "13px" }}
            >
              <ArrowLeft size={14} /> Vue globale
            </button>
          }
        />
        <div className="flex-1 p-8">
          <Card>
            <EmptyState
              icon="🔍"
              title="Client introuvable"
              message={`Aucun client avec l'identifiant #${id}.`}
            />
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const clientData = data === "not-found" ? null : (data as ClientWithData | null)

  return (
    <DashboardLayout>
      <Header
        eyebrow="Dashboard client"
        title={loading ? "Chargement…" : (clientData?.client.name ?? "")}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: "#4a6a9c", fontSize: "13px" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#00d4ff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4a6a9c")}
            >
              <ArrowLeft size={14} />
              Vue globale
            </button>
            {!loading && clientData && (
              <ClientSwitcher
                currentId={clientData.client.id}
                currentName={clientData.client.name}
              />
            )}
          </div>
        }
      />

      <div className="flex-1 p-8">
        {/* key=id forces remount + animations on client switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {loading || !clientData ? (
              <LoadingSkeleton />
            ) : clientData.detailedStats ? (
              <FullDashboard data={clientData} />
            ) : clientData.totalDrawings !== null ? (
              <CountOnlyDashboard data={clientData} />
            ) : (
              <NoDataDashboard data={clientData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
