import api from './axios';
import { User, AuthState } from '@/src/types/auth';


export const authAPI = {
    register: async ({email, displayName, password}: {
        email: string,
        displayName: string,
        password: string
    }) : Promise<AuthState> => {
        const response = await api.post<AuthState>('/auth/register', {
            email,
            display_name: displayName,
            password,
        });
        return response.data;
    },

  login: async ({email, password}: {
    email: string,
    password: string
  }) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};
