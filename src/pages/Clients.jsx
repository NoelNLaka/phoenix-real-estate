import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, User, Phone, Mail } from 'lucide-react'
import Modal from '../components/Modal'

export default function Clients() {
    const [clients, setClients] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        preferences: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchClients()
    }, [])

    async function fetchClients() {
        const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
        if (data) setClients(data)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('clients').insert([formData])
        if (error) alert(error.message)
        else {
            setIsModalOpen(false)
            fetchClients()
            setFormData({ full_name: '', email: '', phone: '', preferences: '' })
        }
        setLoading(false)
    }

    const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--space-xs)' }}>Clients</h1>
                    <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', margin: 0 }}>
                        Manage your client relationships and preferences
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} />
                    Add Client
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Preferences</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-dark)))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            flexShrink: 0,
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }}>
                                            <User size={16} />
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{client.full_name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'hsl(var(--text-secondary))' }}>
                                        <Mail size={14} />
                                        <span>{client.email}</span>
                                    </div>
                                </td>
                                <td>
                                    {client.phone ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'hsl(var(--text-secondary))' }}>
                                            <Phone size={14} />
                                            <span>{client.phone}</span>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>—</span>
                                    )}
                                </td>
                                <td>
                                    <span style={{
                                        color: 'hsl(var(--text-secondary))',
                                        fontSize: '0.85rem',
                                        display: 'block',
                                        maxWidth: '300px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {client.preferences || '—'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && (
                    <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', margin: 0 }}>
                            No clients found. Add your first client to get started!
                        </p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 890" />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Preferences</label>
                        <textarea
                            value={formData.preferences}
                            onChange={e => setFormData({ ...formData, preferences: e.target.value })}
                            placeholder="E.g., Looking for 2BHK downtown"
                            style={{ minHeight: '80px', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Client'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
