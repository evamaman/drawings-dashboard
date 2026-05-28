import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function getTrendColor(trend: number): string {
  if (trend > 0) return "#10b981";
  if (trend < 0) return "#ef4444";
  return "#7b96c2";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "online": return "#10b981";
    case "offline": return "#ef4444";
    case "warning": return "#f59e0b";
    default: return "#7b96c2";
  }
}
