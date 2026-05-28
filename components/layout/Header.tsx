type HeaderProps = {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  eyebrow?: string      // small label above the title (e.g. client name on client page)
}

export function Header({ title, subtitle, actions, eyebrow }: HeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-8 py-6 flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div>
        {eyebrow && (
          <p style={{ fontSize: "11px", color: "#4a6a9c", fontWeight: 500, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {eyebrow}
          </p>
        )}
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#e8f0fe", letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "3px" }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">{actions}</div>
      )}
    </div>
  )
}
