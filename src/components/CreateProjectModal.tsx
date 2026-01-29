"use client";

import React, { useState, useEffect } from 'react';
import { useDataContext, getInitials } from '@/context/DataContext';
import type { Portfolio } from '@/types/entities';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
    const { addProject, portfolios } = useDataContext();

    const [formData, setFormData] = useState({
        name: '',
        shortName: '',
        description: '',
        portfolioId: portfolios[0]?.id || '',
        manager: '',
        status: 'planning' as const,
        priority: 'medium' as const,
        deadline: '',
        color: '#3b82f6',
        icon: '📁'
    });

    // Auto-suggest short name when project name changes
    useEffect(() => {
        if (formData.name && !formData.shortName) {
            // Only auto-suggest if shortName is empty
            // We'll update the display but only if the user hasn't explicitly set it
        }
    }, [formData.name]);

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            shortName: prev.shortName ? prev.shortName : getInitials(name)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.portfolioId || !formData.deadline) {
            alert('Por favor completa los campos requeridos: Nombre, Portfolio y Fecha límite');
            return;
        }

        // Generate gradient from color
        const gradient = `linear-gradient(135deg, ${formData.color}, ${adjustColor(formData.color, -20)})`;

        addProject({
            ...formData,
            shortName: formData.shortName || getInitials(formData.name),
            gradient,
            progress: 0,
            tags: []
        });

        // Reset form
        setFormData({
            name: '',
            shortName: '',
            description: '',
            portfolioId: portfolios[0]?.id || '',
            manager: '',
            status: 'planning',
            priority: 'medium',
            deadline: '',
            color: '#3b82f6',
            icon: '📁'
        });

        onClose();
    };

    // Helper to darken color for gradient
    const adjustColor = (color: string, amount: number) => {
        const num = parseInt(color.slice(1), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    if (!isOpen) return null;

    const iconOptions = ['📁', '🏠', '💼', '🚀', '💡', '🎯', '⚡', '🌟', '🔥', '💎', '🎮', '🎨', '🌐', '📱', '💻'];
    const colorOptions = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
        }} onClick={onClose}>
            <div
                className="card"
                style={{
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2rem'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Crear Nuevo Proyecto</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '0.5rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Project Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Nombre del Proyecto <span style={{ color: 'var(--accent-error)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="ej. Rediseño de Website"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem'
                            }}
                            required
                        />
                    </div>

                    {/* Short Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Nombre Corto (opcional)
                        </label>
                        <input
                            type="text"
                            value={formData.shortName}
                            onChange={(e) => setFormData({ ...formData, shortName: e.target.value.toUpperCase() })}
                            placeholder="ej. RW"
                            maxLength={5}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe el proyecto..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Portfolio Selection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Portfolio <span style={{ color: 'var(--accent-error)' }}>*</span>
                        </label>
                        <select
                            value={formData.portfolioId}
                            onChange={(e) => setFormData({ ...formData, portfolioId: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                cursor: 'pointer'
                            }}
                            required
                        >
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Manager */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Manager
                        </label>
                        <input
                            type="text"
                            value={formData.manager}
                            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                            placeholder="Nombre del responsable"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {/* Row: Status & Priority */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                Estado
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="planning">Planeación</option>
                                <option value="active">Activo</option>
                                <option value="on-hold">En Pausa</option>
                                <option value="completed">Completado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                Prioridad
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Fecha Límite <span style={{ color: 'var(--accent-error)' }}>*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                cursor: 'pointer'
                            }}
                            required
                        />
                    </div>

                    {/* Icon Selection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Icono
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {iconOptions.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    style={{
                                        padding: '0.5rem',
                                        background: formData.icon === icon ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                        border: `2px solid ${formData.icon === icon ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                        borderRadius: '8px',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                            Color
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        background: color,
                                        border: `3px solid ${formData.color === color ? 'white' : 'transparent'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: formData.color === color ? '0 0 0 2px var(--accent-primary)' : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.875rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{
                                flex: 1,
                                padding: '0.875rem',
                                fontSize: '0.95rem',
                                fontWeight: 600
                            }}
                        >
                            Crear Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
