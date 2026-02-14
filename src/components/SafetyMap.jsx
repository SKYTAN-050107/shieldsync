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
        <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading map...</p>
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
          style={{ fontSize: '12px', fontWeight: 'bold' }}
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
              style={{ fontSize: '10px', fontWeight: 'bold' }}
            >
              {i + 1}
            </text>
            
            {/* Type Emoji (Optional visual) */}
            <text y="5" textAnchor="middle" style={{ fontSize: '10px' }}>
                {icon[0]}
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
              className="animate-ping"
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
