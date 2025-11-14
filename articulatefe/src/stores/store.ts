import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import challengeReducer from './slices/challengeSlice'
import progressReducer from './slices/progressSlice'
import submissionReducer from './slices/submissionSlice'
import topicReducer from './slices/topicSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    challenge: challengeReducer,
    progress: progressReducer,
    submission: submissionReducer,
    topic: topicReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
