// ─── Supabase row types ───────────────────────────────────────────────────────
// These mirror the exact columns in each Supabase table.
// Never add fields that don't exist in the database.

export type DbClient = {
  id: number
  name: string
  type: string | null
  created_at: string
  expires_at: string | null
  is_active: boolean
  last_used_at: string | null
  scrolling_enabled: boolean
  ecosystem_ids: number[]
  is_base: boolean
}

export type DbDrawingCount = {
  client_id: number
  total: number
}

export type DbClientStats = {
  client_id: number
  total_drawings: number
  web_drawings: number
  shared_drawings: number
  avg_completion_sec: number
  by_ecosystem: Record<string, number>
  top_animals: [string, number][]
  by_hour: Record<string, number>
  timeline: { date: string; count: number }[]
  updated_at: string
}

export type DbGlobalStats = {
  id: number
  total_drawings: number
  web_drawings: number
  shared_drawings: number
  avg_completion_sec: number
  by_ecosystem: Record<string, number>
  by_animal: [string, number][]
  by_hour: Record<string, number>
  timeline: { date: string; count: number }[]
  updated_at: string
}

// ─── App-level types ──────────────────────────────────────────────────────────
// These are the types consumed by the UI — slightly transformed from DB rows.

export type Client = {
  id: number
  name: string
  isActive: boolean
  ecosystemIds: number[]
  createdAt: string
  expiresAt: string | null
  lastUsedAt: string | null
}

// A client enriched with whatever data is available.
// detailedStats is null for most clients — the UI must handle this gracefully.
export type ClientWithData = {
  client: Client
  totalDrawings: number | null      // available for 22 clients
  detailedStats: ClientStats | null // available for 6 clients only
}

export type ClientStats = {
  clientId: number
  totalDrawings: number
  webDrawings: number
  sharedDrawings: number
  avgCompletionSec: number
  byEcosystem: Record<string, number>
  topAnimals: [string, number][]
  byHour: Record<string, number>
  timeline: { date: string; count: number }[]
}

export type GlobalStats = {
  totalDrawings: number
  webDrawings: number
  sharedDrawings: number
  avgCompletionSec: number
  byEcosystem: Record<string, number>
  byAnimal: [string, number][]
  byHour: Record<string, number>
  timeline: { date: string; count: number }[]
  updatedAt: string
}

// ─── UI utility types ─────────────────────────────────────────────────────────

export type DataAvailability = "full" | "count-only" | "none"
