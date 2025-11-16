import React from "react";
import { Tile } from "@carbon/react";
import { Time } from "@carbon/icons-react";

interface ChallengeCardProps {
  challenge: {
    day: number;
    challengeId?: string;
    promptText: string;
    promptType: string;
    targetDuration: number;
    difficulty: number;
    completed?: boolean;
  };
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  return (
    <Tile style={{ background: "#262626", borderLeft: "4px solid #0f62fe" }}>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0f62fe", textTransform: "uppercase" }}>
              Day {challenge.day}
            </span>
            <span style={{ padding: "2px 8px", background: "rgba(15,98,254,0.2)", color: "#0f62fe", fontSize: 12, borderRadius: 4 }}>
              {challenge.promptType}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#a8a8a8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Time size={16} />
              <span>{challenge.targetDuration}s</span>
            </div>
            <div>Difficulty: {challenge.difficulty}/5</div>
          </div>
        </div>

        <div>
          <h3 style={{ color: "#f4f4f4", marginBottom: 8 }}>Today's Challenge</h3>
          <p style={{ color: "#d0d0d0", lineHeight: 1.6 }}>{challenge.promptText}</p>
        </div>

        <div style={{ paddingTop: 12, borderTop: "1px solid #525252" }}>
          <p style={{ fontSize: 12, color: "#a8a8a8" }}>
            <strong>Tip:</strong> Take your time, speak clearly, and focus on articulating your thoughts coherently.
          </p>
        </div>
      </div>
    </Tile>
  );
};
