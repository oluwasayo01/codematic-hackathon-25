export interface Metrics {
  clarity: number;
  fluency: number;
  vocabulary: number;
  coherence: number;
  pacing: number;
  fillerWords: number;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  userId: string;
  day: number;
  overallScore: number;
  metrics: Metrics;
  strengths: string[];
  areasForImprovement: string[];
  specificFeedback: string;
  recommendations: string[];
  evaluatedAt: string;
}
