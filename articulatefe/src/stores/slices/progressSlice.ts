import { createSlice } from '@reduxjs/toolkit'
import type { UserProgress } from '../../types/progress'
import type { Evaluation } from '../../types/evaluation'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ProgressState {
  progress: UserProgress | null
  evaluations: Evaluation[]
  isLoading: boolean
  error: string | null
}

const initialState: ProgressState = {
  progress: null,
  evaluations: [],
  isLoading: false,
  error: null,
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgress(state, action: PayloadAction<UserProgress | null>) { state.progress = action.payload },
    setEvaluations(state, action: PayloadAction<Evaluation[]>) { state.evaluations = action.payload },
    setLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload },
  },
})

export const { setProgress, setEvaluations, setLoading: setProgressLoading, setError: setProgressError } = progressSlice.actions
export default progressSlice.reducer
