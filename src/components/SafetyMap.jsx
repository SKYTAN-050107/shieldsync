// src/components/SafetyMap.jsx
import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl } from 'react-leaflet'
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

const INCIDENT_ICON = createIcon('#DC2626', '⚠️')

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

export default function SafetyMap({
  userLocation,
  emergencyServices = [],
  incidents = [],
  onSelectService,
  onSelectIncident,
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

      {/* Incident markers */}
      {incidents.map((inc) => (
        <Marker
          key={inc.id}
          position={[inc.lat, inc.lon]}
          icon={INCIDENT_ICON}
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
