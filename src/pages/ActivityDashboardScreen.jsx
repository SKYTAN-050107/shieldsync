// src/pages/ActivityDashboardScreen.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, BarChart3, Clock } from 'lucide-react'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserLocation } from '../services/locationService'
import { subscribeToIncidents, getUserStats, getUserIncidents } from '../services/reportService'
import { calculateDistance } from '../utils/haversine'
import PointsDisplay from '../components/PointsDisplay'
import AiInsightsPanel from '../components/AiInsightsPanel'
import RewardsShop from '../components/RewardsShop'
import ReportModal from '../components/ReportModal'
import SafetyMap from '../components/SafetyMap'

export default function ActivityDashboardScreen() {
  const [userLocation, setUserLocation] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [nearbyIncidents, setNearbyIncidents] = useState([])
  const [userStats, setUserStats] = useState({ totalPoints: 0, incidentCount: 0 })
  const [userIncidents, setUserIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [userId, setUserId] = useState(null)

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null)
    })
    return () => unsub()
  }, [])

  // Location
  useEffect(() => {
    getUserLocation()
      .then((loc) => setUserLocation({ lat: loc.lat, lon: loc.lon }))
      .catch(() => setUserLocation({ lat: 1.4927, lon: 103.7414 }))
  }, [])

  // Real-time incidents (12h)
  useEffect(() => {
    const unsub = subscribeToIncidents(12, (data) => {
      setIncidents(data)
    })
    return () => unsub()
  }, [])

  // Filter to <5km when we have location + incidents
  useEffect(() => {
    if (!userLocation || !incidents.length) {
      setNearbyIncidents(incidents)
      return
    }
    const nearby = incidents.filter(inc => {
      if (!inc.lat || !inc.lon) return false
      const dist = calculateDistance(userLocation.lat, userLocation.lon, inc.lat, inc.lon)
      return dist <= 5 // 5 km
    })
    setNearbyIncidents(nearby)
  }, [userLocation, incidents])

  // User stats + user incidents
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    const load = async () => {
      setLoading(true)
      try {
        const [stats, uIncidents] = await Promise.all([
          getUserStats(userId),
          getUserIncidents(userId, 20),
        ])
        setUserStats(stats)
        setUserIncidents(uIncidents)
      } catch (err) {
        console.error('[ShieldSync] Dashboard data load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId, incidents]) // re-fetch when incidents change (new report may bump stats)

  // Contribution chart data (last 7 days)
  const chartData = buildWeeklyChart(userIncidents)

  return (
    <div className="min-h-screen bg-surface-900 p-4 sm:p-6 lg:p-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Activity Dashboard</h1>
        <p className="text-sm text-white/30 font-medium">Track your impact & earn rewards</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Points + Chart */}
        <div className="lg:col-span-1 space-y-5">
          <PointsDisplay stats={userStats} loading={loading} />

          {/* Weekly Contribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-primary-400" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">This Week</span>
            </div>
            <div className="flex items-end gap-1.5 h-28">
              {chartData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                    className={`w-full rounded-t-md ${day.count > 0
                      ? 'bg-gradient-to-t from-primary-600 to-primary-400'
                      : 'bg-white/5'
                    }`}
                    style={{ minHeight: day.count > 0 ? 8 : 4 }}
                  />
                  <span className="text-[9px] font-bold text-white/30">{day.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
              <Clock size={10} className="text-white/20" />
              <span className="text-[10px] text-white/20 font-medium">
                {userIncidents.length} total reports
              </span>
            </div>
          </motion.div>

          {/* Rewards */}
          <RewardsShop userPoints={userStats.totalPoints} />
        </div>

        {/* Right Column: Map + AI */}
        <div className="lg:col-span-2 space-y-5">
          {/* Mini map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-white/5 overflow-hidden"
            style={{ height: 340 }}
          >
            <div className="relative w-full h-full">
              <SafetyMap
                userLocation={userLocation}
                emergencyServices={[]}
                incidents={nearbyIncidents}
                onSelectIncident={(i) => setSelectedIncident(i)}
              />
              {/* Overlay label */}
              <div className="absolute top-3 left-3 z-[500] px-3 py-1.5 rounded-lg bg-surface-900/80 backdrop-blur-md
                              border border-white/10">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  Nearby Incidents ({nearbyIncidents.length})
                </span>
              </div>
            </div>
          </motion.div>

          {/* Selected incident detail */}
          {selectedIncident && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 border border-white/5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-danger-400 uppercase tracking-widest">
                  {selectedIncident.type}
                </span>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-white/30 hover:text-white/60 text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-white/70 font-medium">{selectedIncident.description || 'No description'}</p>
            </motion.div>
          )}

          {/* AI Insights */}
          <AiInsightsPanel
            userLocation={userLocation}
            incidents={nearbyIncidents}
            userStats={userStats}
            userIncidents={userIncidents}
          />
        </div>
      </div>

      {/* Floating Report Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full
                   bg-gradient-to-br from-danger-600 to-danger-500
                   text-white shadow-lg shadow-danger-600/30
                   flex items-center justify-center
                   border-2 border-danger-400/30"
      >
        <Plus size={24} />
      </motion.button>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userLocation={userLocation}
      />
    </div>
  )
}

// ---- Helper: build weekly chart data ----
function buildWeeklyChart(userIncidents) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  const chart = []
  let maxCount = 0

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dayStr = days[d.getDay()]
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const dayEnd = new Date(dayStart.getTime() + 86400000)

    const count = userIncidents.filter(inc => {
      const ts = inc.timestamp?.toDate ? inc.timestamp.toDate() : new Date(inc.timestamp)
      return ts >= dayStart && ts < dayEnd
    }).length

    if (count > maxCount) maxCount = count
    chart.push({ label: dayStr, count })
  }

  return chart.map(d => ({
    ...d,
    pct: maxCount > 0 ? Math.max((d.count / maxCount) * 100, 0) : 0,
  }))
}
