import { calculateDistance } from '../utils/haversine'
import { db, trackEvent } from './firebase'
import { collection, getDocs } from 'firebase/firestore'
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
 * Initiation emergency call
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
