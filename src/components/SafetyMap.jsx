// src/components/SafetyMap.jsx
import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ---- Custom icon factories ----
const createIcon = (color, emoji) => {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:32px;height:32px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;border:2px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
    ">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  })
}

const SERVICE_ICONS = {
  police: createIcon('#3b82f6', '🛡'),
  fire: createIcon('#d97706', '🔥'),
  hospital: createIcon('#10b981', '🏥'),
}

// ---- Type-specific incident icons ----
const INCIDENT_ICONS = {
  crime:      createIcon('#DC2626', '🚨'),  // Red
  accident:   createIcon('#EA580C', '🚗'),  // Orange
  hazard:     createIcon('#EAB308', '⚠️'),  // Yellow
  harassment: createIcon('#A855F7', '🚷'),  // Purple
  medical:    createIcon('#3B82F6', '🏥'),  // Blue
  other:      createIcon('#6B7280', '❓'),  // Gray
}
const INCIDENT_ICON_DEFAULT = createIcon('#DC2626', '⚠️')

// Preview pin shown while user is selecting a location
const PREVIEW_ICON = L.divIcon({
  className: '',
  html: `<div style="
    background:#f43f5e;
    width:36px;height:36px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:20px;border:3px solid #fff;
    box-shadow:0 0 16px rgba(244,63,94,0.6);
    animation:pulse 1.2s ease-in-out infinite;
  ">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

const USER_ICON = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#22d3ee;border:3px solid #fff;
    box-shadow:0 0 12px rgba(34,211,238,0.6);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

// ---- Helper to re-center when location changes ----
function RecenterMap({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lon) map.setView([lat, lon], map.getZoom())
  }, [lat, lon])
  return null
}

// ---- Click handler for location-selection mode ----
function MapClickHandler({ enabled, onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (enabled && onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lon: e.latlng.lng })
      }
    },
  })
  return null
}

export default function SafetyMap({
  userLocation,
  emergencyServices = [],
  incidents = [],
  onSelectService,
  onSelectIncident,
  isSelectingLocation = false,
  onLocationSelect,
  selectedLocation,
}) {
  if (!userLocation) {
    return (
      <div className="w-full h-full bg-surface-900 flex items-center justify-center">
        <p className="text-white/30 font-bold uppercase tracking-widest animate-pulse">Loading map...</p>
      </div>
    )
  }

  const center = [userLocation.lat, userLocation.lon]

  return (
    <MapContainer
      center={center}
      zoom={14}
      className="w-full h-full z-0"
      zoomControl={false}
      attributionControl={true}
      style={{ background: '#0d1321' }}
    >
      {/* Move zoom control to bottom left */}
      <ZoomControl position="bottomleft" />
      {/* Dark-themed OpenStreetMap tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <RecenterMap lat={userLocation.lat} lon={userLocation.lon} />

      {/* Map click handler for pin-on-map selection mode */}
      <MapClickHandler enabled={isSelectingLocation} onLocationSelect={onLocationSelect} />

      {/* Preview marker when user is selecting a location */}
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={PREVIEW_ICON}>
          <Popup className="dark-popup">
            <strong>Selected Location</strong>
          </Popup>
        </Marker>
      )}

      {/* User location marker + accuracy circle */}
      <Marker position={center} icon={USER_ICON}>
        <Popup className="dark-popup">
          <strong>Your Location</strong>
        </Popup>
      </Marker>
      <Circle
        center={center}
        radius={200}
        pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.08, weight: 1 }}
      />

      {/* Emergency service markers */}
      {emergencyServices.map((s) => {
        const icon = SERVICE_ICONS[s.type] || SERVICE_ICONS.police
        return (
          <Marker
            key={s.id}
            position={[s.lat, s.lon]}
            icon={icon}
            eventHandlers={{ click: () => onSelectService?.(s) }}
          >
            <Popup className="dark-popup">
              <div style={{ minWidth: 160 }}>
                <strong>{s.name}</strong>
                <br />
                <span style={{ fontSize: 12, opacity: 0.7 }}>{s.address || s.type}</span>
                {s.phone && (
                  <>
                    <br />
                    <a href={`tel:${s.phone}`} style={{ color: '#22d3ee', fontSize: 12 }}>
                      📞 {s.phone}
                    </a>
                  </>
                )}
                {s.distance != null && (
                  <>
                    <br />
                    <span style={{ fontSize: 11, opacity: 0.6 }}>{s.distance.toFixed(1)} km away</span>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Incident markers (type-specific icons) */}
      {incidents.map((inc) => (
        <Marker
          key={inc.id}
          position={[inc.lat, inc.lon]}
          icon={INCIDENT_ICONS[inc.type] || INCIDENT_ICON_DEFAULT}
          eventHandlers={{ click: () => onSelectIncident?.(inc) }}
        >
          <Popup className="dark-popup">
            <div style={{ minWidth: 160 }}>
              <strong style={{ color: '#f87171' }}>{inc.type || 'Incident'}</strong>
              <br />
              <span style={{ fontSize: 12, opacity: 0.8 }}>{inc.description || ''}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Danger-zone circles around incidents */}
      {incidents.map((inc) => (
        <Circle
          key={`zone-${inc.id}`}
          center={[inc.lat, inc.lon]}
          radius={300}
          pathOptions={{ color: '#DC2626', fillColor: '#DC2626', fillOpacity: 0.08, weight: 1 }}
        />
      ))}
    </MapContainer>
  )
}
