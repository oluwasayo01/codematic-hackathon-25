import { createSlice } from '@reduxjs/toolkit'
import type { UserChallenge } from '../../types/challenge'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ChallengeState {
  currentChallenge: UserChallenge | null
  isLoading: boolean
  error: string | null
}

const initialState: ChallengeState = {
  currentChallenge: null,
  isLoading: false,
  error: null,
}

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload },
    setCurrentChallenge(state, action: PayloadAction<UserChallenge | null>) { state.currentChallenge = action.payload },
  },
})

export const { setLoading: setChallengeLoading, setError: setChallengeError, setCurrentChallenge } = challengeSlice.actions
export default challengeSlice.reducer
