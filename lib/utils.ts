import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// cn() is kept for shadcn/ui compatibility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Number formatting ────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n)
}

// ─── Duration formatting ──────────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  })
}

// ─── Percentage ───────────────────────────────────────────────────────────────

export function pct(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// ─── Initials (for client avatars) ───────────────────────────────────────────

export function initials(name: string): string {
  return name
    .split(/[\s\-_]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")
}

// ─── Sort by_hour object into ordered array ───────────────────────────────────

export function hourlyData(byHour: Record<string, number>) {
  return Object.entries(byHour)
    .map(([h, count]) => ({ hour: `${parseInt(h)}h`, count, _key: parseInt(h) }))
    .sort((a, b) => a._key - b._key)
}
