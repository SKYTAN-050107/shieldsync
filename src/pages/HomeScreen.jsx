import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserLocation } from '../services/locationService'
import {
  fetchEmergencyServices,
  getNearestByType,
  navigateToService
} from '../services/emergencyService'
import { trackEvent } from '../services/firebase'
import EmergencyCard from '../components/EmergencyCard'
import { Shield, MapPin, AlertTriangle, Phone, Map, FileWarning, ChevronRight, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

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
      const loc = await getUserLocation().catch(() => ({
        lat: 1.4927,
        lon: 103.7414,
        postcode: '80100'
      }))
      setLocation(loc)
      setPostcode(loc.postcode || '81200')

      const services = await fetchEmergencyServices(loc.lat, loc.lon)

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

  // Emergency call numbers
  const MALAYSIA_POLICE = '999'
  const BOMBA = '994'
  // Expand state
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false)
  // Handle call
  const handleEmergencyCall = (number) => {
    trackEvent('panic_button_pressed')
    window.location.href = `tel:${number}`
    setShowEmergencyOptions(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <img
            src="/assets/logos/image-removebg-preview.png"
            alt="ShieldSync"
            className="w-20 h-20 object-contain"
          />
        </motion.div>
        <div className="text-primary-400 text-lg font-inter font-semibold tracking-wide">
          Loading Emergency Services...
        </div>
        <div className="w-48 h-1 bg-surface-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-600 to-accent-400 shimmer rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-8 relative z-10">
      {/* Hero Header with gradient */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />

        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative px-6 pt-16 md:pt-8 pb-16">
          {/* GPS Live Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="h-2 w-2 bg-accent-400 rounded-full" />
              <div className="absolute inset-0 h-2 w-2 bg-accent-400 rounded-full animate-ping" />
            </div>
            <span className="text-accent-300/80 font-inter text-xs font-bold tracking-[0.2em] uppercase">
              GPS LIVE · {postcode} Taman Molek
            </span>
          </div>

          {/* Logo + Title */}
          <div className="flex items-start gap-4 mb-5">
            <img
              src="/assets/logos/image-removebg-preview.png"
              alt="ShieldSync"
              className="w-16 h-16 object-contain drop-shadow-lg flex-shrink-0 mt-1"
            />
            <div>
              <h1 className="font-montserrat font-black text-4xl text-white leading-tight">
                EMERGENCY<br />
                <span className="gradient-text">SERVICES</span>
              </h1>
              <p className="text-white/50 font-inter text-sm mt-2">
                Nearest police, fire & hospitals in Johor Bahru
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="px-6 -mt-8 mb-8 grid grid-cols-2 gap-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/map')}
          className="py-4 glass-card-bright rounded-2xl flex items-center justify-center gap-2.5
                     text-white font-bold text-sm tracking-wide"
        >
          <Map size={18} className="text-accent-400" />
          Safety Map
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/activity')}
          className="py-4 rounded-2xl flex items-center justify-center gap-2.5
                     bg-gradient-to-r from-accent-600 to-accent-500 text-white font-bold text-sm tracking-wide
                     shadow-lg shadow-accent-600/20"
        >
          <Activity size={18} />
          View Activity
        </motion.button>
      </div>

      {/* Services List */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white/90">Nearest Services</h2>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-accent-400 uppercase tracking-widest">
            <div className="h-1.5 w-1.5 bg-accent-400 rounded-full animate-pulse" />
            Live Tracking
          </span>
        </div>

        {nearest.police && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <EmergencyCard
              service={nearest.police}
              onCall={(s) => window.location.href = `tel:${s.phone}`}
              onNavigate={navigateToService}
            />
          </motion.div>
        )}

        {nearest.fire && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <EmergencyCard
              service={nearest.fire}
              onCall={(s) => window.location.href = `tel:${s.phone}`}
              onNavigate={navigateToService}
            />
          </motion.div>
        )}

        {nearest.hospital && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <EmergencyCard
              service={nearest.hospital}
              onCall={(s) => window.location.href = `tel:${s.phone}`}
              onNavigate={navigateToService}
            />
          </motion.div>
        )}
      </div>

      {/* Incident Alert Ticker */}
      <div className="px-6 mt-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-4 border-l-4 border-l-warning-500"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-warning-500/15 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-warning-400" />
            </div>
            <div>
              <p className="text-white/90 font-bold text-sm">Active Incidents Nearby</p>
              <p className="text-white/40 text-xs mt-0.5">
                {recentIncidents} reports in last 60 minutes · <span className="text-accent-400 cursor-pointer" onClick={() => navigate('/dashboard/map')}>View Map</span>
              </p>
            </div>
            <ChevronRight size={18} className="text-white/20 ml-auto flex-shrink-0" />
          </div>
        </motion.div>
      </div>

      {/* Floating Emergency Call Button */}
      <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3">
        {showEmergencyOptions && (
          <div className="mb-2 flex flex-col gap-2">
            <button
              className="w-48 sm:w-56 px-3 sm:px-4 py-3 rounded-xl bg-danger-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 sm:gap-3 shadow-lg border border-danger-400/30 transition hover:bg-danger-700"
              onClick={() => handleEmergencyCall(MALAYSIA_POLICE)}
            >
              <Phone size={20} className="text-white flex-shrink-0" /> Police (999)
            </button>
            {nearest.hospital && (
              <button
                className="w-48 sm:w-56 px-3 sm:px-4 py-3 rounded-xl bg-safe-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 sm:gap-3 shadow-lg border border-safe-400/30 transition hover:bg-safe-700"
                onClick={() => handleEmergencyCall(nearest.hospital.phone)}
              >
                <Phone size={20} className="text-white flex-shrink-0" /> Hospital ({nearest.hospital.phone})
              </button>
            )}
            <button
              className="w-48 sm:w-56 px-3 sm:px-4 py-3 rounded-xl bg-warning-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 sm:gap-3 shadow-lg border border-warning-400/30 transition hover:bg-warning-700"
              onClick={() => handleEmergencyCall(BOMBA)}
            >
              <Phone size={20} className="text-white flex-shrink-0" /> Bomba (994)
            </button>
          </div>
        )}
        <motion.button
          onClick={() => setShowEmergencyOptions(v => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-br from-danger-500 to-danger-700 rounded-full flex items-center justify-center panic-pulse border-2 border-danger-400/30 shadow-lg"
          style={{ width: '60px', height: '60px' }}
        >
          <Phone size={24} className="text-white" />
        </motion.button>
      </div>
    </div>
  )
}
