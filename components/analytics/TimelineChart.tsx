"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

interface TimelineChartProps {
  data: { date: string; count: number }[];
  color?: string;
  title?: string;
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const date = new Date(d.payload.date);
  const formatted = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return (
    <div style={{ background: "rgba(9,20,34,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "8px 12px" }}>
      <p style={{ color: "#7b96c2", fontSize: "11px" }}>{formatted}</p>
      <p style={{ color: "#e8f0fe", fontSize: "13px", fontWeight: 600 }}>{d.value} dessins</p>
    </div>
  );
};

export default function TimelineChart({ data, color = "#00d4ff", title, height = 160 }: TimelineChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    shortDate: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
  }));

  const gradientId = `tl-${color.replace("#", "")}`;

  return (
    <div>
      {title && (
        <p style={{ fontSize: "12px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="shortDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4a6a9c", fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4a6a9c", fontSize: 10 }}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: `${color}40`, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
