import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
    Shield, MapPin, AlertTriangle, Users, ArrowRight,
    Phone, Zap, Lock, Eye
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FEATURES = [
    {
        icon: Phone,
        title: 'Emergency Services',
        desc: 'Find nearest police, fire stations & hospitals instantly with one-tap calling.',
        color: 'text-primary-400',
        bg: 'bg-primary-500/10',
        border: 'border-primary-500/20',
        details: [
            'One-tap dialing to 999/994 from the app.',
            'Shows nearest police, fire, and hospitals.',
            'Shares your GPS with responders when allowed.'
        ]
    },
    {
        icon: MapPin,
        title: 'Safety Map',
        desc: 'Real-time safety map with incident markers and service locations.',
        color: 'text-accent-400',
        bg: 'bg-accent-500/10',
        border: 'border-accent-500/20',
        details: [
            'Live incidents, services, and legend clarity.',
            'Pan, zoom, and reset view for easy navigation.',
            'Tap pins to see contact options and details.'
        ]
    },
    {
        icon: AlertTriangle,
        title: 'Incident Reporting',
        desc: 'Report crimes, accidents & hazards anonymously to keep your community safe.',
        color: 'text-warning-400',
        bg: 'bg-warning-500/10',
        border: 'border-warning-500/20',
        details: [
            'Submit anonymous reports with location.',
            'Categorize hazards, crimes, and accidents.',
            'Send quickly to local coordinators.'
        ]
    },
    {
        icon: Users,
        title: 'Watch Groups',
        desc: 'Join neighborhood watch groups and coordinate with your community.',
        color: 'text-safe-400',
        bg: 'bg-safe-500/10',
        border: 'border-safe-500/20',
        details: [
            'Find nearby groups and request to join.',
            'Chat and coordinate with neighbors.',
            'Receive alerts from your watch group.'
        ]
    },
]

const STATS = [
    { value: '24/7', label: 'Always On', icon: Zap },
    { value: '100%', label: 'Anonymous', icon: Lock },
    { value: '50+', label: 'Services', icon: MapPin },
    { value: 'Live', label: 'Tracking', icon: Eye },
]

export default function LandingPage() {
    const navigate = useNavigate()
    const [openFeature, setOpenFeature] = useState(null)

    return (
        <div className="min-h-screen bg-surface-900 relative overflow-hidden">

            {/* Background Ambient Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] 
                       bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] 
                       bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/logos/image-removebg-preview.png"
                            alt="ShieldSync"
                            className="w-10 h-10 object-contain"
                        />
                        <div>
                            <span className="font-montserrat font-black text-lg text-white tracking-wide">
                                ShieldSync
                            </span>
                            <span className="hidden sm:inline text-white/20 font-medium text-sm ml-2">
                                Malaysia
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-white/60 hover:text-white font-semibold text-sm 
                                     transition-colors"
                        >
                            Login
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 
                                     text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-600/20
                                     flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                          bg-primary-500/10 border border-primary-500/20 mb-8">
                        <div className="h-2 w-2 bg-safe-400 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-primary-300 uppercase tracking-widest">
                            Emergency Services • Live
                        </span>
                    </div>

                    {/* Logo */}
                    <motion.img
                        src="/assets/logos/image-removebg-preview.png"
                        alt="ShieldSync"
                        className="w-28 h-28 sm:w-36 sm:h-36 object-contain mx-auto mb-8 drop-shadow-2xl"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    />

                    {/* Title */}
                    <h1 className="font-montserrat font-black text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-6">
                        Your Safety.<br />
                        <span className="gradient-text">Our Priority.</span>
                    </h1>

                    <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                        Find nearest emergency services, report incidents anonymously,
                        and coordinate with your neighborhood watch — all in one place.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary-600 to-accent-500 
                         text-white font-black text-base rounded-2xl shadow-xl shadow-primary-600/25
                         flex items-center justify-center gap-3 tracking-wide"
                        >
                            GET STARTED
                            <ArrowRight size={20} />
                        </motion.button>

                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="tel:999"
                            className="w-full sm:w-auto px-10 py-4 border-2 border-danger-500/40 
                         text-danger-400 font-black text-base rounded-2xl
                         flex items-center justify-center gap-3 tracking-wide
                         hover:bg-danger-500/10 transition-colors"
                        >
                            <Phone size={20} />
                            CALL 999
                        </motion.a>
                    </div>
                </motion.div>
            </section>

            {/* Stats Row */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {STATS.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="glass-card rounded-2xl p-5 text-center"
                            >
                                <Icon size={20} className="text-accent-400 mx-auto mb-2" />
                                <div className="text-2xl font-black text-white">{stat.value}</div>
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mb-14"
                >
                    <h2 className="font-montserrat font-black text-3xl sm:text-4xl text-white mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-white/30 text-base max-w-lg mx-auto">
                        A comprehensive safety platform for the Malaysia citizens.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {FEATURES.map((feature, i) => {
                        const Icon = feature.icon
                        const isOpen = openFeature === i
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className={`glass-card rounded-2xl p-7 border ${feature.border}
                           hover-glow transition-all group cursor-pointer relative overflow-hidden
                           ${isOpen ? 'border-white/20 bg-white/[0.06]' : ''}`}
                                onClick={() => setOpenFeature(isOpen ? null : i)}
                                aria-expanded={isOpen}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center
                                   group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} className={feature.color} />
                                    </div>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 90 : 0, opacity: 0.6 }}
                                        className="text-white/50 text-sm font-bold"
                                    >
                                        ▶
                                    </motion.span>
                                </div>
                                <h3 className="text-lg font-bold text-white mt-4 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-white/35 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.ul
                                            key="details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="mt-4 space-y-2 text-white/50 text-sm"
                                        >
                                            {feature.details.map((line) => (
                                                <li key={line} className="flex items-start gap-2">
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/30" />
                                                    <span>{line}</span>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/[0.04] py-8">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img
                            src="/assets/logos/image-removebg-preview.png"
                            alt="ShieldSync"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-sm font-bold text-white/20">
                            ShieldSync © 2026
                        </span>
                    </div>
                    <p className="text-xs text-white/15">
                        Made for the safety of Malaysia citizens. Developed by Sky. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
