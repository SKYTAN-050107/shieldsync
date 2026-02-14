import { useState, useEffect } from 'react'
import { trackEvent } from '../services/firebase'
import { fetchWatchGroups, joinWatchGroup } from '../services/watchService'
import { Users, UserCheck, Search, Plus, ShieldCheck, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WatchGroupScreen() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('nearby')

  useEffect(() => {
    loadGroups()
    trackEvent('watch_groups_viewed')
  }, [])

  const loadGroups = async () => {
    setLoading(true)
    setTimeout(() => {
      setGroups([
        { id: '1', name: 'Molek Regency Watch', members: 124, status: 'active', risk: 'low' },
        { id: '2', name: 'Taman Molek Block A', members: 45, status: 'patrolling', risk: 'medium' },
        { id: '3', name: 'Molek Pine Guardians', members: 89, status: 'active', risk: 'low' },
      ])
      setLoading(false)
    }, 800)
  }

  const handleJoin = async (groupId) => {
    await joinWatchGroup(groupId)
    alert('Joined group successfully! You will now receive alerts for this area.')
    loadGroups()
  }

  const tabIcons = {
    nearby: Users,
    'my groups': UserCheck,
    discover: Search
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-8 relative z-10">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-700 via-surface-800 to-surface-900" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl" />

        <div className="relative px-6 pt-12 pb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <ShieldCheck size={22} className="text-primary-400" />
            </div>
            <div>
              <h1 className="font-montserrat font-black text-3xl text-white">
                WATCH GROUPS
              </h1>
              <p className="text-white/30 text-sm font-medium">Protect your neighborhood together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 -mt-5 flex gap-2 relative z-10">
        {['nearby', 'my groups', 'discover'].map(tab => {
          const Icon = tabIcons[tab]
          return (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2
                        ${activeTab === tab
                  ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-600/20'
                  : 'glass-card text-white/40 hover:text-white/60'}`}
            >
              <Icon size={14} />
              {tab}
            </motion.button>
          )
        })}
      </div>

      {/* Group List */}
      <div className="px-6 mt-8 space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Users size={40} className="text-primary-400/50" />
            </motion.div>
            <p className="text-white/30 font-bold uppercase tracking-widest text-sm">Searching for groups...</p>
          </div>
        ) : (
          groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-5 rounded-2xl hover-glow transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{group.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-2 w-2 rounded-full bg-safe-400" />
                    <span className="text-xs font-medium text-white/40">{group.members} Members</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                ${group.risk === 'low'
                    ? 'bg-safe-500/10 text-safe-400 border border-safe-500/20'
                    : 'bg-warning-500/10 text-warning-400 border border-warning-500/20'}`}>
                  {group.risk} risk
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-white/10 border-2 border-surface-800" />
                  ))}
                </div>
                <span className="text-xs font-medium text-white/30">
                  <Activity size={12} className="inline mr-1" />
                  +12 active now
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleJoin(group.id)}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-500 
                           text-white font-bold rounded-xl shadow-lg shadow-primary-600/20
                           transition-all text-sm tracking-wide"
              >
                JOIN WATCH
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Group CTA */}
      <div className="px-6 mt-8">
        <motion.button
          whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl 
                     flex flex-col items-center justify-center gap-2 
                     hover:bg-white/[0.02] transition-all group"
        >
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
            <Plus size={20} className="text-white/30 group-hover:text-primary-400 transition-colors" />
          </div>
          <span className="font-bold text-white/20 uppercase tracking-widest text-xs group-hover:text-white/40 transition-colors">
            Create New Group
          </span>
        </motion.button>
      </div>
    </div>
  )
}
