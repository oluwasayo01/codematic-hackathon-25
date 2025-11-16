export interface User {
  id: string
  email: string
  displayName: string | null
  currentDay?: number
  photoUrl?: string | null
  emailVerified?: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
