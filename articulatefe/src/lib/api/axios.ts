import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { auth } from '../firebase/config'
import { getIdToken } from 'firebase/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Always try to attach Firebase ID token for protected endpoints
    try {
      const fbUser = auth?.currentUser
      if (fbUser) {
        const tokenPromise = getIdToken(fbUser as any)
        const fbTokenStr = await tokenPromise
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(config.headers as any).set?.('Authorization', `Bearer ${fbTokenStr}`) ?? ((config.headers as any).Authorization = `Bearer ${fbTokenStr}`)
      }
    } catch {}

    // Optionally pass backend session token as separate header
    const sessionToken = localStorage.getItem('auth_token')
    if (sessionToken) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config.headers as any).set?.('X-Session-Token', sessionToken) ?? ((config.headers as any)['X-Session-Token'] = sessionToken)
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Do NOT hard-redirect on 401 to avoid flicker; let route guards decide
    // Optionally clear token only if backend explicitly signals invalid session
    if ((error.response?.status ?? 0) === 401) {
      // localStorage.removeItem('auth_token')
    }
    return Promise.reject(error)
  }
)

export default api
