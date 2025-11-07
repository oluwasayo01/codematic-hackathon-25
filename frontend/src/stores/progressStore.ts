import { create } from 'zustand';
import { UserProgress } from '@/src/types/progress';
import { Evaluation } from '@/src/types/evaluation';
import { progressAPI } from '@/src/lib/api/progress';
import { evaluationsAPI } from '@/src/lib/api/evaluations';

interface ProgressStore {
  progress: UserProgress | null;
  evaluations: Evaluation[];
  isLoading: boolean;
  error: string | null;
  
  fetchProgress: (userId: string) => Promise<void>;
  fetchEvaluations: (userId: string) => Promise<void>;
  downloadReport: (userId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressStore>((set) => ({
  progress: null,
  evaluations: [],
  isLoading: false,
  error: null,

  fetchProgress: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await progressAPI.getUserProgress(userId);
      set({ progress, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch progress',
        isLoading: false,
      });
    }
  },

  fetchEvaluations: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const evaluations = await evaluationsAPI.getUserEvaluations(userId);
      set({ evaluations, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch evaluations',
        isLoading: false,
      });
    }
  },

  downloadReport: async (userId) => {
    try {
      await progressAPI.downloadReport(userId);
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to download report' });
      throw error;
    }
  },
}));