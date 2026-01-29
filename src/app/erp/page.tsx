"use client";

import React from 'react';
import styles from '../ops/ops.module.css';
import MetricCard from '@/components/MetricCard';
import { useLanguage } from '@/context/LanguageContext';

export default function ERPPage() {
    const { t } = useLanguage();
    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1>{t('erp.title')}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('erp.subtitle')}</p>
            </header>

            <section className={styles.metricGrid}>
                <MetricCard label={t('erp.revenue')} value="$2.4M" trend={`+15.2% vs ${t('dash.stats.yesterday') === 'Ayer' ? 'año anterior' : 'last year'}`} trendType="positive" icon="💰" />
                <MetricCard label={t('erp.burn')} value="$140k" trend="-2% optimization" trendType="positive" icon="🔥" />
                <MetricCard label={t('erp.utilization')} value="84%" trend="Ideal range" trendType="neutral" icon="👨‍💻" />
                <MetricCard label={t('erp.invoices')} value="12" trend="3 overdue" trendType="negative" icon="🧾" />
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <section className={styles.dashboardSection}>
                    <div className={styles.sectionHeader}>
                        <h3 style={{ fontSize: '1.1rem' }}>{t('erp.distribution')}</h3>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { category: t('erp.infrastructure'), percentage: "45%", value: "$63k" },
                            { category: t('erp.salaries'), percentage: "35%", value: "$49k" },
                            { category: t('erp.marketing'), percentage: "12%", value: "$16.8k" },
                            { category: t('erp.reserve'), percentage: "8%", value: "$11.2k" },

                        ].map((f, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                    <span style={{ fontWeight: 600 }}>{f.category}</span>
                                    <span style={{ fontWeight: 700 }}>{f.value}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'hsl(var(--bg-main))', borderRadius: '3px' }}>
                                    <div style={{ width: f.percentage, height: '100%', background: 'hsl(var(--accent-primary))', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.dashboardSection}>
                    <div className={styles.sectionHeader}>
                        <h3 style={{ fontSize: '1.1rem' }}>{t('erp.allocation')}</h3>
                    </div>

                    <div className={styles.dataList}>
                        {[
                            { project: "Project Alpha", team: "Engineering", load: "Active", budget: "95%" },
                            { project: "Global ERP", team: "Operations", load: "Paused", budget: "20%" },
                            { project: "Client Portal v2", team: "Design", load: "Active", budget: "40%" },
                        ].map((p, i) => (
                            <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.25rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.project}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{p.team}</span>
                                <span style={{ color: p.load === 'Active' ? 'hsl(var(--accent-primary))' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800 }}>{p.load}</span>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.budget} used</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
