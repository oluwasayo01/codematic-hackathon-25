import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined

let app: FirebaseApp | undefined
let auth: Auth | undefined
let firebaseReady = false

if (apiKey && authDomain && projectId) {
  const firebaseConfig = { apiKey, authDomain, projectId }
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  firebaseReady = true
} else {
  // Avoid hard crash when env is not configured; features will be disabled
  console.warn('Firebase env vars missing. Auth features are disabled until configured.')
}

export { app, auth, firebaseReady }
