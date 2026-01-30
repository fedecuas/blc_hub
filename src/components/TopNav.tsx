"use client";

import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '@/context/LanguageContext';
import { useDataContext } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from './ProfileModal';

const TopNav: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { currentUser } = useDataContext();
    const { logout } = useAuth();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav style={{
            height: 'var(--topbar-h)',
            borderBottom: '1px solid hsl(var(--border-color))',
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            justifyContent: 'space-between',
            background: 'hsl(var(--bg-card))',
            transition: 'background-color var(--transition-smooth), border-color var(--transition-smooth)'
        }}>

            <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder={t('top.search')}
                    style={{
                        width: '100%',
                        padding: '10px 15px 10px 35px',
                        borderRadius: '20px',
                        border: '1px solid hsl(var(--border-color))',
                        background: 'hsl(var(--bg-main))',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)'
                    }}
                />
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div
                    onClick={toggleLanguage}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'hsl(var(--accent-primary))',
                        background: 'hsla(var(--accent-primary), 0.1)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        transition: 'var(--transition-smooth)'
                    }}
                >
                    {language === 'en' ? 'ENG' : 'ESP'} ⌄
                </div>
                <ThemeToggle />
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔔</span>
                    <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', background: 'red', borderRadius: '50%', color: 'white', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>

                </div>
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            paddingLeft: '1.5rem',
                            borderLeft: '1px solid hsla(var(--text-primary) / 0.1)',
                            transition: 'all 0.2s ease',
                            paddingRight: '4px'
                        }}
                    >
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontSize: '0.95rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                lineHeight: '1.1'
                            }}>
                                {currentUser.firstName || currentUser.lastName
                                    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
                                    : (currentUser.name && !currentUser.name.includes('@') ? currentUser.name : currentUser.email.split('@')[0])}
                            </div>
                            <div style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: '4px',
                                opacity: 0.8,
                                marginTop: '2px'
                            }}>
                                {currentUser.role} <span style={{ fontSize: '0.6rem', opacity: 0.6, transform: showProfileDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>⌄</span>
                            </div>
                        </div>

                        <img
                            src={currentUser.avatarUrl || "https://i.pravatar.cc/150"}
                            alt="User Profile"
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                border: '2px solid white',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                objectFit: 'cover'
                            }}
                        />
                    </div>

                    {showProfileDropdown && (
                        <>
                            <div
                                style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                                onClick={() => setShowProfileDropdown(false)}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 15px)',
                                right: 0,
                                background: 'hsla(var(--bg-primary) / 0.98)',
                                backdropFilter: 'blur(30px)',
                                WebkitBackdropFilter: 'blur(30px)',
                                border: '1px solid hsla(var(--text-primary) / 0.1)',
                                borderRadius: '14px',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
                                minWidth: '220px',
                                zIndex: 1000,
                                overflow: 'hidden',
                                animation: 'dropdownFadeIn 0.2s ease-out'
                            }}>
                                <div style={{ padding: '4px' }}>
                                    {[
                                        { label: 'Mi Perfil', icon: '👤', id: 'profile', action: () => { setIsProfileOpen(true); setShowProfileDropdown(false); } },
                                        { label: 'Configuración', icon: '⚙️', id: 'settings' },
                                        { label: 'Notificaciones', icon: '🔔', id: 'notifications' },
                                        { label: 'Centro de Ayuda', icon: '❓', id: 'help' }
                                    ].map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={item.action}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontSize: '0.9rem',
                                                color: 'hsl(var(--text-primary))',
                                                borderRadius: '10px',
                                                transition: 'all 0.2s ease',
                                                fontWeight: 500
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'hsla(var(--accent-primary) / 0.1)';
                                                e.currentTarget.style.color = 'hsl(var(--accent-primary))';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'hsl(var(--text-primary))';
                                            }}
                                        >
                                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                            {item.label}
                                        </button>
                                    ))}

                                    <div style={{ margin: '4px 0', height: '1px', background: 'hsla(var(--text-primary) / 0.05)' }} />

                                    <button
                                        onClick={logout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontSize: '0.9rem',
                                            color: '#ef4444',
                                            borderRadius: '10px',
                                            transition: 'all 0.2s ease',
                                            fontWeight: 600
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>🚪</span>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </nav>
    );
};

export default TopNav;
