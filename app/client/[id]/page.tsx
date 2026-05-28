"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, PenTool, Share2, Globe, Clock, CalendarDays } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Header } from "@/components/layout/Header"
import { KpiCard } from "@/components/ui/KpiCard"
import { Card, CardHeader } from "@/components/ui/Card"
import { KpiCardSkeleton, ChartSkeleton, Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { Badge, StatusBadge, resolveClientStatus } from "@/components/ui/Badge"
import { HourlyChart } from "@/components/charts/HourlyChart"
import { TimelineChart } from "@/components/charts/TimelineChart"
import { AnimalChart } from "@/components/charts/AnimalChart"
import { EcosystemChart } from "@/components/charts/EcosystemChart"
import { fetchClientWithData } from "@/lib/supabase/queries"
import { formatNumber, formatDuration, formatDate, initials } from "@/lib/utils"
import { ECOSYSTEM_BY_ID, CHART_COLORS } from "@/lib/constants"
import type { ClientWithData } from "@/lib/types"

// ─── Back button ──────────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 transition-colors"
      style={{ color: "#4a6a9c", fontSize: "13px" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#00d4ff")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4a6a9c")}
    >
      <ArrowLeft size={14} />
      Vue globale
    </button>
  )
}

// ─── Client info card ─────────────────────────────────────────────────────────

function ClientInfoCard({ data }: { data: ClientWithData }) {
  const { client } = data
  const status = resolveClientStatus(client.isActive, client.expiresAt)
  const color = CHART_COLORS[client.id % CHART_COLORS.length]
  const ecos = client.ecosystemIds
    .map((id) => ECOSYSTEM_BY_ID[id])
    .filter(Boolean)

  return (
    <Card>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}
        >
          {initials(client.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#e8f0fe" }}>
              {client.name}
            </h2>
            <StatusBadge status={status} />
          </div>

          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={11} style={{ color: "#2d4a6e" }} />
              <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                Créé le {formatDate(client.createdAt)}
              </span>
            </div>
            {client.lastUsedAt && (
              <div className="flex items-center gap-1.5">
                <Clock size={11} style={{ color: "#2d4a6e" }} />
                <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                  Dernière utilisation {formatDate(client.lastUsedAt)}
                </span>
              </div>
            )}
            <span style={{ fontSize: "11px", color: "#2d4a6e" }}>
              ID #{client.id}
            </span>
          </div>

          {/* Ecosystems */}
          {ecos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {ecos.map((eco) => (
                <Badge key={eco.id} label={`${eco.emoji} ${eco.name}`} color={eco.color} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── No data state ─────────────────────────────────────────────────────────────

function NoDataState({ data }: { data: ClientWithData }) {
  return (
    <div className="space-y-6">
      <ClientInfoCard data={data} />
      <Card>
        <EmptyState
          icon="📭"
          title="Aucune donnée de dessin"
          message="Ce client n'a pas encore de dessins enregistrés dans la base de données."
        />
      </Card>
    </div>
  )
}

// ─── Count-only state ─────────────────────────────────────────────────────────

function CountOnlyState({ data }: { data: ClientWithData }) {
  const color = CHART_COLORS[data.client.id % CHART_COLORS.length]

  return (
    <div className="space-y-6">
      <ClientInfoCard data={data} />

      {/* Single big number */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl flex flex-col items-center justify-center text-center"
        style={{
          background: "rgba(9,20,34,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: `${color}18`, border: `1px solid ${color}28` }}
        >
          <PenTool size={22} style={{ color }} strokeWidth={1.5} />
        </div>
        <p
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#e8f0fe",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {formatNumber(data.totalDrawings!)}
        </p>
        <p style={{ fontSize: "15px", color: "#4a6a9c", marginTop: "8px" }}>
          dessins au total
        </p>
      </motion.div>

      {/* Analytics not available notice */}
      <Card>
        <EmptyState
          icon="📊"
          title="Analytics détaillées non disponibles"
          message="Les données par heure, par animal et par écosystème ne sont pas encore enregistrées pour ce client."
        />
      </Card>
    </div>
  )
}

// ─── Full dashboard ───────────────────────────────────────────────────────────

function FullDashboard({ data }: { data: ClientWithData }) {
  const stats = data.detailedStats!

  return (
    <div className="space-y-6">
      <ClientInfoCard data={data} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total dessins"
          value={formatNumber(stats.totalDrawings)}
          sub="depuis le début"
          icon={PenTool}
          color="#00d4ff"
          delay={0}
        />
        <KpiCard
          label="Dessins web"
          value={formatNumber(stats.webDrawings)}
          sub={`${Math.round((stats.webDrawings / (stats.totalDrawings || 1)) * 100)}% du total`}
          icon={Globe}
          color="#00c9a7"
          delay={0.07}
        />
        <KpiCard
          label="Dessins partagés"
          value={formatNumber(stats.sharedDrawings)}
          sub={`${Math.round((stats.sharedDrawings / (stats.totalDrawings || 1)) * 100)}% du total`}
          icon={Share2}
          color="#818cf8"
          delay={0.14}
        />
        <KpiCard
          label="Durée moyenne"
          value={formatDuration(stats.avgCompletionSec)}
          sub="par dessin web"
          icon={Clock}
          color="#f59e0b"
          delay={0.21}
        />
      </div>

      {/* Timeline + Heures */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader
              title="Timeline des dessins"
              subtitle="Activité journalière enregistrée"
            />
            <TimelineChart timeline={stats.timeline} height={200} />
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader
              title="Par heure"
              subtitle="Distribution horaire (dessins web)"
            />
            <HourlyChart byHour={stats.byHour} height={200} />
          </Card>
        </div>
      </div>

      {/* Animaux + Écosystèmes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Top animaux"
            subtitle="Animaux les plus dessinés"
          />
          <AnimalChart topAnimals={stats.topAnimals} />
        </Card>
        <Card>
          <CardHeader
            title="Par écosystème"
            subtitle="Répartition des dessins"
          />
          <EcosystemChart byEcosystem={stats.byEcosystem} />
        </Card>
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
    if (isNaN(id)) { setData("not-found"); setLoading(false); return }
    fetchClientWithData(id).then((result) => {
      setData(result ?? "not-found")
      setLoading(false)
    })
  }, [id])

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <Header
          eyebrow="Client"
          title="Chargement…"
          actions={<BackButton onClick={() => router.push("/")} />}
        />
        <div className="flex-1 p-8 space-y-6">
          <Skeleton height={120} rounded="lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2"><ChartSkeleton height={200} /></div>
            <ChartSkeleton height={200} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartSkeleton height={260} />
            <ChartSkeleton height={260} />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (data === "not-found") {
    return (
      <DashboardLayout>
        <Header
          eyebrow="Client"
          title="Client introuvable"
          actions={<BackButton onClick={() => router.push("/")} />}
        />
        <div className="flex-1 p-8">
          <Card>
            <EmptyState
              icon="🔍"
              title="Client introuvable"
              message={`Aucun client avec l'identifiant #${id} dans la base de données.`}
            />
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // ── Determine which view to render ─────────────────────────────────────────
  const clientData = data as ClientWithData
  const hasFullStats = clientData.detailedStats !== null
  const hasCount = clientData.totalDrawings !== null

  const subtitle = hasFullStats
    ? `${formatNumber(clientData.detailedStats!.totalDrawings)} dessins · analytics complètes`
    : hasCount
    ? `${formatNumber(clientData.totalDrawings!)} dessins · analytics non disponibles`
    : "Aucune donnée disponible"

  return (
    <DashboardLayout>
      <Header
        eyebrow="Dashboard client"
        title={clientData.client.name}
        subtitle={subtitle}
        actions={<BackButton onClick={() => router.push("/")} />}
      />
      <div className="flex-1 p-8">
        {hasFullStats ? (
          <FullDashboard data={clientData} />
        ) : hasCount ? (
          <CountOnlyState data={clientData} />
        ) : (
          <NoDataState data={clientData} />
        )}
      </div>
    </DashboardLayout>
  )
}
