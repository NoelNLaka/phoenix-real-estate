import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        let result
        if (isSignUp) {
            result = await supabase.auth.signUp({ email, password })
        } else {
            result = await supabase.auth.signInWithPassword({ email, password })
        }
        const { error } = result

        if (error) {
            alert(error.message)
        } else {
            if (isSignUp) alert('Check email for confirmation!')
            else navigate('/')
        }
        setLoading(false)
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: 'var(--space-xl)',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, hsl(var(--bg-darker)) 0%, hsl(var(--bg-dark)) 100%)'
        }}>
            {/* Animated Background Orbs */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 8s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, hsl(var(--accent) / 0.15), transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 10s ease-in-out infinite reverse',
                pointerEvents: 'none'
            }} />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
            `}</style>

            <div className="card" style={{
                width: '100%',
                maxWidth: '420px',
                padding: 'var(--space-xl)',
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(135deg, hsl(var(--bg-card) / 0.9) 0%, hsl(var(--bg-card) / 0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid hsl(var(--border-light))'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        marginBottom: 'var(--space-xs)',
                        background: 'linear-gradient(135deg, hsl(var(--text-primary)), hsl(var(--text-secondary)))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800
                    }}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p style={{
                        color: 'hsl(var(--text-secondary))',
                        fontSize: '0.85rem',
                        margin: 0
                    }}>
                        {isSignUp ? 'Sign up to get started with PropPNG' : 'Sign in to continue to your dashboard'}
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--space-sm)',
                            fontSize: '0.8rem',
                            color: 'hsl(var(--text-secondary))',
                            fontWeight: 500
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            style={{ fontSize: '0.9rem' }}
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--space-sm)',
                            fontSize: '0.8rem',
                            color: 'hsl(var(--text-secondary))',
                            fontWeight: 500
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{ fontSize: '0.9rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.9rem',
                            marginTop: 'var(--space-xs)'
                        }}
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div style={{
                    marginTop: 'var(--space-lg)',
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid hsl(var(--border))',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: 'hsl(var(--text-secondary))',
                        fontSize: '0.85rem',
                        margin: 0
                    }}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"} {' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'hsl(var(--primary))',
                                cursor: 'pointer',
                                padding: 0,
                                font: 'inherit',
                                fontWeight: 600,
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px'
                            }}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
