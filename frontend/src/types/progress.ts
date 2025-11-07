export interface UserProgress {
  userId: string;
  currentStreak: number;
  completedDays: number;
  averageScore: number;
  improvementRate: number;
  metricTrends: {
    [key: string]: number[];
  };
  milestones: string[];
}
