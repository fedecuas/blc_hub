import React from 'react';

interface ContactCardProps {
    name: string;
    company: string;
    email: string;
    lastContact: string;
    status: 'Lead' | 'Active' | 'Churned';
}

import { useLanguage } from '@/context/LanguageContext';

const ContactCard: React.FC<ContactCardProps> = ({ name, company, email, lastContact, status }) => {
    const { t } = useLanguage();
    const statusColor = status === 'Active' ? 'var(--accent-primary)' : status === 'Lead' ? 'var(--accent-secondary)' : 'var(--text-muted)';

    const statusLabels = {
        Lead: t('crm.status.lead'),
        Active: t('crm.status.active'),
        Churned: t('crm.status.churned')
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer', transition: 'transform var(--transition-smooth)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{company}</span>
                </div>
                <span style={{
                    fontSize: '0.65rem',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: `hsl(${statusColor} / 0.1)`,
                    color: `hsl(${statusColor})`,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}>
                    {statusLabels[status]}
                </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{email}</div>
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {t('crm.lastContact')}: <b>{lastContact}</b>
            </div>
        </div>
    );
};




export default ContactCard;
