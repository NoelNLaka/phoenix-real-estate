import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Home, MapPin } from 'lucide-react'
import Modal from '../components/Modal'

export default function Properties() {
    const [properties, setProperties] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        address: '',
        property_type: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        sqft: '',
        price: '',
        status: 'available'
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchProperties()
    }, [])

    async function fetchProperties() {
        const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
        if (data) setProperties(data)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('properties').insert([formData])
        if (error) alert(error.message)
        else {
            setIsModalOpen(false)
            fetchProperties()
            setFormData({
                address: '',
                property_type: 'Apartment',
                bedrooms: 1,
                bathrooms: 1,
                sqft: '',
                price: '',
                status: 'available'
            })
        }
        setLoading(false)
    }

    const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--space-xs)' }}>Properties</h1>
                    <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', margin: 0 }}>
                        Manage your property listings and availability
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} />
                    Add Property
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Size</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                        <MapPin size={15} style={{ color: 'hsl(var(--text-muted))', flexShrink: 0 }} />
                                        <span style={{ fontWeight: 500 }}>{property.address}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'hsl(var(--text-secondary))' }}>
                                        <Home size={14} />
                                        <span>{property.property_type}</span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontWeight: 600, color: 'hsl(var(--text-primary))', fontSize: '0.9rem' }}>
                                        K{Number(property.price).toLocaleString()}
                                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 400 }}>/mo</span>
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: '0.8rem' }}>
                                        <span>{property.bedrooms} <span style={{ color: 'hsl(var(--text-muted))' }}>bd</span></span>
                                        <span>{property.bathrooms} <span style={{ color: 'hsl(var(--text-muted))' }}>ba</span></span>
                                        <span>{property.sqft.toLocaleString()} <span style={{ color: 'hsl(var(--text-muted))' }}>sqft</span></span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge status-${property.status}`}>
                                        {property.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {properties.length === 0 && (
                    <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', margin: 0 }}>
                            No properties found. Add your first property to get started!
                        </p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Property">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div>
                        <label style={labelStyle}>Address</label>
                        <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="123 Main St, City" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                            <label style={labelStyle}>Type</label>
                            <select value={formData.property_type} onChange={e => setFormData({ ...formData, property_type: e.target.value })}>
                                <option>Apartment</option>
                                <option>House</option>
                                <option>Commercial</option>
                                <option>Condo</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Price</label>
                            <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="K" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                            <label style={labelStyle}>Beds</label>
                            <input type="number" required value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Baths</label>
                            <input type="number" required value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Sqft</label>
                            <input type="number" value={formData.sqft} onChange={e => setFormData({ ...formData, sqft: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Property'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
