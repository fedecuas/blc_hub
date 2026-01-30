"use client";

import React, { useState, useEffect } from 'react';
import styles from '../app/tasks/tasks.module.css';
import { useDataContext } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { currentUser, updateUserProfile } = useDataContext();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({ ...currentUser });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({ ...currentUser });
            setError(null);
        }
    }, [isOpen, currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            await updateUserProfile(formData);
            onClose();
        } catch (err: any) {
            console.error('Error saving profile:', err);
            setError(err.message || 'Error al guardar el perfil. Intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} glass`} onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '650px',
                    width: '95%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '0',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <header className={styles.modalHeader} style={{
                    padding: '2rem',
                    borderBottom: '1px solid hsla(var(--accent-primary) / 0.1)',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            fontSize: '1.5rem',
                            background: 'linear-gradient(135deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))',
                            padding: '12px',
                            borderRadius: '16px',
                            color: 'white',
                            boxShadow: '0 4px 15px hsla(var(--accent-primary) / 0.3)'
                        }}>👤</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>Mi Perfil</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', opacity: 0.8 }}>Configura tu identidad en BLC System</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn} style={{ fontSize: '1.5rem' }}>&times;</button>
                </header>

                <form className={styles.modalForm} onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            color: '#ef4444',
                            fontSize: '0.9rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        gap: '2.5rem',
                        marginBottom: '2.5rem',
                        alignItems: 'center',
                        background: 'hsla(var(--accent-primary) / 0.03)',
                        padding: '1.5rem',
                        borderRadius: '24px',
                        border: '1px solid hsla(var(--accent-primary) / 0.05)'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '110px',
                                height: '110px',
                                borderRadius: '50%',
                                padding: '4px',
                                background: 'linear-gradient(135deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}>
                                <img
                                    src={formData.avatarUrl || 'https://i.pravatar.cc/150'}
                                    alt="Profile Avatar"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid white'
                                    }}
                                />
                            </div>
                            <label style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                background: 'hsl(var(--accent-primary))',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                border: '2px solid white',
                                transition: 'transform 0.2s'
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
                                                setFormData({ ...formData, avatarUrl: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem', color: 'hsl(var(--accent-primary))' }}>Rol Profesional</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        padding: '0.8rem 1.2rem',
                                        background: 'white'
                                    }}
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className={styles.formGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Tu nombre"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Apellido</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Tu apellido"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className={styles.formGroup}>
                            <label>Email Corporativo</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                                readOnly
                                style={{ background: 'hsla(var(--accent-primary) / 0.02)', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Teléfono Movil</label>
                            <input
                                type="tel"
                                className={styles.input}
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone || ''}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                        <label>Biografía Profesional</label>
                        <textarea
                            className={styles.input}
                            rows={4}
                            style={{ resize: 'none', lineHeight: '1.6' }}
                            value={formData.bio || ''}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Describe tu trayectoria y rol actual..."
                        />
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        display: 'flex',
                        gap: '1.2rem',
                        justifyContent: 'flex-end',
                        paddingTop: '2rem',
                        borderTop: '1px solid hsla(var(--accent-primary) / 0.1)'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontWeight: '500',
                                padding: '0.8rem 1.5rem',
                                opacity: isSaving ? 0.5 : 1
                            }}>
                            {t('modal.cancel') || 'Cancelar'}
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSaving}
                            style={{
                                padding: '1rem 2.5rem',
                                borderRadius: '14px',
                                fontWeight: '600',
                                boxShadow: '0 10px 20px hsla(var(--accent-primary) / 0.2)',
                                opacity: isSaving ? 0.7 : 1,
                                cursor: isSaving ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                            {isSaving && <span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />}
                            {isSaving ? 'Guardando...' : (t('common.save') || 'Guardar Perfil')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
