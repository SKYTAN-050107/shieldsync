import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics, logEvent } from 'firebase/analytics'

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
export const analytics = getAnalytics(app)

// Analytics helper
export const trackEvent = (eventName, params = {}) => {
  logEvent(analytics, eventName, params)
}
