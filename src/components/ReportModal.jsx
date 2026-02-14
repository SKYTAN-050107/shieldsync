import { useState } from 'react'
import { submitReport } from '../services/reportService'
import { trackEvent } from '../services/firebase'
import { X, ShieldAlert, Car, AlertTriangle, UserX, Cross, HelpCircle, Mic, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const REPORT_TYPES = [
  { id: 'crime', label: 'Crime', icon: ShieldAlert, color: 'text-danger-400', bg: 'bg-danger-500/15', activeBorder: 'border-danger-500/50' },
  { id: 'accident', label: 'Accident', icon: Car, color: 'text-warning-400', bg: 'bg-warning-500/15', activeBorder: 'border-warning-500/50' },
  { id: 'hazard', label: 'Hazard', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/15', activeBorder: 'border-yellow-500/50' },
  { id: 'harassment', label: 'Harassment', icon: UserX, color: 'text-purple-400', bg: 'bg-purple-500/15', activeBorder: 'border-purple-500/50' },
  { id: 'medical', label: 'Medical', icon: Cross, color: 'text-primary-400', bg: 'bg-primary-500/15', activeBorder: 'border-primary-500/50' },
  { id: 'other', label: 'Other', icon: HelpCircle, color: 'text-white/50', bg: 'bg-white/5', activeBorder: 'border-white/30' },
]

export default function ReportModal({ isOpen, onClose, userLocation }) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!selectedType) return

    setIsSubmitting(true)
    try {
      const loc = userLocation || { lat: 1.4927, lon: 103.7414 }
      const reportData = {
        type: selectedType.id,
        description,
        location: loc,        // submitReport extracts lat/lon from this
      }

      await submitReport(reportData)
      trackEvent('report_submitted', { type: selectedType.id })

      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      console.error('Report submission failed:', error)
      alert('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedType(null)
    setDescription('')
    setIsSuccess(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-lg bg-surface-800 rounded-t-[2rem] sm:rounded-[2rem] 
                   overflow-hidden shadow-2xl border border-white/5"
      >

        {/* Handle for mobile */}
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="py-12 text-center"
              >
                <div className="h-20 w-20 rounded-full bg-safe-500/15 flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-safe-400 text-5xl"
                  >
                    ✓
                  </motion.div>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Report Received</h2>
                <p className="text-white/40 font-medium">Thank you for keeping Johor Bahru safe.</p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      {step === 1 ? 'Report Incident' : 'Add Details'}
                    </h2>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">
                      Step {step} of 2
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 
                               text-white/40 hover:bg-white/10 hover:text-white/60 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {step === 1 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {REPORT_TYPES.map((type) => {
                      const Icon = type.icon
                      return (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedType(type)
                            setStep(2)
                          }}
                          className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border 
                                     border-white/5 hover:border-primary-500/30 transition-all ${type.bg}`}
                        >
                          <Icon size={28} className={type.color} />
                          <span className="text-xs font-bold text-white/60">{type.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className={`flex items-center gap-3 p-3.5 rounded-xl ${selectedType.bg} border ${selectedType.activeBorder}`}>
                      {(() => { const Icon = selectedType.icon; return <Icon size={20} className={selectedType.color} /> })()}
                      <span className="font-bold text-white/80">{selectedType.label}</span>
                      <button
                        onClick={() => setStep(1)}
                        className="ml-auto text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-wider"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                        What's happening?
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the situation briefly..."
                        className="w-full h-28 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 
                                   focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/20
                                   font-medium resize-none text-white placeholder-white/20 text-sm"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmit}
                      disabled={isSubmitting || !description.trim()}
                      className={`w-full py-3.5 rounded-xl font-bold text-white shadow-xl transition-all text-sm
                                flex items-center justify-center gap-2
                                ${isSubmitting || !description.trim()
                          ? 'bg-white/10 text-white/30 shadow-none cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-600 to-accent-500 shadow-primary-600/20 hover:shadow-primary-600/40'}`}
                    >
                      <Send size={16} />
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
