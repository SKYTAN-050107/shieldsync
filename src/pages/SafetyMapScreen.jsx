import { useState, useEffect } from 'react'
import { trackEvent } from '../services/firebase'
import { fetchEmergencyServices, getAllCachedServices, filterByType } from '../services/emergencyService'
import { subscribeToIncidents } from '../services/reportService'
import { getUserLocation } from '../services/locationService'
import SafetyMap from '../components/SafetyMap'
import ReportModal from '../components/ReportModal'
import EmergencyCard from '../components/EmergencyCard'
import IncidentCard from '../components/IncidentCard'
import { AlertTriangle, Layers, Radio, Shield, Flame, Cross, MapPin, X as XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', icon: Layers, color: 'text-white/80', activeBg: 'bg-white/15' },
  { id: 'police', label: 'Police', icon: Shield, color: 'text-primary-400', activeBg: 'bg-primary-500/20' },
  { id: 'fire', label: 'Fire', icon: Flame, color: 'text-warning-400', activeBg: 'bg-warning-500/20' },
  { id: 'hospital', label: 'Hospital', icon: Cross, color: 'text-safe-400', activeBg: 'bg-safe-500/20' },
]

export default function SafetyMapScreen() {
  const [userLocation, setUserLocation] = useState(null)
  const [services, setServices] = useState([])
  const [incidents, setIncidents] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allServices, setAllServices] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)
  const [manualLocation, setManualLocation] = useState(null)

  // 1. Get real user location
  useEffect(() => {
    trackEvent('safety_map_viewed')
    getUserLocation()
      .then((loc) => setUserLocation({ lat: loc.lat, lon: loc.lon }))
      .catch(() => setUserLocation({ lat: 1.4927, lon: 103.7414 }))
  }, [])

  // 2. Fetch services from Overpass (bounding-box for all of JB, cached)
  useEffect(() => {
    if (!userLocation) return
    setLoading(true)
    fetchEmergencyServices(userLocation.lat, userLocation.lon, 100) // fetch large set, we filter client-side
      .then((svc) => {
        setAllServices(svc)
        setServices(svc)
      })
      .catch(() => { setAllServices([]); setServices([]) })
      .finally(() => setLoading(false))
  }, [userLocation])

  // 3b. Re-filter when activeFilter changes
  useEffect(() => {
    if (!userLocation) return
    const base = allServices.length ? allServices : getAllCachedServices(userLocation.lat, userLocation.lon)
    const filtered = filterByType(base, activeFilter)
    // Show top 10 nearest of the selected type
    setServices(filtered.slice(0, 10))
  }, [activeFilter, allServices])

  // 3. Real-time Firestore listener for community incidents
  useEffect(() => {
    const unsub = subscribeToIncidents(12, (data) => setIncidents(data))
    return () => unsub()
  }, [])

  return (
    <div className="relative h-screen w-full bg-surface-900 overflow-hidden">
      {/* Safety Map Component */}
      <div className={`absolute inset-0 z-0 ${isSelectingLocation ? 'cursor-crosshair' : ''}`}>
        <SafetyMap
          userLocation={userLocation}
          emergencyServices={services}
          incidents={incidents}
          onSelectService={(s) => {
            if (isSelectingLocation) return // ignore service clicks in selection mode
            setSelectedService(s)
            setSelectedIncident(null)
          }}
          onSelectIncident={(i) => {
            if (isSelectingLocation) return
            setSelectedIncident(i)
            setSelectedService(null)
          }}
          isSelectingLocation={isSelectingLocation}
          selectedLocation={manualLocation}
          onLocationSelect={(loc) => {
            setManualLocation(loc)
            setIsSelectingLocation(false)
            setIsReportModalOpen(true) // re-open modal with pinned location
          }}
        />
      </div>

      {/* Selection-mode banner */}
      <AnimatePresence>
        {isSelectingLocation && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3
                       px-5 py-3 rounded-2xl bg-accent-600/90 backdrop-blur-md border border-accent-400/30
                       shadow-xl shadow-accent-600/20"
          >
            <MapPin size={18} className="text-white animate-bounce" />
            <span className="text-white font-bold text-sm">Tap on the map to pin location</span>
            <button
              onClick={() => {
                setIsSelectingLocation(false)
                setIsReportModalOpen(true) // cancel → re-open modal
              }}
              className="ml-2 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center
                         hover:bg-white/30 transition-colors"
            >
              <XIcon size={14} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar: Filter + Report */}
      <div className="absolute top-4 left-14 sm:left-4 right-4 z-50 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Dynamic Filter Buttons */}
        <div className="flex gap-1 sm:gap-1.5 overflow-x-auto">
          {FILTER_OPTIONS.map((f) => {
            const Icon = f.icon
            const isActive = activeFilter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0
                  ${isActive
                    ? `${f.activeBg} ${f.color} border border-white/15 shadow-lg`
                    : 'bg-surface-800/80 text-white/40 border border-white/5 hover:bg-white/10'}`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            )
          })}
        </div>

        {/* Report Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsReportModalOpen(true)}
          className="px-3 sm:px-5 py-2.5 bg-gradient-to-r from-danger-600 to-danger-500
                     text-white font-bold text-xs rounded-xl shadow-lg shadow-danger-600/30
                     flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
        >
          <AlertTriangle size={14} />
          <span className="hidden sm:inline">REPORT</span>
          <span className="sm:hidden">!</span>
        </motion.button>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {(selectedService || selectedIncident) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-20 sm:bottom-28 inset-x-4 z-40"
          >
            <div className="relative">
              <button
                onClick={() => {
                  setSelectedService(null)
                  setSelectedIncident(null)
                }}
                className="absolute -top-3 -right-1 h-8 w-8 bg-surface-800 text-white/60 
                           rounded-full border border-white/10 flex items-center 
                           justify-center z-50 text-sm hover:bg-surface-700 transition-colors"
              >
                ✕
              </button>

              {selectedService ? (
                <EmergencyCard
                  service={selectedService}
                  onCall={(s) => window.location.href = `tel:${s.phone}`}
                  onNavigate={(s) => window.open(`http://maps.google.com/?q=${s.lat},${s.lon}`)}
                />
              ) : (
                <IncidentCard
                  incident={selectedIncident}
                  onClick={() => { }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Overlay */}
      <div className="absolute top-16 sm:top-20 left-4 sm:left-6 z-10 flex flex-col gap-2">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card px-4 py-2.5 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <Layers size={12} className="text-primary-400" />
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Services</p>
          </div>
          <p className="text-xl font-black text-white">{services.length}</p>
        </motion.div>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card px-4 py-2.5 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <Radio size={12} className="text-danger-400" />
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Alerts</p>
          </div>
          <p className="text-xl font-black text-danger-400">{incidents.length}</p>
        </motion.div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false)
          setManualLocation(null) // clear pin when modal closes
        }}
        userLocation={userLocation}
        selectedLocation={manualLocation}
        onPinOnMap={() => {
          setIsReportModalOpen(false)  // close modal
          setIsSelectingLocation(true) // enter map selection mode
        }}
      />
    </div>
  )
}
