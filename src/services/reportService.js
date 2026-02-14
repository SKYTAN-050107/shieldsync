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
      console.log('[ShieldSync] No current user, signing in anonymously...')
      const userCredential = await signInAnonymously(auth)
      console.log('[ShieldSync] Anonymous auth success, uid:', userCredential.user.uid)
      trackEvent('anonymous_auth_created', { uid: userCredential.user.uid })
    }
    return auth.currentUser.uid
  } catch (error) {
    console.error('[ShieldSync] Auth error:', error.code, error.message)
    console.error('[ShieldSync] Make sure Anonymous Auth is ENABLED in Firebase Console → Authentication → Sign-in method')
    throw error
  }
}

/**
 * Submit incident report to Firestore
 * Confirmed structure: type, description, latitude, longitude, timestamp, userId
 */
export const submitReport = async (reportData) => {
  const userId = await ensureAuth()

  const report = {
    type: reportData.type,
    description: reportData.description || '',
    latitude: reportData.location?.lat ?? reportData.latitude ?? 1.4927,
    longitude: reportData.location?.lon ?? reportData.longitude ?? 103.7414,
    timestamp: serverTimestamp(),
    userId,
  }

  console.log('[ShieldSync] Submitting report to Firestore:', report)

  const docRef = await addDoc(collection(db, 'incidents'), report)

  console.log('[ShieldSync] Report saved successfully, docId:', docRef.id)
  trackEvent('incident_reported', {
    incident_type: report.type,
    lat: report.latitude,
    lon: report.longitude,
  })

  return { success: true, id: docRef.id, report }
}

/**
 * Fetch recent incidents from Firestore (one-time read)
 * Default 12 hours – incidents older than this are hidden
 */
export const fetchRecentIncidents = async (hours = 12) => {
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
 * Default 12 hours – incidents older than this auto-disappear from the map
 */
export const subscribeToIncidents = (hours = 12, callback) => {
  const cutoffTime = Timestamp.fromDate(
    new Date(Date.now() - hours * 60 * 60 * 1000)
  )

  console.log('[ShieldSync] Subscribing to incidents from last', hours, 'hours, cutoff:', cutoffTime.toDate())

  const q = query(
    collection(db, 'incidents'),
    where('timestamp', '>=', cutoffTime),
    orderBy('timestamp', 'desc'),
    limit(50)
  )

  return onSnapshot(q, (snapshot) => {
    // Filter out any docs with null/pending timestamps (server hasn't confirmed yet)
    const incidents = snapshot.docs
      .filter(d => d.data().timestamp != null)
      .map(d => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          lat: data.latitude,
          lon: data.longitude,
        }
      })
    console.log('[ShieldSync] Incidents snapshot:', incidents.length, 'active incidents')
    callback(incidents)
  }, (error) => {
    console.error('[ShieldSync] Incident listener error:', error.code, error.message)
    if (error.code === 'failed-precondition') {
      console.error('[ShieldSync] Missing Firestore index. Go to the link in the error above to create it.')
    }
    if (error.code === 'permission-denied') {
      console.error('[ShieldSync] Firestore rules blocking reads. Update your Firestore Security Rules.')
    }
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
