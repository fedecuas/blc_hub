import React from 'react';

interface TaskCardProps {
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Todo' | 'In Progress' | 'Completed';
    collaborator: string;
}

import { useLanguage } from '@/context/LanguageContext';

const TaskCard: React.FC<TaskCardProps> = ({ title, description, priority, status, collaborator }) => {
    const { t } = useLanguage();
    const priorityColor = priority === 'High' ? 'var(--accent-error)' : priority === 'Medium' ? 'var(--accent-primary)' : 'var(--accent-info)';

    const priorityLabels = {
        High: t('tasks.priority.high'),
        Medium: t('tasks.priority.medium'),
        Low: t('tasks.priority.low')
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: `hsl(${priorityColor} / 0.1)`,
                    color: `hsl(${priorityColor})`,
                    textTransform: 'uppercase'
                }}>
                    {priorityLabels[priority]}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {status === 'Todo' ? t('tasks.todo') : status === 'In Progress' ? t('tasks.inProgress') : t('tasks.completed')}
                </span>
            </div>

            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>{title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</p>

            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'hsl(var(--accent-primary) / 0.1)',
                        color: 'hsl(var(--accent-primary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800
                    }}>
                        {collaborator.charAt(0)}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{collaborator}</span>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'hsl(var(--accent-primary))', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>{t('tasks.details')}</button>
            </div>
        </div>
    );
};





export default TaskCard;
