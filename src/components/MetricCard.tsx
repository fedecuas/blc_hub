import React from 'react';

interface MetricCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, trendType = 'neutral', icon }) => {
    const trendColor = trendType === 'positive' ? 'var(--accent-primary)' : trendType === 'negative' ? 'var(--accent-error)' : 'var(--text-muted)';

    const trendSymbol = trendType === 'positive' ? '▲' : trendType === 'negative' ? '▼' : '•';

    return (
        <div className="card" style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                </div>
                <div style={{ padding: '8px', background: 'hsl(var(--accent-primary) / 0.1)', color: 'hsl(var(--accent-primary))', borderRadius: '8px', fontSize: '1.2rem' }}>
                    {icon || '📊'}
                </div>
            </div>
            {trend && (
                <div style={{ fontSize: '0.7rem', color: `hsl(${trendColor})`, fontWeight: 700, marginTop: '0.5rem' }}>
                    {trendSymbol} {trend}
                </div>
            )}
        </div>
    );
};



export default MetricCard;
