import { progressAPI } from '../lib/api/progress'
import { evaluationsAPI } from '../lib/api/evaluations'
import type { AppDispatch } from './store'
import { setProgress, setEvaluations, setProgressError, setProgressLoading } from './slices/progressSlice'

export const fetchProgress = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setProgressLoading(true))
  dispatch(setProgressError(null))
  try {
    const progress = await progressAPI.getUserProgress(userId)
    dispatch(setProgress(progress))
  } catch (err: any) {
    dispatch(setProgressError(err?.response?.data?.message || 'Failed to fetch progress'))
  } finally {
    dispatch(setProgressLoading(false))
  }
}

export const fetchEvaluations = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setProgressLoading(true))
  dispatch(setProgressError(null))
  try {
    const evaluations = await evaluationsAPI.getUserEvaluations(userId)
    dispatch(setEvaluations(evaluations))
  } catch (err: any) {
    dispatch(setProgressError(err?.response?.data?.message || 'Failed to fetch evaluations'))
  } finally {
    dispatch(setProgressLoading(false))
  }
}

export const downloadReport = (userId: string) => async () => {
  await progressAPI.downloadReport(userId)
}
