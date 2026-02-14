import { useState, useEffect, useRef } from 'react'
import { trackEvent } from '../services/firebase'
import { fetchWatchGroups, joinWatchGroup } from '../services/watchService'
import { 
    Users, UserCheck, Search, Plus, ShieldCheck, 
    Activity, ChevronLeft, Send, MessageSquare, 
    MoreVertical, Info, ShieldAlert, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ALL_MOCK_GROUPS = [
    { id: '1', name: 'Molek Regency Watch', members: 124, status: 'active', risk: 'low', location: 'Taman Molek', recentActivity: 'Illegal parking reported at entrance' },
    { id: '2', name: 'Taman Molek Block A', members: 45, status: 'patrolling', risk: 'medium', location: 'Taman Molek', recentActivity: 'Patrol active at Level 5' },
    { id: '3', name: 'Molek Pine Guardians', members: 89, status: 'active', risk: 'low', location: 'Taman Molek', recentActivity: 'Visitor list updated' },
    { id: '4', name: 'Austin Heights Elite', members: 210, status: 'active', risk: 'low', location: 'Mount Austin', recentActivity: 'Street light repair requested' },
    { id: '5', name: 'Eco Spring Safety', members: 156, status: 'active', risk: 'low', location: 'Tebrau', recentActivity: 'Community run organized for Sunday' },
    { id: '6', name: 'Ponderosa Woods Net', members: 72, status: 'warning', risk: 'medium', location: 'Ponderosa', recentActivity: 'Suspicious vehicle spotted near Gate 2' },
]

const MOCK_MESSAGES = [
    { id: 1, sender: 'Wei Ming', message: 'I noticed some strangers near the back gate.', time: '10:30 AM', type: 'text' },
    { id: 2, sender: 'Sarah Tan', message: 'Yes, I saw them too. They were carrying some delivery boxes.', time: '10:32 AM', type: 'text' },
    { id: 3, sender: 'Security_JB', message: 'Checking CCTV cameras now. Please stay indoors.', time: '10:35 AM', type: 'alert' },
    { id: 4, sender: 'Amir', message: 'They just left in a white van. Plate number JXX 1234.', time: '10:38 AM', type: 'text' },
]

export default function WatchGroupScreen() {
    const [groups, setGroups] = useState([])
    const [myGroups, setMyGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('nearby')
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [chatMessage, setChatMessage] = useState('')
    const chatEndRef = useRef(null)

    useEffect(() => {
        loadGroups()
        trackEvent('watch_groups_viewed')
    }, [])

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [selectedGroup])

    const loadGroups = async () => {
        setLoading(true)
        setTimeout(() => {
            setGroups(ALL_MOCK_GROUPS)
            setMyGroups([ALL_MOCK_GROUPS[0], ALL_MOCK_GROUPS[3]])
            setLoading(false)
        }, 800)
    }

    const handleJoin = async (group) => {
        await joinWatchGroup(group.id)
        if (!myGroups.find(g => g.id === group.id)) {
            setMyGroups(prev => [...prev, group])
        }
        alert(`Joined ${group.name} successfully!`)
    }

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const tabIcons = {
        nearby: Users,
        'my groups': UserCheck,
        discover: Search
    }

    if (selectedGroup) {
        return (
            <div className="min-h-screen bg-surface-900 flex flex-col relative z-20">
                {/* Chat Header */}
                <div className="glass-card-bright sticky top-0 z-30 px-3 md:px-4 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <button 
                            onClick={() => setSelectedGroup(null)}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white flex-shrink-0"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                            <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                                <MessageSquare size={18} className="text-primary-400" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-white font-bold text-sm md:text-base leading-none mb-1 truncate">{selectedGroup.name}</h2>
                                <p className="text-[10px] text-accent-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
                                    {selectedGroup.members} Members Online
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-white/5 text-white/40"><Info size={20} /></button>
                        <button className="p-2 rounded-lg hover:bg-white/5 text-white/40"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="text-center py-6">
                        <span className="px-3 py-1 rounded-full bg-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                            Today
                        </span>
                    </div>

                    {MOCK_MESSAGES.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.type === 'alert' ? 'items-center my-6' : 'items-start'}`}>
                            {msg.type === 'alert' ? (
                                <div className="glass-alert border-danger-500/20 px-6 py-4 rounded-2xl max-w-sm text-center">
                                    <div className="flex items-center justify-center gap-2 text-danger-400 font-black text-xs uppercase tracking-widest mb-2">
                                        <ShieldAlert size={14} />
                                        Security Alert
                                    </div>
                                    <p className="text-white text-sm font-medium">{msg.message}</p>
                                    <p className="text-[10px] text-white/30 mt-2">{msg.time}</p>
                                </div>
                            ) : (
                                <div className="max-w-[80%]">
                                    <p className="text-[11px] font-bold text-accent-400 ml-3 mb-1">{msg.sender}</p>
                                    <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-none">
                                        <p className="text-sm text-white/90 leading-relaxed">{msg.message}</p>
                                    </div>
                                    <p className="text-[10px] text-white/20 mt-1 ml-3">{msg.time}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 glass-nav">
                    <div className="flex items-center gap-2 max-w-3xl mx-auto">
                        <button className="p-3 rounded-xl hover:bg-white/5 text-white/40">
                            <Plus size={20} />
                        </button>
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder="Report or message..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary-500/50"
                            />
                        </div>
                        <button 
                            className={`p-3 rounded-xl transition-all ${chatMessage ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'bg-white/5 text-white/20'}`}
                            onClick={() => setChatMessage('')}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-surface-900 pb-8 relative z-10">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-700 via-surface-800 to-surface-900" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl" />

                <div className="relative px-6 pt-16 md:pt-12 pb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck size={22} className="text-primary-400" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-montserrat font-black text-2xl md:text-3xl text-white">
                                WATCH GROUPS
                            </h1>
                            <p className="text-white/30 text-xs md:text-sm font-medium">Protect your neighborhood together</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 md:px-6 -mt-5 flex gap-2 relative z-10 scrollbar-hide overflow-x-auto pb-2">
                {['nearby', 'my groups', 'discover'].map(tab => {
                    const Icon = tabIcons[tab]
                    return (
                        <motion.button
                            key={tab}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 md:px-5 py-2.5 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0
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

            {/* Discover: Search Bar */}
            <AnimatePresence>
                {activeTab === 'discover' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="px-6 mt-6"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by neighborhood or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary-500/50"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                    <>
                        {(activeTab === 'my groups' ? myGroups : (activeTab === 'discover' ? filteredGroups : groups)).map((group, index) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-5 rounded-2xl hover-glow transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-base md:text-lg text-white truncate">{group.name}</h3>
                                            {activeTab === 'my groups' && (
                                                <div className="h-5 w-5 rounded-full bg-accent-500/10 flex items-center justify-center">
                                                    <Zap size={10} className="text-accent-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-white/40 flex items-center gap-1">
                                                <Activity size={12} />
                                                {group.members} Members
                                            </span>
                                            <span className="text-xs font-medium text-white/40 flex items-center gap-1">
                                                <Users size={12} />
                                                {group.location}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                ${group.risk === 'low'
                                            ? 'bg-safe-500/10 text-safe-400 border border-safe-500/20'
                                            : 'bg-warning-500/10 text-warning-400 border border-warning-500/20'}`}>
                                        {group.risk} risk
                                    </span>
                                </div>

                                <div className="bg-white/[0.03] rounded-xl p-3 mb-5 border border-white/[0.05]">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mb-1">Recent Insight</p>
                                    <p className="text-xs text-white/60 italic">"{group.recentActivity}"</p>
                                </div>

                                {activeTab === 'my groups' ? (
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setSelectedGroup(group)}
                                            className="flex-1 py-3.5 bg-gradient-to-r from-primary-600 to-accent-500 
                                                   text-white font-bold rounded-xl shadow-lg shadow-primary-600/20
                                                   transition-all text-sm tracking-wide flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare size={16} />
                                            OPEN CHAT
                                        </motion.button>
                                        <button className="p-3.5 glass-card rounded-xl text-white/40 hover:text-white/70">
                                            <Info size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleJoin(group)}
                                        className="w-full py-3.5 border border-primary-500/30 text-primary-400 hover:bg-primary-500/5 
                                               font-bold rounded-xl transition-all text-sm tracking-wide"
                                    >
                                        JOIN WATCH
                                    </motion.button>
                                )}
                            </motion.div>
                        ))}

                        {(activeTab === 'my groups' && myGroups.length === 0) && (
                            <div className="py-20 text-center opacity-40">
                                <UserCheck size={40} className="mx-auto mb-4" />
                                <p className="font-bold uppercase tracking-widest text-sm">No groups joined yet</p>
                            </div>
                        )}

                        {(activeTab === 'discover' && filteredGroups.length === 0) && (
                            <div className="py-20 text-center opacity-40">
                                <Search size={40} className="mx-auto mb-4" />
                                <p className="font-bold uppercase tracking-widest text-sm">No results found for "{searchQuery}"</p>
                            </div>
                        )}
                    </>
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
