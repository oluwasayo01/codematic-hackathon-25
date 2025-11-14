export interface Topic {
  id: string
  title: string
  description?: string
  createdAt?: string
}

export interface TopicDay {
  day: number
  challengeId: string
}

export interface TopicDetail {
  topic: Topic
  days: TopicDay[]
}

// Rich view model for TopicDetail page
export interface TopicCurrentDayChallenge {
  day: number
  challengeId?: string
  promptText: string
  promptType: string
  targetDuration: number
  difficulty: number
  completed?: boolean
}

export interface TopicDayProgress {
  day: number
  completed: boolean
  score?: number
}

export interface TopicSubmissionItem {
  id: string
  day: number
  audioUrl: string
  transcription?: string
  score?: number
  submittedAt?: string
}

export interface TopicEvaluationItem {
  day: number
  overallScore?: number
  metrics?: Record<string, number>
}

export interface TopicViewModel {
  topic: Topic
  currentDay?: TopicCurrentDayChallenge
  days: TopicDayProgress[]
  submissions: TopicSubmissionItem[]
  evaluations: TopicEvaluationItem[]
  averageScore: number
  improvementRate: number
  currentStreak: number
  recentPerformance?: { last7Days?: number }
  bestScore?: number
  totalTime?: string
}
