"use client";

import React from 'react';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
    const { t } = useLanguage();

    const stats = [
        { label: t('dash.stats.tasks'), value: '40', sub: `${t('dash.stats.yesterday')}: 32 ${t('dash.stats.tasks')}`, icon: '📋', color: '#3b82f6' },
        { label: t('dash.stats.clients'), value: '21', sub: `${t('dash.stats.yesterday')}: 18 ${t('dash.stats.clients')}`, icon: '👤', color: '#3b82f6' },
        { label: t('dash.stats.projects'), value: '14', sub: `${t('dash.stats.yesterday')}: 9 ${t('dash.stats.today')}`, icon: '🏭', color: '#f59e0b' },
        { label: t('dash.stats.specialists'), value: '15', sub: t('dash.stats.today'), icon: '👨💼', color: '#8b5cf6' },
        { label: t('dash.stats.staff'), value: '36', sub: t('dash.stats.todayAvail'), icon: '🎧', color: '#ec4899' },
        { label: t('dash.stats.revenue'), value: '$52,140', sub: `${t('dash.stats.yesterday')} $41,826`, icon: '💰', color: '#3b82f6' },
    ];


    // Helper component for stat cards
    const StatCard = ({ stat }: { stat: typeof stats[0] }) => (
        <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '1.25rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '4rem', opacity: 0.03, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                {stat.icon}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                        {stat.label}
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: 'hsl(var(--text-main))' }}>
                        {stat.value}
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.75rem', fontWeight: 600 }}>
                        {stat.sub}
                    </div>
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: `${stat.color}15`,
                    color: stat.color,
                    borderRadius: '12px',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${stat.color}10`
                }}>
                    {stat.icon}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Top Banner Grid (Final Placement Correction & Height Optimization) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(280px, 1.2fr) 1fr 1fr minmax(280px, 1.2fr)',
                gap: '0.6rem',
                minHeight: '300px'
            }}>

                {/* Column 1: Active Task Resume (Span 2 Rows - Far Left Anchor) */}
                <div className="card" style={{
                    gridRow: 'span 2',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('dash.featured')}
                            </div>
                            <div style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: 700 }}>{t('dash.upcoming')}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {[
                                { id: 1, title: t('dash.task1'), date: '27 Jan', priority: 'High', color: 'var(--accent-error)' },
                                { id: 2, title: t('dash.task2'), date: '28 Jan', priority: 'Medium', color: 'var(--accent-primary)' },
                                { id: 3, title: t('dash.task3'), date: '30 Jan', priority: 'Low', color: 'var(--accent-info)' },
                                { id: 4, title: t('dash.task4'), date: '01 Feb', priority: 'Medium', color: 'var(--accent-primary)' },
                            ].map(task => (
                                <div key={task.id} style={{
                                    padding: '5px 10px',
                                    background: `hsla(${task.color}, 0.08)`,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: `1px solid hsla(${task.color}, 0.12)`,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: `hsl(${task.color})` }}></div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: `hsl(${task.color})` }}>{task.title}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: `hsl(${task.color})`, opacity: 0.4 }}>›</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '0.1rem' }}>40</h3>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>{t('dash.activeTasks')}</p>
                        </div>
                        <div style={{ fontSize: '2rem', opacity: 0.15, marginBottom: '-5px' }}>📈</div>
                    </div>
                </div>

                {/* Column 2 - Top: New Clients */}
                <StatCard stat={stats[1]} />

                {/* Column 3 - Top: Ops Projects */}
                <StatCard stat={stats[2]} />

                {/* Column 4: Upcoming Meetings (Span 2 Rows - Far Right Anchor) */}
                <div className="card" style={{
                    gridRow: 'span 2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('dash.upcomingMeetings')}
                            </div>
                            <div style={{ fontSize: '1.1rem' }}>📅</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {[
                                { title: t('dash.meet1'), time: '09:00', type: 'Strategy' },
                                { title: t('dash.meet2'), time: '11:30', type: 'Review' },
                                { title: t('dash.meet3'), time: '15:00', type: 'Sync' },
                                { title: 'Project Sync', time: '16:30', type: 'Internal' },
                            ].map((m, i) => (
                                <div key={i} style={{
                                    padding: '6px 10px',
                                    background: 'hsla(var(--accent-secondary), 0.1)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    border: '1px solid hsla(var(--accent-secondary), 0.15)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'hsl(var(--accent-secondary))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{m.title}</div>
                                        <div style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 700 }}>{m.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800, marginTop: '0.75rem', textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                        {t('dash.stats.today')}
                    </div>
                </div>

                {/* Column 2 - Bottom: Revenue Hub */}
                <StatCard stat={stats[5]} />

                {/* Column 3 - Bottom: Risk Alerts (Risk below Ops) */}
                <StatCard stat={stats[3]} />

            </div>

            {/* Charts & Calendar Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1rem' }}>

                {/* Productivity Trends Chart */}
                <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'hsl(var(--text-main))' }}>{t('dash.productivity')}</h3>
                            <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '2px 0 0 0', fontWeight: 600 }}>{t('dash.focusHours')}</p>
                        </div>
                        <div style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            {t('dash.weekView')} <span style={{ opacity: 0.5 }}>⌄</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                        {/* Left Summary Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '1rem 1.25rem',
                            borderRadius: '20px',
                            minWidth: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'hsl(var(--accent-primary))', lineHeight: 1 }}>14</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 800, opacity: 0.8, color: 'hsl(var(--accent-primary))' }}>h</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: '6px 0', fontWeight: 700 }}>{t('dash.loggedWeek')}</p>
                            <div style={{
                                padding: '3px 8px',
                                background: 'rgba(34, 197, 94, 0.15)',
                                color: '#22c55e',
                                borderRadius: '15px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                width: 'fit-content'
                            }}>
                                +15%
                            </div>
                        </div>

                        {/* Right Bars Area */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '0.75rem', position: 'relative' }}>
                                {/* BARS */}
                                {[
                                    { day: 'Sun', h: 30, color: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' },
                                    { day: 'Mon', h: 75, color: 'rgba(127, 219, 202, 0.4)' },
                                    { day: 'Tue', h: 50, color: 'rgba(127, 219, 202, 0.2)' },
                                    { day: 'Wed', h: 90, color: 'hsl(var(--accent-primary))' },
                                    { day: 'Thu', h: 80, color: 'transparent', striped: true },
                                    { day: 'Fri', h: 85, color: 'rgba(127, 219, 202, 0.6)' },
                                    { day: 'Sat', h: 30, color: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' },
                                ].map((b, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                        <div style={{
                                            width: '30px',
                                            height: `${b.h * 0.9}px`,
                                            background: b.striped ? `repeating-linear-gradient(45deg, transparent, transparent 5px, hsl(var(--accent-primary)) 5px, hsl(var(--accent-primary)) 10px)` : b.color,
                                            opacity: b.striped ? 0.3 : 1,
                                            border: b.striped ? `1px solid hsl(var(--accent-primary))` : b.border || 'none',
                                            borderRadius: '15px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}></div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, padding: '0 8px' }}>
                                {[t('dash.calendar.su'), t('dash.calendar.mo'), t('dash.calendar.tu'), t('dash.calendar.we'), t('dash.calendar.th'), t('dash.calendar.fr'), t('dash.calendar.sa')].map(d => <span key={d} style={{ width: '30px', textAlign: 'center' }}>{d}</span>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar Widget */}
                <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{t('dash.calendar')}</h3>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800, background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '10px' }}>December 2026 ⌄</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.75rem' }}>
                        {[t('dash.calendar.su'), t('dash.calendar.mo'), t('dash.calendar.tu'), t('dash.calendar.we'), t('dash.calendar.th'), t('dash.calendar.fr'), t('dash.calendar.sa')].map(d => <div key={d} style={{ fontWeight: 800, opacity: 0.4, marginBottom: '2px' }}>{d}</div>)}
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} style={{
                                padding: '5px',
                                borderRadius: '8px',
                                background: (i + 1) === 16 ? 'hsl(var(--accent-primary))' : 'transparent',
                                color: (i + 1) === 16 ? 'white' : 'inherit',
                                fontWeight: (i + 1) === 16 ? 900 : 700,
                                opacity: (i + 1) > 28 ? 0.3 : 1,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                border: (i + 1) === 16 ? 'none' : '1px solid transparent'
                            }}
                                onMouseEnter={(e) => {
                                    if ((i + 1) !== 16) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    if ((i + 1) !== 16) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
