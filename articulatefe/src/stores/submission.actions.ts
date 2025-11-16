import { submissionsAPI } from '../lib/api/submissions'
import type { AppDispatch } from './store'
import { setCurrentSubmission, setCurrentEvaluation, setSubmissions, setUploading, setEvaluating, setSubmissionError } from './slices/submissionSlice'

export const uploadAudio = (
  userId: string,
  topicId: string | undefined,
  audioBlob: Blob,
  challengeId?: string,
) => async (dispatch: AppDispatch) => {
  dispatch(setUploading(true))
  dispatch(setSubmissionError(null))
  try {
    const submission = await submissionsAPI.uploadAudio(userId, topicId, audioBlob, challengeId)
    dispatch(setCurrentSubmission(submission))
    return submission.id as string
  } catch (err: any) {
    dispatch(setSubmissionError(err?.response?.data?.message || 'Failed to upload audio'))
    throw err
  } finally {
    dispatch(setUploading(false))
  }
}

export const evaluateSubmission = (submissionId: string) => async (dispatch: AppDispatch) => {
  dispatch(setEvaluating(true))
  dispatch(setSubmissionError(null))
  try {
    const evaluation = await submissionsAPI.evaluateSubmission(submissionId)
    dispatch(setCurrentEvaluation(evaluation))
  } catch (err: any) {
    dispatch(setSubmissionError(err?.response?.data?.message || 'Failed to evaluate submission'))
    throw err
  } finally {
    dispatch(setEvaluating(false))
  }
}

export const fetchUserSubmissions = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    const submissions = await submissionsAPI.getUserSubmissions(userId)
    dispatch(setSubmissions(submissions))
  } catch (err: any) {
    dispatch(setSubmissionError(err?.response?.data?.message || 'Failed to fetch submissions'))
  }
}
