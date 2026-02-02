"use client";

import React, { useState, useEffect } from 'react';
import styles from '../app/tasks/tasks.module.css';
import { useDataContext } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import type { Portfolio } from '@/types/entities';

interface PortfolioProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    portfolioId: string | null;
}

const PortfolioProfileModal: React.FC<PortfolioProfileModalProps> = ({ isOpen, onClose, portfolioId }) => {
    const { portfolios, updatePortfolio } = useDataContext();
    const { t } = useLanguage();

    const currentPortfolio = portfolios.find(p => p.id === portfolioId);
    const [formData, setFormData] = useState<Partial<Portfolio>>({});

    useEffect(() => {
        if (isOpen && currentPortfolio) {
            setFormData({ ...currentPortfolio });
        }
    }, [isOpen, currentPortfolio]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (portfolioId && formData) {
            updatePortfolio(portfolioId, formData);
            onClose();
        }
    };

    if (!isOpen || !currentPortfolio) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} glass`} onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', width: '95%' }}>
                <header className={styles.modalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            fontSize: '1.5rem',
                            background: currentPortfolio.gradient,
                            padding: '10px',
                            borderRadius: '12px',
                            color: 'white'
                        }}>{currentPortfolio.icon}</div>
                        <div>
                            <h3 style={{ margin: 0 }}>Perfil del Portafolio</h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configura la identidad corporativa de {currentPortfolio.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </header>

                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '16px',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid hsla(var(--text-primary) / 0.1)',
                                overflow: 'hidden',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                            }}>
                                {formData.logoUrl ? (
                                    <img
                                        src={formData.logoUrl}
                                        alt="Company Logo"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '2rem', opacity: 0.3 }}>🏢</span>
                                )}
                            </div>
                            <label style={{
                                position: 'absolute',
                                bottom: '-5px',
                                right: '-5px',
                                background: 'hsl(var(--accent-primary))',
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: '0.8rem',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}>
                                📷
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, logoUrl: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className={styles.formGroup}>
                                <label>Nombre del Portafolio</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>Nombre de la Empresa</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.companyName || ''}
                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="p.ej. Noodle Tech S.A."
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Sector / Industria</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.industry || ''}
                                onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                placeholder="p.ej. Tecnología, Logística..."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>Sitio Web</label>
                            <input
                                type="url"
                                className={styles.input}
                                value={formData.website || ''}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://www.ejemplo.com"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Color Temático</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    className={styles.input}
                                    style={{ width: '40px', padding: '2px', height: '40px' }}
                                    value={formData.color || '#3b82f6'}
                                    onChange={e => setFormData({ ...formData, color: e.target.value, gradient: `linear-gradient(135deg, ${e.target.value}, ${adjustColor(e.target.value, -30)})` })}
                                />
                                <input
                                    type="text"
                                    className={styles.input}
                                    style={{ flex: 1 }}
                                    value={formData.color || ''}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Descripción del Negocio</label>
                        <textarea
                            className={styles.input}
                            rows={3}
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Breve descripción de los objetivos del portafolio o empresa..."
                        />
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
                        <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper function to darken/lighten colors for gradients
function adjustColor(hex: string, amt: number) {
    let useHash = false;
    if (hex[0] == "#") {
        hex = hex.slice(1);
        useHash = true;
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (useHash ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

export default PortfolioProfileModal;
