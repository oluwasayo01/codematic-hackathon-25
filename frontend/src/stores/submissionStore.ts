import { create } from 'zustand';
import { Submission } from '@/src/types/submission';
import { Evaluation } from '@/src/types/evaluation';
import { submissionsAPI } from '@/src/lib/api/submissions';
import { evaluationsAPI } from '@/src/lib/api/evaluations';

interface SubmissionStore {
  currentSubmission: Submission | null;
  currentEvaluation: Evaluation | null;
  submissions: Submission[];
  isUploading: boolean;
  isEvaluating: boolean;
  error: string | null;
  
  uploadAudio: (userId: string, challengeId: string, audioBlob: Blob) => Promise<string>;
  evaluateSubmission: (submissionId: string) => Promise<void>;
  fetchUserSubmissions: (userId: string) => Promise<void>;
  clearSubmission: () => void;
}

export const useSubmissionStore = create<SubmissionStore>((set) => ({
  currentSubmission: null,
  currentEvaluation: null,
  submissions: [],
  isUploading: false,
  isEvaluating: false,
  error: null,

  uploadAudio: async (userId, challengeId, audioBlob) => {
    set({ isUploading: true, error: null });
    try {
      const submission = await submissionsAPI.uploadAudio(userId, challengeId, audioBlob);
      set({ currentSubmission: submission, isUploading: false });
      return submission.id;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to upload audio',
        isUploading: false,
      });
      throw error;
    }
  },

  evaluateSubmission: async (submissionId) => {
    set({ isEvaluating: true, error: null });
    try {
      const evaluation = await submissionsAPI.evaluateSubmission(submissionId);
      set({ currentEvaluation: evaluation, isEvaluating: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to evaluate submission',
        isEvaluating: false,
      });
      throw error;
    }
  },

  fetchUserSubmissions: async (userId) => {
    try {
      const submissions = await submissionsAPI.getUserSubmissions(userId);
      set({ submissions });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch submissions' });
    }
  },

  clearSubmission: () => set({ currentSubmission: null, currentEvaluation: null }),
}));
