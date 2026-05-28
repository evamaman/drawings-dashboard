"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { ECOSYSTEM_MAP } from "@/lib/real-data";

interface EcosystemChartProps {
  data: Record<string, number>;
  title?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "rgba(9,20,34,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px" }}>
      <p style={{ color: "#e8f0fe", fontSize: "13px", fontWeight: 600 }}>{d.payload.name}</p>
      <p style={{ color: d.payload.color, fontSize: "12px", marginTop: "2px" }}>{d.value.toLocaleString()} dessins</p>
    </div>
  );
};

export default function EcosystemChart({ data, title = "Dessins par écosystème" }: EcosystemChartProps) {
  const chartData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      shortName: name.length > 14 ? name.slice(0, 13) + "…" : name,
      count,
      color: ECOSYSTEM_MAP[name]?.color ?? "#00d4ff",
      emoji: ECOSYSTEM_MAP[name]?.emoji ?? "🌍",
    }));

  const max = chartData[0]?.count ?? 1;

  return (
    <div>
      {title && (
        <p style={{ fontSize: "12px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          {title}
        </p>
      )}
      <div className="space-y-2.5">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <span style={{ fontSize: "14px", flexShrink: 0 }}>{d.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "12px", color: "#7b96c2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {d.name}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: d.color, marginLeft: "8px", flexShrink: 0 }}>
                  {d.count.toLocaleString()}
                </span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "99px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${d.color}80, ${d.color})`,
                    borderRadius: "99px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
