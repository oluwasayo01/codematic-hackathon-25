import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '../../types/auth'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isLoading = false
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload
      state.isAuthenticated = state.isAuthenticated || !!action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
    },
  },
})

export const { setUser, setLoading, setToken, logout } = authSlice.actions
export default authSlice.reducer
