"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { t } = useLanguage();

    const menuGroups = [
        {
            title: t('nav.management'),
            items: [
                {
                    name: t('nav.dashboard'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
                    href: '/'
                },
                {
                    name: t('nav.portfolio'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
                    href: '/portfolio'
                },
                {
                    name: t('nav.projects'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10c0-1.1.9-2 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M8 8V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-1" /></svg>,
                    href: '/projects'
                },
                {
                    name: t('nav.taskPortal'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>,
                    href: '/tasks'
                },
                {
                    name: t('nav.clientPortal'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>,
                    href: '/client'
                },
                {
                    name: t('nav.growth'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
                    href: '/growth'
                },
                {
                    name: t('nav.inventory'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
                    href: '/inventory'
                },
                {
                    name: t('nav.purchases'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>,
                    href: '/purchases'
                },
                {
                    name: t('nav.surveys'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>,
                    href: '/surveys'
                },
                {
                    name: t('nav.pipeline'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
                    href: '/pipeline'
                },
                {
                    name: t('nav.team'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                    href: '/team'
                },
                {
                    name: t('nav.financial'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>,
                    href: '/financial'
                },
                {
                    name: t('nav.sales'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
                    href: '/sales'
                },
            ]
        },
        {
            title: t('nav.marketing'),
            items: [
                {
                    name: t('nav.outreach'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>,
                    href: '/marketing/outreach'
                },
                {
                    name: t('nav.emailMarketing'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
                    href: '/marketing/email'
                },
                {
                    name: t('nav.smsMarketing'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
                    href: '/marketing/sms'
                },
                {
                    name: t('nav.marketingAutomation'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
                    href: '/marketing/automation'
                },
                {
                    name: t('nav.socialMedia'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>,
                    href: '/marketing/social'
                },
                {
                    name: t('nav.events'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="4" /><line x1="8" x2="8" y1="2" y2="4" /><line x1="3" x2="21" y1="10" y2="10" /></svg>,
                    href: '/marketing/events'
                },
            ]
        },
        {
            title: t('nav.communication'),
            items: [
                {
                    name: t('nav.conversations'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>,
                    href: '/communication/conversations'
                },
                {
                    name: t('nav.contracts'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>,
                    href: '/communication/contracts'
                },
                {
                    name: t('nav.scheduling'),
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                    href: '/communication/scheduling'
                },
            ]
        }
    ];


    return (
        <aside style={{
            width: 'var(--sidebar-w)',
            background: 'hsl(var(--bg-sidebar))',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflowY: 'auto',
            transition: 'all var(--transition-smooth)'
        }}>
            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ padding: '6px', background: '#011627', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#7fdbca', fontWeight: 900, fontSize: '0.9rem', border: '2px solid #7fdbca', padding: '0 2px' }}>BLC</span>
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '1px', color: 'white' }}>BLC HUB</h2>
            </div>

            <nav style={{ padding: '1rem 0' }}>
                {menuGroups.map((group, gIdx) => (
                    <div key={gIdx} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', color: 'white' }}>
                            {group.title}
                        </div>
                        {group.items.map((item, iIdx) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={iIdx} href={item.href} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem', /* Slightly increased gap */
                                    padding: '0.5rem 1.5rem', /* Better vertical padding */
                                    textDecoration: 'none',
                                    color: isActive ? 'hsl(var(--accent-primary))' : 'rgba(255,255,255,0.5)',
                                    background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    fontSize: '0.75rem',
                                    fontWeight: isActive ? 600 : 500,
                                    position: 'relative',
                                    transition: 'all 0.2s ease',
                                    borderLeft: isActive ? '3px solid hsl(var(--accent-primary))' : '3px solid transparent'
                                }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                            const icon = e.currentTarget.firstElementChild as HTMLElement;
                                            if (icon) {
                                                icon.style.transform = 'scale(1.1)';
                                                icon.style.color = 'white';
                                            }
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                            e.currentTarget.style.background = 'transparent';
                                            const icon = e.currentTarget.firstElementChild as HTMLElement;
                                            if (icon) {
                                                icon.style.transform = 'scale(1)';
                                                icon.style.color = 'currentColor';
                                            }
                                        }
                                    }}
                                >
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '20px',
                                        height: '20px',
                                        transition: 'transform 0.2s ease',
                                        color: isActive ? 'hsl(var(--accent-primary))' : 'currentColor'
                                    }}>
                                        {item.icon}
                                    </span>
                                    <span style={{
                                        flex: 1,
                                        letterSpacing: '0.02em',
                                    }}>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>
        </aside>
    );


};



export default Sidebar;
