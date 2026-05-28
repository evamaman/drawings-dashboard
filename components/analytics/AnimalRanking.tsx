"use client";

import { ANIMALS, ECOSYSTEM_MAP } from "@/lib/real-data";

interface AnimalRankingProps {
  data: [string, number][];
  title?: string;
  limit?: number;
}

export default function AnimalRanking({ data, title = "Top animaux", limit = 8 }: AnimalRankingProps) {
  const top = data.slice(0, limit);
  const max = top[0]?.[1] ?? 1;

  return (
    <div>
      {title && (
        <p style={{ fontSize: "12px", color: "#4a6a9c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          {title}
        </p>
      )}
      <div className="space-y-2">
        {top.map(([key, count], i) => {
          const animal = ANIMALS[key];
          const ecosystemName = animal
            ? Object.entries(ECOSYSTEM_MAP).find(([, v]) => v.id === animal.ecosystemId)?.[0]
            : undefined;
          const color = ecosystemName ? ECOSYSTEM_MAP[ecosystemName]?.color : "#00d4ff";

          return (
            <div key={key} className="flex items-center gap-3">
              <span style={{ fontSize: "11px", color: "#2d4a6e", fontWeight: 700, width: "16px", flexShrink: 0, textAlign: "right" }}>
                {i + 1}
              </span>
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{animal?.emoji ?? "🐾"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "12px", color: "#7b96c2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {animal?.name ?? key}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: color ?? "#00d4ff", marginLeft: "8px", flexShrink: 0 }}>
                    {count}
                  </span>
                </div>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "99px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(count / max) * 100}%`,
                      height: "100%",
                      background: color ?? "#00d4ff",
                      borderRadius: "99px",
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
