import { db, auth, trackEvent } from './firebase'
import { 
  collection, addDoc, getDocs, updateDoc, doc,
  query, where, orderBy, limit, Timestamp, increment,
  onSnapshot, serverTimestamp
} from 'firebase/firestore'
import { signInAnonymously } from 'firebase/auth'

/**
 * Ensure user is authenticated (anonymous or signed-in)
 */
export const ensureAuth = async () => {
  try {
    if (!auth.currentUser) {
      const userCredential = await signInAnonymously(auth)
      trackEvent('anonymous_auth_created', { uid: userCredential.user.uid })
    }
    return auth.currentUser.uid
  } catch (error) {
    console.error('Auth error:', error)
    throw error
  }
}

/**
 * Submit incident report to Firestore
 * Confirmed structure: type, description, latitude, longitude, timestamp, userId
 */
export const submitReport = async (reportData) => {
  try {
    const userId = await ensureAuth()

    const report = {
      type: reportData.type,
      description: reportData.description || '',
      latitude: reportData.location?.lat ?? reportData.latitude ?? 1.4927,
      longitude: reportData.location?.lon ?? reportData.longitude ?? 103.7414,
      timestamp: serverTimestamp(),
      userId,
    }

    const docRef = await addDoc(collection(db, 'incidents'), report)

    trackEvent('incident_reported', {
      incident_type: report.type,
      lat: report.latitude,
      lon: report.longitude,
    })

    return { success: true, id: docRef.id, report }
  } catch (error) {
    console.error('Report submission error:', error)
    trackEvent('report_submission_error', { error: error.message })
    return { success: false, error: error.message }
  }
}

/**
 * Fetch recent incidents from Firestore (one-time read)
 */
export const fetchRecentIncidents = async (hours = 24) => {
  try {
    const cutoffTime = Timestamp.fromDate(
      new Date(Date.now() - hours * 60 * 60 * 1000)
    )

    const q = query(
      collection(db, 'incidents'),
      where('timestamp', '>=', cutoffTime),
      orderBy('timestamp', 'desc'),
      limit(50)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        lat: data.latitude,
        lon: data.longitude,
      }
    })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return []
  }
}

/**
 * Real-time listener for incidents – returns an unsubscribe function
 */
export const subscribeToIncidents = (hours = 24, callback) => {
  const cutoffTime = Timestamp.fromDate(
    new Date(Date.now() - hours * 60 * 60 * 1000)
  )

  const q = query(
    collection(db, 'incidents'),
    where('timestamp', '>=', cutoffTime),
    orderBy('timestamp', 'desc'),
    limit(50)
  )

  return onSnapshot(q, (snapshot) => {
    const incidents = snapshot.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        lat: data.latitude,
        lon: data.longitude,
      }
    })
    callback(incidents)
  }, (error) => {
    console.error('Incident listener error:', error)
    callback([])
  })
}

/**
 * Upvote an incident (confirm it's real)
 */
export const upvoteIncident = async (incidentId) => {
  try {
    await ensureAuth()

    const incidentRef = doc(db, 'incidents', incidentId)
    await updateDoc(incidentRef, { upvotes: increment(1) })

    trackEvent('incident_upvoted', { incident_id: incidentId })
    return { success: true }
  } catch (error) {
    console.error('Upvote error:', error)
    return { success: false, error: error.message }
  }
}
