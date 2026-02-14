import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

// Analytics - wrapped safely for environments where it may fail (SSR, dev, etc.)
let analytics = null
try {
  if (typeof window !== 'undefined') {
    import('firebase/analytics').then(({ getAnalytics, logEvent: _logEvent }) => {
      analytics = getAnalytics(app)
    }).catch(() => {
      console.warn('Firebase Analytics not available')
    })
  }
} catch (e) {
  console.warn('Firebase Analytics init skipped:', e.message)
}

// Analytics helper - safe to call even if analytics is unavailable
export const trackEvent = (eventName, params = {}) => {
  if (analytics) {
    import('firebase/analytics').then(({ logEvent }) => {
      logEvent(analytics, eventName, params)
    }).catch(() => { })
  }
}
