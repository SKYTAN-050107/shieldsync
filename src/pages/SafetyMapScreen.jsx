import { useState, useEffect } from 'react'
import { trackEvent } from '../services/firebase'
import { fetchEmergencyServices } from '../services/emergencyService'
import { fetchRecentIncidents } from '../services/reportService'
import SafetyMap from '../components/SafetyMap'
import ReportModal from '../components/ReportModal'
import EmergencyCard from '../components/EmergencyCard'
import IncidentCard from '../components/IncidentCard'
import { AlertTriangle, Layers, Radio } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SafetyMapScreen() {
  const [userLocation] = useState({ lat: 1.4927, lon: 103.7414 })
  const [services, setServices] = useState([])
  const [incidents, setIncidents] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    trackEvent('safety_map_viewed')
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [fetchedServices, fetchedIncidents] = await Promise.all([
        fetchEmergencyServices(),
        fetchRecentIncidents()
      ])

      const servicesWithDist = fetchedServices.map(s => ({
        ...s,
        distance: 1.2
      }))

      setServices(servicesWithDist)
      setIncidents(fetchedIncidents)
    } catch (error) {
      console.error('Error loading map data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-screen w-full bg-surface-900 overflow-hidden">
      {/* Safety Map Component */}
      <div className="absolute inset-0 z-0">
        <SafetyMap
          userLocation={userLocation}
          emergencyServices={services}
          incidents={incidents}
          onSelectService={(s) => {
            setSelectedService(s)
            setSelectedIncident(null)
          }}
          onSelectIncident={(i) => {
            setSelectedIncident(i)
            setSelectedService(null)
          }}
        />
      </div>

      {/* Report Button (Floating) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsReportModalOpen(true)}
        className="absolute top-6 right-6 z-50 px-6 py-2.5 
                   bg-gradient-to-r from-danger-600 to-danger-500
                   text-white font-bold text-sm rounded-xl shadow-lg shadow-danger-600/30
                   flex items-center gap-2"
      >
        <AlertTriangle size={16} />
        REPORT
      </motion.button>

      {/* Detail Overlay */}
      <AnimatePresence>
        {(selectedService || selectedIncident) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-28 inset-x-4 z-40"
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
      <div className="absolute top-20 left-6 z-10 flex flex-col gap-2">
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
          loadData()
        }}
        userLocation={userLocation}
      />
    </div>
  )
}
