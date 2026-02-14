import React, { useState, useEffect } from 'react';
import { trackEvent } from '../services/firebase';
import { fetchWatchGroups, joinWatchGroup } from '../services/watchService';

export default function WatchGroupScreen() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('nearby');

  useEffect(() => {
    loadGroups();
    trackEvent('watch_groups_viewed');
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setGroups([
        { id: '1', name: 'Molek Regency Watch', members: 124, status: 'active', risk: 'low' },
        { id: '2', name: 'Taman Molek Block A', members: 45, status: 'patrolling', risk: 'medium' },
        { id: '3', name: 'Molek Pine Guardians', members: 89, status: 'active', risk: 'low' },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleJoin = async (groupId) => {
    await joinWatchGroup(groupId);
    alert('Joined group successfully! You will now receive alerts for this area.');
    loadGroups();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-10 rounded-b-[2.5rem] shadow-xl">
        <h1 className="font-montserrat font-black text-4xl text-white mb-2">
          WATCH GROUPS
        </h1>
        <p className="text-slate-400 font-medium">Protect your neighborhood together</p>
      </div>

      {/* Tabs */}
      <div className="px-6 -mt-6 flex gap-2">
        {['nearby', 'my groups', 'discover'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg
                      ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Group List */}
      <div className="px-6 mt-8 space-y-4">
        {loading ? (
          <div className="py-20 text-center animate-pulse">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-slate-400 font-bold uppercase tracking-widest">Searching for groups...</p>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.id} className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-xl text-slate-900">{group.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase">{group.members} Members</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase
                                ${group.risk === 'low' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {group.risk} risk
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400">+12 active now</span>
              </div>

              <button
                onClick={() => handleJoin(group.id)}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl active:scale-95 transition-all"
              >
                JOIN WATCH
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Group CTA */}
      <div className="px-6 mt-10">
        <button className="w-full py-6 border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:bg-white transition-colors">
          <span className="text-3xl">➕</span>
          <span className="font-black text-slate-400 uppercase tracking-widest text-sm">Create New Group</span>
        </button>
      </div>
    </div>
  );
}
