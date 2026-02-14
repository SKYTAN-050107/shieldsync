import { db, auth, trackEvent } from './firebase'
import { 
  collection, addDoc, getDocs, updateDoc, doc,
  query, where, orderBy, limit, Timestamp, increment 
} from 'firebase/firestore'
import { signInAnonymously } from 'firebase/auth'

/**
 * Ensure user is anonymously authenticated
 * Creates anonymous account on first use
 */
export const ensureAnonymousAuth = async () => {
  try {
    if (!auth.currentUser) {
      const userCredential = await signInAnonymously(auth)
      console.log('Anonymous user created:', userCredential.user.uid)
      
      trackEvent('anonymous_auth_created', {
        uid: userCredential.user.uid
      })
    }
    return auth.currentUser.uid
  } catch (error) {
    console.error('Anonymous auth error:', error)
    throw error
  }
}

/**
 * Submit incident report anonymously
 */
export const submitReport = async (reportData) => {
  try {
    // Ensure anonymous authentication
    const userId = await ensureAnonymousAuth()
    
    const report = {
      ...reportData,
      userId,
      timestamp: new Date().toISOString(),
      createdAt: Timestamp.now(),
      verified: false,
      upvotes: 0,
      status: 'pending'
    }
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'incidents'), report)
    
    // Track in Analytics
    trackEvent('incident_reported', {
      incident_type: reportData.type,
      location: reportData.location,
      severity: reportData.severity || 'medium'
    })
    
    return { success: true, id: docRef.id, report }
  } catch (error) {
    console.error('Report submission error:', error)
    trackEvent('report_submission_error', {
      error: error.message
    })
    return { success: false, error: error.message }
  }
}

/**
 * Fetch recent incidents (last N hours)
 */
export const fetchRecentIncidents = async (hours = 24, useFirestore = false) => {
  try {
    if (!useFirestore) {
      // Use mock data for demo
      const { mockIncidents } = await import('../data/mockSafetyData')
      return mockIncidents
    }
    
    const cutoffTime = Timestamp.fromDate(
      new Date(Date.now() - hours * 60 * 60 * 1000)
    )
    
    const q = query(
      collection(db, 'incidents'),
      where('createdAt', '>=', cutoffTime),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return []
  }
}

/**
 * Upvote an incident (confirm it's real)
 */
export const upvoteIncident = async (incidentId) => {
  try {
    await ensureAnonymousAuth()
    
    const incidentRef = doc(db, 'incidents', incidentId)
    await updateDoc(incidentRef, {
      upvotes: increment(1)
    })
    
    trackEvent('incident_upvoted', {
      incident_id: incidentId
    })
    
    return { success: true }
  } catch (error) {
    console.error('Upvote error:', error)
    return { success: false, error: error.message }
  }
}
