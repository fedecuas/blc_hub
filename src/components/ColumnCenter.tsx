'use client';

import React, { useState } from 'react';
import styles from './ColumnCenter.module.css';

export interface ColumnType {
    id: string;
    name: string;
    description: string;
    icon: string;
    iconBg: string;
    category: string;
    fieldType: 'text' | 'number' | 'date' | 'status' | 'priority' | 'person' | 'checkbox' | 'link' | 'dropdown';
}

const COLUMN_TYPES: ColumnType[] = [
    // Esenciales
    { id: 'status', name: 'Estado', description: 'Obtén un panorama general instantáneo de cómo está todo', icon: '≡', iconBg: '#00c875', category: 'esenciales', fieldType: 'status' },
    { id: 'priority', name: 'Priority', description: 'Prioritize tasks and focus on what\'s most important', icon: '★', iconBg: '#ff8652', category: 'esenciales', fieldType: 'priority' },
    { id: 'label', name: 'Label', description: 'Categorize and triage work with custom labels', icon: '≡', iconBg: '#579bfc', category: 'esenciales', fieldType: 'dropdown' },
    { id: 'personas', name: 'Personas', description: 'Asigna personas para mejorar el trabajo en equipo', icon: '👥', iconBg: '#0073ea', category: 'esenciales', fieldType: 'person' },
    { id: 'numeros', name: 'Números', description: 'Agrega ingresos, costos, cálculos de tiempo y más', icon: '123', iconBg: '#fdbb63', category: 'esenciales', fieldType: 'number' },
    { id: 'fecha', name: 'Fecha', description: 'Agregas fechas y plazos límites para no olvidar nada', icon: '📅', iconBg: '#00c875', category: 'esenciales', fieldType: 'date' },
    { id: 'texto', name: 'Texto', description: 'Agrega información textual, p. ej., direcciones, nombres o...', icon: 'T', iconBg: '#c792ea', category: 'esenciales', fieldType: 'text' },
    { id: 'texto_largo', name: 'Texto largo', description: 'Agrega textos extensos sin cambiar el ancho de la columna', icon: '≡', iconBg: '#c792ea', category: 'esenciales', fieldType: 'text' },

    // Super útiles
    { id: 'checkbox', name: 'Casilla de verificación', description: 'Marcar elementos y ver qué fue completado en un vistazo', icon: '✓', iconBg: '#00d2d2', category: 'super_utiles', fieldType: 'checkbox' },
    { id: 'enlace', name: 'Enlace', description: 'Simplemente crea un hiperenlace a cualquier sitio web', icon: '🔗', iconBg: '#00c875', category: 'super_utiles', fieldType: 'link' },
    { id: 'telefono', name: 'Teléfono', description: 'Llama a tus contactos directamente desde...', icon: '📞', iconBg: '#579bfc', category: 'super_utiles', fieldType: 'text' },
    { id: 'archivo', name: 'Archivo', description: 'Agrega archivos y documentos a tu elemento', icon: '📁', iconBg: '#579bfc', category: 'super_utiles', fieldType: 'text' },

    // Empodera a tu equipo
    { id: 'etiquetas', name: 'Etiquetas', description: 'Agrega etiquetas para categorizar elementos entre...', icon: '#', iconBg: '#c792ea', category: 'empodera', fieldType: 'dropdown' },
    { id: 'clasificacion', name: 'Clasificación', description: 'Clasifica o califica todo visualmente', icon: '★★', iconBg: '#fdbb63', category: 'empodera', fieldType: 'number' },

    // Potencia tu tablero
    { id: 'dropdown', name: 'Menú desplegable', description: 'Crea una lista desplegable de opciones', icon: '▼', iconBg: '#0073ea', category: 'potencia', fieldType: 'dropdown' },
    { id: 'hora', name: 'Hora', description: 'Agrega la hora para administrar y programar tareas, turnos y más', icon: '🕐', iconBg: '#579bfc', category: 'potencia', fieldType: 'text' },
    { id: 'email', name: 'Correo electrónico', description: 'Envía correos electrónicos a los miembros del equipo y a client...', icon: '✉', iconBg: '#c792ea', category: 'potencia', fieldType: 'text' },
];

const CATEGORIES = [
    { id: 'esenciales', name: 'Esenciales' },
    { id: 'super_utiles', name: 'Super útiles' },
    { id: 'empodera', name: 'Empodera a tu equipo' },
    { id: 'potencia', name: 'Potencia tu tablero' },
];

interface ColumnCenterProps {
    isOpen: boolean;
    onClose: () => void;
    onAddColumn: (column: ColumnType) => void;
}

export default function ColumnCenter({ isOpen, onClose, onAddColumn }: ColumnCenterProps) {
    const [activeCategory, setActiveCategory] = useState('esenciales');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const filteredColumns = COLUMN_TYPES.filter(col => {
        const matchesCategory = activeCategory === 'destacadas' || col.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            col.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryTitle = () => {
        const cat = CATEGORIES.find(c => c.id === activeCategory);
        return cat?.name || 'Esenciales';
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Centro de columnas</h2>
                    <div className={styles.searchBar}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.content}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarTitle}>Categorías</div>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.categoryButton} ${activeCategory === cat.id ? styles.categoryActive : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </aside>

                    <main className={styles.mainContent}>
                        <h3 className={styles.categoryHeading}>{getCategoryTitle()}</h3>
                        <div className={styles.columnsGrid}>
                            {filteredColumns.map(col => (
                                <div key={col.id} className={styles.columnCard}>
                                    <div
                                        className={styles.columnIcon}
                                        style={{ background: col.iconBg }}
                                    >
                                        {col.icon}
                                    </div>
                                    <div className={styles.columnInfo}>
                                        <div className={styles.columnName}>{col.name}</div>
                                        <div className={styles.columnDesc}>{col.description}</div>
                                    </div>
                                    <button
                                        className={styles.addButton}
                                        onClick={() => {
                                            onAddColumn(col);
                                            onClose();
                                        }}
                                    >
                                        Agregar al tabl...
                                    </button>
                                </div>
                            ))}
                            {filteredColumns.length === 0 && (
                                <div className={styles.emptyState}>
                                    No se encontraron columnas para esta categoría.
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
