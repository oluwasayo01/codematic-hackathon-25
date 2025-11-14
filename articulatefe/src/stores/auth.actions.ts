import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, firebaseReady } from '../lib/firebase/config'
import type { AppDispatch } from '../stores/store'
import { setUser, setLoading, logout, setToken } from '../stores/slices/authSlice'
import { authAPI } from '../lib/api/auth'

export const startAuthListener = () => (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  if (!firebaseReady || !auth) {
    dispatch(setUser(null))
    dispatch(setLoading(false))
    return () => {}
  }
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      // If backend token already present, refresh current user from backend
      const backendToken = localStorage.getItem('auth_token')
      if (backendToken) {
        try {
          const me = await authAPI.me()
          dispatch(
            setUser({
              id: me.id,
              email: me.email,
              displayName: me.displayName ?? null,
            })
          )
          dispatch(setLoading(false))
          return
        } catch (e) {
          // fallback to firebase profile
        }
      }
      dispatch(
        setUser({
          id: fbUser.uid,
          email: fbUser.email ?? '',
          displayName: fbUser.displayName ?? null,
          photoUrl: fbUser.photoURL ?? null,
          emailVerified: fbUser.emailVerified,
        })
      )
    } else {
      dispatch(setUser(null))
    }
    dispatch(setLoading(false))
  })
}

export const signIn = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  if (!firebaseReady || !auth) throw new Error('Firebase not configured')
  const result = await authAPI.login({ email, password })
  // Persist backend token if provided
  if ((result as any).token) {
    localStorage.setItem('auth_token', (result as any).token)
    dispatch(setToken((result as any).token))
  }
  if ((result as any).user) {
    const u = (result as any).user
    dispatch(
      setUser({ id: u.id, email: u.email, displayName: u.displayName ?? null })
    )
  }
  dispatch(setLoading(false))
}

export const signOutUser = () => async (dispatch: AppDispatch) => {
  if (!firebaseReady || !auth) {
    localStorage.removeItem('auth_token')
    dispatch(logout())
    return
  }
  try {
    localStorage.removeItem('auth_token')
    await signOut(auth)
  } finally {
    dispatch(logout())
  }
}

export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  if (!firebaseReady || !auth) throw new Error('Firebase not configured')
  const result = await authAPI.googleSignIn()
  if ((result as any).token) {
    localStorage.setItem('auth_token', (result as any).token)
    dispatch(setToken((result as any).token))
  }
  if ((result as any).user) {
    const u = (result as any).user
    dispatch(
      setUser({ id: u.id, email: u.email, displayName: u.displayName ?? null })
    )
  }
  dispatch(setLoading(false))
}

export const signUp = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  if (!firebaseReady || !auth) throw new Error('Firebase not configured')
  const result = await authAPI.register({ email, password, displayName: email.split('@')[0] })
  if ((result as any).token) {
    localStorage.setItem('auth_token', (result as any).token)
    dispatch(setToken((result as any).token))
  }
  if ((result as any).user) {
    const u = (result as any).user
    dispatch(
      setUser({ id: u.id, email: u.email, displayName: u.displayName ?? null })
    )
  }
  dispatch(setLoading(false))
}
