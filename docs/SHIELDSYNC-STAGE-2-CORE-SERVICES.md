# STAGE 2: CORE SAFETY SERVICES (4 Hours)

**Goal**: Build emergency services logic, anonymous reporting, safety analytics, and neighborhood watch system

---

## HOUR 1: Emergency Service Logic

### Tasks (60 min)
- [ ] Create emergencyService.js (40 min):
  ```javascript
  // src/services/emergencyService.js
  import { calculateDistance } from '../utils/haversine'
  import { db, trackEvent } from './firebase'
  import { collection, getDocs, query, where } from 'firebase/firestore'
  import { emergencyServices } from '../data/mockSafetyData'
  
  /**
   * Fetch emergency services (police, fire, hospitals)
   * @param {boolean} useFirestore - Use Firestore or mock data
   * @returns {Promise<Array>} List of emergency services
   */
  export const fetchEmergencyServices = async (useFirestore = false) => {
    try {
      if (!useFirestore) {
        // Use mock data for demo
        trackEvent('emergency_services_loaded', {
          source: 'mock',
          count: emergencyServices.length
        })
        return emergencyServices
      }
      
      // Fetch from Firestore in production
      const servicesSnapshot = await getDocs(collection(db, 'emergencyServices'))
      const services = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      trackEvent('emergency_services_loaded', {
        source: 'firestore',
        count: services.length
      })
      
      return services
    } catch (error) {
      console.error('Error fetching emergency services:', error)
      return emergencyServices // Fallback to mock data
    }
  }
  
  /**
   * Sort services by distance from user location
   */
  export const sortServicesByDistance = (services, userLat, userLon) => {
    return services
      .map(service => ({
        ...service,
        distance: calculateDistance(userLat, userLon, service.lat, service.lon)
      }))
      .sort((a, b) => a.distance - b.distance)
  }
  
  /**
   * Filter services by type
   * @param {string} type - 'police', 'fire', 'hospital', or 'all'
   */
  export const filterByType = (services, type) => {
    if (type === 'all') return services
    return services.filter(s => s.type === type)
  }
  
  /**
   * Get nearest service of specific type
   */
  export const getNearestByType = (services, userLat, userLon, type) => {
    const filtered = filterByType(services, type)
    const sorted = sortServicesByDistance(filtered, userLat, userLon)
    return sorted[0] || null
  }
  
  /**
   * Get emergency statistics
   */
  export const getEmergencyStats = (services) => {
    const stats = {
      total: services.length,
      police: services.filter(s => s.type === 'police').length,
      fire: services.filter(s => s.type === 'fire').length,
      hospitals: services.filter(s => s.type === 'hospital').length,
      open24hr: services.filter(s => s.status === 'open24hr').length,
      avgResponseTime: 0
    }
    
    // Calculate average response time
    const withResponseTime = services.filter(s => s.responseTime)
    if (withResponseTime.length > 0) {
      stats.avgResponseTime = Math.round(
        withResponseTime.reduce((sum, s) => sum + s.responseTime, 0) / 
        withResponseTime.length
      )
    }
    
    return stats
  }
  
  /**
   * Initiate emergency call
   */
  export const callEmergencyNumber = (service) => {
    trackEvent('emergency_call_initiated', {
      service_type: service.type,
      service_name: service.name
    })
    window.location.href = `tel:${service.phone}`
  }
  
  /**
   * Open navigation to service
   */
  export const navigateToService = (service) => {
    trackEvent('navigation_initiated', {
      service_type: service.type,
      service_name: service.name,
      distance: service.distance
    })
    const url = `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lon}`
    window.open(url, '_blank')
  }
  ```

- [ ] Keep haversine.js from SynCure (already works) (5 min)

- [ ] Update locationService.js for safety context (10 min):
  ```javascript
  // src/services/locationService.js
  import { DEFAULT_COORDINATES, JB_POSTCODES } from '../utils/constants'
  import { trackEvent } from './firebase'
  
  export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
          
          trackEvent('location_detected', {
            accuracy: location.accuracy
          })
          
          resolve(location)
        },
        (error) => {
          trackEvent('location_error', {
            error: error.message
          })
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      )
    })
  }
  
  export const getPostcodeCoordinates = (postcode) => {
    // Map JB postcodes to approximate coordinates
    const postcodeMap = {
      '81200': DEFAULT_COORDINATES.taman_molek,
      '80100': DEFAULT_COORDINATES.jb_center,
      '80300': DEFAULT_COORDINATES.tebrau,
      '81300': DEFAULT_COORDINATES.skudai
    }
    
    return postcodeMap[postcode] || DEFAULT_COORDINATES.jb_center
  }
  
  export const validateJohorPostcode = (postcode) => {
    return JB_POSTCODES.includes(postcode)
  }
  ```

- [ ] Test services in console (5 min)

### Deliverables
- ✅ Emergency services fetching
- ✅ Distance-based sorting
- ✅ Call and navigate functions
- ✅ Stats calculation
- ✅ Analytics tracking

---

## HOUR 2: Anonymous Reporting Service

### Tasks (60 min)
- [ ] Create reportService.js with Firebase Auth (50 min):
  ```javascript
  // src/services/reportService.js
  import { db, auth, trackEvent } from './firebase'
  import { 
    collection, addDoc, getDocs, updateDoc, doc,
    query, where, orderBy, limit, Timestamp 
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
      // In production: use Firestore transactions to prevent race conditions
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
  
  /**
   * Get incidents near a location
   */
  export const getIncidentsNearLocation = (incidents, lat, lon, radiusKm = 5) => {
    const { calculateDistance } = require('../utils/haversine')
    
    return incidents
      .map(incident => ({
        ...incident,
        distance: calculateDistance(lat, lon, incident.lat, incident.lon)
      }))
      .filter(incident => incident.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
  }
  ```

- [ ] Add voice input utility (optional, 10 min):
  ```javascript
  // src/utils/voiceInput.js
  export const startVoiceInput = (onResult, onError) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      onError('Voice input not supported in this browser')
      return null
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US' // Can add 'ms-MY' for Malay
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }
    
    recognition.onerror = (event) => {
      onError(event.error)
    }
    
    recognition.start()
    return recognition
  }
  
  export const stopVoiceInput = (recognition) => {
    if (recognition) {
      recognition.stop()
    }
  }
  ```

### Deliverables
- ✅ Anonymous Firebase Auth working
- ✅ Report submission to Firestore
- ✅ Incident fetching with time filter
- ✅ Upvote functionality
- ✅ Voice input utility (UI ready)

---

## HOUR 3: Safety Analytics & AI Prediction

### Tasks (60 min)
- [ ] Create safetyAnalytics.js (45 min):
  ```javascript
  // src/services/safetyAnalytics.js
  import { calculateDistance } from '../utils/haversine'
  import { trackEvent } from './firebase'
  
  /**
   * Calculate safety score for a location (0-10 scale)
   * Higher score = safer area
   */
  export const calculateSafetyScore = (location, incidents, emergencyServices) => {
    const factors = {
      incidentDensity: calculateIncidentDensity(location, incidents),
      emergencyProximity: calculateEmergencyProximity(location, emergencyServices),
      recentActivity: calculateRecentActivity(incidents),
      timeOfDay: getTimeOfDayRisk()
    }
    
    // Weighted scoring (lower factor value = safer)
    const weights = {
      incidentDensity: 0.4,    // 40% weight
      emergencyProximity: 0.3, // 30% weight
      recentActivity: 0.2,     // 20% weight
      timeOfDay: 0.1           // 10% weight
    }
    
    // Calculate weighted risk (0-1, lower is better)
    const totalRisk = Object.keys(factors).reduce((sum, key) => 
      sum + (factors[key] * weights[key]), 0
    )
    
    // Convert to safety score (0-10, higher is better)
    const safetyScore = Math.max(0, Math.min(10, 10 - (totalRisk * 10)))
    
    trackEvent('safety_score_calculated', {
      score: safetyScore.toFixed(1),
      risk_level: safetyScore < 4 ? 'high' : safetyScore < 7 ? 'medium' : 'low'
    })
    
    return {
      score: parseFloat(safetyScore.toFixed(1)),
      breakdown: factors,
      risk: safetyScore < 4 ? 'high' : safetyScore < 7 ? 'medium' : 'low'
    }
  }
  
  /**
   * Calculate incident density (0-1, higher = more dangerous)
   */
  const calculateIncidentDensity = (location, incidents) => {
    const nearbyIncidents = incidents.filter(incident => {
      const distance = calculateDistance(
        location.lat, location.lon,
        incident.lat, incident.lon
      )
      return distance < 2 // 2km radius
    })
    
    // Normalize: 0 incidents = 0, 10+ incidents = 1
    return Math.min(1, nearbyIncidents.length / 10)
  }
  
  /**
   * Calculate emergency service proximity (0-1, higher = farther)
   */
  const calculateEmergencyProximity = (location, services) => {
    const policeStations = services.filter(s => s.type === 'police')
    
    if (policeStations.length === 0) return 1 // Worst case
    
    const distances = policeStations.map(station => 
      calculateDistance(location.lat, location.lon, station.lat, station.lon)
    )
    
    const nearest = Math.min(...distances)
    
    // 0km = 0 (best), 10km+ = 1 (worst)
    return Math.min(1, nearest / 10)
  }
  
  /**
   * Calculate recent activity level (0-1, higher = more active)
   */
  const calculateRecentActivity = (incidents) => {
    const now = Date.now()
    const last24Hours = incidents.filter(inc => {
      const incTime = new Date(inc.timestamp).getTime()
      const hoursDiff = (now - incTime) / (1000 * 60 * 60)
      return hoursDiff < 24
    })
    
    // 0 incidents = 0, 5+ = 1
    return Math.min(1, last24Hours.length / 5)
  }
  
  /**
   * Get time-of-day risk factor (0-1, higher = riskier)
   */
  const getTimeOfDayRisk = () => {
    const hour = new Date().getHours()
    
    // Peak crime hours in JB: 8-11PM
    if (hour >= 20 && hour <= 23) return 0.9 // High risk
    // Early morning: 12-5AM
    if (hour >= 0 && hour <= 5) return 0.7   // Medium-high
    // Daytime: 9AM-5PM
    if (hour >= 9 && hour <= 17) return 0.2  // Low risk
    // Evening: 6-8PM
    return 0.5 // Medium
  }
  
  /**
   * Generate safety insights and recommendations
   */
  export const generateSafetyInsights = (location, incidents, services, safetyScore) => {
    const insights = []
    
    // Incident-based warnings
    const nearbyIncidents = incidents.filter(inc => {
      const distance = calculateDistance(location.lat, location.lon, inc.lat, inc.lon)
      return distance < 1 // 1km radius
    })
    
    if (nearbyIncidents.length > 0) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        message: `${nearbyIncidents.length} incident(s) reported within 1km in last 24 hours`
      })
    }
    
    // Emergency service proximity
    const policeStations = services.filter(s => s.type === 'police')
    if (policeStations.length > 0) {
      const nearest = policeStations
        .map(s => ({
          ...s,
          distance: calculateDistance(location.lat, location.lon, s.lat, s.lon)
        }))
        .sort((a, b) => a.distance - b.distance)[0]
      
      if (nearest.distance < 2) {
        insights.push({
          type: 'safe',
          icon: '🟢',
          message: `${nearest.name} is ${nearest.distance.toFixed(1)}km away`
        })
      } else {
        insights.push({
          type: 'alert',
          icon: '🚨',
          message: `Nearest police station is ${nearest.distance.toFixed(1)}km away`
        })
      }
    }
    
    // Time-based recommendations
    const hour = new Date().getHours()
    if (hour >= 20 && hour <= 23) {
      insights.push({
        type: 'alert',
        icon: '🚨',
        message: 'Peak snatch theft hours (8-11PM). Stay vigilant and avoid dark areas.'
      })
    }
    
    return insights
  }
  
  /**
   * Predict risk trend
   */
  export const predictRiskTrend = (incidents) => {
    const now = Date.now()
    const msPerDay = 24 * 60 * 60 * 1000
    
    // Count incidents in last 7 days vs previous 7 days
    const thisWeek = incidents.filter(inc => {
      const time = new Date(inc.timestamp).getTime()
      return time > now - 7 * msPerDay
    })
    
    const lastWeek = incidents.filter(inc => {
      const time = new Date(inc.timestamp).getTime()
      return time > now - 14 * msPerDay && time <= now - 7 * msPerDay
    })
    
    if (thisWeek.length > lastWeek.length * 1.2) {
      return 'increasing'
    } else if (thisWeek.length < lastWeek.length * 0.8) {
      return 'decreasing'
    }
    return 'stable'
  }
  ```

- [ ] Create aiSafetyInsights.js (10 min):
  ```javascript
  // src/services/aiSafetyInsights.js
  import { 
    calculateSafetyScore, 
    generateSafetyInsights,
    predictRiskTrend 
  } from './safetyAnalytics'
  
  /**
   * Generate AI-powered safety alerts
   */
  export const generateAIAlerts = (location, incidents, services) => {
    const safetyAnalysis = calculateSafetyScore(location, incidents, services)
    const insights = generateSafetyInsights(location, incidents, services, safetyAnalysis.score)
    const trend = predictRiskTrend(incidents)
    
    // Find nearest police station (safe shelter)
    const police = services
      .filter(s => s.type === 'police')
      .sort((a, b) => a.distance - b.distance)[0]
    
    return {
      overallSafety: {
        score: safetyAnalysis.score,
        risk: safetyAnalysis.risk,
        message: getRiskMessage(safetyAnalysis.risk),
        trend
      },
      nearestShelter: police,
      recommendations: insights,
      safestRoute: {
        suggestion: 'Stay on main roads with good lighting',
        avoid: incidents
          .filter(inc => inc.severity === 'high')
          .map(inc => inc.location)
      }
    }
  }
  
  const getRiskMessage = (risk) => {
    const messages = {
      low: '✅ Low risk area. Enjoy your day safely!',
      medium: '⚠️ Moderate risk. Stay alert and avoid dark areas.',
      high: '🚨 High risk detected. Consider alternate routes or travel in groups.'
    }
    return messages[risk] || messages.medium
  }
  ```

- [ ] Test safety scoring (5 min)

### Deliverables
- ✅ Safety score calculation (0-10)
- ✅ Multi-factor risk analysis
- ✅ Safety insights generation
- ✅ Risk trend prediction
- ✅ AI alerts system

---

## HOUR 4: Neighborhood Watch Service

### Tasks (60 min)
- [ ] Create watchService.js (55 min):
  ```javascript
  // src/services/watchService.js
  import { db, auth, trackEvent } from './firebase'
  import { 
    collection, addDoc, getDocs, updateDoc, doc,
    query, where, orderBy, limit, onSnapshot,
    Timestamp, arrayUnion 
  } from 'firebase/firestore'
  import { ensureAnonymousAuth } from './reportService'
  
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
      const userId = await ensureAnonymousAuth()
      
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
      const userId = await ensureAnonymousAuth()
      
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
      const userId = await ensureAnonymousAuth()
      
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
      const userId = await ensureAnonymousAuth()
      
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
  ```

- [ ] Test watch group functions (5 min)

### Deliverables
- ✅ Watch group fetching by postcode
- ✅ Join/leave group functionality
- ✅ Alert posting
- ✅ Real-time alert subscription
- ✅ Group creation

---

## Stage 2 Checkpoint

### What You Should Have Now:
1. ✅ Emergency service logic (fetch, sort, filter)
2. ✅ Call and navigate functions
3. ✅ Anonymous Firebase Auth
4. ✅ Incident reporting system
5. ✅ Safety score calculation (0-10 scale)
6. ✅ AI-powered safety insights
7. ✅ Risk trend prediction
8. ✅ Neighborhood watch groups
9. ✅ Real-time alerts system
10. ✅ Analytics event tracking

### Services Created:
```
src/services/
├── firebase.js                # ✅ Firebase config with Auth/Analytics
├── emergencyService.js        # ✅ Emergency services logic
├── reportService.js           # ✅ Anonymous incident reporting
├── safetyAnalytics.js         # ✅ Safety scoring & insights
├── aiSafetyInsights.js        # ✅ AI predictions
└── watchService.js            # ✅ Neighborhood watch
```

### Test Services (Browser Console):
```javascript
// Test emergency services
import { fetchEmergencyServices, getNearestByType } from './services/emergencyService'
const services = await fetchEmergencyServices()
console.log('Nearest police:', getNearestByType(services, 1.5, 103.7, 'police'))

// Test anonymous auth + reporting
import { submitReport } from './services/reportService'
const result = await submitReport({
  type: 'Snatch Theft',
  location: 'Plaza Pelangi',
  lat: 1.5389,
  lon: 103.7820,
  description: 'Test report'
})
console.log('Report:', result)

// Test safety scoring
import { calculateSafetyScore } from './services/safetyAnalytics'
const score = calculateSafetyScore(
  { lat: 1.5, lon: 103.7 },
  mockIncidents,
  services
)
console.log('Safety Score:', score)
```

### Next Stage Preview:
Stage 3 will build all UI components - HomeScreen (emergency finder), SafetyMap (interactive SVG), ReportModal, Watch Groups, and complete the demo-ready interface.

---

**Estimated Time**: 4 hours  
**Difficulty**: ⭐⭐⭐ (Medium - Firebase Auth integration)  
**Dependencies**: Stage 1 complete (Firebase configured, mock data ready)
