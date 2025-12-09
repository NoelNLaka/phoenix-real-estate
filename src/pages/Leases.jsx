import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Calendar, DollarSign } from 'lucide-react'
import Modal from '../components/Modal'

export default function Leases() {
    const [leases, setLeases] = useState([])
    const [properties, setProperties] = useState([])
    const [clients, setClients] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        property_id: '',
        client_id: '',
        start_date: '',
        end_date: '',
        total_amount: '',
        status: 'pending'
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchLeases()
        fetchOptions()
    }, [])

    async function fetchLeases() {
        const { data } = await supabase
            .from('leases')
            .select('*, properties(address, property_type), clients(full_name, email)')
            .order('created_at', { ascending: false })
        if (data) setLeases(data)
    }

    async function fetchOptions() {
        const { data: props } = await supabase.from('properties').select('id, address, status').eq('status', 'available')
        const { data: cls } = await supabase.from('clients').select('id, full_name')
        if (props) setProperties(props)
        if (cls) setClients(cls)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('leases').insert([formData])
        if (error) {
            alert(error.message)
        } else {
            if (formData.status === 'active') {
                await supabase.from('properties').update({ status: 'leased' }).eq('id', formData.property_id)
            }

            setIsModalOpen(false)
            fetchLeases()
            fetchOptions()
            setFormData({
                property_id: '',
                client_id: '',
                start_date: '',
                end_date: '',
                total_amount: '',
                status: 'pending'
            })
        }
        setLoading(false)
    }

    const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--space-xs)' }}>Leases</h1>
                    <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', margin: 0 }}>
                        Manage lease agreements and rental contracts
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} />
                    Create Lease
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Tenant</th>
                            <th>Lease Period</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leases.map((lease) => (
                            <tr key={lease.id}>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>
                                            {lease.properties?.address || 'Unknown Property'}
                                        </div>
                                        <div style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem' }}>
                                            {lease.properties?.property_type}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>
                                            {lease.clients?.full_name || 'Unknown Client'}
                                        </div>
                                        <div style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem' }}>
                                            {lease.clients?.email}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(lease.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            {' - '}
                                            {new Date(lease.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                        <DollarSign size={14} style={{ color: 'hsl(var(--success))' }} />
                                        <span style={{ fontWeight: 600, color: 'hsl(var(--text-primary))', fontSize: '0.9rem' }}>
                                            K{Number(lease.total_amount).toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge status-${lease.status}`}>
                                        {lease.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leases.length === 0 && (
                    <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', margin: 0 }}>
                            No leases found. Create your first lease agreement!
                        </p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lease">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                            <label style={labelStyle}>Property</label>
                            <select required value={formData.property_id} onChange={e => setFormData({ ...formData, property_id: e.target.value })}>
                                <option value="">Select Property</option>
                                {properties.map(p => (
                                    <option key={p.id} value={p.id}>{p.address}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Tenant</label>
                            <select required value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })}>
                                <option value="">Select Tenant</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.full_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                            <label style={labelStyle}>Start Date</label>
                            <input type="date" required value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>End Date</label>
                            <input type="date" required value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                            <label style={labelStyle}>Total Amount</label>
                            <input type="number" required value={formData.total_amount} onChange={e => setFormData({ ...formData, total_amount: e.target.value })} placeholder="K" />
                        </div>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="terminated">Terminated</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Lease'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
