type EmptyStateProps = {
  title?: string
  message?: string
  icon?: string
  compact?: boolean
}

export function EmptyState({
  title = "Données non disponibles",
  message = "Aucune donnée enregistrée pour cette section.",
  icon = "📭",
  compact = false,
}: EmptyStateProps) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span style={{ fontSize: "13px" }}>{icon}</span>
        <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{title}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</span>
      <p style={{ fontSize: "14px", fontWeight: 600, color: "#7b96c2" }}>
        {title}
      </p>
      <p style={{ fontSize: "12px", color: "#2d4a6e", marginTop: "4px", maxWidth: "240px" }}>
        {message}
      </p>
    </div>
  )
}

// Wraps a chart section — shows content if data exists, EmptyState if not
type DataGuardProps = {
  hasData: boolean
  children: React.ReactNode
  title?: string
  message?: string
  height?: number
}

export function DataGuard({
  hasData,
  children,
  title,
  message,
  height = 200,
}: DataGuardProps) {
  if (!hasData) {
    return (
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          height,
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.06)",
        }}
      >
        <EmptyState title={title} message={message} />
      </div>
    )
  }

  return <>{children}</>
}
