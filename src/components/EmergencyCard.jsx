export default function EmergencyCard({ service, onCall, onNavigate }) {
  const typeConfig = {
    police: {
      icon: '🚓',
      borderColor: 'border-blue-600',
      bgColor: 'bg-blue-50',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-blue-700'
    },
    fire: {
      icon: '🚒',
      borderColor: 'border-orange-600',
      bgColor: 'bg-orange-50',
      gradientFrom: 'from-orange-600',
      gradientTo: 'to-orange-700'
    },
    hospital: {
      icon: '🏥',
      borderColor: 'border-green-600',
      bgColor: 'bg-green-50',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-green-700'
    }
  }
  
  const config = typeConfig[service.type] || typeConfig.police
  
  return (
    <div className={`glass-alert rounded-2xl p-5 border-2 ${config.borderColor}
                    hover-lift cursor-pointer transition-all duration-300`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{config.icon}</div>
          <div>
            <h3 className="font-inter font-bold text-xl text-gray-900">
              {service.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {service.address}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="px-3 py-1 bg-green-100 rounded-full border-2 border-green-600
                       flex items-center gap-2 shrink-0">
          <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-green-700">
            {service.status || 'Open 24hr'}
          </span>
        </div>
      </div>
      
      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-100/50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">📍</div>
          <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Distance</div>
          <div className="font-bold text-gray-900">
            {service.distance?.toFixed(1)} km
          </div>
        </div>
        
        <div className="bg-gray-100/50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Response</div>
          <div className="font-bold text-gray-900">
            ~{service.responseTime || 10} min
          </div>
        </div>
        
        <div className="bg-gray-100/50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">📞</div>
          <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">
            {service.type === 'hospital' ? 'Wait' : 'Today'}
          </div>
          <div className="font-bold text-gray-900">
            {service.callsToday || service.emergencyWait || 0}
            {service.type === 'hospital' ? 'm' : ''}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); onCall(service); }}
          className={`py-3 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}
                     text-white font-bold rounded-xl hover:scale-105 active:scale-95
                     transition-transform shadow-lg shadow-black/10`}
        >
          📞 Call Now
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(service); }}
          className="py-3 bg-white text-slate-700 border-2 border-slate-200 
                   font-bold rounded-xl hover:bg-slate-50 active:scale-95
                   transition-all shadow-md"
        >
          🗺️ Navigate
        </button>
      </div>
    </div>
  )
}
