import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    User, Shield, Bell, Mail, Wallet, 
    Smartphone, Lock, ChevronRight, ExternalLink 
} from 'lucide-react'
import { auth } from '../services/firebase'

export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState('Account Security')
    const user = auth.currentUser

    const tabs = [
        { name: 'Profile', icon: User },
        { name: 'Account Security', icon: Shield },
        { name: 'Notifications', icon: Bell },
    ]

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-montserrat font-black text-white tracking-tight">
                    Settings
                </h1>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar */}
                <aside className="w-full lg:w-64 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.name
                        return (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive 
                                    ? 'bg-primary-600/20 text-white border border-primary-500/30' 
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}
                            >
                                <Icon size={18} className={isActive ? 'text-accent-400' : ''} />
                                <span className="font-semibold text-sm">{tab.name}</span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                    />
                                )}
                            </button>
                        )
                    })}
                </aside>

                {/* Settings Content */}
                <main className="flex-1 space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">{activeTab}</h2>

                    {activeTab === 'Account Security' && (
                        <div className="space-y-6">
                            {/* Account Informations */}
                            <section className="glass-card rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Account Informations</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-white/50 mb-1">Email address</p>
                                            <p className="text-white font-medium">{user?.email || 'user@example.com'}</p>
                                            <p className="text-xs text-white/30 mt-1">If you need to change your e-mail address, please contact Customer Service</p>
                                        </div>
                                        <button className="text-accent-400 text-sm font-bold hover:underline">
                                            Customer Service
                                        </button>
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-white/50 mb-1">Wallet address</p>
                                            <p className="text-white/40 italic">Log in with your preferred wallet address</p>
                                        </div>
                                        <button className="px-5 py-2 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                                            Connect wallet
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Security Settings */}
                            <section className="glass-card rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0 text-accent-400">
                                                <Smartphone size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">Google Authenticator (2FA)</p>
                                                <p className="text-sm text-white/40">Use the Authenticator to get verification codes for better security.</p>
                                            </div>
                                        </div>
                                        <div className="w-12 h-6 rounded-full bg-accent-500 p-1 cursor-pointer">
                                            <div className="w-4 h-4 rounded-full bg-white ml-auto" />
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 text-primary-400">
                                                <Lock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">Password</p>
                                                <p className="text-sm text-white/40">Set a unique password for better protection</p>
                                            </div>
                                        </div>
                                        <button className="px-5 py-2 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                                            Change password
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Devices and Activities */}
                            <section className="glass-card rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Devices and Activities</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-white font-bold">Device Management</p>
                                            <p className="text-sm text-white/40">Authorize devices with access to your account</p>
                                        </div>
                                        <button className="px-5 py-2 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                                            Manage
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                        <div className="w-12 h-12 rounded-xl bg-surface-600 flex items-center justify-center text-white/60">
                                            <Smartphone size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-white font-bold">Arc on macOS</p>
                                                <span className="text-[10px] bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full font-bold">Current session</span>
                                            </div>
                                            <p className="text-xs text-white/30 mt-0.5">In use: 126</p>
                                        </div>
                                        <ChevronRight size={18} className="text-white/20" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab !== 'Account Security' && (
                        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 mb-4">
                                <IconComponent name={activeTab} size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{activeTab}</h3>
                            <p className="text-white/40 max-w-sm">
                                This section is coming soon in the production version. 
                                Currently optimized for the Account Security demo.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

function IconComponent({ name, size }) {
    if (name === 'Profile') return <User size={size} />
    if (name === 'Notifications') return <Bell size={size} />
    return <Shield size={size} />
}
