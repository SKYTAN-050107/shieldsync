import React from 'react';

const incidentTypes = {
  crime: { icon: '🚔', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
  accident: { icon: '🚗', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
  hazard: { icon: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  emergency: { icon: '🚨', color: 'text-red-700', bg: 'bg-red-200', border: 'border-red-300' }
};

export default function IncidentCard({ incident, onClick }) {
  const type = incidentTypes[incident.type] || incidentTypes.hazard;
  
  return (
    <div 
      onClick={() => onClick && onClick(incident)}
      className={`p-4 rounded-2xl border-2 ${type.border} ${type.bg} 
                 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{type.icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-bold text-lg leading-tight ${type.color}`}>
              {incident.description || 'Unknown Incident'}
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap ml-2">
              {incident.timeAgo || 'Just now'}
            </span>
          </div>
          
          <p className="text-slate-600 text-sm mt-1 font-medium">
            📍 {incident.locationName || 'Near your location'}
          </p>
          
          <div className="flex items-center gap-3 mt-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-6 w-6 rounded-full bg-slate-300 border-2 border-white" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500">
              +{incident.confirmations || 0} confirmed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
