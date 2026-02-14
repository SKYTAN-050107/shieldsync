import { AlertTriangle, Car, ShieldAlert, Siren, MapPin, ThumbsUp } from 'lucide-react'

const incidentTypes = {
  crime: { icon: ShieldAlert, color: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30' },
  accident: { icon: Car, color: 'text-warning-400', bg: 'bg-warning-500/10', border: 'border-warning-500/30' },
  hazard: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  emergency: { icon: Siren, color: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30' }
}

export default function IncidentCard({ incident, onClick }) {
  const type = incidentTypes[incident.type] || incidentTypes.hazard
  const Icon = type.icon

  return (
    <div
      onClick={() => onClick && onClick(incident)}
      className={`glass-card p-4 rounded-2xl border ${type.border}
                 transition-all hover:scale-[1.01] cursor-pointer active:scale-[0.99]`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`h-11 w-11 rounded-xl ${type.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} className={type.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className={`font-bold text-base leading-tight ${type.color}`}>
              {incident.description || 'Unknown Incident'}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 whitespace-nowrap">
              {incident.timeAgo || 'Just now'}
            </span>
          </div>

          <p className="text-white/40 text-sm mt-1.5 flex items-center gap-1.5">
            <MapPin size={12} className="flex-shrink-0" />
            {incident.locationName || 'Near your location'}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-6 w-6 rounded-full bg-white/10 border-2 border-surface-800" />
              ))}
            </div>
            <span className="text-xs font-medium text-white/30 flex items-center gap-1">
              <ThumbsUp size={12} />
              +{incident.confirmations || 0} confirmed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
