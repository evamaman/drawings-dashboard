import { cn } from "@/lib/utils"

type SkeletonProps = {
  className?: string
  height?: number | string
  width?: number | string
  rounded?: "sm" | "md" | "lg" | "full"
}

const roundedMap = {
  sm:   "rounded",
  md:   "rounded-lg",
  lg:   "rounded-xl",
  full: "rounded-full",
}

export function Skeleton({ className, height, width, rounded = "lg" }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse", roundedMap[rounded], className)}
      style={{
        height,
        width,
        background: "rgba(255,255,255,0.05)",
      }}
    />
  )
}

// Pre-built skeleton for a KPI card
export function KpiCardSkeleton() {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Skeleton height={36} width={36} rounded="lg" className="mb-3" />
      <Skeleton height={28} width="60%" className="mb-2" />
      <Skeleton height={12} width="80%" className="mb-1" />
      <Skeleton height={11} width="50%" />
    </div>
  )
}

// Pre-built skeleton for a chart card
export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="p-6 rounded-2xl"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Skeleton height={16} width="40%" className="mb-2" />
      <Skeleton height={12} width="60%" className="mb-5" />
      <Skeleton height={height} rounded="lg" />
    </div>
  )
}
