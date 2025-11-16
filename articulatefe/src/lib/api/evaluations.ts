import api from './axios'
import type { Evaluation } from '../../types/evaluation'

export const evaluationsAPI = {
  getUserEvaluations: async (userId: string): Promise<Evaluation[]> => {
    const response = await api.get(`/evaluations/${userId}`)
    return response.data
  },

  getEvaluationById: async (evaluationId: string): Promise<Evaluation> => {
    const response = await api.get(`/evaluations/detail/${evaluationId}`)
    return response.data
  },

  getLatestEvaluation: async (userId: string): Promise<Evaluation | null> => {
    const response = await api.get(`/evaluations/${userId}/latest`)
    return response.data
  },
}
