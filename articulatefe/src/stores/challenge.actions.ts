import { challengesAPI } from '../lib/api/challenges'
import type { AppDispatch } from './store'
import { setChallengeError, setChallengeLoading, setCurrentChallenge } from './slices/challengeSlice'

export const fetchDailyChallenge = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setChallengeLoading(true))
  dispatch(setChallengeError(null))
  try {
    const challenge = await challengesAPI.getDailyChallenge(userId)
    dispatch(setCurrentChallenge(challenge))
  } catch (err: any) {
    dispatch(setChallengeError(err?.response?.data?.message || 'Failed to fetch challenge'))
  } finally {
    dispatch(setChallengeLoading(false))
  }
}
