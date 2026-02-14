import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../services/firebase'
import { fetchEmergencyServices } from '../services/emergencyService'
import { fetchRecentIncidents } from '../services/reportService'
import SafetyMap from '../components/SafetyMap'
import ReportModal from '../components/ReportModal'
import EmergencyCard from '../components/EmergencyCard'
import IncidentCard from '../components/IncidentCard'

export default function SafetyMapScreen() {
  const navigate = useNavigate()
  const [userLocation] = useState({ lat: 1.4927, lon: 103.7414 }) // Default to JB
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
      
      // Calculate distances for services
      const servicesWithDist = fetchedServices.map(s => ({
        ...s,
        distance: 1.2 // Mock distance calculation for now
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
    <div className="relative h-screen w-screen bg-slate-900 overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 h-12 w-12 bg-white/90 backdrop-blur 
                   rounded-2xl shadow-xl flex items-center justify-center text-xl
                   hover:scale-110 transition-transform active:scale-95"
      >
        🔙
      </button>

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
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="absolute top-6 right-6 z-50 px-8 py-3 bg-danger-600 text-white 
                   font-black rounded-2xl shadow-2xl hover:bg-danger-700 
                   transition-all scale-100 hover:scale-105 active:scale-95"
      >
        REPORT ⚠️
      </button>

      {/* Detail Overlay */}
      {(selectedService || selectedIncident) && (
        <div className="absolute bottom-28 inset-x-6 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="relative">
            <button
              onClick={() => {
                setSelectedService(null)
                setSelectedIncident(null)
              }}
              className="absolute -top-4 -right-2 h-10 w-10 bg-slate-900 text-white 
                         rounded-full border-2 border-white shadow-xl flex items-center 
                         justify-center z-50"
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
                onClick={() => {}} 
              />
            )}
          </div>
        </div>
      )}

      {/* Quick Stats Overlay */}
      <div className="absolute top-24 left-6 z-10 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nearby Services</p>
          <p className="text-xl font-black text-slate-900">{services.length}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Alerts</p>
          <p className="text-xl font-black text-danger-600">{incidents.length}</p>
        </div>
      </div>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => {
          setIsReportModalOpen(false)
          loadData() // Refresh
        }} 
        userLocation={userLocation}
      />
    </div>
  )
}
