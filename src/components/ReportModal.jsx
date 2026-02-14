import React, { useState } from 'react';
import { submitReport } from '../services/reportService';
import { trackEvent } from '../services/firebase';

const REPORT_TYPES = [
  { id: 'crime', label: 'Crime', icon: '🚔', color: 'bg-red-600' },
  { id: 'accident', label: 'Accident', icon: '🚗', color: 'bg-orange-600' },
  { id: 'hazard', label: 'Hazard', icon: '⚠️', color: 'bg-yellow-500' },
  { id: 'harassment', label: 'Harassment', icon: '👤', color: 'bg-purple-600' },
  { id: 'medical', label: 'Medical', icon: '🏥', color: 'bg-blue-600' },
  { id: 'other', label: 'Other', icon: '❓', color: 'bg-slate-600' },
];

export default function ReportModal({ isOpen, onClose, userLocation }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    try {
      const reportData = {
        type: selectedType.id,
        description,
        location: userLocation || { lat: 1.4927, lon: 103.7414 }, // Fallback to JB
        timestamp: new Date().toISOString(),
      };
      
      await submitReport(reportData);
      trackEvent('report_submitted', { type: selectedType.id });
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Report submission failed:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedType(null);
    setDescription('');
    setIsSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 sm:hidden" />
        
        <div className="p-8">
          {isSuccess ? (
            <div className="py-12 text-center">
              <div className="text-6xl mb-6 scale-up animate-bounce">✅</div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Report Received</h2>
              <p className="text-slate-500 font-medium">Thank you for keeping Johor Bahru safe.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {step === 1 ? 'Report Incident' : 'Add Details'}
                  </h2>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    Step {step} of 2
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              {step === 1 ? (
                <div className="grid grid-cols-3 gap-4">
                  {REPORT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type);
                        setStep(2);
                      }}
                      className="flex flex-col items-center gap-3 p-4 rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-95"
                    >
                      <span className="text-3xl">{type.icon}</span>
                      <span className="text-xs font-bold text-slate-700">{type.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100">
                    <span className="text-2xl">{selectedType.icon}</span>
                    <span className="font-bold text-slate-800">{selectedType.label}</span>
                    <button 
                      onClick={() => setStep(1)}
                      className="ml-auto text-xs font-black text-blue-600 uppercase"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                      What's happening?
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the situation briefly..."
                      className="w-full h-32 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:outline-none font-medium resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !description.trim()}
                    className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95
                              ${isSubmitting || !description.trim() ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
