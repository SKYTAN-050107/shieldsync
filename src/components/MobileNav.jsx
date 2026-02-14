import { NavLink } from 'react-router-dom'

export default function MobileNav() {
  const tabs = [
    { name: 'Home', path: '/', icon: '🚨' },
    { name: 'Map', path: '/safety-map', icon: '🗺️' },
    { name: 'Report', path: '/report', icon: '📝' },
    { name: 'Watch', path: '/watch', icon: '👥' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-red-600' : 'text-slate-400'
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{tab.name}</span>
          {/* Active Indicator Bar */}
          <div className={`h-1 w-6 rounded-full transition-all mt-0.5 ${
            window.location.pathname === tab.path ? 'bg-red-600' : 'bg-transparent'
          }`} />
        </NavLink>
      ))}
    </nav>
  )
}
