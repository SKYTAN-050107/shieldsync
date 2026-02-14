import { db, auth, trackEvent } from './firebase'
import { 
  collection, addDoc, getDocs, updateDoc, doc,
  query, where, orderBy, limit, onSnapshot,
  Timestamp, arrayUnion, increment 
} from 'firebase/firestore'
import { ensureAuth } from './reportService'

/**
 * Fetch watch groups by postcode
 */
export const fetchWatchGroups = async (postcode, useFirestore = false) => {
  try {
    if (!useFirestore) {
      const { watchGroups } = await import('../data/mockSafetyData')
      return watchGroups.filter(g => 
        g.postcodes.includes(postcode) && g.active
      )
    }
    
    const q = query(
      collection(db, 'watchGroups'),
      where('postcodes', 'array-contains', postcode),
      where('active', '==', true)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching watch groups:', error)
    return []
  }
}

/**
 * Join a watch group
 */
export const joinWatchGroup = async (groupId) => {
  try {
    const userId = await ensureAuth()
    
    const groupRef = doc(db, 'watchGroups', groupId)
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      memberCount: increment(1)
    })
    
    trackEvent('watch_group_joined', {
      group_id: groupId
    })
    
    return { success: true }
  } catch (error) {
    console.error('Join group error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Post alert to watch group
 */
export const postAlert = async (groupId, alertData) => {
  try {
    const userId = await ensureAuth()
    
    const alert = {
      ...alertData,
      groupId,
      userId,
      timestamp: new Date().toISOString(),
      createdAt: Timestamp.now(),
      responses: []
    }
    
    const docRef = await addDoc(collection(db, 'groupAlerts'), alert)
    
    trackEvent('watch_alert_posted', {
      group_id: groupId,
      alert_type: alertData.type
    })
    
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Post alert error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Subscribe to real-time group alerts
 */
export const subscribeToGroupAlerts = (groupId, callback) => {
  const q = query(
    collection(db, 'groupAlerts'),
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  
  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(alerts)
  })
}

/**
 * Respond to alert ("watching", "safe", "confirmed")
 */
export const respondToAlert = async (alertId, response) => {
  try {
    const userId = await ensureAuth()
    
    const alertRef = doc(db, 'groupAlerts', alertId)
    await updateDoc(alertRef, {
      responses: arrayUnion({
        userId,
        response,
        timestamp: new Date().toISOString()
      })
    })
    
    trackEvent('alert_response', {
      alert_id: alertId,
      response_type: response
    })
    
    return { success: true }
  } catch (error) {
    console.error('Respond error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create new watch group
 */
export const createWatchGroup = async (groupData) => {
  try {
    const userId = await ensureAuth()
    
    const group = {
      ...groupData,
      creatorId: userId,
      members: [userId],
      memberCount: 1,
      active: true,
      createdAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, 'watchGroups'), group)
    
    trackEvent('watch_group_created', {
      area: groupData.area,
      postcodes: groupData.postcodes
    })
    
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Create group error:', error)
    return { success: false, error: error.message }
  }
}
