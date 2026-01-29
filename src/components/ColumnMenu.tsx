'use client';

import React from 'react';
import styles from './ColumnMenu.module.css';

export interface ColumnMenuAction {
    id: string;
    label: string;
    icon: string;
    hasSubmenu?: boolean;
    divider?: boolean;
    danger?: boolean;
}

const MENU_ACTIONS: ColumnMenuAction[] = [
    { id: 'config', label: 'Configuración', icon: '⚙️', hasSubmenu: true },
    { id: 'divider1', label: '', icon: '', divider: true },
    { id: 'filter', label: 'Filtrar', icon: '🔍', hasSubmenu: true },
    { id: 'sort', label: 'Ordenar', icon: '↕️', hasSubmenu: true },
    { id: 'collapse', label: 'Contraer', icon: '↔️', hasSubmenu: true },
    { id: 'group', label: 'Agrupar por', icon: '▦' },
    { id: 'divider2', label: '', icon: '', divider: true },
    { id: 'duplicate', label: 'Duplicar columna', icon: '📋' },
    { id: 'addRight', label: 'Agregar columna a la derecha', icon: '➕' },
    { id: 'changeType', label: 'Cambiar tipo de columna', icon: '🔄', hasSubmenu: true },
    { id: 'divider3', label: '', icon: '', divider: true },
    { id: 'rename', label: 'Renombrar', icon: '✏️' },
    { id: 'delete', label: 'Eliminar', icon: '🗑️', danger: true },
];

interface ColumnMenuProps {
    isOpen: boolean;
    x: number;
    y: number;
    columnId: string;
    columnName: string;
    sectionKey: string;
    onClose: () => void;
    onAction: (actionId: string, columnId: string, sectionKey: string) => void;
}

export default function ColumnMenu({
    isOpen,
    x,
    y,
    columnId,
    columnName,
    sectionKey,
    onClose,
    onAction
}: ColumnMenuProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay to close menu */}
            <div className={styles.overlay} onClick={onClose} />

            <div
                className={styles.menu}
                style={{
                    left: Math.min(x, typeof window !== 'undefined' ? window.innerWidth - 280 : x),
                    top: Math.min(y, typeof window !== 'undefined' ? window.innerHeight - 400 : y)
                }}
            >
                <div className={styles.header}>
                    <span className={styles.columnName}>{columnName}</span>
                </div>
                <div className={styles.menuContent}>
                    {MENU_ACTIONS.map(action => {
                        if (action.divider) {
                            return <div key={action.id} className={styles.divider} />;
                        }
                        return (
                            <button
                                key={action.id}
                                className={`${styles.menuItem} ${action.danger ? styles.danger : ''}`}
                                onClick={() => {
                                    onAction(action.id, columnId, sectionKey);
                                    if (!action.hasSubmenu) {
                                        onClose();
                                    }
                                }}
                            >
                                <span className={styles.icon}>{action.icon}</span>
                                <span className={styles.label}>{action.label}</span>
                                {action.hasSubmenu && <span className={styles.arrow}>›</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
