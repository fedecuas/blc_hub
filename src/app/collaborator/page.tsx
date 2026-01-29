"use client";

import React from 'react';
import styles from '../portals.module.css';

export default function CollaboratorHub() {
    const myTasks = [
        { title: "Review API Documentation", project: "Project Alpha", priority: "High", time: "2h" },
        { title: "Design System Refactor", project: "Core UI", priority: "Medium", time: "5h" },
        { title: "Client Discovery Call", project: "CyberNexus", priority: "High", time: "1h" },
    ];

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Collaborator Hub</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your assignments and report your capacity.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Availability</div>
                        <div style={{ fontWeight: 600, color: 'hsl(var(--accent-secondary))' }}>Open</div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <section>
                    <h3 style={{ marginBottom: '1.5rem' }}>Assigned Work Items</h3>
                    <div className={styles.list}>
                        {myTasks.map((t, i) => (
                            <div key={i} className={`${styles.listItem} glass glass-hover`}>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{t.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.project}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: t.priority === 'High' ? 'hsl(var(--accent-tritiary))' : 'hsl(var(--accent-primary))'
                                    }}>
                                        {t.priority}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.time} left</span>
                                    <button style={{
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}>
                                        Start
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 style={{ marginBottom: '1.5rem' }}>Capacity Management</h3>
                    <div className="glass" style={{ padding: '2rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Keep your team updated on your current bandwidth.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontSize: '0.85rem' }}>Current Focus</label>
                            <input type="text" className={styles.textArea} style={{ padding: '0.75rem' }} placeholder="e.g. Frontend Development" />

                            <label style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Utilization Level</label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <span>Resting</span>
                                <span>Maxed</span>
                            </div>
                            <input type="range" step="10" defaultValue="40" style={{ accentColor: 'hsl(var(--accent-primary))' }} />

                            <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Update Status</button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
