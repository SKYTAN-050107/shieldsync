import { NavLink, useLocation } from 'react-router-dom'
import { Home, Map, FileText, Users } from 'lucide-react'

export default function MobileNav() {
  const location = useLocation()

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Map', path: '/safety-map', icon: Map },
    { name: 'Report', path: '/report', icon: FileText },
    { name: 'Watch', path: '/watch', icon: Users }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav px-4 py-2.5 flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        const Icon = tab.icon

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 relative"
          >
            {/* Active background glow */}
            {isActive && (
              <div className="absolute inset-0 bg-primary-600/10 rounded-xl" />
            )}

            <div className={`relative transition-colors duration-300 ${isActive ? 'text-accent-400' : 'text-white/30'
              }`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>

            <span className={`text-[10px] font-semibold tracking-wider transition-colors duration-300 ${isActive ? 'text-accent-400' : 'text-white/30'
              }`}>
              {tab.name}
            </span>

            {/* Active indicator dot */}
            <div className={`h-1 w-5 rounded-full transition-all duration-300 ${isActive
                ? 'bg-gradient-to-r from-primary-500 to-accent-400 shadow-sm shadow-accent-400/50'
                : 'bg-transparent'
              }`} />
          </NavLink>
        )
      })}
    </nav>
  )
}
