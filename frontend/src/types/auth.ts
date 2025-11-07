export interface User {
  id: string;
  email: string;
  displayName: string;
  currentDay: number;
  startDate: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
