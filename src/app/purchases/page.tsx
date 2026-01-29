"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function PurchasesPage() {
    const { t } = useLanguage();
    return (
        <main style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('nav.purchases')}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Module under development.</p>
            <div className="card" style={{ marginTop: '2rem', padding: '3rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <span style={{ fontSize: '3rem' }}>🛒</span>
                <p style={{ marginTop: '1rem', fontWeight: 600 }}>Purchases & Procurement Scaffolding</p>
            </div>
        </main>
    );
}
