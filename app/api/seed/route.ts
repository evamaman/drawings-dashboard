import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { RAW_CLIENTS } from "@/lib/mock-data";
import {
  DRAWING_COUNT_TOTALS,
  GLOBAL_TOTAL_DRAWINGS,
  GLOBAL_WEB_DRAWINGS,
  GLOBAL_SHARED_DRAWINGS,
  GLOBAL_AVG_COMPLETION_SEC,
  GLOBAL_BY_ECOSYSTEM,
  GLOBAL_BY_ANIMAL,
  GLOBAL_BY_HOUR,
  GLOBAL_TIMELINE,
  CLIENT_DETAILS,
} from "@/lib/real-data";

export async function POST() {
  const errors: string[] = [];

  // 1. Clients
  const clientsData = RAW_CLIENTS.map((c) => ({
    id: c.id,
    name: c.name,
    created_at: c.createdAt,
    expires_at: (c as any).expiresAt ?? null,
    is_active: (c as any).isActive ?? true,
    last_used_at: c.lastUsedAt ?? null,
    scrolling_enabled: c.scrollingEnabled,
    ecosystem_ids: c.ecosystemIds,
    is_base: true,
  }));

  const { error: e1 } = await supabase
    .from("clients")
    .upsert(clientsData, { onConflict: "id" });
  if (e1) errors.push(`clients: ${e1.message}`);

  // 2. Drawing counts
  const countsData = Object.entries(DRAWING_COUNT_TOTALS).map(([id, total]) => ({
    client_id: parseInt(id),
    total,
  }));

  const { error: e2 } = await supabase
    .from("drawing_counts")
    .upsert(countsData, { onConflict: "client_id" });
  if (e2) errors.push(`drawing_counts: ${e2.message}`);

  // 3. Global stats
  const { error: e3 } = await supabase.from("global_stats").upsert({
    id: 1,
    total_drawings: GLOBAL_TOTAL_DRAWINGS,
    web_drawings: GLOBAL_WEB_DRAWINGS,
    shared_drawings: GLOBAL_SHARED_DRAWINGS,
    avg_completion_sec: GLOBAL_AVG_COMPLETION_SEC,
    by_ecosystem: GLOBAL_BY_ECOSYSTEM,
    by_animal: GLOBAL_BY_ANIMAL,
    by_hour: GLOBAL_BY_HOUR,
    timeline: GLOBAL_TIMELINE,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (e3) errors.push(`global_stats: ${e3.message}`);

  // 4. Client stats
  const clientStatsData = Object.values(CLIENT_DETAILS).map((c) => ({
    client_id: parseInt(c.id),
    web_drawings: c.webDrawings,
    total_drawings: c.totalDrawings,
    shared_drawings: c.sharedDrawings,
    avg_completion_sec: c.avgCompletionSec,
    by_ecosystem: c.byEcosystem,
    top_animals: c.topAnimals,
    by_hour: c.byHour,
    timeline: c.timeline,
    updated_at: new Date().toISOString(),
  }));

  const { error: e4 } = await supabase
    .from("client_stats")
    .upsert(clientStatsData, { onConflict: "client_id" });
  if (e4) errors.push(`client_stats: ${e4.message}`);

  if (errors.length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Base de données peuplée : ${clientsData.length} clients, ${countsData.length} totaux, stats globales, ${clientStatsData.length} stats client`,
  });
}
