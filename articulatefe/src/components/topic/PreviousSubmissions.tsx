import React from "react";
import { Tile, Button } from "@carbon/react";
import { PlayFilledAlt, View } from "@carbon/icons-react";

interface SubmissionItem {
  id: string;
  day: number;
  audioUrl: string;
  transcription?: string;
  score?: number;
  submittedAt?: string;
}

interface PreviousSubmissionsProps {
  submissions: SubmissionItem[];
  topicId: string;
}

export const PreviousSubmissions: React.FC<PreviousSubmissionsProps> = ({
  submissions,
}) => {
  if (!submissions.length) {
    return (
      <Tile style={{ background: "#262626", textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "#a8a8a8" }}>No previous submissions yet</p>
      </Tile>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {submissions.map((submission) => (
        <Tile key={submission.id} style={{ background: "#262626" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0f62fe", textTransform: "uppercase" }}>
                  Day {submission.day}
                </span>
                {typeof submission.score === 'number' && (
                  <span style={{ fontSize: 14, fontWeight: 600, color: submission.score >= 80 ? '#42be65' : submission.score >= 60 ? '#f1c21b' : '#fa4d56' }}>
                    Score: {Math.round(submission.score)}%
                  </span>
                )}
              </div>
              {submission.transcription && (
                <p style={{ fontSize: 14, color: "#a8a8a8" }}>
                  {submission.transcription}
                </p>
              )}
              {submission.submittedAt && (
                <p style={{ fontSize: 12, color: "#8d8d8d", marginTop: 8 }}>
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
              {submission.audioUrl && (
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={PlayFilledAlt}
                  onClick={() => {
                    const audio = new Audio(submission.audioUrl);
                    audio.play();
                  }}
                >
                  Play
                </Button>
              )}
              <Button
                kind="ghost"
                size="sm"
                renderIcon={View}
                onClick={() => {
                  // Reserved for detailed evaluation view
                }}
              >
                View
              </Button>
            </div>
          </div>
        </Tile>
      ))}
    </div>
  );
};
