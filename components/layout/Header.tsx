type HeaderProps = {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  eyebrow?: string
}

export function Header({ title, subtitle, actions, eyebrow }: HeaderProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-8 py-4 md:py-6 flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p style={{
            fontSize: "11px", color: "#4a6a9c", fontWeight: 500,
            marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            {eyebrow}
          </p>
        )}
        <h1 className="truncate" style={{
          fontSize: "clamp(16px, 2.5vw, 20px)",
          fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p className="truncate" style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "3px" }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  )
}
