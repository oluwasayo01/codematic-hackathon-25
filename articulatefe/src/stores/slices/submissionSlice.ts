import { createSlice } from '@reduxjs/toolkit'
import type { Submission } from '../../types/submission'
import type { Evaluation } from '../../types/evaluation'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SubmissionState {
  currentSubmission: Submission | null
  currentEvaluation: Evaluation | null
  submissions: Submission[]
  isUploading: boolean
  isEvaluating: boolean
  error: string | null
}

const initialState: SubmissionState = {
  currentSubmission: null,
  currentEvaluation: null,
  submissions: [],
  isUploading: false,
  isEvaluating: false,
  error: null,
}

const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    setCurrentSubmission(state, action: PayloadAction<Submission | null>) { state.currentSubmission = action.payload },
    setCurrentEvaluation(state, action: PayloadAction<Evaluation | null>) { state.currentEvaluation = action.payload },
    setSubmissions(state, action: PayloadAction<Submission[]>) { state.submissions = action.payload },
    setUploading(state, action: PayloadAction<boolean>) { state.isUploading = action.payload },
    setEvaluating(state, action: PayloadAction<boolean>) { state.isEvaluating = action.payload },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload },
  },
})

export const { setCurrentSubmission, setCurrentEvaluation, setSubmissions, setUploading, setEvaluating, setError: setSubmissionError } = submissionSlice.actions
export default submissionSlice.reducer
