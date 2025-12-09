import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Building, Users, FileText, LogOut, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

export default function Layout() {
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/properties', label: 'Properties', icon: Building },
        { path: '/clients', label: 'Clients', icon: Users },
        { path: '/leases', label: 'Leases', icon: FileText },
    ]

    return (
        <div className="layout">
            {/* Mobile Header */}
            <header className="mobile-header">
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
                <span className="mobile-logo">PropPNG</span>
            </header>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div style={{
                    padding: '0 var(--space-md)',
                    marginBottom: 'var(--space-2xl)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '1.75rem',
                            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent-light)))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 'var(--space-xs)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em'
                        }}>
                            PropPNG
                        </h2>
                        <p style={{
                            color: 'hsl(var(--text-secondary))',
                            fontSize: '0.8rem',
                            margin: 0,
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            Real Estate Manager
                        </p>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        className="mobile-close-btn"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Icon className="icon" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div style={{
                    marginTop: 'auto',
                    borderTop: '1px solid hsl(var(--border))',
                    paddingTop: 'var(--space-lg)'
                }}>
                    <div
                        className="nav-item"
                        style={{ cursor: 'pointer' }}
                        onClick={handleLogout}
                    >
                        <LogOut className="icon" />
                        Sign Out
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
