// src/components/RewardsShop.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Coffee, Ticket, ShieldCheck, Star, Lock } from 'lucide-react'

const REWARDS = [
  {
    id: 'coffee',
    name: 'Free Coffee',
    description: 'Redeem at partnered cafés in JB',
    cost: 50,
    icon: Coffee,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    id: 'movie',
    name: 'Movie Ticket',
    description: '1x ticket at any GSC cinema',
    cost: 100,
    icon: Ticket,
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/20',
  },
  {
    id: 'safety-kit',
    name: 'Safety Kit',
    description: 'Mini safety kit with flashlight & whistle',
    cost: 200,
    icon: ShieldCheck,
    color: 'text-safe-400',
    bg: 'bg-safe-500/10',
    border: 'border-safe-500/20',
  },
  {
    id: 'voucher',
    name: 'RM10 GrabFood',
    description: 'Grab voucher for food delivery',
    cost: 150,
    icon: Gift,
    color: 'text-accent-400',
    bg: 'bg-accent-500/10',
    border: 'border-accent-500/20',
  },
]

export default function RewardsShop({ userPoints = 0 }) {
  const [redeemed, setRedeemed] = useState(null)

  const handleRedeem = (reward) => {
    if (userPoints < reward.cost) return
    setRedeemed(reward.id)
    setTimeout(() => setRedeemed(null), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-2xl p-6 border border-white/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-accent-400" />
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Rewards Shop</span>
        </div>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 border border-white/5">
          Mock Preview
        </span>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {REWARDS.map((reward) => {
          const Icon = reward.icon
          const canAfford = userPoints >= reward.cost
          const isRedeemed = redeemed === reward.id

          return (
            <motion.div
              key={reward.id}
              whileHover={{ scale: canAfford ? 1.02 : 1 }}
              className={`relative p-4 rounded-xl border transition-all ${reward.bg} ${reward.border}
                ${!canAfford ? 'opacity-50' : ''}`}
            >
              <AnimatePresence>
                {isRedeemed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-xl bg-safe-500/20 border border-safe-500/30
                               flex items-center justify-center z-10 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎉</div>
                      <p className="text-xs font-bold text-safe-300">Redeemed!</p>
                      <p className="text-[10px] text-white/30">(Demo only)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Icon size={24} className={`${reward.color} mb-2`} />
              <h4 className="text-sm font-bold text-white mb-0.5">{reward.name}</h4>
              <p className="text-[11px] text-white/40 mb-3 leading-snug">{reward.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-warning-400" />
                  <span className="text-xs font-bold text-warning-400">{reward.cost}</span>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                    ${canAfford
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                      : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                    }`}
                >
                  {canAfford ? 'Redeem' : <Lock size={10} />}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
