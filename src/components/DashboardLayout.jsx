import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useIsMobile } from '../hooks/useIsMobile'

export default function DashboardLayout() {
    const isMobile = useIsMobile()
    const [collapsed, setCollapsed] = useState(false)
    const sidebarWidth = collapsed ? 72 : 256

    return (
        <div className="flex min-h-screen bg-surface-900">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content Area */}
            <main
                className="flex-1 min-h-screen transition-all duration-300"
                style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
            >
                <Outlet />
            </main>
        </div>
    )
}
