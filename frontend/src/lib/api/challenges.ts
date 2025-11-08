import api from './axios';
import { UserChallenge } from '@/src/types/challenge';


export const challengesAPI = {
  getDailyChallenge: async (userId: string): Promise<UserChallenge> => {
    const response = await api.get(`/challenges/daily/${userId}`);
    return response.data;
  },

  getChallengeById: async (challengeId: string) => {
    const response = await api.get(`/challenges/${challengeId}`);
    return response.data;
  },
};
