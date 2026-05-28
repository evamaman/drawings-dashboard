"use client";

import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface HourlyChartProps {
  data: Record<string, number>;
  color?: string;
  title?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "rgba(9,20,34,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "8px 12px" }}>
      <p style={{ color: "#7b96c2", fontSize: "11px" }}>{d.payload.hour}h00</p>
      <p style={{ color: "#e8f0fe", fontSize: "13px", fontWeight: 600 }}>{d.value} dessins</p>
    </div>
  );
};

export default function HourlyChart({ data, color = "#00d4ff", title = "Activité par heure" }: HourlyChartProps) {
  const allHours = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return { hour: i, label: i % 4 === 0 ? `${i}h` : "", count: data[h] ?? 0 };
  });

  const max = Math.max(...allHours.map((h) => h.count), 1);

  return (
    <div>
      {title && (
        <p style={{ fontSize: "12px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={allHours} barCategoryGap="20%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4a6a9c", fontSize: 10 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {allHours.map((entry) => {
              const intensity = entry.count / max;
              return (
                <Cell
                  key={entry.hour}
                  fill={`${color}${Math.round(intensity * 0xdd + 0x22).toString(16).padStart(2, "0")}`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
