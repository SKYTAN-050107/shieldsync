import { calculateDistance } from '../utils/haversine'
import { trackEvent } from './firebase'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Malaysia bounding box (covers Peninsular + East Malaysia)
// south, west, north, east
const MY_BBOX = '0.85,99.60,7.50,119.30'

/**
 * Build Overpass QL query using a country-wide bounding box instead of a radius.
 * Fetches ALL police, hospitals and fire stations within the Malaysia bbox once.
 */
const buildOverpassQuery = () => {
  return `
    [out:json][timeout:60];
    (
      node["amenity"="police"](${MY_BBOX});
      way["amenity"="police"](${MY_BBOX});
      node["amenity"="hospital"](${MY_BBOX});
      way["amenity"="hospital"](${MY_BBOX});
      node["amenity"="fire_station"](${MY_BBOX});
      way["amenity"="fire_station"](${MY_BBOX});
    );
    out center body;
  `
}

/**
 * Map Overpass amenity type to our internal type
 */
const mapAmenityType = (amenity) => {
  const mapping = { police: 'police', hospital: 'hospital', fire_station: 'fire' }
  return mapping[amenity] || 'police'
}

// Simple in-memory cache so we only hit Overpass once per session
let _cache = null

/**
 * Fetch ALL emergency services in JB from Overpass, sort by distance, return top N.
 * @param {number} lat  User latitude
 * @param {number} lon  User longitude
 * @param {number} topN Maximum stations to return (default 10)
 */
export const fetchEmergencyServices = async (lat = 1.4927, lon = 103.7414, topN = 10) => {
  try {
    // Return cached data re-sorted for the new position
    if (_cache) {
      const sorted = _cache
        .map(s => ({ ...s, distance: calculateDistance(lat, lon, s.lat, s.lon) }))
        .sort((a, b) => a.distance - b.distance)
      return sorted.slice(0, topN)
    }

    const q = buildOverpassQuery()
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(q)}`
    })

    if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`)

    const json = await res.json()

    const allServices = json.elements
      .filter(el => el.tags?.amenity)
      .map((el) => {
        const type = mapAmenityType(el.tags.amenity)
        // For ways, Overpass returns center coords when using "out center"
        const elLat = el.lat ?? el.center?.lat
        const elLon = el.lon ?? el.center?.lon
        if (!elLat || !elLon) return null
        return {
          id: `osm_${el.id}`,
          name: el.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)} Station`,
          type,
          lat: elLat,
          lon: elLon,
          phone: el.tags?.phone || el.tags?.['contact:phone'] || '',
          address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || '',
          status: 'open24hr',
          responseTime: type === 'police' ? 8 : type === 'fire' ? 6 : 15,
        }
      })
      .filter(Boolean)

    // Store full set in cache
    _cache = allServices

    // Sort by distance and slice top N
    const sorted = allServices
      .map(s => ({ ...s, distance: calculateDistance(lat, lon, s.lat, s.lon) }))
      .sort((a, b) => a.distance - b.distance)

    trackEvent('emergency_services_loaded', { source: 'overpass', total: allServices.length, shown: Math.min(topN, sorted.length) })
    return sorted.slice(0, topN)
  } catch (error) {
    console.warn('Overpass API failed, using fallback mock data:', error.message)
    const { emergencyServices } = await import('../data/mockSafetyData')
    const services = emergencyServices
      .map(s => ({ ...s, distance: calculateDistance(lat, lon, s.lat, s.lon) }))
      .sort((a, b) => a.distance - b.distance)
    trackEvent('emergency_services_loaded', { source: 'mock_fallback', count: services.length })
    return services.slice(0, topN)
  }
}

/**
 * Get ALL cached services (unsliced) for filtering.
 * Returns empty array if Overpass hasn't been fetched yet.
 */
export const getAllCachedServices = (lat, lon) => {
  if (!_cache) return []
  return _cache
    .map(s => ({ ...s, distance: calculateDistance(lat, lon, s.lat, s.lon) }))
    .sort((a, b) => a.distance - b.distance)
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
