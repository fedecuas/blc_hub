"use client";

import React from 'react';
import styles from './crm.module.css';
import ContactCard from '@/components/ContactCard';
import { useLanguage } from '@/context/LanguageContext';

export default function CRMPage() {
    const { t } = useLanguage();
    const contacts = [
        { name: "Julian Rossi", company: "CyberNexus", email: "j.rossi@cybernexus.com", lastContact: `2 ${t('dash.stats.yesterday') === 'Ayer' ? 'horas' : 'hours'} ago`, status: "Active" },
        { name: "Elena Vance", company: "Nova Red", email: "vance@novared.io", lastContact: `1 ${t('dash.stats.yesterday') === 'Ayer' ? 'día' : 'day'} ago`, status: "Lead" },
        { name: "Marcus Thorne", company: "Black Ridge", email: "m.thorne@br-ops.com", lastContact: `3 ${t('dash.stats.yesterday') === 'Ayer' ? 'días' : 'days'} ago`, status: "Active" },
    ] as const;

    const pipeline = [
        { stage: "Discovery", count: 4, deals: [{ title: "Mainframe Upgrade", value: "$45k" }, { title: "Cloud Migration", value: "$12k" }] },
        { stage: "Proposal", count: 2, deals: [{ title: "AI Integration", value: "$88k" }] },
        { stage: "Negotiation", count: 1, deals: [{ title: "Security Audit", value: "$15k" }] },
        { stage: "Closing", count: 3, deals: [{ title: "Biolink Pro", value: "$200k" }] },
    ];

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>{t('crm.title')}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('crm.subtitle')}</p>
                </div>
                <button className="btn-primary">{t('crm.newContact')}</button>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 style={{ fontSize: '1.1rem' }}>{t('nav.financial')} Pipeline</h3>
                </div>
                <div className={styles.pipelineScroll}>
                    {pipeline.map((p, i) => (
                        <div key={i} className={styles.pipelineStage}>
                            <div className={styles.stageTitle}>
                                {p.stage} <span style={{ padding: '2px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px' }}>{p.count}</span>
                            </div>
                            {p.deals.map((deal, di) => (
                                <div key={di} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{deal.title}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--accent-primary))', fontWeight: 700 }}>{deal.value}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 style={{ fontSize: '1.1rem' }}>{t('crm.recent')}</h3>
                </div>
                <div className={styles.contactGrid}>
                    {contacts.map((contact, i) => (
                        <ContactCard key={i} {...contact} />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 style={{ fontSize: '1.1rem' }}>{t('nav.opsReports')}</h3>
                </div>

                <div className="card" style={{ padding: '0' }}>
                    {[
                        { date: "Oct 24, 2026", user: "Antigravity", note: "Sent follow-up email to CyberNexus regarding the Q4 roadmap." },
                        { date: "Oct 23, 2026", user: "Julian Rossi", note: "Called to discuss the API integration timeline." },
                        { date: "Oct 22, 2026", user: "Antigravity", note: "Initial discovery call with Nova Red was successful." },
                    ].map((item, i) => (
                        <div key={i} className={styles.interactionItem} style={{ borderBottom: i < 2 ? '1px solid hsl(var(--border-color))' : 'none' }}>
                            <div className={styles.dot}></div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{item.date} • {item.user}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.note}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

