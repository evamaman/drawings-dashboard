"use client"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import { ChartTooltip } from "./ChartTooltip"
import { DataGuard } from "@/components/ui/EmptyState"

type TimelineChartProps = {
  timeline: { date: string; count: number }[]
  height?: number
  // How many last entries to show (default: all)
  limit?: number
}

export function TimelineChart({ timeline, height = 180, limit }: TimelineChartProps) {
  const raw = limit ? timeline.slice(-limit) : timeline
  // Show only the day/month part for readability
  const data = raw.map((t) => ({
    date: t.date.slice(5), // "MM-DD"
    count: t.count,
    fullDate: t.date,
  }))

  const hasData = data.length > 0

  // Show a tick every ~6 points to avoid label crowding
  const tickInterval = Math.max(1, Math.floor(data.length / 6))

  return (
    <DataGuard
      hasData={hasData}
      height={height}
      title="Aucune timeline disponible"
      message="Pas de données chronologiques pour ce client."
    >
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#2d4a6e", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fill: "#2d4a6e", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={(props) => <ChartTooltip {...props} />} />
            <Line
              type="monotone"
              dataKey="count"
              name="dessins"
              stroke="#00d4ff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#00d4ff", stroke: "#050c18", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DataGuard>
  )
}
