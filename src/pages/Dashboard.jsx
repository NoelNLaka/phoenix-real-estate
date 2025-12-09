import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Building, Users, FileText, DollarSign } from 'lucide-react'

export default function Dashboard() {
    const [stats, setStats] = useState({
        properties: 0,
        clients: 0,
        activeLeases: 0,
        revenue: 0
    })

    useEffect(() => {
        fetchStats()
    }, [])

    async function fetchStats() {
        const { count: propertiesCount } = await supabase.from('properties').select('*', { count: 'exact', head: true })
        const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true })
        const { data: leases } = await supabase.from('leases').select('status, total_amount')

        const activeLeases = leases?.filter(l => l.status === 'active').length || 0
        const revenue = leases?.reduce((sum, l) => sum + (Number(l.total_amount) || 0), 0) || 0

        setStats({
            properties: propertiesCount || 0,
            clients: clientsCount || 0,
            activeLeases,
            revenue
        })
    }

    const cards = [
        { label: 'Total Properties', value: stats.properties, icon: Building, color: 'hsl(var(--primary))' },
        { label: 'Total Clients', value: stats.clients, icon: Users, color: 'hsl(210, 100%, 50%)' },
        { label: 'Active Leases', value: stats.activeLeases, icon: FileText, color: 'hsl(var(--success))' },
        { label: 'Total Revenue', value: `K${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'hsl(var(--warning))' },
    ]

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h1 style={{ marginBottom: 'var(--space-xs)' }}>Dashboard</h1>
                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', margin: 0 }}>
                    Welcome back! Here's an overview of your real estate portfolio.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-lg)',
                marginBottom: 'var(--space-2xl)'
            }}>
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={card.label}
                            className="card"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-md)',
                                background: `linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-card) / 0.6) 100%)`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '100px',
                                height: '100px',
                                background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                                pointerEvents: 'none'
                            }} />

                            <div style={{
                                padding: 'var(--space-sm)',
                                borderRadius: 'var(--radius-md)',
                                background: `${card.color}15`,
                                border: `1px solid ${card.color}30`,
                                color: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 15px ${card.color}15`,
                                position: 'relative',
                                zIndex: 1,
                                flexShrink: 0
                            }}>
                                <Icon size={22} strokeWidth={2.5} />
                            </div>

                            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                                <p style={{
                                    margin: '0 0 var(--space-xs)',
                                    color: 'hsl(var(--text-secondary))',
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {card.label}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: '1.35rem',
                                    fontWeight: 800,
                                    color: 'hsl(var(--text-primary))',
                                    lineHeight: 1,
                                    letterSpacing: '-0.02em'
                                }}>
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
