import { cn } from "@/lib/utils"

type CardProps = {
  children: React.ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

export function Card({ children, className, padding = "lg" }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl", paddingMap[padding], className)}
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "3px" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
