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
