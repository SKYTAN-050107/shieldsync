// src/components/AiInsightsPanel.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, MapPin, User, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react'
import { generateNeighborhoodSummary, generateUserContributionSummary, generateSafetyTips } from '../services/geminiService'

const TAB_OPTIONS = [
  { id: 'neighborhood', label: 'Area', icon: MapPin },
  { id: 'contribution', label: 'You', icon: User },
  { id: 'tips', label: 'Tips', icon: ShieldCheck },
]

export default function AiInsightsPanel({ userLocation, incidents, userStats, userIncidents }) {
  const [activeTab, setActiveTab] = useState('neighborhood')
  const [neighborhoodSummary, setNeighborhoodSummary] = useState('')
  const [contributionSummary, setContributionSummary] = useState('')
  const [safetyTips, setSafetyTips] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState({})

  const fetchInsight = async (tab) => {
    if (hasLoaded[tab]) return
    setLoading(true)

    try {
      if (tab === 'neighborhood' && userLocation) {
        const result = await generateNeighborhoodSummary(
          userLocation.lat, userLocation.lon, incidents
        )
        setNeighborhoodSummary(result.summary)
      } else if (tab === 'contribution') {
        const result = await generateUserContributionSummary(
          userStats || { totalPoints: 0, incidentCount: 0 },
          userIncidents || []
        )
        setContributionSummary(result.summary)
      } else if (tab === 'tips') {
        const result = await generateSafetyTips(incidents)
        setSafetyTips(result.tips)
      }
      setHasLoaded(prev => ({ ...prev, [tab]: true }))
    } catch (err) {
      console.error('[ShieldSync] AI Insight error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsight(activeTab)
  }, [activeTab])

  const handleRefresh = () => {
    setHasLoaded(prev => ({ ...prev, [activeTab]: false }))
    fetchInsight(activeTab)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-5/6" />
          <div className="h-4 bg-white/5 rounded w-4/6" />
        </div>
      )
    }

    if (activeTab === 'neighborhood') {
      return (
        <p className="text-sm text-white/70 leading-relaxed font-medium">
          {neighborhoodSummary || 'Loading area insights...'}
        </p>
      )
    }

    if (activeTab === 'contribution') {
      return (
        <p className="text-sm text-white/70 leading-relaxed font-medium">
          {contributionSummary || 'Submit reports to see your contribution summary.'}
        </p>
      )
    }

    if (activeTab === 'tips') {
      return (
        <div className="space-y-2.5">
          {safetyTips.length > 0 ? safetyTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white/70 font-medium"
            >
              {tip}
            </motion.div>
          )) : (
            <p className="text-sm text-white/40">Loading safety tips...</p>
          )}
        </div>
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden"
    >
      {/* Header glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-accent-500/20 
                          flex items-center justify-center border border-purple-500/20">
              <Brain size={16} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Safety Insights</h3>
              <p className="text-[10px] text-white/30 font-medium">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                       hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <RefreshCw size={14} className={`text-white/40 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-4">
          {TAB_OPTIONS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${isActive
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25'
                    : 'bg-white/[0.03] text-white/40 border border-white/5 hover:bg-white/[0.06]'
                  }`}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-[80px]"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Gemini badge */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-white/5">
          <Sparkles size={10} className="text-purple-400/50" />
          <span className="text-[9px] font-medium text-white/20 uppercase tracking-widest">
            Gemini 2.0 Flash • Insights may vary
          </span>
        </div>
      </div>
    </motion.div>
  )
}
