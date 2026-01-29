"use client";

import React from 'react';
import styles from '../portals.module.css';

export default function ClientPortal() {
    const projects = [
        { name: "Global ERP Implementation", progress: 75, status: "In Development", deadline: "Nov 20, 2026" },
        { name: "Cloud Migration Phase 2", progress: 30, status: "Active", deadline: "Dec 15, 2026" },
    ];

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Client Portal</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Track your project status and provide feedback.</p>
                </div>
                <div className="glass" style={{ padding: '0.5rem 1.5rem', borderRadius: '30px', fontSize: '0.9rem' }}>
                    Account: <span style={{ color: 'hsl(var(--accent-secondary))', fontWeight: 600 }}>CyberNexus</span>
                </div>
            </header>

            <section className={styles.grid}>
                {projects.map((p, i) => (
                    <div key={i} className={`${styles.card} glass`}>
                        <div className={styles.statusIndicator}>
                            <span className={styles.badge} style={{
                                background: 'hsla(var(--accent-secondary), 0.15)',
                                color: 'hsl(var(--accent-secondary))'
                            }}>
                                {p.status}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline: {p.deadline}</span>
                        </div>
                        <h3 style={{ marginBottom: '1.5rem' }}>{p.name}</h3>

                        <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span>Progress</span>
                            <span>{p.progress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', marginBottom: '2rem' }}>
                            <div style={{
                                width: `${p.progress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))',
                                borderRadius: '4px',
                                boxShadow: '0 0 10px hsla(var(--accent-primary), 0.3)'
                            }}></div>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>View Deliverables</button>
                    </div>
                ))}
            </section>

            <section className="glass" style={{ padding: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Feedback & Requests</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Need a change or have a question? Our team is standing by.</p>
                <div className={styles.feedbackArea}>
                    <textarea className={styles.textArea} rows={5} placeholder="Describe your request or feedback here..."></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary">Submit Feedback</button>
                    </div>
                </div>
            </section>
        </main>
    );
}
