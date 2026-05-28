import { cn } from "@/lib/utils"

type BadgeProps = {
  label: string
  color?: string
  className?: string
}

// Generic colored badge — pass any hex color
export function Badge({ label, color = "#00d4ff", className }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium", className)}
      style={{
        background: `${color}18`,
        border: `1px solid ${color}28`,
        color,
        fontSize: "11px",
      }}
    >
      {label}
    </span>
  )
}

// Preset status badges
type StatusBadgeProps = { status: "active" | "expired" | "expiring" | "inactive" }

const STATUS_CONFIG = {
  active:   { label: "Actif",           color: "#10b981" },
  expired:  { label: "Expiré",          color: "#ef4444" },
  expiring: { label: "Expire bientôt",  color: "#f59e0b" },
  inactive: { label: "Inactif",         color: "#4a6a9c" },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return <Badge label={cfg.label} color={cfg.color} />
}

// Resolves client status from DB data
export function resolveClientStatus(
  isActive: boolean,
  expiresAt: string | null
): "active" | "expired" | "expiring" | "inactive" {
  if (!isActive) return "inactive"
  if (!expiresAt) return "active"
  const exp = new Date(expiresAt)
  const now = new Date()
  if (exp < now) return "expired"
  const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / 86_400_000)
  if (daysLeft <= 60) return "expiring"
  return "active"
}
