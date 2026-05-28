import { supabase } from "./supabase";
import type { Client } from "./mock-data";
import type { ClientDetail, ClientRankEntry } from "./real-data";
import {
  GLOBAL_TOTAL_DRAWINGS,
  GLOBAL_WEB_DRAWINGS,
  GLOBAL_SHARED_DRAWINGS,
  GLOBAL_AVG_COMPLETION_SEC,
  GLOBAL_BY_ECOSYSTEM,
  GLOBAL_BY_ANIMAL,
  GLOBAL_BY_HOUR,
  GLOBAL_TIMELINE,
  CLIENT_RANKING as STATIC_CLIENT_RANKING,
  CLIENT_DETAILS as STATIC_CLIENT_DETAILS,
} from "./real-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GlobalStats = {
  total_drawings: number;
  web_drawings: number;
  shared_drawings: number;
  avg_completion_sec: number;
  by_ecosystem: Record<string, number>;
  by_animal: [string, number][];
  by_hour: Record<string, number>;
  timeline: { date: string; count: number }[];
  updated_at?: string;
};

export type DbClient = {
  id: number;
  name: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  last_used_at: string | null;
  scrolling_enabled: boolean;
  ecosystem_ids: number[];
  is_base: boolean;
};

// ─── Static fallbacks ─────────────────────────────────────────────────────────

const STATIC_GLOBAL_STATS: GlobalStats = {
  total_drawings: GLOBAL_TOTAL_DRAWINGS,
  web_drawings: GLOBAL_WEB_DRAWINGS,
  shared_drawings: GLOBAL_SHARED_DRAWINGS,
  avg_completion_sec: GLOBAL_AVG_COMPLETION_SEC,
  by_ecosystem: GLOBAL_BY_ECOSYSTEM,
  by_animal: GLOBAL_BY_ANIMAL,
  by_hour: GLOBAL_BY_HOUR,
  timeline: GLOBAL_TIMELINE,
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchGlobalStats(): Promise<GlobalStats> {
  const { data, error } = await supabase
    .from("global_stats")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return STATIC_GLOBAL_STATS;
  return data as GlobalStats;
}

export async function fetchClientRanking(): Promise<ClientRankEntry[]> {
  const { data: counts, error: e1 } = await supabase
    .from("drawing_counts")
    .select("client_id, total")
    .order("total", { ascending: false });

  const { data: clients, error: e2 } = await supabase
    .from("clients")
    .select("id, name");

  if (e1 || e2 || !counts || !clients) return STATIC_CLIENT_RANKING;

  const clientMap = Object.fromEntries(clients.map((c: { id: number; name: string }) => [c.id, c]));
  const detailIds = new Set(Object.keys(STATIC_CLIENT_DETAILS));

  return counts.map((row) => {
    const client = clientMap[row.client_id];
    return {
      id: String(row.client_id),
      name: client?.name ?? `Client #${row.client_id}`,
      totalDrawings: row.total,
      hasDetail: detailIds.has(String(row.client_id)),
    };
  });
}

export async function fetchClientStats(clientId: string): Promise<ClientDetail | null> {
  const { data, error } = await supabase
    .from("client_stats")
    .select("*")
    .eq("client_id", parseInt(clientId))
    .single();

  if (error || !data) return STATIC_CLIENT_DETAILS[clientId] ?? null;

  return {
    id: clientId,
    name: STATIC_CLIENT_DETAILS[clientId]?.name ?? `Client #${clientId}`,
    webDrawings: data.web_drawings,
    totalDrawings: data.total_drawings,
    sharedDrawings: data.shared_drawings,
    avgCompletionSec: data.avg_completion_sec,
    byEcosystem: data.by_ecosystem,
    topAnimals: data.top_animals,
    byHour: data.by_hour,
    timeline: data.timeline,
  };
}

// ─── Converters ──────────────────────────────────────────────────────────────

function dbToClient(db: DbClient): Client {
  return {
    id: db.id,
    name: db.name,
    createdAt: db.created_at ? db.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
    expiresAt: db.expires_at ?? null,
    isActive: db.is_active,
    lastUsedAt: db.last_used_at ?? null,
    scrollingEnabled: db.scrolling_enabled,
    ecosystemIds: db.ecosystem_ids ?? [],
    isBase: db.is_base,
  };
}

function clientToDb(client: Client): Omit<DbClient, "created_at"> {
  return {
    id: client.id,
    name: client.name,
    expires_at: client.expiresAt ?? null,
    is_active: client.isActive,
    last_used_at: client.lastUsedAt ?? null,
    scrolling_enabled: client.scrollingEnabled,
    ecosystem_ids: client.ecosystemIds,
    is_base: false,
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchAllClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("id");

  if (error || !data) return [];
  return (data as DbClient[]).map(dbToClient);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function addClient(client: Client): Promise<number | null> {
  const { data, error } = await supabase
    .from("clients")
    .insert(clientToDb(client))
    .select("id")
    .single();

  if (error) { console.error("addClient:", error); return null; }
  return (data as { id: number }).id;
}

export async function updateClient(client: Client): Promise<boolean> {
  const { error } = await supabase
    .from("clients")
    .update(clientToDb(client))
    .eq("id", client.id);

  if (error) { console.error("updateClient:", error); return false; }
  return true;
}

export async function deleteClient(id: number): Promise<boolean> {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("is_base", false);

  if (error) { console.error("deleteClient:", error); return false; }
  return true;
}
