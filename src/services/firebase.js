import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "krackathon.firebaseapp.com",
  projectId: "krackathon",
  storageBucket: "krackathon.firebasestorage.app",
  messagingSenderId: "REDACTED_SENDER_ID",
  appId: "1:REDACTED_SENDER_ID:web:c473ba63b6b0ae4ac0229d",
  measurementId: "REDACTED_MEASUREMENT_ID"
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
