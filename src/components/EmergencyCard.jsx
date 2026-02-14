import { Phone, Navigation, MapPin, Clock, PhoneCall, Shield } from 'lucide-react'

export default function EmergencyCard({ service, onCall, onNavigate }) {
  const typeConfig = {
    police: {
      icon: Shield,
      label: 'Police',
      borderColor: 'border-primary-600/30',
      glowColor: 'shadow-primary-500/10',
      iconBg: 'bg-primary-500/15',
      iconColor: 'text-primary-400',
      gradientFrom: 'from-primary-600',
      gradientTo: 'to-primary-500',
      shadowColor: 'shadow-primary-600/30'
    },
    fire: {
      icon: () => <span className="text-2xl">🔥</span>,
      label: 'Fire Station',
      borderColor: 'border-warning-600/30',
      glowColor: 'shadow-warning-500/10',
      iconBg: 'bg-warning-500/15',
      iconColor: 'text-warning-400',
      gradientFrom: 'from-warning-600',
      gradientTo: 'to-warning-500',
      shadowColor: 'shadow-warning-600/30'
    },
    hospital: {
      icon: () => <span className="text-2xl">🏥</span>,
      label: 'Hospital',
      borderColor: 'border-safe-600/30',
      glowColor: 'shadow-safe-500/10',
      iconBg: 'bg-safe-500/15',
      iconColor: 'text-safe-400',
      gradientFrom: 'from-safe-600',
      gradientTo: 'to-safe-500',
      shadowColor: 'shadow-safe-600/30'
    }
  }

  const config = typeConfig[service.type] || typeConfig.police
  const IconComponent = config.icon

  return (
    <div className={`glass-card rounded-2xl p-5 ${config.borderColor} border
                    hover-glow cursor-pointer transition-all duration-300`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
            <IconComponent size={24} className={config.iconColor} />
          </div>
          <div>
            <h3 className="font-inter font-bold text-base text-white">
              {service.name}
            </h3>
            <p className="text-sm text-white/40 mt-0.5">
              {service.address}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="px-2.5 py-1 bg-safe-500/10 rounded-full border border-safe-500/30
                       flex items-center gap-1.5 shrink-0">
          <div className="h-1.5 w-1.5 bg-safe-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-safe-400">
            {service.status === 'open24hr' ? '24HR' : service.status || '24HR'}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
          <MapPin size={16} className="text-white/30 mx-auto mb-1" />
          <div className="text-[10px] text-white/30 mb-0.5 uppercase font-bold tracking-wider">Dist</div>
          <div className="font-bold text-white/90 text-sm">
            {service.distance?.toFixed(1)} km
          </div>
        </div>

        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
          <Clock size={16} className="text-white/30 mx-auto mb-1" />
          <div className="text-[10px] text-white/30 mb-0.5 uppercase font-bold tracking-wider">ETA</div>
          <div className="font-bold text-white/90 text-sm">
            ~{service.responseTime || 10}m
          </div>
        </div>

        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
          <PhoneCall size={16} className="text-white/30 mx-auto mb-1" />
          <div className="text-[10px] text-white/30 mb-0.5 uppercase font-bold tracking-wider">
            {service.type === 'hospital' ? 'Wait' : 'Calls'}
          </div>
          <div className="font-bold text-white/90 text-sm">
            {service.callsToday || service.emergencyWait || 0}
            {service.type === 'hospital' ? 'm' : ''}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={(e) => { e.stopPropagation(); onCall(service); }}
          className={`py-3 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}
                     text-white font-bold text-sm rounded-xl hover:scale-[1.03] active:scale-95
                     transition-transform shadow-lg ${config.shadowColor} flex items-center justify-center gap-2`}
        >
          <Phone size={16} />
          Call Now
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(service); }}
          className="py-3 bg-white/[0.06] text-white/70 border border-white/10
                   font-bold text-sm rounded-xl hover:bg-white/10 active:scale-95
                   transition-all flex items-center justify-center gap-2"
        >
          <Navigation size={16} />
          Navigate
        </button>
      </div>
    </div>
  )
}
