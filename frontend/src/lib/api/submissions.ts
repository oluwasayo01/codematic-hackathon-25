import api from './axios';
import { Submission } from '@/src/types/submission';


export const submissionsAPI = {
  uploadAudio: async (userId: string, challengeId: string, audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('user_id', userId);
    formData.append('challenge_id', challengeId);

    const response = await api.post('/submissions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  evaluateSubmission: async (submissionId: string) => {
    const response = await api.post(`/submissions/evaluate`, {
      submission_id: submissionId,
    });
    return response.data;
  },

  getUserSubmissions: async (userId: string): Promise<Submission[]> => {
    const response = await api.get(`/submissions/user/${userId}`);
    return response.data;
  },

  getSubmissionById: async (submissionId: string): Promise<Submission> => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  },
};
