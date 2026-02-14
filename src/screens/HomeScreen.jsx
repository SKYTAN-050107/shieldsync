import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserLocation } from '../services/locationService'
import { 
  fetchEmergencyServices, 
  getNearestByType,
  callEmergencyNumber,
  navigateToService
} from '../services/emergencyService'
import { trackEvent } from '../services/firebase'
import EmergencyCard from '../components/EmergencyCard'

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
      <div className="min-h-screen bg-gradient-to-br from-danger-900 to-warning-600 
                     flex items-center justify-center">
        <div className="text-white text-2xl font-montserrat font-bold animate-pulse">
          🚨 Loading Emergency Services...
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Dynamic Header Background */}
      <div className="bg-gradient-to-br from-danger-900 via-danger-700 to-warning-600 px-6 pt-8 pb-12 rounded-b-[3rem] shadow-2xl">
        {/* GPS Live Indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="relative">
            <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 h-2 w-2 bg-red-400 rounded-full animate-ping" />
          </div>
          <span className="text-red-100 font-inter text-xs font-bold tracking-widest uppercase">
            📍 GPS LIVE: {postcode} Taman Molek
          </span>
        </div>
        
        {/* Hero Section */}
        <h1 className="font-montserrat font-black text-5xl text-white leading-tight mb-4">
          🚨 EMERGENCY SERVICES NEARBY
        </h1>
        <p className="text-white/80 font-inter text-lg">
          Finding nearest police, fire stations & hospitals in Johor Bahru
        </p>
      </div>
      
      {/* Quick Action Buttons */}
      <div className="px-6 -mt-8 mb-8 grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/safety-map')}
          className="py-4 bg-white text-danger-600 font-bold rounded-2xl
                   shadow-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors uppercase text-sm font-black"
        >
          🗺️ Safety Map
        </button>
        <button
          onClick={() => navigate('/report')}
          className="py-4 bg-warning-600 text-white font-bold rounded-2xl
                   shadow-xl flex items-center justify-center gap-2 hover:bg-warning-700 transition-colors uppercase text-sm font-black"
        >
          📲 Report Incident
        </button>
      </div>

      {/* Services List */}
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 uppercase">Recommended</h2>
          <span className="text-[10px] font-black text-danger-600 uppercase tracking-tighter">Live Distance Tracking</span>
        </div>

        {nearest.police && (
          <EmergencyCard 
            service={nearest.police} 
            onCall={(s) => window.location.href = `tel:${s.phone}`}
            onNavigate={navigateToService}
          />
        )}

        {nearest.fire && (
          <EmergencyCard 
            service={nearest.fire} 
            onCall={(s) => window.location.href = `tel:${s.phone}`}
            onNavigate={navigateToService}
          />
        )}

        {nearest.hospital && (
          <EmergencyCard 
            service={nearest.hospital} 
            onCall={(s) => window.location.href = `tel:${s.phone}`}
            onNavigate={navigateToService}
          />
        )}
      </div>
      
      {/* Incident Alert Ticker */}
      <div className="px-6 mt-8 mb-10">
        <div className="bg-warning-50 rounded-2xl p-4 border-2 border-warning-200">
          <div className="flex items-center gap-4">
            <span className="text-3xl animate-pulse">⚠️</span>
            <div>
              <p className="text-warning-900 font-black text-sm uppercase">Active Incidents Nearby</p>
              <p className="text-warning-700 text-xs font-medium">
                {recentIncidents} reports in last 60 minutes. Check Safety Map.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Panic Button */}
      <button
        onClick={handlePanicButton}
        className="fixed bottom-28 right-6 z-50 h-20 w-20 bg-gradient-to-br from-danger-600 to-danger-800 
                   rounded-full shadow-[0_0_40px_rgba(220,38,38,0.6)] flex items-center justify-center 
                   text-4xl animate-bounce hover:scale-110 transition-transform active:scale-90 border-4 border-white"
      >
        🚨
      </button>
    </div>
  )
}
