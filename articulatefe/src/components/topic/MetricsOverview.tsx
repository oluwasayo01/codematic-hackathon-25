import React from "react";
import { Tile } from "@carbon/react";
import { ArrowUp, ArrowDown, Subtract } from "@carbon/icons-react";

interface MetricsOverviewProps {
  completedDays: number;
  averageScore: number;
  improvementRate: number;
  currentStreak: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  completedDays,
  averageScore,
  improvementRate,
  currentStreak,
}) => {
  const getTrendIcon = (rate: number) => {
    if (rate > 0) return <ArrowUp size={16} />;
    if (rate < 0) return <ArrowDown size={16} />;
    return <Subtract size={16} />;
  };

  const getTrendColor = (rate: number) => {
    if (rate > 0) return "#42be65";
    if (rate < 0) return "#fa4d56";
    return "#8d8d8d";
  };

  return (
    <Tile style={{ background: "#262626" }}>
      <h4 style={{ color: "#f4f4f4", marginBottom: 16 }}>Overall Performance</h4>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Completed Days */}
        <div style={{ background: "#1e1e1e", padding: 16, borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: "#a8a8a8", textTransform: "uppercase", marginBottom: 4 }}>
            Completed
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#0f62fe" }}>{completedDays}</div>
          <div style={{ fontSize: 12, color: "#8d8d8d", marginTop: 4 }}>of 21 days</div>
        </div>

        {/* Average Score */}
        <div style={{ background: "#1e1e1e", padding: 16, borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: "#a8a8a8", textTransform: "uppercase", marginBottom: 4 }}>
            Avg Score
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#f4f4f4" }}>{Math.round(averageScore)}%</div>
          <div style={{ fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 6, color: getTrendColor(improvementRate) }}>
            {getTrendIcon(improvementRate)}
            <span>{Math.abs(Math.round(improvementRate))}%</span>
          </div>
        </div>

        {/* Current Streak */}
        <div style={{ background: "#1e1e1e", padding: 16, borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: "#a8a8a8", textTransform: "uppercase", marginBottom: 4 }}>
            Streak
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#ff832b" }}>{currentStreak}</div>
          <div style={{ fontSize: 12, color: "#8d8d8d", marginTop: 4 }}>days</div>
        </div>

        {/* Improvement */}
        <div style={{ background: "#1e1e1e", padding: 16, borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: "#a8a8a8", textTransform: "uppercase", marginBottom: 4 }}>
            Trend
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: getTrendColor(improvementRate) }}>
            {improvementRate > 0 ? "+" : ""}
            {Math.round(improvementRate)}%
          </div>
          <div style={{ fontSize: 12, color: "#8d8d8d", marginTop: 4 }}>improvement</div>
        </div>
      </div>
    </Tile>
  );
};
