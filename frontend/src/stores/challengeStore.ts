import { create } from 'zustand';
import { UserChallenge } from '@/src/types/challenge';
import { challengesAPI } from '@/src/lib/api/challenges';

interface ChallengeStore {
  currentChallenge: UserChallenge | null;
  isLoading: boolean;
  error: string | null;
  
  fetchDailyChallenge: (userId: string) => Promise<void>;
  clearChallenge: () => void;
}

export const useChallengeStore = create<ChallengeStore>((set) => ({
  currentChallenge: null,
  isLoading: false,
  error: null,

  fetchDailyChallenge: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const challenge = await challengesAPI.getDailyChallenge(userId);
      set({ currentChallenge: challenge, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch challenge',
        isLoading: false,
      });
    }
  },

  clearChallenge: () => set({ currentChallenge: null }),
}));
