// src/components/PointsDisplay.jsx
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Star, Zap, Award } from 'lucide-react'

const RANKS = [
  { min: 0,   label: 'Observer',       icon: '👁️',  color: 'text-white/60' },
  { min: 10,  label: 'Reporter',       icon: '📝',  color: 'text-primary-400' },
  { min: 50,  label: 'Guardian',       icon: '🛡️',  color: 'text-accent-400' },
  { min: 100, label: 'Sentinel',       icon: '⚡',  color: 'text-warning-400' },
  { min: 250, label: 'Protector',      icon: '🏆',  color: 'text-yellow-400' },
  { min: 500, label: 'Shield Master',  icon: '👑',  color: 'text-amber-300' },
]

function getRank(points) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (points >= r.min) rank = r
  }
  return rank
}

function getNextRank(points) {
  for (const r of RANKS) {
    if (points < r.min) return r
  }
  return null
}

function AnimatedCounter({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const start = display
    const diff = value - start
    if (diff === 0) return
    const startTime = performance.now()

    const animate = (time) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + diff * eased))
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate)
      }
    }
    ref.current = requestAnimationFrame(animate)
    return () => ref.current && cancelAnimationFrame(ref.current)
  }, [value])

  return <span>{display}</span>
}

export default function PointsDisplay({ stats, loading }) {
  const points = stats?.totalPoints || 0
  const count = stats?.incidentCount || 0
  const rank = getRank(points)
  const nextRank = getNextRank(points)
  const progressPct = nextRank
    ? ((points - rank.min) / (nextRank.min - rank.min)) * 100
    : 100

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-20 bg-white/5 rounded-xl" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-warning-400" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Your Points</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10`}>
            <span className="text-sm">{rank.icon}</span>
            <span className={`text-xs font-bold ${rank.color}`}>{rank.label}</span>
          </div>
        </div>

        {/* Points Number */}
        <div className="flex items-end gap-3 mb-1">
          <p className="text-5xl font-black text-white leading-none">
            <AnimatedCounter value={points} />
          </p>
          <span className="text-sm font-bold text-primary-400 mb-1">pts</span>
        </div>

        {/* Sub stats */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-accent-400" />
            <span className="text-xs text-white/40 font-medium">{count} reports</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-warning-400" />
            <span className="text-xs text-white/40 font-medium">+5 pts/report</span>
          </div>
        </div>

        {/* Progress to Next Rank */}
        {nextRank && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Next: {nextRank.icon} {nextRank.label}
              </span>
              <span className="text-[10px] font-bold text-white/30">
                {points}/{nextRank.min}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPct, 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
              />
            </div>
          </div>
        )}

        {!nextRank && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Award size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-300">Max Rank Achieved!</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
