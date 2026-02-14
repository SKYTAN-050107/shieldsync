import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth, trackEvent } from '../services/firebase'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignUpPage() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSignUp = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setIsLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(userCredential.user, { displayName: name })
            
            trackEvent('signup_success', { method: 'email' })
            navigate('/dashboard')
        } catch (err) {
            console.error('Signup error:', err)
            setError(err.message || 'Failed to create account. Please try again.')
            trackEvent('signup_failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialSignUp = async (provider) => {
        setIsLoading(true)
        setError('')
        try {
            if (provider === 'google') {
                const googleProvider = new GoogleAuthProvider()
                await signInWithPopup(auth, googleProvider)
                trackEvent('social_signup_success', { provider })
                navigate('/dashboard')
            }
        } catch (err) {
            console.error('Social signup error:', err)
            setError('Failed to sign up with Google. Please try again.')
            trackEvent('social_signup_failed', { provider })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a1628 100%)' }}>

            {/* Dark overlay gradient */}
            <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.5) 0%, rgba(17, 24, 39, 0.4) 50%, rgba(10, 22, 40, 0.6) 100%)' }} />

            {/* Floating glass orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] right-[15%] w-40 h-40 rounded-full opacity-25 animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, transparent 70%)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(34, 211, 238, 0.1)',
                    }} />
                <div className="absolute bottom-[20%] left-[15%] w-32 h-32 rounded-full opacity-20 animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(59, 130, 246, 0.08)',
                        animationDelay: '1s',
                    }} />
                <div className="absolute top-[55%] left-[35%] w-20 h-20 rounded-full opacity-15 animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, transparent 70%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(96, 165, 250, 0.06)',
                        animationDelay: '2s',
                    }} />
            </div>

            {/* Sign Up Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] relative z-10 rounded-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%)',
                    backdropFilter: 'blur(48px) saturate(200%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                }}
            >
                {/* Header */}
                <div className="text-center pt-8 pb-2 px-7">
                    <div className="mx-auto mb-4 w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)',
                            border: '1px solid rgba(34, 211, 238, 0.15)',
                        }}>
                        <img src="/assets/logos/image-removebg-preview.png" alt="ShieldSync" className="w-9 h-9 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/95">
                        Create Account
                    </h1>
                    <p className="text-white/45 text-sm mt-1">
                        Join ShieldSync to protect your community
                    </p>
                </div>

                {/* Form */}
                <div className="px-7 pb-7 pt-4 space-y-5">
                    {error && (
                        <div className="px-4 py-2.5 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/10
                           text-white/90 placeholder:text-white/25 text-sm
                           focus:ring-1 focus:ring-accent-400/40 focus:border-accent-400/30 
                           focus:bg-white/[0.08] transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="signup-email" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                                <input
                                    id="signup-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/10
                           text-white/90 placeholder:text-white/25 text-sm
                           focus:ring-1 focus:ring-accent-400/40 focus:border-accent-400/30 
                           focus:bg-white/[0.08] transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="signup-password" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                                <input
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-11 pl-10 pr-11 rounded-xl bg-white/[0.06] border border-white/10
                           text-white/90 placeholder:text-white/25 text-sm
                           focus:ring-1 focus:ring-accent-400/40 focus:border-accent-400/30 
                           focus:bg-white/[0.08] transition-all duration-200 outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="confirm-password" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                                <input
                                    id="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/10
                           text-white/90 placeholder:text-white/25 text-sm
                           focus:ring-1 focus:ring-accent-400/40 focus:border-accent-400/30 
                           focus:bg-white/[0.08] transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-xl font-bold text-sm transition-all duration-300 
                       flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)',
                                color: 'white',
                                boxShadow: '0 4px 16px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                            }}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <ArrowRight size={16} />}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSocialSignUp('Google')}
                            className="flex-1 h-11 rounded-xl bg-transparent border border-white/10 text-white/70 
                       hover:bg-white/[0.06] hover:text-white/90 hover:border-white/15 
                       transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 2.43-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>

                        <button
                            onClick={() => handleSocialSignUp('Apple')}
                            className="flex-1 h-11 rounded-xl bg-transparent border border-white/10 text-white/70 
                       hover:bg-white/[0.06] hover:text-white/90 hover:border-white/15 
                       transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                            </svg>
                            Apple
                        </button>

                        <button
                            onClick={() => handleSocialSignUp('Meta')}
                            className="flex-1 h-11 rounded-xl bg-transparent border border-white/10 text-white/70 
                       hover:bg-white/[0.06] hover:text-white/90 hover:border-white/15 
                       transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                            </svg>
                            Meta
                        </button>
                    </div>

                    {/* Login link */}
                    <p className="text-center text-xs text-white/35">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent-300/70 hover:text-accent-300 transition-colors font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
