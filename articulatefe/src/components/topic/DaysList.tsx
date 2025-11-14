import React from "react";
import { CheckmarkFilled, Locked, Time } from "@carbon/icons-react";

interface DaysListProps {
  days: Array<{
    day: number;
    completed: boolean;
    score?: number;
  }>;
  currentDay?: number;
}

export const DaysList: React.FC<DaysListProps> = ({ days, currentDay }) => {
  const allDays = Array.from({ length: 21 }, (_, i) => {
    const dayNum = i + 1;
    const dayData = days.find((d) => d.day === dayNum);
    return {
      day: dayNum,
      completed: dayData?.completed || false,
      score: dayData?.score,
      isCurrent: dayNum === currentDay,
    };
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
      {allDays.map((day) => {
        const baseStyle: React.CSSProperties = {
          aspectRatio: "1 / 1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          fontSize: 12,
          border: "1px solid #525252",
          color: "#8d8d8d",
          background: "#262626",
        };
        const currentStyle: React.CSSProperties = {
          border: "2px solid #0f62fe",
          color: "#0f62fe",
          background: "rgba(15,98,254,0.15)",
        };
        const completedStyle: React.CSSProperties = {
          border: "1px solid #198038",
          color: "#42be65",
          background: "rgba(25,128,56,0.15)",
        };
        const style = day.completed
          ? { ...baseStyle, ...completedStyle }
          : day.isCurrent
          ? { ...baseStyle, ...currentStyle }
          : baseStyle;
        return (
          <div key={day.day} style={style}>
            {day.completed ? (
              <>
                <CheckmarkFilled size={16} style={{ marginBottom: 4 }} />
                <span>{day.day}</span>
              </>
            ) : day.isCurrent ? (
              <>
                <Time size={16} style={{ marginBottom: 4 }} />
                <span>{day.day}</span>
              </>
            ) : (
              <>
                <Locked size={14} style={{ marginBottom: 4, opacity: 0.6 }} />
                <span>{day.day}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
