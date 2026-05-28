import { supabase } from "./client"
import type {
  DbClient,
  DbDrawingCount,
  DbClientStats,
  DbGlobalStats,
  Client,
  ClientStats,
  GlobalStats,
  ClientWithData,
} from "@/lib/types"

// ─── Converters ───────────────────────────────────────────────────────────────
// Transform raw DB rows into the cleaner app-level types.

function toClient(row: DbClient): Client {
  return {
    id: row.id,
    name: row.name,
    isActive: row.is_active,
    ecosystemIds: row.ecosystem_ids ?? [],
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    lastUsedAt: row.last_used_at,
  }
}

function toClientStats(row: DbClientStats): ClientStats {
  return {
    clientId: row.client_id,
    totalDrawings: row.total_drawings,
    webDrawings: row.web_drawings,
    sharedDrawings: row.shared_drawings,
    avgCompletionSec: row.avg_completion_sec,
    byEcosystem: row.by_ecosystem ?? {},
    topAnimals: row.top_animals ?? [],
    byHour: row.by_hour ?? {},
    timeline: row.timeline ?? [],
  }
}

function toGlobalStats(row: DbGlobalStats): GlobalStats {
  return {
    totalDrawings: row.total_drawings,
    webDrawings: row.web_drawings,
    sharedDrawings: row.shared_drawings,
    avgCompletionSec: row.avg_completion_sec,
    byEcosystem: row.by_ecosystem ?? {},
    byAnimal: row.by_animal ?? [],
    byHour: row.by_hour ?? {},
    timeline: row.timeline ?? [],
    updatedAt: row.updated_at,
  }
}

// ─── Global queries ───────────────────────────────────────────────────────────

// Fetches the single aggregated row from global_stats.
// Returns null if the table is empty or the query fails.
export async function fetchGlobalStats(): Promise<GlobalStats | null> {
  const { data, error } = await supabase
    .from("global_stats")
    .select("*")
    .eq("id", 1)
    .single()

  if (error || !data) return null
  return toGlobalStats(data as DbGlobalStats)
}

// Fetches all clients ordered by id.
export async function fetchAllClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("id")

  if (error || !data) return []
  return (data as DbClient[]).map(toClient)
}

// Fetches all drawing counts ordered by total descending.
// Only 22 clients have a row here — the others have no drawings recorded.
export async function fetchDrawingCounts(): Promise<DbDrawingCount[]> {
  const { data, error } = await supabase
    .from("drawing_counts")
    .select("client_id, total")
    .order("total", { ascending: false })

  if (error || !data) return []
  return data as DbDrawingCount[]
}

// ─── Client queries ───────────────────────────────────────────────────────────

// Fetches a single client by id.
export async function fetchClient(id: number): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null
  return toClient(data as DbClient)
}

// Fetches detailed analytics for one client.
// Returns null for the 39 clients who have no entry in client_stats.
export async function fetchClientStats(id: number): Promise<ClientStats | null> {
  const { data, error } = await supabase
    .from("client_stats")
    .select("*")
    .eq("client_id", id)
    .single()

  if (error || !data) return null
  return toClientStats(data as DbClientStats)
}

// Fetches the total drawing count for one client.
// Returns null if this client has no entry in drawing_counts.
export async function fetchClientDrawingCount(id: number): Promise<number | null> {
  const { data, error } = await supabase
    .from("drawing_counts")
    .select("total")
    .eq("client_id", id)
    .single()

  if (error || !data) return null
  return (data as DbDrawingCount).total
}

// ─── Combined query ───────────────────────────────────────────────────────────

// Fetches everything available for one client in parallel.
// The UI uses this to decide what to display:
//   - client not found          → 404
//   - totalDrawings is null     → "no data"
//   - detailedStats is null     → show total only
//   - detailedStats is present  → show full dashboard
export async function fetchClientWithData(id: number): Promise<ClientWithData | null> {
  const [client, totalDrawings, detailedStats] = await Promise.all([
    fetchClient(id),
    fetchClientDrawingCount(id),
    fetchClientStats(id),
  ])

  if (!client) return null

  return { client, totalDrawings, detailedStats }
}

// ─── Global page combined query ───────────────────────────────────────────────

// Loads everything needed for the global dashboard in parallel.
export async function fetchGlobalPageData() {
  const [globalStats, clients, drawingCounts] = await Promise.all([
    fetchGlobalStats(),
    fetchAllClients(),
    fetchDrawingCounts(),
  ])

  return { globalStats, clients, drawingCounts }
}
