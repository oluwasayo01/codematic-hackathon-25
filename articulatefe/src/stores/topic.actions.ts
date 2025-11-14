import { topicsAPI } from '../lib/api/topics'
import type { AppDispatch } from './store'
import { setTopics, setCurrentTopic, setTopicError, setTopicLoading } from './slices/topicSlice'
import type { TopicViewModel, TopicDayProgress, TopicSubmissionItem, TopicEvaluationItem } from '../types/topic'

export const fetchTopics = () => async (dispatch: AppDispatch) => {
  dispatch(setTopicLoading(true))
  dispatch(setTopicError(null))
  try {
    const topics = await topicsAPI.list()
    dispatch(setTopics(topics))
  } catch (e: any) {
    dispatch(setTopicError(e?.response?.data?.message || 'Failed to load topics'))
  } finally {
    dispatch(setTopicLoading(false))
  }
}

export const fetchTopicDetail = (topicId: string) => async (dispatch: AppDispatch) => {
  dispatch(setTopicLoading(true))
  dispatch(setTopicError(null))
  try {
    const s = await topicsAPI.status(topicId)

    // Map to view model expected by TopicDetail page
    const completedDaysSet = new Set<number>((s.history || []).filter((h: any) => !!h.submission).map((h: any) => h.day))
    const days: TopicDayProgress[] = Array.from({ length: 21 }, (_, i) => {
      const day = i + 1
      const hist = (s.history || []).find((h: any) => h.day === day)
      return {
        day,
        completed: completedDaysSet.has(day),
        score: hist?.evaluation?.overall_score ?? undefined,
      }
    })

    const submissions: TopicSubmissionItem[] = (s.history || []).filter((h: any) => !!h.submission).map((h: any) => ({
      id: h.submission!.id || `${s.topic.id}-${h.day}`,
      day: h.day,
      audioUrl: h.submission!.audio_url,
      transcription: h.submission!.transcription || undefined,
      score: h.evaluation?.overall_score ?? undefined,
      submittedAt: h.submission!.submitted_at || undefined,
    }))

    const evaluations: TopicEvaluationItem[] = (s.history || []).filter((h: any) => !!h.evaluation).map((h: any) => ({
      day: h.day,
      overallScore: h.evaluation?.overall_score ?? undefined,
      metrics: h.evaluation?.metrics ?? undefined,
    }))

    const avg = s.metrics?.overall_score ?? null
    const scores = (s.metrics?.scores || []).filter((x: any) => typeof x === 'number') as number[]
    const improvementRate = scores.length >= 2 ? (scores[scores.length - 1] - scores[0]) : 0

    // Streak: count back from highest completed day consecutively
    const sortedCompleted = [...completedDaysSet].sort((a,b)=>a-b)
    const maxCompleted = sortedCompleted[sortedCompleted.length - 1] || 0
    let streak = 0
    for (let d = maxCompleted; d >= 1; d--) {
      if (completedDaysSet.has(d)) streak++
      else break
    }

    const dayNumber = s.today?.day ?? s.current_day ?? 1

    const vm: TopicViewModel = {
      topic: { id: s.topic.id, title: s.topic.title, description: s.topic.description },
      currentDay: s.today?.challenge ? {
        day: dayNumber,
        challengeId: s.today.challenge.id,
        promptText: s.today.challenge.prompt_text,
        promptType: s.today.challenge.prompt_type,
        targetDuration: s.today.challenge.target_duration,
        difficulty: s.today.challenge.difficulty,
        completed: completedDaysSet.has(dayNumber),
      } : {
        // Fallback demo challenge so users can see the UI even if no mapping exists yet
        day: dayNumber,
        challengeId: undefined,
        promptText: 'Demo: Speak about your favorite book for 30 seconds. Focus on clarity and pacing.',
        promptType: 'free_speech',
        targetDuration: 30,
        difficulty: 2,
        completed: completedDaysSet.has(dayNumber),
      },
      days,
      submissions,
      evaluations,
      averageScore: avg ?? 0,
      improvementRate,
      currentStreak: streak,
      recentPerformance: { last7Days: scores.slice(-7).reduce((a,b)=>a+b,0) / Math.max(1, Math.min(7, scores.length)) },
      bestScore: scores.length ? Math.max(...scores) : undefined,
    }

    dispatch(setCurrentTopic(vm))
  } catch (e: any) {
    dispatch(setTopicError(e?.response?.data?.message || 'Failed to load topic'))
  } finally {
    dispatch(setTopicLoading(false))
  }
}
