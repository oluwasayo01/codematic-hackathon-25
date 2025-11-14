import { createSlice } from '@reduxjs/toolkit'

export type AppTheme = 'g100' | 'g10'

interface UIState { theme: AppTheme }

const initialState: UIState = { theme: 'g100' }

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: { payload: AppTheme }) { state.theme = action.payload },
    toggleTheme(state) { state.theme = state.theme === 'g100' ? 'g10' : 'g100' },
  },
})

export const { setTheme, toggleTheme } = uiSlice.actions
export default uiSlice.reducer