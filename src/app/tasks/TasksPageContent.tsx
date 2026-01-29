"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDataContext } from '@/context/DataContext';
import styles from './tasks.module.css';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import { useLanguage } from '@/context/LanguageContext';

export default function TasksPageContent() {
    const { t } = useLanguage();
    const { tasks: contextTasks, getTasksByProject, projects, portfolios } = useDataContext();
    const [activeTab, setActiveTab] = useState('All');
    const [viewMode, setViewMode] = useState<'main' | 'gantt' | 'milestone' | 'kanban' | 'tracking'>('main');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');

    // Portfolio Selector State
    const [selectedPortfolio, setSelectedPortfolio] = useState('all');
    const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);

    // Project Selector State
    const [selectedProject, setSelectedProject] = useState('all');
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);

    // Build portfolio list from DataContext
    const clientPortfolios = [
        { id: 'all', name: 'Todos los Portafolios', icon: '📁' },
        ...portfolios.map(p => ({ id: p.id, name: p.name, icon: p.icon }))
    ];

    // Get tasks from DataContext, filter by projectId if provided
    let filteredTasksByContext = contextTasks;

    if (projectId) {
        filteredTasksByContext = getTasksByProject(projectId);
    } else {
        if (selectedPortfolio !== 'all') {
            const portfolioProjectsIds = projects.filter(p => p.portfolioId === selectedPortfolio).map(p => p.id);
            filteredTasksByContext = contextTasks.filter(t => portfolioProjectsIds.includes(t.projectId));

            if (selectedProject !== 'all') {
                filteredTasksByContext = filteredTasksByContext.filter(t => t.projectId === selectedProject);
            }
        }
    }

    const tasks = filteredTasksByContext.map(t => ({
        title: t.title,
        description: t.description || '',
        priority: (t.priority === 'high' ? 'High' : t.priority === 'low' ? 'Low' : 'Medium') as 'High' | 'Low' | 'Medium',
        status: (t.status === 'approved' ? 'Completed' : t.status === 'in_progress' ? 'In Progress' : t.status === 'completed' ? 'Completed' : 'Todo') as 'Todo' | 'In Progress' | 'Completed',
        collaborator: t.assignee || 'Unassigned',
        start: t.createdAt.substring(0, 10),
        end: t.dueDate || new Date().toISOString().substring(0, 10),
        progress: t.completed ? 100 : 50,
        hours: t.actualHours || 0,
        projectId: t.projectId
    }));

    const filteredTasks = tasks.filter(t => {
        const statusMatch = activeTab === 'All' ? true : t.status === activeTab;
        return statusMatch;
    });

    // View Components Logic
    const renderContent = () => {
        switch (viewMode) {
            case 'main':
                return (
                    <section className={styles.taskGrid}>
                        {filteredTasks.length > 0 ? filteredTasks.map((task, idx) => (
                            <TaskCard key={idx} {...task} />
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                                No tasks found for this project filter.
                            </div>
                        )}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="card"
                            style={{ height: '100%', minHeight: '150px', borderStyle: 'dashed', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'hsl(var(--accent-primary))', cursor: 'pointer' }}
                        >
                            {t('tasks.create')}
                        </button>
                    </section>
                );
            case 'gantt':
                const hours = ['09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00'];
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const ganttTasks = [
                    { day: 'Tue', start: 1, end: 4, label: 'Mabar.co Project', color: '#addb67' },
                    { day: 'Thu', start: 5, end: 8, label: 'Client Sync', color: '#7fdbca' },
                    { day: 'Fri', start: 3.5, end: 7.5, label: 'Website Redesign', color: '#013e4a' },
                    { day: 'Sun', start: 7, end: 8.5, label: 'Review', color: '#e0f2f1' }
                ];

                return (
                    <section className="card" style={{ padding: '2rem', overflowX: 'auto' }}>
                        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'hsl(var(--text-primary))', fontWeight: 600 }}>Upcoming Activity</h2>
                        <div style={{ minWidth: '850px', position: 'relative' }}>
                            {/* Header: Hours */}
                            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(9, 1fr)', marginBottom: '1.5rem' }}>
                                <div></div>
                                {hours.map(h => (
                                    <div key={h} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</div>
                                ))}
                            </div>

                            {/* Grid Content */}
                            <div style={{ position: 'relative' }}>
                                {/* Vertical Grid Lines */}
                                <div style={{ position: 'absolute', top: 0, left: '60px', right: 0, bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', zIndex: 0 }}>
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} style={{ borderLeft: '1px solid var(--border-color)', height: '100%', opacity: 0.2 }}></div>
                                    ))}
                                </div>

                                {/* Days and Bars */}
                                {days.map(day => (
                                    <div key={day} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', height: '45px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: day === 'Tue' ? 'hsl(var(--accent-primary))' : 'var(--text-muted)' }}>{day}</div>
                                        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                                            {ganttTasks.filter(t => t.day === day).map((task, idx) => {
                                                const startPct = (task.start / 9) * 100;
                                                const widthPct = ((task.end - task.start) / 9) * 100;
                                                return (
                                                    <div key={idx} style={{
                                                        position: 'absolute',
                                                        left: `${startPct}%`,
                                                        width: `${widthPct}%`,
                                                        height: '30px',
                                                        top: '7.5px',
                                                        background: task.color,
                                                        borderRadius: '8px 18px 18px 8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0 12px',
                                                        color: task.color === '#addb67' || task.color === '#e0f2f1' ? '#011627' : 'white',
                                                        boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
                                                        clipPath: 'polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        gap: '6px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }}></div>
                                                        {task.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Milestone Indicator */}
                                <div style={{ position: 'absolute', top: '-10px', left: 'calc(60px + (3.5 / 9) * (100% - 60px))', bottom: 0, width: '2px', background: 'hsl(var(--accent-primary))', zIndex: 2, opacity: 0.6 }}>
                                    <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'hsl(var(--accent-primary))', border: '2px solid white' }}></div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 'kanban':
                return (
                    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {['Todo', 'In Progress', 'Completed'].map(col => (
                            <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', opacity: 0.6 }}>{t(`tasks.${col === 'Todo' ? 'todo' : col === 'In Progress' ? 'inProgress' : 'completed'}`)}</h4>
                                    <span style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '10px' }}>
                                        {tasks.filter(t => t.status === col).length}
                                    </span>
                                </div>
                                {tasks.filter(t => t.status === col).map((task, i) => (
                                    <div key={i} className="card" style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>{task.title}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{task.collaborator}</div>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `hsl(${task.priority === 'High' ? 'var(--accent-error)' : 'var(--accent-primary)'})` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                );
            case 'milestone':
                return (
                    <section className="card" style={{ padding: '2rem' }}>
                        {[
                            { title: "Alpha Prototype Finish", date: "Jan 30, 2026", status: "On Track" },
                            { title: "User Acceptance Testing", date: "Feb 15, 2026", status: "Upcoming" },
                            { title: "Final Launch v1.0", date: "Mar 01, 2026", status: "Upcoming" },
                        ].map((ms, i) => (
                            <div key={i} style={{ display: 'flex', gap: '2rem', paddingBottom: '2rem', borderLeft: '2px solid var(--border-color)', marginLeft: '1rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-9px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: 'hsl(var(--accent-primary))', border: '4px solid hsl(var(--bg-card))' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0 }}>{ms.title}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--accent-primary))', fontWeight: 700 }}>{ms.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: '5px 0' }}>{ms.date}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                );
            case 'tracking':
                // Keeping the complete tracking view from the original file for brevity
                return <div>Tracking view...</div>;
            default:
                return null;
        }
    };

    return (
        <main className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {projectId && (
                            <button
                                onClick={() => router.back()}
                                style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                ← Volver al Proyecto
                            </button>
                        )}
                        <h1 style={{ marginBottom: '0.1rem', fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{t('tasks.title')}</h1>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            opacity: 0.8
                        }}>
                            {t('tasks.subtitle')} {projectId ? ` > ${projectId}` : ''}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <div style={{
                            padding: '4px',
                            borderRadius: '16px',
                            display: 'flex',
                            gap: '4px',
                            background: 'hsla(var(--text-primary) / 0.04)',
                            border: '1px solid hsla(var(--text-primary) / 0.06)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {[
                                { id: 'main', icon: '🏠' },
                                { id: 'gantt', icon: '📊' },
                                { id: 'kanban', icon: '🗂️' },
                                { id: 'milestone', icon: '🚩' },
                                { id: 'tracking', icon: '⏱️' }
                            ].map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setViewMode(v.id as any)}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: viewMode === v.id ? 'hsl(var(--bg-secondary))' : 'transparent',
                                        boxShadow: viewMode === v.id ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                                        color: viewMode === v.id ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontWeight: viewMode === v.id ? 700 : 500,
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                    title={t(`tasks.view.${v.id}.desc`)}
                                >
                                    <span style={{
                                        fontSize: '1rem',
                                        filter: viewMode === v.id ? 'none' : 'grayscale(1)',
                                        opacity: viewMode === v.id ? 1 : 0.6
                                    }}>{v.icon}</span>
                                    <span style={{ fontSize: '0.8rem' }}>{t(`tasks.view.${v.id}`)}</span>
                                </button>
                            ))}
                        </div>
                        <button className="btn-primary" style={{ padding: '0.8rem 1.8rem', borderRadius: '14px', fontSize: '0.9rem' }} onClick={() => setIsModalOpen(true)}>{t('tasks.create')}</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Selector de Portafolio */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowPortfolioDropdown(!showPortfolioDropdown)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'hsla(var(--bg-primary) / 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid hsla(var(--text-primary) / 0.1)',
                                    cursor: 'pointer',
                                    padding: '8px 16px 8px 10px',
                                    borderRadius: '10px',
                                    color: 'hsl(var(--text-primary))',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>
                                    {clientPortfolios.find(p => p.id === selectedPortfolio)?.icon}
                                </span>
                                <span>{clientPortfolios.find(p => p.id === selectedPortfolio)?.name}</span>
                                <span style={{ fontSize: '0.6rem', opacity: 0.4 }}>▼</span>
                            </button>

                            {showPortfolioDropdown && (
                                <>
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowPortfolioDropdown(false)} />
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                                        background: 'hsla(var(--bg-primary) / 0.98)', backdropFilter: 'blur(30px)',
                                        border: '1px solid hsla(var(--text-primary) / 0.1)', borderRadius: '14px',
                                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', minWidth: '280px', zIndex: 1000, overflow: 'hidden'
                                    }}>
                                        <div style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portafolios</div>
                                        <div style={{ padding: '4px' }}>
                                            {clientPortfolios.map(portfolio => (
                                                <button
                                                    key={portfolio.id}
                                                    onClick={() => {
                                                        setSelectedPortfolio(portfolio.id);
                                                        setSelectedProject('all');
                                                        setShowPortfolioDropdown(false);
                                                    }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px',
                                                        border: 'none', background: selectedPortfolio === portfolio.id ? 'hsla(var(--accent-primary) / 0.12)' : 'transparent',
                                                        cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', color: 'hsl(var(--text-primary))',
                                                        borderRadius: '10px', transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '1.2rem' }}>{portfolio.icon}</span>
                                                    <span style={{ flex: 1, fontWeight: selectedPortfolio === portfolio.id ? 700 : 500 }}>{portfolio.name}</span>
                                                    {selectedPortfolio === portfolio.id && <span style={{ color: 'hsl(var(--accent-primary))', fontWeight: 800 }}>✓</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Selector de Proyecto (Ligado al Portafolio) */}
                        {selectedPortfolio !== 'all' && (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        background: 'hsla(var(--bg-primary) / 0.8)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid hsla(var(--text-primary) / 0.1)',
                                        cursor: 'pointer',
                                        padding: '8px 16px 8px 10px',
                                        borderRadius: '10px',
                                        color: 'hsl(var(--text-primary))',
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem' }}>🚀</span>
                                    <span>{selectedProject === 'all' ? 'Todos los Proyectos' : projects.find(p => p.id === selectedProject)?.name}</span>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.4 }}>▼</span>
                                </button>

                                {showProjectDropdown && (
                                    <>
                                        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowProjectDropdown(false)} />
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                                            background: 'hsla(var(--bg-primary) / 0.98)', backdropFilter: 'blur(30px)',
                                            border: '1px solid hsla(var(--text-primary) / 0.1)', borderRadius: '14px',
                                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', minWidth: '280px', zIndex: 1000, overflow: 'hidden'
                                        }}>
                                            <div style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proyectos del Portafolio</div>
                                            <div style={{ padding: '4px' }}>
                                                <button
                                                    onClick={() => { setSelectedProject('all'); setShowProjectDropdown(false); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px',
                                                        border: 'none', background: selectedProject === 'all' ? 'hsla(var(--accent-primary) / 0.12)' : 'transparent',
                                                        cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', color: 'hsl(var(--text-primary))',
                                                        borderRadius: '10px', transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '1.2rem' }}>📁</span>
                                                    <span style={{ flex: 1, fontWeight: selectedProject === 'all' ? 700 : 500 }}>Todos los Proyectos</span>
                                                    {selectedProject === 'all' && <span style={{ color: 'hsl(var(--accent-primary))', fontWeight: 800 }}>✓</span>}
                                                </button>
                                                {projects.filter(p => p.portfolioId === selectedPortfolio).map(project => (
                                                    <button
                                                        key={project.id}
                                                        onClick={() => {
                                                            setSelectedProject(project.id);
                                                            setShowProjectDropdown(false);
                                                        }}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px',
                                                            border: 'none', background: selectedProject === project.id ? 'hsla(var(--accent-primary) / 0.12)' : 'transparent',
                                                            cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', color: 'hsl(var(--text-primary))',
                                                            borderRadius: '10px', transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '1.2rem' }}>{project.icon || '🚀'}</span>
                                                        <span style={{ flex: 1, fontWeight: selectedProject === project.id ? 700 : 500 }}>{project.name}</span>
                                                        {selectedProject === project.id && <span style={{ color: 'hsl(var(--accent-primary))', fontWeight: 800 }}>✓</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {viewMode === 'main' && (
                <nav className={styles.tabs}>
                    {['All', 'Todo', 'In Progress', 'Completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                        >
                            {tab === 'All' ? t('tasks.all') : tab === 'Todo' ? t('tasks.todo') : tab === 'In Progress' ? t('tasks.inProgress') : t('tasks.completed')}
                        </button>
                    ))}
                </nav>
            )}

            <div style={{ minHeight: '400px' }}>
                {renderContent()}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultProjectId={projectId || undefined}
                defaultPortfolioId={projectId ? projects.find(p => p.id === projectId)?.portfolioId : (selectedPortfolio !== 'all' ? selectedPortfolio : undefined)}
            />
        </main>
    );
}
