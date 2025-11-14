import api from './axios'
import type { Topic, TopicDetail } from '../../types/topic'

export const topicsAPI = {
  list: async (): Promise<Topic[]> => {
    const res = await api.get('/topics')
    return res.data
  },
  create: async (payload: { title: string; description?: string }): Promise<Topic> => {
    const res = await api.post('/topics', payload)
    return res.data
  },
  detail: async (topicId: string): Promise<TopicDetail> => {
    const res = await api.get(`/topics/${topicId}`)
    return res.data
  },
  status: async (topicId: string) => {
    const res = await api.get(`/topics/${topicId}/status`)
    return res.data as {
      topic: { id: string; title: string; description?: string }
      current_day: number
      today: { day: number; challenge?: any }
      history: Array<{ day: number; submission?: any; evaluation?: any }>
      metrics: { overall_score: number | null; days_completed: number; scores: number[] }
    }
  },
  setDay: async (topicId: string, day: number, challengeId: string): Promise<TopicDetail> => {
    const res = await api.post(`/topics/${topicId}/days`, { day, challenge_id: challengeId })
    return res.data
  },
}
