// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TooltipProps = Record<string, any>

export function ChartTooltip({ active, payload, label, formatter }: TooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: "rgba(5,12,24,0.97)",
        border: "1px solid rgba(0,212,255,0.15)",
        borderRadius: "10px",
        padding: "8px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
      }}
    >
      {label && (
        <p style={{ fontSize: "11px", color: "#4a6a9c", marginBottom: "4px" }}>
          {label}
        </p>
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: "13px", fontWeight: 600, color: p.color ?? "#00d4ff" }}>
          {formatter ? formatter(p.value) : p.value.toLocaleString("fr-FR")}{" "}
          <span style={{ fontWeight: 400, color: "#4a6a9c" }}>{p.name}</span>
        </p>
      ))}
    </div>
  )
}
