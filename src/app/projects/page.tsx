"use client";

import React, { useState, Suspense } from 'react';
import styles from './projects.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { useDataContext } from '@/context/DataContext';
import type { Project as ProjectType } from '@/types/entities';
import ColumnCenter, { ColumnType } from '@/components/ColumnCenter';
import ColumnMenu from '@/components/ColumnMenu';
import ProjectsSearchHandler from './ProjectsSearchHandler';
import CreateProjectModal from '@/components/CreateProjectModal';

type ProjectStatus = 'planning' | 'active' | 'completed';
type RiskLevel = 'low' | 'medium' | 'high';
type ViewMode = 'overview' | 'board' | 'timeline';
interface Project {
    id: string;
    name: string;
    description: string;
    manager: string;
    status: ProjectStatus;
    risk: RiskLevel;
    progress: number;
    team: string[];
    deadline: string;
    color: string;
}

interface Tag {
    id: string;
    label: string;
    color: string;
}

interface BoardItem {
    id: string;
    item: string;
    responsible: string;
    projectId: string;
    projectName: string;
    priority: string; // Refers to Tag.label
    status: string;   // Refers to Tag.label
    startDate: string;
    deadline: string;
    progress: number;
    weekGroup: 'this' | 'next';
}

export default function ProjectsPage() {
    const { t } = useLanguage();
    const router = require('next/navigation').useRouter();
    const { portfolios, projects: contextProjects } = useDataContext();

    const [viewMode, setViewMode] = useState<ViewMode>('overview');
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({ this: false, next: false, done: false });

    const [groupColors, setGroupColors] = useState<Record<string, string>>({
        this: '#c792ea',
        next: '#ff8652',
        done: '#00c875'
    });
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
    const [groupNames, setGroupNames] = useState<Record<string, string>>({
        this: 'ESTA SEMANA',
        next: 'LA PRÓXIMA SEMANA',
        done: 'LISTO'
    });
    const [editingGroup, setEditingGroup] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<{ id: string, field: string } | null>(null);
    const [editingHeader, setEditingHeader] = useState<{ section: string; field: string } | null>(null);

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        item: 300,
        responsible: 80,
        projectName: 180,
        priority: 120,
        status: 120,
        deadline: 120
    });

    const [columnTitles, setColumnTitles] = useState<Record<string, string>>({
        item: 'ELEMENTO',
        responsible: 'RESPONSABLE',
        projectName: 'PROYECTO',
        priority: 'PRIORIDAD',
        status: 'ESTADO',
        deadline: 'FECHA DE ENTREGA'
    });

    const [resizing, setResizing] = useState<{ field: string, startX: number, startWidth: number } | null>(null);
    const [showColumnCenter, setShowColumnCenter] = useState<string | null>(null);
    const [customColumns, setCustomColumns] = useState<Record<string, ColumnType[]>>({});
    const [columnMenuAnchor, setColumnMenuAnchor] = useState<{
        x: number;
        y: number;
        columnId: string;
        columnName: string;
        sectionKey: string;
    } | null>(null);

    // Build portfolio dropdown from DataContext
    const clientPortfolios = [
        { id: 'all', name: 'Todos los Portafolios', icon: '📁' },
        ...portfolios.map(p => ({ id: p.id, name: p.name, icon: p.icon }))
    ];
    const [selectedPortfolio, setSelectedPortfolio] = useState('all');
    const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleResizeStart = (e: React.MouseEvent, field: string) => {
        e.preventDefault();
        e.stopPropagation();
        setResizing({
            field,
            startX: e.pageX,
            startWidth: columnWidths[field]
        });
    };

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizing) return;
            const diff = e.pageX - resizing.startX;
            setColumnWidths(prev => ({
                ...prev,
                [resizing.field]: Math.max(50, resizing.startWidth + diff)
            }));
        };

        const handleMouseUp = () => {
            setResizing(null);
        };

        if (resizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing]);

    const colorPalette = [
        '#f85a5a', '#fdab3d', '#99e63e', '#00c875', '#579bfc', '#666666',
        '#c792ea', '#ff8652', '#00c875'
    ];

    const responsibles = ['Antigravity', 'User', 'Julian Rossi', 'Federico', 'Elena Vance', 'Marcus Thorne'];

    const toggleSection = (section: string) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Use projects from DataContext, filter by selected portfolio
    const projects: Project[] = selectedPortfolio === 'all'
        ? contextProjects.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            manager: p.manager,
            status: p.status as ProjectStatus,
            risk: (p.priority === 'high' ? 'high' : p.priority === 'low' ? 'low' : 'medium') as RiskLevel,
            progress: p.progress,
            team: [],
            deadline: p.deadline,
            color: p.color
        }))
        : contextProjects
            .filter(p => p.portfolioId === selectedPortfolio)
            .map(p => ({
                id: p.id,
                name: p.name,
                description: p.description || '',
                manager: p.manager,
                status: p.status as ProjectStatus,
                risk: (p.priority === 'high' ? 'high' : p.priority === 'low' ? 'low' : 'medium') as RiskLevel,
                progress: p.progress,
                team: [],
                deadline: p.deadline,
                color: p.color
            }));

    const [boardItems, setBoardItems] = useState<BoardItem[]>([
        { id: '1', item: 'Diseño de Riego Automático', responsible: 'Federico', projectId: 'gh', projectName: 'Green House', priority: 'Alta', status: 'Trabajand...', startDate: '2026-01-20', deadline: '2026-02-10', progress: 45, weekGroup: 'this' },
        { id: '2', item: 'Assets de Personajes Principal', responsible: 'Federico', projectId: 'cp', projectName: 'Cyber Punk', priority: 'Media', status: 'Aprobado', startDate: '2026-01-22', deadline: '2026-02-15', progress: 30, weekGroup: 'this' },
        { id: '3', item: 'TOMAR HAPPY PILLS', responsible: 'Julian Rossi', projectId: 'PROJ-001', projectName: 'Personal', priority: 'Alta', status: 'REPETIR', startDate: '2026-01-20', deadline: '2026-01-27', progress: 45, weekGroup: 'this' },
    ]);

    const [statusTags, setStatusTags] = useState<Tag[]>([
        { id: 's1', label: 'Interrumpido', color: '#f85a5a' },
        { id: 's2', label: 'Trabajando en ello', color: '#fdab3d' },
        { id: 's3', label: 'Esperando revisión', color: '#579bfc' },
        { id: 's4', label: 'Aprobado', color: '#ff8652' },
        { id: 's5', label: 'Listo', color: '#00c875' },
        { id: 's6', label: 'REPETIR', color: '#444' },
    ]);

    const [priorityTags, setPriorityTags] = useState<Tag[]>([
        { id: 'p1', label: 'Alta', color: '#f85a5a' },
        { id: 'p2', label: 'Media', color: '#fdab3d' },
        { id: 'p3', label: 'Baja', color: '#99e63e' },
    ]);

    const updateItem = (id: string, field: string, value: string | number | string[] | boolean) => {
        setBoardItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
        setEditingCell(null);
    };

    const renderOverview = () => (
        <div className={styles.projectsGrid}>
            {projects.map(proj => (
                <div key={proj.id} className={`card ${styles.projectCard}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, marginBottom: '0.25rem' }}>{proj.id}</div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{proj.name}</h3>
                        </div>
                        <div className={styles.statusBadge} style={{
                            background: `hsla(${proj.status === 'completed' ? 'var(--accent-gold)' : proj.status === 'active' ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} / 0.1)`,
                            color: proj.status === 'completed' ? 'hsl(var(--accent-gold))' : proj.status === 'active' ? 'hsl(var(--accent-primary))' : 'hsl(var(--text-muted))',
                            border: `1px solid hsla(${proj.status === 'completed' ? 'var(--accent-gold)' : proj.status === 'active' ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} / 0.15)`
                        }}>
                            {t(`projects.status.${proj.status}`)}
                        </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.5, minHeight: '3em' }}>{proj.description}</p>

                    <div style={{ margin: '0.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            <span>{t('projects.progress')}</span>
                            <span>{proj.progress}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${proj.progress}%`,
                                height: '100%',
                                background: proj.color,
                                boxShadow: `0 0 10px ${proj.color}40`,
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', marginLeft: '0.25rem' }}>
                                {proj.team.map((m, i) => (
                                    <div key={i} style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: 'var(--bg-tertiary)',
                                        border: '2px solid white',
                                        marginLeft: i === 0 ? 0 : '-10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        zIndex: 10 - i
                                    }}>{m}</div>
                                ))}
                            </div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                                <span style={{ opacity: 0.5 }}>{t('projects.manager')}: </span>
                                {proj.manager}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.5 }}>{t('projects.risk.' + proj.risk)}</div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `hsl(${proj.risk === 'high' ? 'var(--accent-error)' : proj.risk === 'medium' ? 'var(--accent-gold)' : 'var(--accent-primary)'})`, marginLeft: 'auto', marginTop: '4px' }}></div>
                        </div>
                    </div>
                </div>
            ))}
            <button
                className={`card ${styles.projectCard}`}
                style={{ borderStyle: 'dashed', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '200px' }}
                onClick={() => setIsCreateModalOpen(true)}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>🏗️</div>
                    <div style={{ fontWeight: 800, color: 'hsl(var(--accent-primary))' }}>{t('projects.new')}</div>
                </div>
            </button>
        </div>
    );

    const respAvatars: Record<string, string> = {
        'Julian Rossi': '🧔🏻',
        'Elena Vance': '👩🏼‍💻',
        'Marcus Thorne': '👨🏾‍💼',
        'Antigravity': '🤖',
        'User': '👤'
    };

    const getPriorityColor = (p: string) => {
        if (p === 'High' || p === 'Alta') return '#ff5f5f'; // Red-ish
        if (p === 'Medium' || p === 'Media') return '#ffb340'; // Orange/Gold
        return '#99e63e'; // Green-ish
    };

    const getStatusColor = (s: string) => {
        if (s === 'Terminado' || s === 'Entregado' || s === 'Aprobado') return '#ff8652'; // Coral/Orange
        if (s === 'REPETIR') return '#444'; // Dark
        return '#ffcd52'; // Yellow/Amber
    };

    const getProjectColor = (p: string) => {
        const colors: Record<string, string> = {
            'Biolink Pro': '#cedee3',
            'CyberNexus': '#4d80b3',
            'ERP Migration': '#ff7a8a',
            'Personal': '#cedee3',
            'Un Techo Propio': '#4d80b3',
            'Faliberries': '#ff7a8a',
            'San Fede Produce': '#b8e645',
            'Une Capital': '#3e8e91'
        };
        return colors[p] || 'var(--accent-primary)';
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = [
            'ene', 'feb', 'mar', 'abr', 'may', 'jun',
            'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
        ];
        return `${monthNames[date.getMonth()]}. ${day}`;
    };

    const [popoverAnchor, setPopoverAnchor] = useState<{ x: number, y: number, id: string, field: string, type: 'status' | 'priority', tags: Tag[] } | null>(null);
    const [isEditingTags, setIsEditingTags] = useState(false);

    const colors = ['#f85a5a', '#fdab3d', '#ffcb00', '#00c875', '#00d2d2', '#579bfc', '#a25ddc', '#444', '#784450', '#808080'];


    const renderEditableCell = (bi: BoardItem, field: keyof BoardItem, type: 'text' | 'select' | 'date' | 'priority' | 'status' | 'project', options?: string[]) => {
        const isEditing = editingCell?.id === bi.id && editingCell?.field === field;
        const value = bi[field];

        const handleOpenPopover = (e: React.MouseEvent) => {
            if (type !== 'status' && type !== 'priority') return;
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setPopoverAnchor({
                x: rect.left,
                y: rect.bottom + 5,
                id: bi.id,
                field: field as string,
                type: type,
                tags: type === 'status' ? statusTags : priorityTags
            });
            setIsEditingTags(false);
        };

        if (isEditing) {
            return (
                <div className={styles.cellContent}>
                    {type === 'select' || type === 'project' ? (
                        <select
                            autoFocus
                            className={`${styles.inlineSelect} ${styles.blockCell}`}
                            style={{
                                background: type === 'project' ? getProjectColor(String(value)) : 'transparent',
                                color: (type === 'project' && (String(value) === 'Personal' || String(value) === 'Biolink Pro')) ? '#444' : 'white',
                                border: 'none'
                            }}
                            value={String(value)}
                            onChange={(e) => updateItem(bi.id, field, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                        >
                            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : type === 'date' ? (
                        <input
                            type="date"
                            autoFocus
                            className={styles.inlineInput}
                            style={{ padding: '0 8px' }}
                            value={String(value)}
                            onChange={(e) => updateItem(bi.id, field, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                        />
                    ) : (
                        <input
                            autoFocus
                            className={styles.inlineInput}
                            style={{ padding: '0 8px' }}
                            value={String(value)}
                            onChange={(e) => updateItem(bi.id, field, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                        />
                    )}
                </div>
            );
        }

        if (type === 'status' || type === 'priority') {
            const tag = (type === 'status' ? statusTags : priorityTags).find(t => t.label === value);
            return (
                <div className={styles.cellContent} onClick={handleOpenPopover} style={{ cursor: 'pointer' }}>
                    <div className={styles.blockCell} style={{ background: tag?.color || '#444', color: 'white' }}>
                        {String(value)}
                    </div>
                </div>
            );
        }

        if (type === 'project') {
            const label = String(value);
            return (
                <div className={styles.cellContent} onClick={() => setEditingCell({ id: bi.id, field })} style={{ cursor: 'pointer' }}>
                    <div
                        className={styles.blockCell}
                        style={{
                            background: getProjectColor(label),
                            color: (label === 'Personal' || label === 'Biolink Pro') ? '#444' : 'white'
                        }}
                    >
                        {label}
                    </div>
                </div>
            );
        }

        if (field === 'responsible') {
            return (
                <div className={styles.responsibleCell} style={{ width: '150px', justifyContent: 'flex-start', gap: '8px', padding: '0 12px', flexDirection: 'row' }} onClick={() => setEditingCell({ id: bi.id, field })}>
                    <div className={styles.avatar}>{respAvatars[String(value)] || '👤'}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{String(value)}</span>
                </div>
            );
        }

        const isDate = field === 'startDate' || field === 'deadline';
        const isElemento = field === 'item';

        return (
            <div
                className={`${styles.cellContent} ${isDate ? styles.dateCell : ''}`}
                onClick={() => setEditingCell({ id: bi.id, field })}
                style={{
                    justifyContent: isElemento ? 'flex-start' : (isDate ? 'flex-start' : 'center'),
                    textAlign: isElemento ? 'left' : 'inherit',
                    paddingLeft: isElemento ? '16px' : '8px'
                }}
            >
                {isDate ? formatDate(String(value)) :
                    field === 'progress' ? `${value}%` : String(value)}
            </div>
        );
    };

    // Render custom column cell based on field type
    const renderCustomColumnCell = (bi: BoardItem, col: ColumnType) => {
        // Get custom data from a dynamic field (we'll store it in the item)
        const customData = (bi as unknown as Record<string, unknown>)[col.id] ?? '';

        switch (col.fieldType) {
            case 'checkbox':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <input
                            type="checkbox"
                            checked={Boolean(customData)}
                            onChange={(e) => updateItem(bi.id, col.id, e.target.checked)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                    </div>
                );
            case 'number':
                return (
                    <div className={styles.cellContent} style={{ justifyContent: 'center' }}>
                        <input
                            type="number"
                            value={String(customData || '')}
                            onChange={(e) => updateItem(bi.id, col.id, e.target.value)}
                            style={{
                                width: '60px',
                                background: 'transparent',
                                border: '1px solid hsla(var(--text-primary) / 0.1)',
                                borderRadius: '4px',
                                padding: '2px 4px',
                                textAlign: 'center',
                                color: 'inherit'
                            }}
                        />
                    </div>
                );
            case 'date':
                return (
                    <div className={styles.cellContent}>
                        {formatDate(String(customData || ''))}
                    </div>
                );
            case 'link':
                return (
                    <div className={styles.cellContent} style={{ justifyContent: 'center' }}>
                        {customData ? (
                            <a href={String(customData)} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--accent-primary))' }}>
                                🔗
                            </a>
                        ) : (
                            <span style={{ opacity: 0.3 }}>—</span>
                        )}
                    </div>
                );
            default:
                // text, status, priority, dropdown, person
                return (
                    <div
                        className={styles.cellContent}
                        style={{ justifyContent: 'center', cursor: 'pointer', opacity: customData ? 1 : 0.3 }}
                        onClick={() => {
                            const newValue = prompt(`Nuevo valor para ${col.name}:`, String(customData || ''));
                            if (newValue !== null) {
                                updateItem(bi.id, col.id, newValue);
                            }
                        }}
                    >
                        {String(customData || '—')}
                    </div>
                );
        }
    };

    const renderBoardTable = (items: BoardItem[], title: string, sectionKey: string) => {
        const isCollapsed = collapsedSections[sectionKey];

        const baseHeaders = [
            { key: 'item', field: 'item', info: true },
            { key: 'responsible', field: 'responsible', info: true, width: '150px' },
            { key: 'projectName', field: 'projectName', info: false },
            { key: 'priority', field: 'priority', info: true },
            { key: 'status', field: 'status', info: true },
            { key: 'deadline', field: 'deadline', info: true },
        ];

        // Add custom columns for this section
        const sectionCustomColumns = customColumns[sectionKey] || [];
        const customHeaders = sectionCustomColumns.map(col => ({
            key: col.id,
            field: col.id,
            info: false,
            fieldType: col.fieldType
        }));

        const headers = [...baseHeaders, ...customHeaders];

        return (
            <div
                className={`${styles.tableContainer} ${resizing ? styles.resizing : ''}`}
                style={{
                    overflow: 'visible',
                    zIndex: activeColorPicker === sectionKey ? 1000 : (editingHeader ? 500 : 1),
                    position: 'relative'
                }}
            >
                <div className={styles.groupHeader} onClick={() => toggleSection(sectionKey)} style={{ position: 'relative', zIndex: 110 }}>
                    <div className={styles.groupTitle} style={{ color: groupColors[sectionKey] || 'hsl(var(--accent-primary))', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`${styles.caret} ${!isCollapsed ? styles.caretDown : ''}`}>▼</span>
                        <div
                            className={styles.groupColorSwatch}
                            style={{
                                background: groupColors[sectionKey] || '#ccc',
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                position: 'relative'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveColorPicker(activeColorPicker === sectionKey ? null : sectionKey);
                            }}
                        >
                        </div>
                        {editingGroup === sectionKey ? (
                            <input
                                autoFocus
                                className={styles.inlineInput}
                                style={{
                                    background: 'hsla(var(--bg-primary) / 0.8)',
                                    color: 'inherit',
                                    fontWeight: 800,
                                    border: '1px solid hsla(var(--accent-primary) / 0.3)',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    padding: '2px 6px',
                                    width: 'auto',
                                    minWidth: '200px'
                                }}
                                value={groupNames[sectionKey]}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setGroupNames(prev => ({ ...prev, [sectionKey]: e.target.value.toUpperCase() }))}
                                onBlur={() => setEditingGroup(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingGroup(null)}
                            />
                        ) : (
                            <div
                                style={{ cursor: 'text', display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingGroup(sectionKey);
                                }}
                            >
                                <span>{groupNames[sectionKey] || title}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.3 }}>✎</span>
                            </div>
                        )}

                        {activeColorPicker === sectionKey && (
                            <>
                                <div
                                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9998, cursor: 'default' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveColorPicker(null);
                                    }}
                                />
                                <div
                                    className={styles.colorGridPopover}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '2rem',
                                        zIndex: 9999,
                                        marginTop: '4px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {colorPalette.map(color => (
                                        <div
                                            key={color}
                                            className={styles.colorOption}
                                            style={{ background: color }}
                                            onClick={() => {
                                                setGroupColors(prev => ({ ...prev, [sectionKey]: color }));
                                                setActiveColorPicker(null);
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {!isCollapsed && (
                    <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
                        <table className={styles.dataTable} style={{ tableLayout: 'fixed', width: 'auto' }}>
                            <thead>
                                <tr>
                                    <th className={styles.checkboxCell} style={{ width: '40px' }}><input type="checkbox" style={{ opacity: 0.3 }} /></th>
                                    {headers.map(h => (
                                        <th
                                            key={h.key}
                                            style={{
                                                width: `${columnWidths[h.field]}px`,
                                                textAlign: (h.key === 'item' || h.key === 'responsible') ? 'left' : 'center',
                                                paddingLeft: (h.key === 'item' || h.key === 'responsible') ? '16px' : '0',
                                                position: 'relative'
                                            }}
                                        >
                                            {editingHeader?.section === sectionKey && editingHeader?.field === h.field ? (
                                                <div style={{ padding: '4px' }}>
                                                    <input
                                                        autoFocus
                                                        className={styles.editableHeader}
                                                        value={columnTitles[h.field] || ''}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onFocus={(e) => e.target.select()}
                                                        onChange={(e) => {
                                                            const val = e.target.value.toUpperCase();
                                                            setColumnTitles(prev => ({ ...prev, [h.field]: val }));
                                                        }}
                                                        onBlur={() => setEditingHeader(null)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') setEditingHeader(null);
                                                            if (e.key === 'Escape') setEditingHeader(null);
                                                            e.stopPropagation();
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            border: '2px solid hsl(var(--accent-primary))',
                                                            background: 'hsl(var(--bg-primary))',
                                                            borderRadius: '4px',
                                                            padding: '2px 4px',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: (h.key === 'item' || h.key === 'responsible') ? 'flex-start' : 'center',
                                                        gap: '6px',
                                                        width: '100%',
                                                        height: '100%',
                                                        cursor: 'pointer',
                                                        padding: '0.6rem 0.8rem'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log('Activating header edit:', sectionKey, h.field);
                                                        setEditingHeader({ section: sectionKey, field: h.field });
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 800 }}>{columnTitles[h.field]}</span>
                                                    {h.info && <span className={styles.infoIcon}>ⓘ</span>}
                                                    <button
                                                        className={styles.columnMenuBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                            setColumnMenuAnchor({
                                                                x: rect.left,
                                                                y: rect.bottom + 4,
                                                                columnId: h.field,
                                                                columnName: columnTitles[h.field] || h.field,
                                                                sectionKey: sectionKey
                                                            });
                                                        }}
                                                        style={{
                                                            marginLeft: 'auto',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '2px 4px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            opacity: 0.4,
                                                            transition: 'opacity 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
                                                    >
                                                        •••
                                                    </button>
                                                </div>
                                            )}
                                            <div
                                                className={styles.resizeHandle}
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    handleResizeStart(e, h.field);
                                                }}
                                            />
                                        </th>
                                    ))}
                                    <th
                                        style={{ width: '40px', cursor: 'pointer', position: 'relative' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowColumnCenter(sectionKey);
                                        }}
                                        title="Agregar columna"
                                        className={styles.addColumnHeader}
                                    >
                                        <span style={{ fontSize: '1.2rem', fontWeight: 300 }}>+</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(bi => (
                                    <tr key={bi.id} className={styles.dataRow}>
                                        <td className={styles.checkboxCell} style={{ borderLeft: `4px solid ${groupColors[sectionKey]}` }}>
                                            <input type="checkbox" style={{ opacity: 0.3 }} />
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            <div className={styles.cellContent} style={{ justifyContent: 'space-between' }}>
                                                {renderEditableCell(bi, 'item', 'text')}
                                                <button
                                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.6 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Ensure mapping or fallback
                                                        const targetId = bi.projectId === 'gh' ? 'gh' : bi.projectId;
                                                        router.push(`/tasks?projectId=${targetId}`);
                                                    }}
                                                    title="Ver Tareas"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td>{renderEditableCell(bi, 'responsible', 'select', responsibles)}</td>
                                        <td>{renderEditableCell(bi, 'projectName', 'project', ['Personal', 'Un Techo Propio', 'Faliberries', 'San Fede Produce', 'Une Capital', 'Biolink Pro'])}</td>
                                        <td>{renderEditableCell(bi, 'priority', 'priority', ['Alta', 'Media', 'Baja'])}</td>
                                        <td>{renderEditableCell(bi, 'status', 'status', ['Activo', 'Trabajand...', 'Aprobado', 'Terminado', 'Entregado', 'REPETIR'])}</td>
                                        <td>
                                            <div className={styles.cellContent} style={{ gap: '8px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsla(var(--white), 0.2)' }}></div>
                                                {renderEditableCell(bi, 'deadline', 'date')}
                                            </div>
                                        </td>
                                        {/* Custom columns */}
                                        {sectionCustomColumns.map(col => (
                                            <td key={col.id} style={{ width: columnWidths[col.id] || 120 }}>
                                                {renderCustomColumnCell(bi, col)}
                                            </td>
                                        ))}
                                        <td style={{ textAlign: 'center' }}></td>
                                    </tr>
                                ))}
                                <tr className={`${styles.dataRow} ${styles.addRow}`}>
                                    <td className={styles.checkboxCell}></td>
                                    <td colSpan={headers.length} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => {
                                        const newItem: BoardItem = {
                                            id: Date.now().toString(),
                                            item: 'Nuevo elemento...',
                                            responsible: responsibles[0],
                                            projectId: 'PROJ-001',
                                            projectName: 'Biolink Pro',
                                            priority: 'Alta',
                                            status: 'Activo',
                                            startDate: new Date().toISOString().split('T')[0],
                                            deadline: new Date().toISOString().split('T')[0],
                                            progress: 0,
                                            weekGroup: sectionKey === 'done' ? 'this' : sectionKey as 'this' | 'next'
                                        };
                                        setBoardItems(prev => [...prev, newItem]);
                                    }}>
                                        + Agregar elemento
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const renderBoard = () => {
        // Automation: Items marked as finished/delivered go to 'LISTO'
        const doneItems = boardItems.filter(item => item.status === 'Terminado' || item.status === 'Entregado');
        const thisWeekItems = boardItems.filter(item => item.weekGroup === 'this' && item.status !== 'Terminado' && item.status !== 'Entregado');
        const nextWeekItems = boardItems.filter(item => item.weekGroup === 'next' && item.status !== 'Terminado' && item.status !== 'Entregado');

        return (
            <div className={styles.board}>
                {renderBoardTable(thisWeekItems, t('projects.board.thisWeek'), 'this')}
                {renderBoardTable(nextWeekItems, t('projects.board.nextWeek'), 'next')}
                {renderBoardTable(doneItems, t('projects.board.done'), 'done')}
            </div>
        );
    };

    const renderTimeline = () => (
        <div className={`card ${styles.timelineContainer}`}>
            <div className={styles.timelineGrid}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) repeat(6, 1fr)', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ fontWeight: 800, opacity: 0.4, fontSize: '0.75rem' }}>PROJECT NAME</div>
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map(m => (
                        <div key={m} style={{ textAlign: 'center', fontWeight: 800, opacity: 0.4, fontSize: '0.75rem' }}>{m}</div>
                    ))}
                </div>
                {projects.map((proj, i) => (
                    <div key={proj.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 6fr', gap: '1rem', height: '50px', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{proj.name}</div>
                        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                            <div style={{
                                position: 'absolute',
                                left: `${(i * 10) + 5}%`,
                                width: `${Math.max(20, proj.progress * 0.6)}%`,
                                height: '24px',
                                top: '13px',
                                background: proj.color,
                                opacity: 0.8,
                                borderRadius: '12px',
                                boxShadow: `0 4px 15px ${proj.color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 12px',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 800
                            }}>
                                {proj.id}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        <div className={styles.container}>
            <Suspense fallback={<div>Loading...</div>}>
                <ProjectsSearchHandler setViewMode={setViewMode} />
            </Suspense>
            <header className={styles.header}>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowPortfolioDropdown(!showPortfolioDropdown)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'hsla(var(--bg-primary) / 0.9)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid hsla(var(--text-primary) / 0.1)',
                            cursor: 'pointer',
                            padding: '8px 14px 8px 8px',
                            borderRadius: '10px',
                            color: 'hsl(var(--text-primary))',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px hsla(255, 255, 255, 0.05) inset',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px hsla(255, 255, 255, 0.08) inset';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px hsla(255, 255, 255, 0.05) inset';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>
                            {clientPortfolios.find(p => p.id === selectedPortfolio)?.icon}
                        </span>
                        <span style={{ fontWeight: 600 }}>{clientPortfolios.find(p => p.id === selectedPortfolio)?.name}</span>
                        <span style={{ fontSize: '0.55rem', opacity: 0.4, marginLeft: '2px' }}>▼</span>
                    </button>

                    {showPortfolioDropdown && (
                        <>
                            <div
                                style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                                onClick={() => setShowPortfolioDropdown(false)}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: '8px',
                                background: 'hsla(var(--bg-primary) / 0.85)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid hsla(var(--text-primary) / 0.08)',
                                borderRadius: '12px',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px hsla(255, 255, 255, 0.05) inset',
                                minWidth: '300px',
                                zIndex: 1000,
                                overflow: 'hidden'
                            }}>
                                {/* Search */}
                                <div style={{ padding: '12px', borderBottom: '1px solid hsla(var(--text-primary) / 0.06)' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 14px',
                                        background: 'hsla(var(--text-primary) / 0.04)',
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        color: 'hsl(var(--text-muted))',
                                        border: '1px solid hsla(var(--text-primary) / 0.06)'
                                    }}>
                                        <span style={{ opacity: 0.6 }}>🔍</span>
                                        <span>Buscar portafolio...</span>
                                    </div>
                                </div>

                                {/* Header */}
                                <div style={{
                                    padding: '10px 14px 6px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    color: 'hsl(var(--text-muted))',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Mis Portafolios
                                </div>

                                {/* List */}
                                <div style={{ padding: '4px 6px' }}>
                                    {clientPortfolios.map(portfolio => (
                                        <button
                                            key={portfolio.id}
                                            onClick={() => {
                                                setSelectedPortfolio(portfolio.id);
                                                setShowPortfolioDropdown(false);
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: 'none',
                                                background: selectedPortfolio === portfolio.id
                                                    ? 'linear-gradient(135deg, hsla(var(--accent-primary) / 0.15), hsla(var(--accent-primary) / 0.08))'
                                                    : 'transparent',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontSize: '0.9rem',
                                                color: 'hsl(var(--text-primary))',
                                                transition: 'all 0.2s ease',
                                                borderRadius: '8px',
                                                borderLeft: selectedPortfolio === portfolio.id ? '3px solid hsl(var(--accent-primary))' : '3px solid transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedPortfolio !== portfolio.id) {
                                                    e.currentTarget.style.background = 'hsla(var(--text-primary) / 0.05)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = selectedPortfolio === portfolio.id
                                                    ? 'linear-gradient(135deg, hsla(var(--accent-primary) / 0.15), hsla(var(--accent-primary) / 0.08))'
                                                    : 'transparent';
                                            }}
                                        >
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: portfolio.id === selectedPortfolio
                                                    ? 'linear-gradient(135deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))'
                                                    : 'hsla(var(--text-primary) / 0.08)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1rem',
                                                color: portfolio.id === selectedPortfolio ? 'white' : 'inherit',
                                                boxShadow: portfolio.id === selectedPortfolio ? '0 4px 12px hsla(var(--accent-primary) / 0.3)' : 'none'
                                            }}>
                                                {portfolio.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: selectedPortfolio === portfolio.id ? 600 : 500 }}>
                                                    {portfolio.name}
                                                </div>
                                                {selectedPortfolio === portfolio.id && (
                                                    <div style={{ fontSize: '0.7rem', color: 'hsl(var(--accent-primary))', marginTop: '2px' }}>
                                                        Portafolio activo
                                                    </div>
                                                )}
                                            </div>
                                            {selectedPortfolio === portfolio.id && (
                                                <span style={{ color: 'hsl(var(--accent-primary))', fontSize: '1.1rem' }}>✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div style={{ borderTop: '1px solid hsla(var(--text-primary) / 0.06)', padding: '6px' }}>
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontSize: '0.9rem',
                                            color: 'hsl(var(--accent-primary))',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'hsla(var(--accent-primary) / 0.08)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background: 'hsla(var(--accent-primary) / 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem'
                                        }}>
                                            ➕
                                        </div>
                                        <span style={{ fontWeight: 500 }}>Agregar portafolio</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.viewControls}>
                    <div className={styles.tabs}>
                        {[
                            { id: 'overview', icon: '🎴' },
                            { id: 'board', icon: '📋' },
                            { id: 'timeline', icon: '📅' }
                        ].map(v => (
                            <button
                                key={v.id}
                                onClick={() => setViewMode(v.id as ViewMode)}
                                className={`${styles.tab} ${viewMode === v.id ? styles.tabActive : ''}`}
                            >
                                <span>{v.icon}</span>
                                <span>{t(`projects.view.${v.id}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div style={{ minHeight: '600px' }}>
                {viewMode === 'overview' && renderOverview()}
                {viewMode === 'board' && renderBoard()}
                {viewMode === 'timeline' && renderTimeline()}
            </div>
            <DropdownPopover
                popoverAnchor={popoverAnchor}
                setPopoverAnchor={setPopoverAnchor}
                isEditingTags={isEditingTags}
                setIsEditingTags={setIsEditingTags}
                statusTags={statusTags}
                setStatusTags={setStatusTags}
                priorityTags={priorityTags}
                setPriorityTags={setPriorityTags}
                updateItem={updateItem}
                t={t}
            />

            <ColumnCenter
                isOpen={showColumnCenter !== null}
                onClose={() => setShowColumnCenter(null)}
                onAddColumn={(column) => {
                    if (showColumnCenter) {
                        // Generate unique ID to avoid conflicts with base columns
                        const uniqueId = `${column.id}_${Date.now()}`;
                        const newColumn = { ...column, id: uniqueId };

                        setCustomColumns(prev => ({
                            ...prev,
                            [showColumnCenter]: [...(prev[showColumnCenter] || []), newColumn]
                        }));
                        // Add column width and title for the new column
                        setColumnWidths(prev => ({
                            ...prev,
                            [uniqueId]: 120
                        }));
                        setColumnTitles(prev => ({
                            ...prev,
                            [uniqueId]: column.name.toUpperCase()
                        }));
                    }
                }}
            />

            <ColumnMenu
                isOpen={columnMenuAnchor !== null}
                x={columnMenuAnchor?.x || 0}
                y={columnMenuAnchor?.y || 0}
                columnId={columnMenuAnchor?.columnId || ''}
                columnName={columnMenuAnchor?.columnName || ''}
                sectionKey={columnMenuAnchor?.sectionKey || ''}
                onClose={() => setColumnMenuAnchor(null)}
                onAction={(actionId, columnId, sectionKey) => {
                    switch (actionId) {
                        case 'rename':
                            setEditingHeader({ section: sectionKey, field: columnId });
                            break;
                        case 'delete':
                            // Only delete custom columns, not base columns
                            const baseColumns = ['item', 'responsible', 'projectName', 'priority', 'status', 'deadline'];
                            if (!baseColumns.includes(columnId)) {
                                setCustomColumns(prev => ({
                                    ...prev,
                                    [sectionKey]: (prev[sectionKey] || []).filter(c => c.id !== columnId)
                                }));
                            } else {
                                alert('No se pueden eliminar las columnas base del tablero.');
                            }
                            break;
                        case 'duplicate':
                            // Duplicate custom column
                            const cols = customColumns[sectionKey] || [];
                            const colToDuplicate = cols.find(c => c.id === columnId);
                            if (colToDuplicate) {
                                const newCol = { ...colToDuplicate, id: `${colToDuplicate.id}_copy_${Date.now()}` };
                                setCustomColumns(prev => ({
                                    ...prev,
                                    [sectionKey]: [...(prev[sectionKey] || []), newCol]
                                }));
                                setColumnWidths(prev => ({ ...prev, [newCol.id]: 120 }));
                                setColumnTitles(prev => ({ ...prev, [newCol.id]: `${columnTitles[columnId]} (COPIA)` }));
                            }
                            break;
                        case 'addRight':
                            // Open column center for this section
                            setShowColumnCenter(sectionKey);
                            break;
                        case 'sort':
                            // Sort items by this column ascending
                            setBoardItems(prev => [...prev].sort((a, b) => {
                                const aVal = String((a as unknown as Record<string, unknown>)[columnId] || '');
                                const bVal = String((b as unknown as Record<string, unknown>)[columnId] || '');
                                return aVal.localeCompare(bVal);
                            }));
                            break;
                        default:
                            console.log('Action:', actionId, 'Column:', columnId, 'Section:', sectionKey);
                    }
                    setColumnMenuAnchor(null);
                }}
            />
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}

interface DropdownPopoverProps {
    popoverAnchor: { x: number, y: number, id: string, field: string, type: 'status' | 'priority', tags: Tag[] } | null;
    setPopoverAnchor: React.Dispatch<React.SetStateAction<{ x: number, y: number, id: string, field: string, type: 'status' | 'priority', tags: Tag[] } | null>>;
    isEditingTags: boolean;
    setIsEditingTags: React.Dispatch<React.SetStateAction<boolean>>;
    statusTags: Tag[];
    setStatusTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    priorityTags: Tag[];
    setPriorityTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    updateItem: (id: string, field: string, value: string | number | string[]) => void;
    t: (key: string) => string;
}

const DropdownPopover = ({
    popoverAnchor,
    setPopoverAnchor,
    isEditingTags,
    setIsEditingTags,
    statusTags,
    setStatusTags,
    priorityTags,
    setPriorityTags,
    updateItem,
    t
}: DropdownPopoverProps) => {
    if (!popoverAnchor) return null;

    const { x, y, id, field, type } = popoverAnchor;
    const currentTags = type === 'status' ? statusTags : priorityTags;
    const setTags = type === 'status' ? setStatusTags : setPriorityTags;
    const colors = ['#f85a5a', '#fdab3d', '#ffcb00', '#00c875', '#00d2d2', '#579bfc', '#a25ddc', '#444', '#784450', '#808080'];

    const handleSelect = (label: string) => {
        updateItem(id, field, label);
        setPopoverAnchor(null);
    };

    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    return (
        <>
            <div className={styles.popoverContainer} style={{ top: y, left: Math.min(x, windowWidth - 260) }}>
                {!isEditingTags ? (
                    <>
                        <div className={styles.popoverGrid}>
                            {currentTags.map(tag => (
                                <button
                                    key={tag.id}
                                    className={styles.popoverOption}
                                    style={{ background: tag.color }}
                                    onClick={() => handleSelect(tag.label)}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                        <div className={styles.popoverFooter}>
                            <button className={styles.footerAction} onClick={() => setIsEditingTags(true)}>
                                ✏️ {t('projects.board.editTags')}
                            </button>
                            <button className={styles.footerAction}>
                                ✨ {t('projects.board.autoAssign')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.editList}>
                        {currentTags.map(tag => (
                            <div key={tag.id} className={styles.editRow}>
                                <div
                                    className={styles.colorChip}
                                    style={{ background: tag.color }}
                                    onClick={() => {
                                        const nextColor = colors[(colors.indexOf(tag.color) + 1) % colors.length];
                                        setTags(prev => prev.map(t => t.id === tag.id ? { ...t, color: nextColor } : t));
                                    }}
                                />
                                <input
                                    className={styles.editInput}
                                    value={tag.label}
                                    onChange={(e) => setTags(prev => prev.map(t => t.id === tag.id ? { ...t, label: e.target.value } : t))}
                                />
                            </div>
                        ))}
                        <button
                            className={styles.footerAction}
                            onClick={() => {
                                const newTag: Tag = { id: Date.now().toString(), label: 'Nueva etiqueta', color: '#444' };
                                setTags(prev => [...prev, newTag]);
                            }}
                        >
                            + Etiqueta nueva
                        </button>
                        <button className={styles.applyButton} onClick={() => setPopoverAnchor(null)}>
                            Aplicar
                        </button>
                    </div>
                )}
            </div>
            {/* Overlay to close popover */}
            <div
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}
                onClick={() => setPopoverAnchor(null)}
            />
        </>
    );
};
