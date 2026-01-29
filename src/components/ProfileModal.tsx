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

    useEffect(() => {
        if (isOpen) {
            setFormData({ ...currentUser });
        }
    }, [isOpen, currentUser]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} glass`} onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', width: '95%' }}>
                <header className={styles.modalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            fontSize: '1.5rem',
                            background: 'hsla(var(--accent-primary) / 0.1)',
                            padding: '10px',
                            borderRadius: '12px'
                        }}>👤</div>
                        <div>
                            <h3 style={{ margin: 0 }}>Mi Perfil</h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configura tu información personal y profesional</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </header>

                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <img
                                src={formData.avatarUrl || 'https://i.pravatar.cc/150'}
                                alt="Profile Avatar"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid white',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                }}
                            />
                            <label style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
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
                                <label>Rol Profesional</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                className={styles.input}
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
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                className={styles.input}
                                value={formData.phone || ''}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Biografía</label>
                        <textarea
                            className={styles.input}
                            rows={3}
                            value={formData.bio || ''}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Cuéntanos un poco sobre ti..."
                        />
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>{t('modal.cancel') || 'Cancelar'}</button>
                        <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>{t('common.save') || 'Guardar Cambios'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
