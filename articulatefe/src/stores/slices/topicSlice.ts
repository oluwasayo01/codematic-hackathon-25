import { createSlice } from '@reduxjs/toolkit'
import type { Topic, TopicViewModel } from '../../types/topic'
import type { PayloadAction } from '@reduxjs/toolkit'

interface TopicState {
  topics: Topic[]
  current?: TopicViewModel
  isLoading: boolean
  error: string | null
}

const initialState: TopicState = {
  topics: [],
  current: undefined,
  isLoading: false,
  error: null,
}

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setTopics(state, action: PayloadAction<Topic[]>) { state.topics = action.payload },
    setCurrentTopic(state, action: PayloadAction<TopicViewModel | undefined>) { state.current = action.payload },
    setLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload },
  },
})

export const { setTopics, setCurrentTopic, setLoading: setTopicLoading, setError: setTopicError } = topicSlice.actions
export default topicSlice.reducer
