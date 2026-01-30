"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useDataContext, getInitials } from '@/context/DataContext';
import type { Portfolio as PortfolioType, Project as ProjectType } from '@/types/entities';
import styles from './portfolio.module.css';
import PortfolioProfileModal from '@/components/PortfolioProfileModal';

interface Portfolio {
    id: string;
    name: string;
    shortName: string;
    color: string;
    gradient: string;
    icon: string;
    tasksCount: number;
    completedTasks: number;
}

interface Task {
    id: string;
    text: string;
    status: 'approved' | 'in_progress' | 'in_review' | 'waiting';
    completed: boolean;
}

const INITIAL_PORTFOLIOS = [
    { id: 'personal', name: 'Personal', icon: '👤' },
    { id: 'techo', name: 'Un Techo Propio', icon: '🏠' },
    { id: 'faliberries', name: 'Faliberries', icon: '🍓' },
    { id: 'sanfede', name: 'San Fede Produce', icon: '🥬' },
    { id: 'unecapital', name: 'Une Capital', icon: '💰' },
    { id: 'biolink', name: 'Biolink Pro', icon: '🔗' },
];

const PROJECTS: Portfolio[] = [
    { id: 'gh', name: 'Green House', shortName: 'GH', color: '#00c7b7', gradient: 'linear-gradient(135deg, #00c7b7, #00a99d)', icon: '🏠', tasksCount: 12, completedTasks: 8 },
    { id: 'cp', name: 'Cyber Punk', shortName: 'CP', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)', icon: '🎮', tasksCount: 15, completedTasks: 5 },
    { id: 'ec', name: 'Easy Crypto', shortName: 'EC', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', icon: '💎', tasksCount: 8, completedTasks: 3 },
    { id: 'ta', name: 'Travel App', shortName: 'TA', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: '✈️', tasksCount: 20, completedTasks: 15 },
    { id: 'lp', name: 'Landing Page', shortName: 'LP', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', icon: '🎯', tasksCount: 6, completedTasks: 4 },
];

const TASKS: Record<string, { today: Task[], upcoming: Task[] }> = {
    'cp': {
        today: [
            { id: '1', text: 'Create initial layout for homepage', status: 'approved', completed: true },
            { id: '2', text: 'Fixing icons with transparent background', status: 'in_progress', completed: true },
            { id: '3', text: 'Fixing icons with transparent background', status: 'in_progress', completed: true },
            { id: '4', text: 'Create initial layout for homepage', status: 'in_progress', completed: true },
            { id: '5', text: 'Discussions regarding workflow improvement', status: 'in_review', completed: false },
            { id: '6', text: 'Create quotation for app redesign project', status: 'waiting', completed: false },
        ],
        upcoming: [
            { id: '7', text: 'Create initial layout for homepage', status: 'waiting', completed: false },
            { id: '8', text: 'Discussions regarding workflow improvement', status: 'waiting', completed: false },
            { id: '9', text: 'Fixing icons with transparent background', status: 'waiting', completed: false },
        ]
    },
    'gh': {
        today: [
            { id: '1', text: 'Design sustainable garden layout', status: 'approved', completed: true },
            { id: '2', text: 'Research eco-friendly materials', status: 'in_progress', completed: true },
        ],
        upcoming: [
            { id: '3', text: 'Create 3D model of greenhouse', status: 'waiting', completed: false },
        ]
    }
};

export default function PortfolioPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const {
        portfolios,
        projects,
        addPortfolio,
        getProjectsByPortfolio
    } = useDataContext();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioType | null>(portfolios[0] || null);
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
    const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
    const [viewMode, setViewMode] = useState<'main' | 'workspace'>('main');
    const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
    const [newPortfolioName, setNewPortfolioName] = useState('');
    const [isPortfolioProfileOpen, setIsPortfolioProfileOpen] = useState(false);
    const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);

    const handleAddPortfolio = async () => {
        if (!newPortfolioName.trim()) return;

        try {
            const newPortfolio = await addPortfolio({
                name: newPortfolioName,
                shortName: newPortfolioName.substring(0, 3).toUpperCase(),
                icon: '📁',
                color: '#3b82f6',
                gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
            });

            setSelectedPortfolio(newPortfolio);
            setNewPortfolioName('');
            setIsAddingPortfolio(false);
            setShowPortfolioDropdown(false);
        } catch (error) {
            console.error('Error adding portfolio:', error);
            alert('Error al crear el portfolio. Por favor intenta de nuevo.');
        }
    };

    // Get projects filtered by selected portfolio AND search query
    const portfolioProjects = selectedPortfolio
        ? getProjectsByPortfolio(selectedPortfolio.id)
        : projects;

    const filteredProjects = portfolioProjects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: Task['status']) => {
        const statusConfig = {
            approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
            in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            in_review: { label: 'In Review', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
            waiting: { label: 'Waiting', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
        };
        return statusConfig[status];
    };

    // Get tasks for the selected PROJECT
    const currentTasks = selectedProject ? TASKS[selectedProject.id] || { today: [], upcoming: [] } : { today: [], upcoming: [] };

    return (
        <div className={styles.container}>
            {/* Left Panel */}
            {/* Left Panel */}
            <div className={styles.leftPanel}>

                {/* Top Bar: Selector + View Toggle */}
                <div className={styles.topBar}>
                    {/* Portfolio Selector Dropdown */}
                    <div className={styles.portfolioSelector}>
                        {/* ... Button ... */}
                        <button
                            className={styles.selectorButton}
                            onClick={() => setShowPortfolioDropdown(!showPortfolioDropdown)}
                        >
                            <span className={styles.selectorIcon}>
                                {selectedPortfolio?.logoUrl ? (
                                    <img src={selectedPortfolio.logoUrl} style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'contain' }} />
                                ) : (
                                    selectedPortfolio?.icon || '📁'
                                )}
                            </span>
                            <span className={styles.selectorName}>
                                {selectedPortfolio?.name || 'Seleccionar Portafolio'}
                            </span>
                            <span className={styles.selectorArrow}>▼</span>
                        </button>

                        {showPortfolioDropdown && (
                            <>
                                <div
                                    className={styles.dropdownOverlay}
                                    onClick={() => {
                                        setShowPortfolioDropdown(false);
                                        setIsAddingPortfolio(false);
                                    }}
                                />
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownSearchContainer}>
                                        <span className={styles.dropdownSearchIcon}>🔍</span>
                                        <input
                                            type="text"
                                            placeholder="Buscar portafolio..."
                                            className={styles.dropdownSearchInput}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    <div className={styles.dropdownSectionTitle}>MIS PORTAFOLIOS</div>

                                    <div className={styles.dropdownList}>
                                        {/* Portfolio List */}
                                        {portfolios.map(p => (
                                            <div key={p.id} className={styles.dropdownItemRow} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 8px' }}>
                                                <button
                                                    className={styles.dropdownItem}
                                                    style={{ flex: 1, padding: '10px 8px' }}
                                                    onClick={() => {
                                                        setSelectedPortfolio(p);
                                                        setShowPortfolioDropdown(false);
                                                    }}
                                                >
                                                    <div className={styles.itemIconContainer}>
                                                        {p.logoUrl ? (
                                                            <img src={p.logoUrl} style={{ width: '100%', height: '100%', borderRadius: '4px', objectFit: 'contain' }} />
                                                        ) : (
                                                            p.icon
                                                        )}
                                                    </div>
                                                    <span className={styles.itemName}>{p.name}</span>
                                                </button>
                                                <button
                                                    className={styles.editIconBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingPortfolioId(p.id);
                                                        setIsPortfolioProfileOpen(true);
                                                        setShowPortfolioDropdown(false);
                                                    }}
                                                    title="Editar Perfil"
                                                    style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', opacity: 0.5 }}
                                                >
                                                    ⚙️
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.dropdownFooter}>
                                        {isAddingPortfolio ? (
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '0.25rem' }}>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Nombre del portafolio"
                                                    value={newPortfolioName}
                                                    onChange={(e) => setNewPortfolioName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddPortfolio();
                                                        if (e.key === 'Escape') setIsAddingPortfolio(false);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '6px 8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e5e7eb',
                                                        fontSize: '0.85rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                                <button
                                                    onClick={handleAddPortfolio}
                                                    style={{ background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => setIsAddingPortfolio(false)}
                                                    style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className={styles.addItemBtn}
                                                onClick={() => setIsAddingPortfolio(true)}
                                            >
                                                <div className={styles.plusIconContainer}>+</div>
                                                <span>Agregar portafolio</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* View Toggle */}
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'main' ? styles.active : ''}`}
                            onClick={() => setViewMode('main')}
                        >
                            <svg className={styles.toggleIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9.11V19.86C3 20.41 3.45 20.86 4 20.86H9.57C9.83 20.86 10.05 20.64 10.05 20.37V15.74C10.05 15.28 10.42 14.91 10.88 14.91H13.12C13.58 14.91 13.95 15.28 13.95 15.74V20.37C13.95 20.64 14.17 20.86 14.43 20.86H20C20.55 20.86 21 20.41 21 19.86V9.11C21 8.8 20.86 8.5 20.61 8.32L12.61 2.54C12.25 2.28 11.75 2.28 11.39 2.54L3.39 8.32C3.14 8.5 3 8.8 3 9.11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className={styles.toggleLabel}>Main</span>
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'workspace' ? styles.active : ''}`}
                            onClick={() => setViewMode('workspace')}
                        >
                            <svg className={styles.toggleIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.5 2.87012C14.5 2.87012 16.5 4.50012 18 8.00012" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.62988 15.5H12.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 11.5L2.86987 15.5L7 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className={styles.toggleLabel}>Workspace</span>
                        </button>
                    </div>
                </div>

                {viewMode === 'main' ? (
                    <>
                        {/* Header with greeting */}
                        <div className={styles.header}>
                            <h1 className={styles.greeting}>Hola, Federico</h1>
                            <p className={styles.subGreeting}>Bienvenido de vuelta, ¡te extrañamos!</p>
                        </div>

                        {/* Search */}
                        <div className={styles.searchContainer}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar Tarea o Proyecto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {/* Projects Grid */}
                        <div className={styles.portfoliosSection}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Proyectos</h2>
                                <span className={styles.count}>({filteredProjects.length})</span>
                            </div>

                            <div className={styles.portfolioGrid}>
                                {filteredProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className={`${styles.portfolioCard} ${selectedProject?.id === project.id ? styles.selected : ''}`}
                                        onClick={() => setSelectedProject(project)}
                                    >
                                        <div
                                            className={styles.portfolioIcon}
                                            style={{ background: project.gradient }}
                                        >
                                            <span className={styles.shortName}>
                                                {project.shortName && project.shortName.length <= 2
                                                    ? project.shortName
                                                    : getInitials(project.name)}
                                            </span>
                                            {project.id === 'lp' && (
                                                <div className={styles.notificationDot} />
                                            )}
                                        </div>
                                        <span className={styles.portfolioName}>{project.name}</span>
                                    </div>
                                ))}

                                {/* Add More Card */}
                                <div className={styles.portfolioCard}>
                                    <div className={styles.addMoreIcon}>
                                        <span>8+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ marginTop: '2rem' }}>
                        <div className={styles.workspaceHeader} style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: 'white' }}>{selectedPortfolio?.name}</h2>
                            <span className={styles.workspaceSubtitle}>Espacio de Trabajo</span>
                        </div>
                        <div className={styles.workspaceStats}>
                            <div className={styles.statCard} style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <span className={styles.statValue} style={{ color: 'white' }}>12</span>
                                <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>Proyectos Activos</span>
                            </div>
                            <div className={styles.statCard} style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <span className={styles.statValue} style={{ color: 'white' }}>85%</span>
                                <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>Eficiencia</span>
                            </div>
                            <div className={styles.statCard} style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <span className={styles.statValue} style={{ color: 'white' }}>3</span>
                                <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>Próximos Vencimientos</span>
                            </div>
                            <div className={styles.statCard} style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <span className={styles.statValue} style={{ color: '#10b981' }}>+15%</span>
                                <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>Rendimiento</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Panel - Project Details OR Workspace View */}
            <div className={styles.rightPanel}>
                {selectedProject && viewMode === 'main' ? (
                    // Project Details Content
                    <>
                        <div className={styles.detailsHeader}>
                            <div className={styles.detailsTitle}>
                                <h2>{selectedProject.name}</h2>
                                <button className={styles.moreBtn}>•••</button>
                            </div>
                            <div className={styles.avatarGroup}>
                                <div className={styles.avatar} style={{ background: '#f59e0b' }}>👤</div>
                                <div className={styles.avatar} style={{ background: '#ec4899', marginLeft: '-8px' }}>👩</div>
                                <div className={styles.avatar} style={{ background: '#3b82f6', marginLeft: '-8px' }}>👨</div>
                            </div>
                        </div>

                        <p className={styles.detailsDescription}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                        </p>

                        <button
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '1.5rem',
                                background: 'hsl(var(--accent-primary))',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onClick={() => router.push(`/projects?id=${selectedProject.id}`)}
                        >
                            Ver Tablero del Proyecto 📊
                        </button>

                        {/* Today Tasks */}
                        <div className={styles.tasksSection}>
                            <div className={styles.tasksSectionHeader}>
                                <h3>Hoy</h3>
                                <button className={styles.moreBtn}>•••</button>
                            </div>
                            <div className={styles.tasksList}>
                                {currentTasks.today.length > 0 ? (
                                    currentTasks.today.map(task => {
                                        const statusBadge = getStatusBadge(task.status);
                                        return (
                                            <div key={task.id} className={styles.taskItem}>
                                                <div
                                                    className={`${styles.taskCheckbox} ${task.completed ? styles.checked : ''}`}
                                                    style={{ borderColor: task.completed ? '#10b981' : undefined }}
                                                >
                                                    {task.completed && <span>✓</span>}
                                                </div>
                                                <span className={styles.taskText}>{task.text}</span>
                                                <span
                                                    className={styles.statusBadge}
                                                    style={{ color: statusBadge.color, background: statusBadge.bg }}
                                                >
                                                    {statusBadge.label}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.85rem' }}>No hay tareas para hoy</div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className={styles.tasksSection}>
                            <div className={styles.tasksSectionHeader}>
                                <h3>Próximas</h3>
                            </div>
                            <div className={styles.tasksList}>
                                {currentTasks.upcoming.length > 0 ? (
                                    currentTasks.upcoming.map(task => {
                                        const statusBadge = getStatusBadge(task.status);
                                        return (
                                            <div key={task.id} className={styles.taskItem}>
                                                <div className={styles.taskCheckbox} />
                                                <span className={styles.taskText}>{task.text}</span>
                                                <span
                                                    className={styles.statusBadge}
                                                    style={{ color: statusBadge.color, background: statusBadge.bg }}
                                                >
                                                    {statusBadge.label}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.85rem' }}>No hay tareas próximas</div>
                                )}
                            </div>
                        </div>

                        {/* Floating Action Button */}
                        <button className={styles.fab}>
                            <span>+</span>
                        </button>
                    </>
                ) : null}
            </div>

            <PortfolioProfileModal
                isOpen={isPortfolioProfileOpen}
                onClose={() => {
                    setIsPortfolioProfileOpen(false);
                    setEditingPortfolioId(null);
                }}
                portfolioId={editingPortfolioId || (selectedPortfolio?.id || null)}
            />
        </div>
    );
}

