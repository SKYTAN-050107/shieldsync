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
    const scale = 8000

    return {
      x: (lon - centerLon) * scale + mapWidth / 2,
      y: (centerLat - lat) * scale + mapHeight / 2
    }
  }

  const getServiceColor = (type) => {
    const colors = {
      police: '#3b82f6',   // primary-500
      fire: '#d97706',     // warning-600
      hospital: '#10b981'  // safe-500
    }
    return colors[type] || colors.police
  }

  const getServiceIcon = (type) => {
    const icons = {
      police: '🛡',
      fire: '🔥',
      hospital: '🏥'
    }
    return icons[type] || '📍'
  }

  if (!userLocation) {
    return (
      <div className="w-full h-full bg-surface-900 flex items-center justify-center">
        <p className="text-white/30 font-bold uppercase tracking-widest animate-pulse">Loading map...</p>
      </div>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${mapWidth} ${mapHeight}`}
      className="w-full h-full"
      style={{ background: 'linear-gradient(180deg, #0d1321 0%, #111827 50%, #0f172a 100%)' }}
    >
      {/* Grid Background */}
      <defs>
        <pattern id="safety-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>

        {/* Danger Zone Gradient */}
        <radialGradient id="danger-zone">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>

        {/* Safe Zone Gradient */}
        <radialGradient id="safe-zone">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>

        {/* User Pin Glow */}
        <radialGradient id="user-glow">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
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
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 4"
            opacity="0.35"
          />
        )
      })}

      {/* User Pin (YOU) */}
      <g transform={`translate(${mapWidth / 2}, ${mapHeight / 2})`}>
        {/* Glow effect */}
        <circle r="40" fill="url(#user-glow)" />
        <circle r="16" fill="#0e7490" opacity="0.5" className="animate-pulse" />
        <circle r="12" fill="#22d3ee" />
        <circle r="7" fill="#0a0f1e" />
        <circle r="4" fill="#22d3ee" />
        <text
          y="-22"
          textAnchor="middle"
          fill="#22d3ee"
          style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px' }}
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
            {/* Pin Outer Glow */}
            <circle r="18" fill={color} opacity="0.15" />

            {/* Pin Body */}
            <circle r="12" fill={color} opacity="0.9" />
            <circle r="8" fill={`${color}55`} />

            {/* Number Badge */}
            <circle cx="14" cy="-14" r="9" fill="#0a0f1e" stroke={color} strokeWidth="2" />
            <text
              x="14"
              y="-10"
              textAnchor="middle"
              fill={color}
              style={{ fontSize: '9px', fontWeight: 'bold' }}
            >
              {i + 1}
            </text>

            {/* Type Emoji */}
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
              strokeWidth="1.5"
              className="animate-ping"
              opacity="0.5"
            />

            {/* Warning Icon */}
            <circle r="10" fill="#DC2626" opacity="0.8" />
            <circle r="6" fill="#0a0f1e" opacity="0.5" />
            <text
              y="4"
              textAnchor="middle"
              style={{ fontSize: '10px' }}
            >
              ⚠️
            </text>
          </g>
        )
      })}

      {/* Legend */}
      <g transform="translate(15, 15)">
        <rect width="140" height="105" fill="#0a0f1e" opacity="0.85" rx="10"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        <circle cx="24" cy="24" r="5" fill="#3b82f6" />
        <text x="38" y="28" fill="rgba(255,255,255,0.5)" style={{ fontSize: '10px', fontWeight: '500' }}>
          Police Station
        </text>

        <circle cx="24" cy="44" r="5" fill="#d97706" />
        <text x="38" y="48" fill="rgba(255,255,255,0.5)" style={{ fontSize: '10px', fontWeight: '500' }}>
          Fire Station
        </text>

        <circle cx="24" cy="64" r="5" fill="#DC2626" />
        <text x="38" y="68" fill="rgba(255,255,255,0.5)" style={{ fontSize: '10px', fontWeight: '500' }}>
          Incident
        </text>

        <circle cx="24" cy="84" r="5" fill="#22d3ee" />
        <text x="38" y="88" fill="rgba(255,255,255,0.5)" style={{ fontSize: '10px', fontWeight: '500' }}>
          Your Location
        </text>
      </g>
    </svg>
  )
}
