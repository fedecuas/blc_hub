"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const { success, error } = await login(email, password);
            if (success) {
                router.push('/portfolio');
            } else {
                setError(error || 'Credenciales incorrectas. Por favor intenta de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error al intentar iniciar sesión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
            overflow: 'hidden',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                background: 'rgba(59, 130, 246, 0.15)',
                filter: 'blur(100px)',
                borderRadius: '50%',
                top: '10%',
                left: '10%',
                animation: 'float 20s infinite alternate'
            }} />
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'rgba(139, 92, 246, 0.15)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                bottom: '15%',
                right: '15%',
                animation: 'float 15s infinite alternate-reverse'
            }} />

            <div className="glass" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '3rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                animation: 'slideUp 0.6s ease-out'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        animation: 'bounce 2s infinite'
                    }}>🛡️</div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: 'white',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.5px'
                    }}>BLC System</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                        Bienvenido al futuro de la gestión empresarial
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', fontWeight: 600, paddingLeft: '4px' }}>
                            Email / Usuario
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@blc.com"
                            style={{
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', fontWeight: 600, paddingLeft: '4px' }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            required
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isSubmitting ? 'Iniciando sesión...' : 'Entrar al Sistema'}
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                        <a href="#" style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.8rem', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
                        <a href="#" style={{ color: '#60a5fa', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>Solicitar Acceso</a>
                    </div>
                </form>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                input:focus {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(59, 130, 246, 0.5) !important;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
                }
                button:active:not(:disabled) {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
}
