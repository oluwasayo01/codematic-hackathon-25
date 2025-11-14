import React from "react";
import { Tile } from "@carbon/react";

interface DetailedMetricsProps {
  evaluations: Array<{
    day: number;
    overallScore?: number;
    metrics?: Record<string, number>;
  }>;
  days: Array<{ day: number; completed: boolean; score?: number }>;
}

export const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ evaluations, days }) => {
  const last = evaluations.filter(Boolean).slice(-1)[0];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Tile style={{ background: "#262626" }}>
        <h4 style={{ color: "#f4f4f4", marginBottom: 16 }}>Performance Trend</h4>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 120 }}>
          {days.slice(0, 21).map((d) => {
            const score = evaluations.find((e) => e.day === d.day)?.overallScore || d.score || 0;
            const h = Math.max(6, Math.min(100, score));
            return <div key={d.day} style={{ width: 8, height: (h / 100) * 120, background: "#8a3ffc", borderRadius: 2 }} />;
          })}
        </div>
      </Tile>

      <Tile style={{ background: "#262626" }}>
        <h4 style={{ color: "#f4f4f4", marginBottom: 16 }}>Metrics Breakdown</h4>
        {last?.metrics && (
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(last.metrics).map(([key, value]) => (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#d0d0d0", textTransform: "capitalize" }}>{key}</span>
                  <span style={{ color: "#f4f4f4", fontWeight: 600 }}>{Math.round(value)}%</span>
                </div>
                <div style={{ width: "100%", background: "#393939", borderRadius: 999, height: 8 }}>
                  <div style={{ width: `${value}%`, background: "#0f62fe", height: 8, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Tile>
    </div>
  );
};
