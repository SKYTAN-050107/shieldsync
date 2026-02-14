import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import {
    Home, Map, FileText, Users, Settings,
    X, Menu, Shield, ChevronLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Safety Map', path: '/dashboard/map', icon: Map },
    { name: 'Report Incident', path: '/dashboard/report', icon: FileText },
    { name: 'Watch Groups', path: '/dashboard/watch', icon: Users },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
    const isMobile = useIsMobile()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const sidebarWidth = collapsed ? 72 : 256

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo Header */}
            <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/[0.06] ${collapsed ? 'justify-center px-3' : ''}`}>
                <img
                    src="/assets/logos/image-removebg-preview.png"
                    alt="ShieldSync"
                    className="w-9 h-9 object-contain flex-shrink-0"
                />
                {!collapsed && (
                    <div>
                        <h1 className="font-montserrat font-black text-base text-white leading-tight tracking-wide">
                            ShieldSync
                        </h1>
                        <p className="text-[10px] font-bold text-accent-400 uppercase tracking-[0.2em]">
                            Safety Hub
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className={`text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 ${collapsed ? 'text-center' : 'px-3'}`}>
                    {collapsed ? '—' : 'Navigation'}
                </p>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path ||
                        (item.path === '/dashboard' && location.pathname === '/dashboard')

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => isMobile && setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                                    ? 'bg-primary-600/15 text-white'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}
                ${collapsed ? 'justify-center' : ''}`}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-primary-400 to-accent-400 rounded-r-full" />
                            )}

                            <Icon
                                size={20}
                                strokeWidth={isActive ? 2.2 : 1.6}
                                className={`flex-shrink-0 transition-colors ${isActive ? 'text-accent-400' : ''}`}
                            />

                            {!collapsed && (
                                <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-white' : ''}`}>
                                    {item.name}
                                </span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className={`px-4 py-4 border-t border-white/[0.06] ${collapsed ? 'px-3' : ''}`}>
                {!collapsed && (
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center flex-shrink-0">
                            <Shield size={16} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white/80 truncate">JB Resident</p>
                            <p className="text-[11px] text-white/30 truncate">Johor Bahru</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="flex justify-center">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                            <Shield size={16} className="text-white" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    // ===== MOBILE: Hamburger + Drawer =====
    if (isMobile) {
        return (
            <>
                {/* Hamburger Button */}
                <button
                    onClick={() => setMobileOpen(true)}
                    className="fixed top-4 left-4 z-[60] h-11 w-11 
                     glass-card-bright rounded-xl flex items-center justify-center
                     hover:border-primary-500/40 transition-all"
                >
                    <Menu size={20} className="text-white/80" />
                </button>

                {/* Drawer Overlay */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                                onClick={() => setMobileOpen(false)}
                            />
                            <motion.div
                                initial={{ x: -280 }}
                                animate={{ x: 0 }}
                                exit={{ x: -280 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed top-0 left-0 bottom-0 w-[280px] z-[80]
                           bg-surface-800 border-r border-white/[0.06]
                           shadow-2xl"
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-white/5 
                             flex items-center justify-center text-white/40
                             hover:bg-white/10 transition-colors z-10"
                                >
                                    <X size={16} />
                                </button>

                                <SidebarContent />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        )
    }

    // ===== DESKTOP: Fixed Sidebar =====
    return (
        <div
            className="fixed top-0 left-0 bottom-0 z-40 
                 bg-surface-800/95 backdrop-blur-xl border-r border-white/[0.06]
                 transition-all duration-300 ease-in-out flex flex-col"
            style={{ width: sidebarWidth }}
        >
            <SidebarContent />

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 h-6 w-6 rounded-full 
                   bg-surface-700 border border-white/10 
                   flex items-center justify-center
                   hover:bg-surface-600 transition-colors z-50"
            >
                <ChevronLeft
                    size={12}
                    className={`text-white/50 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                />
            </button>
        </div>
    )
}

export function useSidebarWidth() {
    const isMobile = useIsMobile()
    // On mobile, sidebar is an overlay so no offset needed
    // On desktop, return the width for content margin  
    return isMobile ? 0 : 256
}
