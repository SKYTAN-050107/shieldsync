# STAGE 3: UI COMPONENTS & SCREENS (5 Hours)

**Goal**: Build emergency-focused UI with panic button, interactive safety map, report modal, and watch groups

---

## HOUR 1: HomeScreen - Emergency Finder

### Tasks (60 min)
- [ ] Transform HomeScreen.jsx for emergency context (55 min):
  ```jsx
  // src/screens/HomeScreen.jsx
  import { useState, useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { getUserLocation } from '../services/locationService'
  import { 
    fetchEmergencyServices, 
    getNearestByType,
    callEmergencyNumber 
  } from '../services/emergencyService'
  import { trackEvent } from '../services/firebase'
  
  export default function HomeScreen() {
    const navigate = useNavigate()
    const [location, setLocation] = useState(null)
    const [postcode, setPostcode] = useState('81200')
    const [nearest, setNearest] = useState({})
    const [loading, setLoading] = useState(true)
    const [recentIncidents, setRecentIncidents] = useState(3)
    
    useEffect(() => {
      loadEmergencyServices()
      trackEvent('home_screen_viewed')
    }, [])
    
    const loadEmergencyServices = async () => {
      try {
        // Get user location
        const loc = await getUserLocation().catch(() => ({
          lat: 1.4927,
          lon: 103.7414,
          postcode: '80100'
        }))
        setLocation(loc)
        setPostcode(loc.postcode || '81200')
        
        // Fetch services
        const services = await fetchEmergencyServices()
        
        // Get nearest of each type
        setNearest({
          police: getNearestByType(services, loc.lat, loc.lon, 'police'),
          fire: getNearestByType(services, loc.lat, loc.lon, 'fire'),
          hospital: getNearestByType(services, loc.lat, loc.lon, 'hospital')
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Load error:', error)
        setLoading(false)
      }
    }
    
    const handlePanicButton = () => {
      trackEvent('panic_button_pressed')
      window.location.href = 'tel:999'
    }
    
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-600 
                       flex items-center justify-center">
          <div className="text-white text-2xl font-montserrat font-bold">
            🚨 Loading Emergency Services...
          </div>
        </div>
      )
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-orange-600 pb-24">
        {/* GPS Live Indicator */}
        <div className="flex items-center gap-2 px-6 pt-6">
          <div className="relative">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 h-3 w-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <span className="text-white font-inter text-sm font-medium">
            📍 LIVE: {postcode} Taman Molek
          </span>
        </div>
        
        {/* Hero Section */}
        <div className="px-6 pt-12 pb-8">
          <h1 className="font-montserrat font-black text-5xl md:text-6xl 
                        text-white leading-tight mb-4">
            🚨 EMERGENCY SERVICES NEARBY
          </h1>
          <p className="text-red-100 font-inter text-lg">
            Find nearest police, fire stations & hospitals in Johor Bahru
          </p>
        </div>
        
        {/* Quick Emergency Cards */}
        <div className="px-6 space-y-4 mb-8">
          {/* Police Card */}
          {nearest.police && (
            <div className="glass-alert rounded-2xl p-5 border-2 border-trust-600 
                           hover-lift cursor-pointer"
                 onClick={() => navigate('/safety-map')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">🚓</div>
                  <div>
                    <h3 className="font-inter font-bold text-xl text-gray-900">
                      {nearest.police.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      📍 {nearest.police.distance?.toFixed(1)} km away
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-safe-100 
                               rounded-full border-2 border-safe-600">
                  <div className="h-2 w-2 bg-safe-600 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-safe-700">Open 24hr</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  callEmergencyNumber(nearest.police)
                }}
                className="w-full py-3 bg-gradient-to-r from-trust-600 to-trust-700
                         text-white font-bold rounded-xl hover:scale-105 
                         transition-transform shadow-lg">
                📞 Call {nearest.police.phone}
              </button>
            </div>
          )}
          
          {/* Fire Card */}
          {nearest.fire && (
            <div className="glass-alert rounded-2xl p-5 border-2 border-warning-600 
                           hover-lift cursor-pointer"
                 onClick={() => navigate('/safety-map')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">🚒</div>
                  <div>
                    <h3 className="font-inter font-bold text-xl text-gray-900">
                      {nearest.fire.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      📍 {nearest.fire.distance?.toFixed(1)} km away
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-safe-100 
                               rounded-full border-2 border-safe-600">
                  <div className="h-2 w-2 bg-safe-600 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-safe-700">Open 24hr</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  callEmergencyNumber(nearest.fire)
                }}
                className="w-full py-3 bg-gradient-to-r from-warning-600 to-warning-700
                         text-white font-bold rounded-xl hover:scale-105 
                         transition-transform shadow-lg">
                📞 Call {nearest.fire.phone}
              </button>
            </div>
          )}
        </div>
        
        {/* Incident Alert Ticker */}
        <div className="px-6 mb-8">
          <div className="glass-alert rounded-xl p-4 border-2 border-yellow-400">
            <p className="text-gray-800 font-inter flex items-center gap-2">
              <span className="text-2xl animate-pulse">⚠️</span>
              <span className="font-semibold">
                {recentIncidents} incidents reported in last hour
              </span>
            </p>
          </div>
        </div>
        
        {/* Primary Action Buttons */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/safety-map')}
            className="py-4 bg-white text-red-600 font-bold rounded-xl
                     border-4 border-red-600 hover:bg-red-50
                     transition-colors shadow-xl">
            🗺️ Safety Map
          </button>
          
          <button
            onClick={() => navigate('/report')}
            className="py-4 bg-gradient-to-r from-warning-600 to-warning-700
                     text-white font-bold rounded-xl hover:scale-105
                     transition-transform shadow-xl">
            📲 Report Incident
          </button>
        </div>
        
        {/* Panic Button (Floating) */}
        <button
          onClick={handlePanicButton}
          className="fixed bottom-24 md:bottom-8 right-8 z-50
                   h-20 w-20 bg-gradient-to-r from-danger-600 to-danger-700
                   rounded-full shadow-2xl emergency-glow
                   flex items-center justify-center text-5xl
                   hover:scale-110 transition-transform panic-pulse">
          🚨
        </button>
      </div>
    )
  }
  ```

- [ ] Test HomeScreen rendering (5 min)

### Deliverables
- ✅ Emergency-focused hero screen
- ✅ Nearest police/fire cards with call buttons
- ✅ Incident alert ticker
- ✅ Panic button (floating, pulsing)
- ✅ Navigation to map/report screens

---

## HOUR 2: SafetyMap Component (SVG)

### Tasks (60 min)
- [ ] Create SafetyMap.jsx with emergency pins (55 min):
  ```jsx
  // src/components/SafetyMap.jsx
  import { calculateDistance } from '../utils/haversine'
  
  export default function SafetyMap({ 
    userLocation, 
    emergencyServices = [], 
    incidents = [],
    onSelectService,
    onSelectIncident 
  }) {
    const mapWidth = 500
    const mapHeight = 500
    
    const toSVGCoords = (lat, lon) => {
      if (!userLocation) return { x: mapWidth / 2, y: mapHeight / 2 }
      
      const centerLat = userLocation.lat
      const centerLon = userLocation.lon
      const scale = 8000 // Adjust zoom level
      
      return {
        x: (lon - centerLon) * scale + mapWidth / 2,
        y: (centerLat - lat) * scale + mapHeight / 2
      }
    }
    
    const getServiceColor = (type) => {
      const colors = {
        police: '#1D4ED8',   // trust-blue
        fire: '#D97706',     // warning-orange
        hospital: '#059669'  // safe-green
      }
      return colors[type] || colors.police
    }
    
    const getServiceIcon = (type) => {
      const icons = {
        police: '🚓',
        fire: '🚒',
        hospital: '🏥'
      }
      return icons[type] || '📍'
    }
    
    if (!userLocation) {
      return (
        <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      )
    }
    
    return (
      <svg 
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50
                   rounded-2xl shadow-2xl border-2 border-gray-200"
      >
        {/* Grid Background */}
        <defs>
          <pattern id="safety-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
          
          {/* Danger Zone Gradient */}
          <radialGradient id="danger-zone">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
          
          {/* Safe Zone Gradient */}
          <radialGradient id="safe-zone">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <rect width={mapWidth} height={mapHeight} fill="url(#safety-grid)" />
        
        {/* Danger Zones (Incident Clusters) */}
        {incidents.map((incident, i) => {
          const coords = toSVGCoords(incident.lat, incident.lon)
          return (
            <circle
              key={`danger-zone-${i}`}
              cx={coords.x}
              cy={coords.y}
              r="80"
              fill="url(#danger-zone)"
              opacity="0.6"
            />
          )
        })}
        
        {/* Safe Zones (Near Police Stations) */}
        {emergencyServices
          .filter(s => s.type === 'police')
          .map((service, i) => {
            const coords = toSVGCoords(service.lat, service.lon)
            return (
              <circle
                key={`safe-zone-${i}`}
                cx={coords.x}
                cy={coords.y}
                r="100"
                fill="url(#safe-zone)"
                opacity="0.5"
              />
            )
          })}
        
        {/* Connection Lines (User to Nearest Services) */}
        {emergencyServices.slice(0, 3).map((service, i) => {
          const userCoords = toSVGCoords(userLocation.lat, userLocation.lon)
          const serviceCoords = toSVGCoords(service.lat, service.lon)
          const color = getServiceColor(service.type)
          
          return (
            <path
              key={`line-${service.id}`}
              d={`M ${userCoords.x} ${userCoords.y} 
                  Q ${(userCoords.x + serviceCoords.x) / 2} 
                    ${Math.min(userCoords.y, serviceCoords.y) - 50}
                    ${serviceCoords.x} ${serviceCoords.y}`}
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 4"
              opacity="0.6"
            />
          )
        })}
        
        {/* User Pin (YOU) */}
        <g transform={`translate(${mapWidth/2}, ${mapHeight/2})`}>
          <circle r="18" fill="#DC2626" className="animate-pulse" />
          <circle r="14" fill="#FEE2E2" />
          <text 
            y="6" 
            textAnchor="middle" 
            className="text-sm font-bold fill-danger-700"
            style={{ fontSize: '12px' }}
          >
            YOU
          </text>
        </g>
        
        {/* Emergency Service Pins */}
        {emergencyServices.map((service, i) => {
          const coords = toSVGCoords(service.lat, service.lon)
          const color = getServiceColor(service.type)
          const icon = getServiceIcon(service.type)
          
          return (
            <g 
              key={service.id}
              transform={`translate(${coords.x}, ${coords.y})`}
              className="cursor-pointer hover:scale-125 transition-transform"
              onClick={() => onSelectService?.(service)}
            >
              {/* Pin Shadow */}
              <circle r="14" fill="black" opacity="0.2" cy="2" />
              
              {/* Pin Body */}
              <circle r="12" fill={color} className="drop-shadow-lg" />
              <circle r="8" fill="white" opacity="0.4" />
              
              {/* Number Badge */}
              <circle cx="14" cy="-14" r="10" fill="white" stroke={color} strokeWidth="2" />
              <text 
                x="14" 
                y="-10" 
                textAnchor="middle"
                className="text-xs font-bold"
                fill={color}
                style={{ fontSize: '10px' }}
              >
                {i + 1}
              </text>
            </g>
          )
        })}
        
        {/* Incident Markers */}
        {incidents.map((incident, i) => {
          const coords = toSVGCoords(incident.lat, incident.lon)
          
          return (
            <g
              key={incident.id}
              transform={`translate(${coords.x}, ${coords.y})`}
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onSelectIncident?.(incident)}
            >
              {/* Pulsing Alert Ring */}
              <circle 
                r="16" 
                fill="none" 
                stroke="#DC2626" 
                strokeWidth="2"
                className="incident-ping"
              />
              
              {/* Warning Icon */}
              <circle r="10" fill="#DC2626" />
              <circle r="6" fill="#FEE2E2" opacity="0.8" />
              <text 
                y="4" 
                textAnchor="middle"
                style={{ fontSize: '12px' }}
              >
                ⚠️
              </text>
            </g>
          )
        })}
        
        {/* Legend */}
        <g transform="translate(15, 15)">
          <rect width="150" height="110" fill="white" opacity="0.95" rx="8" />
          
          <circle cx="25" cy="25" r="6" fill="#1D4ED8" />
          <text x="40" y="29" className="text-xs fill-gray-700" style={{ fontSize: '11px' }}>
            Police Station
          </text>
          
          <circle cx="25" cy="45" r="6" fill="#D97706" />
          <text x="40" y="49" className="text-xs fill-gray-700" style={{ fontSize: '11px' }}>
            Fire Station
          </text>
          
          <circle cx="25" cy="65" r="6" fill="#DC2626" />
          <text x="40" y="69" className="text-xs fill-gray-700" style={{ fontSize: '11px' }}>
            Incident
          </text>
          
          <circle cx="25" cy="85" r="6" fill="#059669" opacity="0.5" />
          <text x="40" y="89" className="text-xs fill-gray-700" style={{ fontSize: '11px' }}>
            Safe Zone
          </text>
        </g>
      </svg>
    )
  }
  ```

- [ ] Test map rendering with mock data (5 min)

### Deliverables
- ✅ Interactive SVG safety map
- ✅ User pin (YOU, pulsing)
- ✅ Emergency service pins (colored by type)
- ✅ Incident markers (pulsing warnings)
- ✅ Safe/danger zone overlays
- ✅ Connection lines to nearest services
- ✅ Click handlers for pins

---

## HOUR 3: EmergencyCard & IncidentCard Components

### Tasks (60 min)
- [ ] Create EmergencyCard.jsx (30 min):
  ```jsx
  // src/components/EmergencyCard.jsx
  export default function EmergencyCard({ service, onCall, onNavigate }) {
    const typeConfig = {
      police: {
        icon: '🚓',
        borderColor: 'border-trust-600',
        bgColor: 'bg-trust-50',
        gradientFrom: 'from-trust-600',
        gradientTo: 'to-trust-700'
      },
      fire: {
        icon: '🚒',
        borderColor: 'border-warning-600',
        bgColor: 'bg-warning-50',
        gradientFrom: 'from-warning-600',
        gradientTo: 'to-warning-700'
      },
      hospital: {
        icon: '🏥',
        borderColor: 'border-safe-600',
        bgColor: 'bg-safe-50',
        gradientFrom: 'from-safe-600',
        gradientTo: 'to-safe-700'
      }
    }
    
    const config = typeConfig[service.type] || typeConfig.police
    
    return (
      <div className={`glass-alert rounded-2xl p-5 border-2 ${config.borderColor}
                      hover-lift cursor-pointer transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{config.icon}</div>
            <div>
              <h3 className="font-inter font-bold text-xl text-gray-900">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {service.address}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="px-3 py-1 bg-safe-100 rounded-full border-2 border-safe-600
                         flex items-center gap-2 shrink-0">
            <div className="h-2 w-2 bg-safe-600 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-safe-700">
              {service.status || 'Open 24hr'}
            </span>
          </div>
        </div>
        
        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">📍</div>
            <div className="text-xs text-gray-600 mb-1">Distance</div>
            <div className="font-bold text-gray-900">
              {service.distance?.toFixed(1)} km
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-xs text-gray-600 mb-1">Response</div>
            <div className="font-bold text-gray-900">
              ~{service.responseTime || 10} min
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">📞</div>
            <div className="text-xs text-gray-600 mb-1">
              {service.type === 'hospital' ? 'Wait' : 'Today'}
            </div>
            <div className="font-bold text-gray-900">
              {service.callsToday || service.emergencyWait || 0}
              {service.type === 'hospital' ? 'min' : ''}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onCall(service)}
            className={`py-3 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}
                       text-white font-bold rounded-xl hover:scale-105
                       transition-transform shadow-lg`}
          >
            📞 Call Now
          </button>
          
          <button
            onClick={() => onNavigate(service)}
            className="py-3 bg-white border-2 border-gray-300 text-gray-700 
                     font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            🗺️ Navigate
          </button>
        </div>
      </div>
    )
  }
  ```

- [ ] Create IncidentCard.jsx (25 min):
  ```jsx
  // src/components/IncidentCard.jsx
  export default function IncidentCard({ incident, onUpvote }) {
    const severityConfig = {
      high: {
        border: 'border-danger-500',
        bg: 'bg-danger-50',
        text: 'text-danger-700'
      },
      medium: {
        border: 'border-warning-500',
        bg: 'bg-warning-50',
        text: 'text-warning-700'
      },
      low: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-50',
        text: 'text-yellow-700'
      }
    }
    
    const config = severityConfig[incident.severity] || severityConfig.medium
    
    const timeAgo = (timestamp) => {
      const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000)
      if (seconds < 60) return `${seconds}s ago`
      const minutes = Math.floor(seconds / 60)
      if (minutes < 60) return `${minutes}min ago`
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}hr ago`
      return `${Math.floor(hours / 24)}d ago`
    }
    
    return (
      <div className={`glass-alert rounded-xl p-4 border-2 ${config.border} ${config.bg}`}>
        <div className="flex items-start gap-3">
          <div className="text-3xl">⚠️</div>
          
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-inter font-bold text-gray-900">
                {incident.type}
              </h4>
              <span className="text-xs text-gray-500">
                {timeAgo(incident.timestamp)}
              </span>
              {incident.verified && (
                <span className="text-xs bg-safe-100 text-safe-700 
                               px-2 py-0.5 rounded-full font-bold">
                  ✅ Verified
                </span>
              )}
            </div>
            
            {/* Location */}
            <p className="text-sm text-gray-700 mb-2">
              📍 {incident.location}
            </p>
            
            {/* Description */}
            {incident.description && (
              <p className="text-sm text-gray-600 italic mb-3">
                "{incident.description}"
              </p>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onUpvote(incident.id)}
                className="flex items-center gap-2 text-sm text-gray-600 
                         hover:text-trust-600 transition-colors"
              >
                <span>👍</span>
                <span className="font-semibold">
                  {incident.upvotes || 0} confirmed
                </span>
              </button>
              
              {incident.distance && (
                <span className="text-xs text-gray-500">
                  {incident.distance.toFixed(1)}km away
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] Test both card components (5 min)

### Deliverables
- ✅ EmergencyCard with call/navigate buttons
- ✅ Color-coded by service type
- ✅ IncidentCard with upvote functionality
- ✅ Time-ago formatting
- ✅ Verified badges

---

## HOUR 4: ReportModal & WatchGroupWidget

### Tasks (60 min)
- [ ] Create ReportModal.jsx (35 min):
  ```jsx
  // src/components/ReportModal.jsx
  import { useState } from 'react'
  import { submitReport } from '../services/reportService'
  import { INCIDENT_TYPES } from '../utils/constants'
  import { trackEvent } from '../services/firebase'
  
  export default function ReportModal({ isOpen, onClose, userLocation }) {
    const [formData, setFormData] = useState({
      type: 'Snatch Theft',
      location: '',
      description: '',
      severity: 'medium'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    
    const handleSubmit = async () => {
      if (!formData.description.trim()) {
        alert('Please describe what happened')
        return
      }
      
      setIsSubmitting(true)
      
      const result = await submitReport({
        ...formData,
        lat: userLocation?.lat || 1.4927,
        lon: userLocation?.lon || 103.7414,
        postcode: userLocation?.postcode || '81200'
      })
      
      setIsSubmitting(false)
      
      if (result.success) {
        setSubmitted(true)
        trackEvent('incident_report_submitted', {
          type: formData.type,
          severity: formData.severity
        })
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setFormData({
            type: 'Snatch Theft',
            location: '',
            description: '',
            severity: 'medium'
          })
        }, 2000)
      } else {
        alert('Failed to submit report. Please try again.')
      }
    }
    
    if (!isOpen) return null
    
    if (submitted) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="glass-alert rounded-3xl p-12 max-w-md mx-4 text-center">
            <div className="text-7xl mb-4">✅</div>
            <h2 className="font-montserrat font-black text-3xl text-gray-900 mb-3">
              Report Submitted!
            </h2>
            <p className="text-gray-600">
              Thank you for keeping Johor Bahru safe. Your anonymous report 
              has been shared with the community.
            </p>
          </div>
        </div>
      )
    }
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black bg-opacity-60 backdrop-blur-sm px-4">
        
        <div className="glass-alert rounded-3xl p-6 md:p-8 max-w-md w-full
                       border-2 border-warning-500 shadow-2xl max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-montserrat font-black text-2xl text-gray-900">
              📱 Report Incident
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Anonymous Badge */}
          <div className="bg-safe-100 border-2 border-safe-600 rounded-lg p-3 mb-6">
            <p className="text-sm text-safe-800 flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <span className="font-semibold">
                100% Anonymous - No login required
              </span>
            </p>
          </div>
          
          {/* Form */}
          <div className="space-y-4">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🚨 Incident Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300
                         focus:border-warning-500 focus:ring-2 focus:ring-warning-200
                         font-inter"
              >
                {INCIDENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📍 Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Plaza Pelangi parking lot"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300
                         focus:border-warning-500 focus:ring-2 focus:ring-warning-200"
              />
            </div>
            
            {/* Severity */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ⚠️ Severity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(severity => (
                  <button
                    key={severity}
                    onClick={() => setFormData({...formData, severity})}
                    className={`py-2 rounded-lg font-semibold capitalize
                               transition-all ${
                      formData.severity === severity
                        ? 'bg-warning-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                💬 What happened?
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the incident in detail..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300
                         focus:border-warning-500 focus:ring-2 focus:ring-warning-200
                         resize-none"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={onClose}
              className="py-3 bg-gray-200 text-gray-700 font-bold rounded-xl
                       hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.description.trim()}
              className="py-3 bg-gradient-to-r from-warning-600 to-danger-600
                       text-white font-bold rounded-xl hover:scale-105
                       transition-transform shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:scale-100"
            >
              {isSubmitting ? '⏳ Sending...' : '🚨 Submit Report'}
            </button>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] Create WatchGroupWidget.jsx (20 min):
  ```jsx
  // src/components/WatchGroupWidget.jsx
  import { useState, useEffect } from 'react'
  import { fetchWatchGroups, joinWatchGroup } from '../services/watchService'
  import { trackEvent } from '../services/firebase'
  
  export default function WatchGroupWidget({ postcode }) {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
      loadGroups()
    }, [postcode])
    
    const loadGroups = async () => {
      setLoading(true)
      const groupList = await fetchWatchGroups(postcode)
      setGroups(groupList)
      setLoading(false)
    }
    
    const handleJoin = async (groupId) => {
      const result = await joinWatchGroup(groupId)
      if (result.success) {
        alert('✅ Joined watch group! You\'ll receive alerts for this area.')
        trackEvent('watch_group_joined', { group_id: groupId })
        loadGroups() // Refresh to show updated member count
      } else {
        alert('Failed to join group. Please try again.')
      }
    }
    
    if (loading) {
      return <div className="text-center py-8 text-gray-500">Loading watch groups...</div>
    }
    
    return (
      <div className="glass-alert rounded-2xl p-6 border-2 border-safe-600">
        <h3 className="font-montserrat font-bold text-xl mb-4 flex items-center gap-2">
          🌐 Neighborhood Watch
        </h3>
        
        {groups.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-gray-600 mb-4">
              No watch groups in your area yet.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-safe-600 to-safe-700
                             text-white font-bold rounded-xl hover:scale-105
                             transition-transform">
              🆕 Create Watch Group
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map(group => (
              <div key={group.id} 
                   className="bg-white rounded-lg p-4 border-2 border-gray-200
                             hover:border-safe-500 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-inter font-bold text-gray-900">
                      {group.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      📍 {group.area}
                    </p>
                    {group.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                  
                  <span className="shrink-0 text-xs bg-safe-100 text-safe-700 
                                 px-3 py-1 rounded-full font-bold">
                    👥 {group.memberCount || group.members} members
                  </span>
                </div>
                
                <button
                  onClick={() => handleJoin(group.id)}
                  className="w-full py-2 bg-gradient-to-r from-safe-600 to-safe-700
                           text-white font-bold rounded-lg hover:scale-105
                           transition-transform text-sm"
                >
                  👀 Join & Stay Alert
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  ```

- [ ] Test both components (5 min)

### Deliverables
- ✅ Anonymous report modal with form validation
- ✅ Severity selection (low/medium/high)
- ✅ Success animation
- ✅ Watch group widget with join functionality
- ✅ Empty state handling

---

## HOUR 5: SafetyMapScreen & Mobile Navigation

### Tasks (60 min)
- [ ] Create SafetyMapScreen.jsx (35 min):
  ```jsx
  // src/screens/SafetyMapScreen.jsx
  import { useState, useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import SafetyMap from '../components/SafetyMap'
  import EmergencyCard from '../components/EmergencyCard'
  import IncidentCard from '../components/IncidentCard'
  import { 
    fetchEmergencyServices, 
    sortServicesByDistance,
    callEmergencyNumber,
    navigateToService 
  } from '../services/emergencyService'
  import { fetchRecentIncidents, upvoteIncident } from '../services/reportService'
  import { getUserLocation } from '../services/locationService'
  import { trackEvent } from '../services/firebase'
  
  export default function SafetyMapScreen() {
    const navigate = useNavigate()
    const [userLocation, setUserLocation] = useState(null)
    const [services, setServices] = useState([])
    const [incidents, setIncidents] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
      loadMapData()
      trackEvent('safety_map_viewed')
    }, [])
    
    const loadMapData = async () => {
      try {
        // Get location
        const loc = await getUserLocation().catch(() => ({
          lat: 1.4927,
          lon: 103.7414
        }))
        setUserLocation(loc)
        
        // Load services and incidents
        const servicesData = await fetchEmergencyServices()
        const sorted = sortServicesByDistance(servicesData, loc.lat, loc.lon)
        setServices(sorted)
        
        const incidentsData = await fetchRecentIncidents(24)
        setIncidents(incidentsData)
        
        setLoading(false)
      } catch (error) {
        console.error('Map load error:', error)
        setLoading(false)
      }
    }
    
    const handleUpvote = async (incidentId) => {
      await upvoteIncident(incidentId)
      loadMapData() // Refresh to show updated count
    }
    
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-2xl font-montserrat font-bold text-gray-600">
            🗺️ Loading Safety Map...
          </div>
        </div>
      )
    }
    
    return (
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-danger-700 to-warning-600 p-6 text-white">
          <button 
            onClick={() => navigate('/')}
            className="mb-4 flex items-center gap-2 hover:underline text-sm"
          >
            ← Back to Home
          </button>
          <h1 className="font-montserrat font-black text-3xl md:text-4xl mb-2">
            🗺️ JB Safety Map
          </h1>
          <p className="text-red-100">
            {services.length} emergency services • {incidents.length} recent incidents
          </p>
        </div>
        
        {/* Split Layout */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Map Column (Sticky on desktop) */}
          <div className="md:sticky md:top-6 h-fit">
            <div className="mb-4">
              <SafetyMap
                userLocation={userLocation}
                emergencyServices={services.slice(0, 10)}
                incidents={incidents}
                onSelectService={(service) => console.log('Selected:', service)}
                onSelectIncident={(incident) => console.log('Incident:', incident)}
              />
            </div>
            
            {/* Map Stats */}
            <div className="glass-alert p-4 rounded-xl border-2 border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-1">🚓</div>
                  <div className="text-xs text-gray-600 mb-1">Police</div>
                  <div className="font-bold text-gray-900">
                    {services.filter(s => s.type === 'police').length}
                  </div>
                </div>
                <div>
                  <div className="text-3xl mb-1">🚒</div>
                  <div className="text-xs text-gray-600 mb-1">Fire</div>
                  <div className="font-bold text-gray-900">
                    {services.filter(s => s.type === 'fire').length}
                  </div>
                </div>
                <div>
                  <div className="text-3xl mb-1">⚠️</div>
                  <div className="text-xs text-gray-600 mb-1">Incidents</div>
                  <div className="font-bold text-gray-900">
                    {incidents.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lists Column (Scrollable) */}
          <div className="space-y-6">
            {/* Emergency Services */}
            <div>
              <h2 className="font-montserrat font-bold text-2xl mb-4">
                🚓 Emergency Services Nearby
              </h2>
              <div className="space-y-4">
                {services.slice(0, 5).map(service => (
                  <EmergencyCard
                    key={service.id}
                    service={service}
                    onCall={callEmergencyNumber}
                    onNavigate={navigateToService}
                  />
                ))}
              </div>
            </div>
            
            {/* Recent Incidents */}
            <div>
              <h2 className="font-montserrat font-bold text-2xl mb-4">
                ⚠️ Recent Incidents (24 hours)
              </h2>
              {incidents.length === 0 ? (
                <div className="glass-alert p-8 rounded-xl text-center">
                  <div className="text-5xl mb-3">✅</div>
                  <p className="text-gray-600">No incidents reported recently</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.slice(0, 5).map(incident => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      onUpvote={handleUpvote}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] Create MobileNav.jsx (15 min):
  ```jsx
  // src/components/MobileNav.jsx
  import { useNavigate, useLocation } from 'react-router-dom'
  
  export default function MobileNav() {
    const navigate = useNavigate()
    const location = useLocation()
    
    const navItems = [
      { path: '/', icon: '🏠', label: 'Home' },
      { path: '/safety-map', icon: '🗺️', label: 'Map' },
      { path: '/report', icon: '📲', label: 'Report' },
      { path: '/watch', icon: '👥', label: 'Watch' }
    ]
    
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white 
                     border-t-2 border-gray-200 shadow-2xl z-40 safe-area-pb">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-3 transition-all
                         ${location.pathname === item.path 
                           ? 'text-danger-600 bg-danger-50' 
                           : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    )
  }
  ```

- [ ] Update App.jsx with routes (10 min):
  ```jsx
  // src/App.jsx
  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import HomeScreen from './screens/HomeScreen'
  import SafetyMapScreen from './screens/SafetyMapScreen'
  import MobileNav from './components/MobileNav'
  import './styles/design-system.css'
  
  function App() {
    return (
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/safety-map" element={<SafetyMapScreen />} />
          </Routes>
          
          <MobileNav />
        </div>
      </BrowserRouter>
    )
  }
  
  export default App
  ```

### Deliverables
- ✅ SafetyMapScreen with split layout
- ✅ Map and lists integrated
- ✅ Mobile bottom navigation
- ✅ Responsive design (mobile/desktop)
- ✅ All navigation working

---

## Stage 3 Checkpoint

### What You Should Have Now:
1. ✅ HomeScreen (emergency finder with panic button)
2. ✅ SafetyMap component (interactive SVG)
3. ✅ EmergencyCard component (call/navigate)
4. ✅ IncidentCard component (upvote functionality)
5. ✅ ReportModal (anonymous reporting)
6. ✅ WatchGroupWidget (join groups)
7. ✅ SafetyMapScreen (full map view)
8. ✅ Mobile navigation (bottom bar)
9. ✅ All routes connected

### Components Created:
```
src/components/
├── SafetyMap.jsx          # ✅ Interactive SVG map
├── EmergencyCard.jsx      # ✅ Service cards
├── IncidentCard.jsx       # ✅ Incident reports
├── ReportModal.jsx        # ✅ Anonymous reporting
├── WatchGroupWidget.jsx   # ✅ Watch groups
└── MobileNav.jsx          # ✅ Bottom navigation

src/screens/
├── HomeScreen.jsx         # ✅ Emergency finder
└── SafetyMapScreen.jsx    # ✅ Map view
```

### Visual Checklist:
- [ ] Red emergency gradient background
- [ ] GPS pulse animation visible
- [ ] Panic button floating and pulsing
- [ ] Emergency cards with call buttons working
- [ ] SVG map rendering with pins
- [ ] Incident markers pulsing
- [ ] Report modal opens/closes smoothly
- [ ] Mobile nav showing on small screens
- [ ] Responsive layout on 375px, 768px, 1024px

### Test User Flow:
1. ✅ Land on HomeScreen → See nearest police/fire
2. ✅ Tap panic button → Phone dialer opens
3. ✅ Tap "Safety Map" → See interactive map
4. ✅ Tap "Report" → Modal opens
5. ✅ Submit report → Success animation
6. ✅ Bottom nav works on mobile

### Next Stage Preview:
Stage 4 will add final polish, deployment to Firebase, analytics setup, and production verification.

---

**Estimated Time**: 5 hours  
**Difficulty**: ⭐⭐⭐⭐ (High - UI assembly)  
**Dependencies**: Stage 2 complete (all services working)
