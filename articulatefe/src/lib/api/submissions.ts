import api from './axios'
import type { Submission } from '../../types/submission'

export const submissionsAPI = {
  uploadAudio: async (userId: string, topicId: string | undefined, audioBlob: Blob, challengeId?: string) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    formData.append('user_id', userId)
    if (challengeId) formData.append('challenge_id', challengeId)
    if (topicId) formData.append('topic_id', topicId)

    const response = await api.post('/submissions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  evaluateSubmission: async (submissionId: string) => {
    const response = await api.post(`/submissions/evaluate`, { submission_id: submissionId })
    return response.data
  },

  getUserSubmissions: async (userId: string): Promise<Submission[]> => {
    const response = await api.get(`/submissions/user/${userId}`)
    return response.data
  },

  getSubmissionById: async (submissionId: string): Promise<Submission> => {
    const response = await api.get(`/submissions/${submissionId}`)
    return response.data
  },
}
