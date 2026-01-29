"use client";

import React from 'react';
import styles from './ops.module.css';
import MetricCard from '@/components/MetricCard';

export default function OpsPage() {
    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1>Operations Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Live system metrics and operational throughput.</p>
            </header>

            <section className={styles.metricGrid}>
                <MetricCard label="System Uptime" value="99.98%" trend="+0.01% vs last week" trendType="positive" icon="💎" />
                <MetricCard label="Average Latency" value="42ms" trend="-4ms improvement" trendType="positive" icon="⚡" />
                <MetricCard label="Active Requests" value="1,280" trend="+12% load" trendType="neutral" icon="📊" />
                <MetricCard label="Error Rate" value="0.04%" trend="+0.01% alert" trendType="negative" icon="⚠️" />
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <section className={styles.dashboardSection}>
                    <div className={styles.sectionHeader}>
                        <h3 style={{ fontSize: '1.1rem' }}>Service Health</h3>
                    </div>
                    <div className={styles.dataList}>
                        {[
                            { service: "API Gateway", region: "US-East", load: "45%", status: "Healthy" },
                            { service: "Database Cluster", region: "Global", load: "78%", status: "Optimizing" },
                            { service: "Auth Service", region: "EU-West", load: "12%", status: "Healthy" },
                        ].map((s, i) => (
                            <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.service}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.region}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Load: {s.load}</span>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        background: s.status === 'Healthy' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: s.status === 'Healthy' ? '#3b82f6' : '#f59e0b',

                                        fontWeight: 800,
                                        textTransform: 'uppercase'
                                    }}>
                                        {s.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.dashboardSection}>
                    <div className={styles.sectionHeader}>
                        <h3 style={{ fontSize: '1.1rem' }}>Incident Feed</h3>
                    </div>
                    <div className="card" style={{ padding: '0' }}>
                        {[
                            { time: "10:45 AM", event: "API Latency spike detected in US-East node.", type: "Warning" },
                            { time: "09:12 AM", event: "Database backup completed successfully.", type: "Log" },
                            { time: "Yesterday", event: "Unauthorized access attempt blocked (IP: 192.168.x.x)", type: "Security" },
                        ].map((ev, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: i < 2 ? '1px solid hsl(var(--border-color))' : 'none', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)', minWidth: '70px', fontWeight: 600 }}>{ev.time}</span>
                                <div>
                                    <div style={{ fontWeight: 700, color: ev.type === 'Warning' ? '#ef4444' : 'hsl(var(--accent-primary))' }}>{ev.type}</div>
                                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>{ev.event}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
