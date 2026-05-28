"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { ChartTooltip } from "./ChartTooltip"
import { DataGuard } from "@/components/ui/EmptyState"
import { hourlyData } from "@/lib/utils"

type HourlyChartProps = {
  byHour: Record<string, number>
  height?: number
}

export function HourlyChart({ byHour, height = 200 }: HourlyChartProps) {
  const data = hourlyData(byHour)
  const hasData = data.length > 0
  const peak = Math.max(...data.map((d) => d.count), 1)

  return (
    <DataGuard
      hasData={hasData}
      height={height}
      title="Aucune donnée horaire"
      message="Pas de données par heure pour ce client."
    >
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#2d4a6e", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#2d4a6e", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={(props) => <ChartTooltip {...props} />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="count" name="dessins" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={`rgba(0,212,255,${0.2 + (entry.count / peak) * 0.65})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DataGuard>
  )
}
