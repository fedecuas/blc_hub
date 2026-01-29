"use client";

import React, { useState } from 'react';
/* Importing styles directly from the projects module to ensure exact visual matching */
import styles from '@/app/projects/projects.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { ColumnType } from '@/components/ColumnCenter';

/* --- Types (Mirrored from Projects Page) --- */
export interface BoardItem {
    id: string;
    item: string;
    responsible: string;
    projectId: string;
    projectName: string;
    priority: string;
    status: string;
    startDate: string;
    deadline: string;
    progress: number;
    weekGroup: 'this' | 'next' | 'done';
    [key: string]: any; // For custom columns
}

export interface Tag {
    id: string;
    label: string;
    color: string;
}

interface ProjectBoardViewProps {
    project: {
        id: string;
        name: string;
        [key: string]: any;
    } | null;
    initialItems?: BoardItem[];
}

export default function ProjectBoardView({ project, initialItems = [] }: ProjectBoardViewProps) {
    const { t } = useLanguage();

    // --- State Management ---
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({ this: false, next: false, done: false });
    const [groupColors, setGroupColors] = useState<Record<string, string>>({
        this: '#c792ea', // Purple
        next: '#ff8652', // Orange
        done: '#00c875'  // Green
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
        item: 350, // Slightly wider for this view
        responsible: 80,
        priority: 120,
        status: 120,
        deadline: 120
    });

    const [columnTitles, setColumnTitles] = useState<Record<string, string>>({
        item: 'ELEMENTO',
        responsible: 'RESPONSABLE',
        priority: 'PRIORIDAD',
        status: 'ESTADO',
        deadline: 'FECHA DE ENTREGA'
    });

    const [resizing, setResizing] = useState<{ field: string, startX: number, startWidth: number } | null>(null);

    // Mock Data if not provided
    const [boardItems, setBoardItems] = useState<BoardItem[]>(initialItems.length > 0 ? initialItems : [
        // Default Mock Data for Demo
        { id: '1', item: 'Revisión de Estructura de Costos', responsible: 'Julian Rossi', projectId: project?.id || 'P1', projectName: project?.name || 'Project', priority: 'Alta', status: 'Trabajand...', startDate: '2026-01-20', deadline: '2026-01-27', progress: 45, weekGroup: 'this' },
        { id: '2', item: 'Aprobación de Presupuesto Mensual', responsible: 'Elena Vance', projectId: project?.id || 'P1', projectName: project?.name || 'Project', priority: 'Media', status: 'Esperando', startDate: '2026-01-22', deadline: '2026-02-05', progress: 10, weekGroup: 'this' },
        { id: '3', item: 'Actualización de Inventario', responsible: 'User', projectId: project?.id || 'P1', projectName: project?.name || 'Project', priority: 'Alta', status: 'Listo', startDate: '2026-01-10', deadline: '2026-01-18', progress: 100, weekGroup: 'done' },
        { id: '4', item: 'Planificación Q2', responsible: 'Julian Rossi', projectId: project?.id || 'P1', projectName: project?.name || 'Project', priority: 'Alta', status: 'Planning', startDate: '2026-02-01', deadline: '2026-02-15', progress: 0, weekGroup: 'next' },
    ]);

    const [statusTags] = useState<Tag[]>([
        { id: 's1', label: 'Interrumpido', color: '#f85a5a' },
        { id: 's2', label: 'Trabajand...', color: '#fdab3d' },
        { id: 's3', label: 'Esperando', color: '#579bfc' },
        { id: 's4', label: 'Aprobado', color: '#ff8652' },
        { id: 's5', label: 'Listo', color: '#00c875' },
    ]);

    const [priorityTags] = useState<Tag[]>([
        { id: 'p1', label: 'Alta', color: '#f85a5a' },
        { id: 'p2', label: 'Media', color: '#fdab3d' },
        { id: 'p3', label: 'Baja', color: '#99e63e' },
    ]);

    const respAvatars: Record<string, string> = {
        'Julian Rossi': '🧔🏻',
        'Elena Vance': '👩🏼‍💻',
        'Marcus Thorne': '👨🏾‍💼',
        'Antigravity': '🤖',
        'User': '👤'
    };
    const responsibles = Object.keys(respAvatars);

    // --- Handlers ---

    const handleResizeStart = (e: React.MouseEvent, field: string) => {
        e.preventDefault();
        e.stopPropagation();
        setResizing({ field, startX: e.pageX, startWidth: columnWidths[field] });
    };

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizing) return;
            const diff = e.pageX - resizing.startX;
            setColumnWidths(prev => ({ ...prev, [resizing.field]: Math.max(50, resizing.startWidth + diff) }));
        };
        const handleMouseUp = () => setResizing(null);

        if (resizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing]);

    const updateItem = (id: string, field: string, value: any) => {
        setBoardItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
        setEditingCell(null);
    };

    const toggleSection = (section: string) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return `${monthNames[date.getMonth()]}. ${day}`;
    };

    // --- Renderers ---

    const renderEditableCell = (bi: BoardItem, field: keyof BoardItem, type: 'text' | 'select' | 'date' | 'priority' | 'status', options?: string[]) => {
        const isEditing = editingCell?.id === bi.id && editingCell?.field === field;
        const value = bi[field];

        if (isEditing) {
            return (
                <div className={styles.cellContent}>
                    {type === 'select' ? (
                        <select
                            autoFocus
                            className={styles.inlineSelect}
                            value={String(value)}
                            onChange={(e) => updateItem(bi.id, field as string, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                        >
                            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : type === 'date' ? (
                        <input
                            type="date"
                            autoFocus
                            className={styles.inlineInput}
                            value={String(value)}
                            onChange={(e) => updateItem(bi.id, field as string, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                        />
                    ) : (
                        <input
                            autoFocus
                            className={styles.inlineInput}
                            value={String(value)}
                            onChange={(e) => updateItem(bi.id, field as string, e.target.value)}
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
                <div className={styles.cellContent} onClick={() => { /* Simplified: just toggle edit to cycle or select? For now simple text edit via click */ }} style={{ cursor: 'pointer' }}>
                    <div className={styles.blockCell} style={{ background: tag?.color || '#444', color: 'white' }} onClick={() => setEditingCell({ id: bi.id, field: field as string })}>
                        {String(value)}
                    </div>
                </div>
            );
        }

        if (field === 'responsible') {
            return (
                <div className={styles.responsibleCell} style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', padding: '0 8px', flexDirection: 'row' }} onClick={() => setEditingCell({ id: bi.id, field: field as string })}>
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
                onClick={() => setEditingCell({ id: bi.id, field: field as string })}
                style={{
                    justifyContent: isElemento ? 'flex-start' : (isDate ? 'flex-start' : 'center'),
                    textAlign: isElemento ? 'left' : 'inherit',
                    paddingLeft: isElemento ? '8px' : '0'
                }}
            >
                {isDate ? formatDate(String(value)) : String(value)}
            </div>
        );
    };

    const renderTableSection = (title: string, sectionKey: string) => {
        const items = boardItems.filter(item => item.weekGroup === sectionKey);
        const isCollapsed = collapsedSections[sectionKey];

        // Headers relevant for the project view (omitting 'Project Name' since we are IN a project view)
        const headers = [
            { key: 'item', field: 'item', info: true },
            { key: 'responsible', field: 'responsible', info: true },
            { key: 'priority', field: 'priority', info: true },
            { key: 'status', field: 'status', info: true },
            { key: 'deadline', field: 'deadline', info: true },
        ];

        return (
            <div className={`${styles.tableContainer} ${resizing ? styles.resizing : ''}`} style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
                {/* Group Header */}
                <div className={styles.groupHeader} onClick={() => toggleSection(sectionKey)}>
                    <div className={styles.groupTitle} style={{ color: groupColors[sectionKey] }}>
                        <span className={`${styles.caret} ${!isCollapsed ? styles.caretDown : ''}`}>▼</span>
                        <div className={styles.groupColorSwatch} style={{ background: groupColors[sectionKey], width: '16px', height: '16px', borderRadius: '4px' }}></div>
                        <span>{groupNames[sectionKey] || title}</span>
                        <span style={{ opacity: 0.5, fontSize: '0.8em', marginLeft: 'auto' }}>{items.length} Items</span>
                    </div>
                </div>

                {!isCollapsed && (
                    <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
                        <table className={styles.dataTable} style={{ tableLayout: 'fixed' }}>
                            <thead>
                                <tr>
                                    <th className={styles.checkboxCell}><input type="checkbox" style={{ opacity: 0.3 }} /></th>
                                    {headers.map(h => (
                                        <th key={h.key} style={{ width: `${columnWidths[h.field]}px` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 0.8rem' }}>
                                                {columnTitles[h.field]}
                                            </div>
                                            <div className={styles.resizeHandle} onMouseDown={(e) => handleResizeStart(e, h.field)} />
                                        </th>
                                    ))}
                                    <th className={styles.addColumnHeader} title="Agregar columna"><span style={{ fontSize: '1.2rem', fontWeight: 300 }}>+</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(bi => (
                                    <tr key={bi.id} className={styles.dataRow}>
                                        <td className={styles.checkboxCell} style={{ borderLeft: `4px solid ${groupColors[sectionKey]}` }}>
                                            <input type="checkbox" style={{ opacity: 0.3 }} />
                                        </td>
                                        <td>{renderEditableCell(bi, 'item', 'text')}</td>
                                        <td>{renderEditableCell(bi, 'responsible', 'select', responsibles)}</td>
                                        <td>{renderEditableCell(bi, 'priority', 'priority')}</td>
                                        <td>{renderEditableCell(bi, 'status', 'status')}</td>
                                        <td>{renderEditableCell(bi, 'deadline', 'date')}</td>
                                        <td></td>
                                    </tr>
                                ))}
                                {/* Add Item Row */}
                                <tr className={styles.addRow}>
                                    <td className={styles.checkboxCell} style={{ borderLeft: `4px solid ${groupColors[sectionKey]}`, opacity: 0.5 }}></td>
                                    <td colSpan={6}>
                                        <div
                                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: 0.7 }}
                                            onClick={() => {
                                                const newItem: BoardItem = {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    item: 'Nuevo Item',
                                                    responsible: 'User',
                                                    projectId: project?.id || '',
                                                    projectName: project?.name || '',
                                                    priority: 'Media',
                                                    status: 'Esperando',
                                                    startDate: new Date().toISOString().split('T')[0],
                                                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                                    progress: 0,
                                                    weekGroup: sectionKey as any
                                                };
                                                setBoardItems(prev => [...prev, newItem]);
                                            }}
                                        >
                                            <span style={{ fontSize: '1.1rem', fontWeight: 300 }}>+</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Agregar Item</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.board} style={{ paddingBottom: '50px !important', minHeight: 'auto' }}>
            <div style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>{project?.name || 'Proyecto'}</h3>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Gestión de Tareas y Seguimiento</p>
            </div>

            {renderTableSection("ESTA SEMANA", "this")}
            {renderTableSection("LA PRÓXIMA SEMANA", "next")}
            {renderTableSection("LISTO", "done")}
        </div>
    );
}
