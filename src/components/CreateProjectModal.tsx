"use client";

import React, { useState, useEffect } from 'react';

import { useDataContext, getInitials } from '@/context/DataContext';
import type { Portfolio, TeamMember } from '@/types/entities';
import { supabase } from '@/lib/supabase';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const allIconOptions = [
    '📁', '🏠', '💼', '🚀', '💡', '🎯', '⚡', '🌟', '🔥', '💎', '🎮', '🎨', '🌐', '📱', '💻',
    '🌍', '📊', '🛠️', '🏗️', '🚜', '🌱', '🍎', '🥩', '🥗', '🚲', '🚗', '✈️', '🚢', '🏥', '🗳️',
    '📣', '📢', '🔔', '📅', '📋', '📌', '🏷️', '🔍', '🔒', '🔑', '⚙️', '🧪'
];

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
    const { addProject, portfolios, getTeamMembersByPortfolio } = useDataContext();
    const [uploadingIcon, setUploadingIcon] = useState(false);
    const [portfolioTeam, setPortfolioTeam] = useState<TeamMember[]>([]);
    const [isCustomManager, setIsCustomManager] = useState(false);

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
        icon: '📁',
        tags: '',
        progress: 0
    });

    // Update team list when portfolio changes
    useEffect(() => {
        if (formData.portfolioId) {
            const team = getTeamMembersByPortfolio(formData.portfolioId);
            setPortfolioTeam(team);
        }
    }, [formData.portfolioId, getTeamMembersByPortfolio]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIcon(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `custom-icons/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-icons')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('project-icons')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, icon: publicUrl }));
        } catch (error) {
            console.error('Error uploading icon:', error);
            alert('Error al subir el icono. Verifica que el archivo sea una imagen.');
        } finally {
            setUploadingIcon(false);
        }
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            shortName: prev.shortName ? prev.shortName : getInitials(name)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.portfolioId || !formData.deadline) {
            alert('Por favor completa los campos requeridos: Nombre, Portfolio y Fecha límite');
            return;
        }

        // Generate gradient from color
        const gradient = `linear-gradient(135deg, ${formData.color}, ${adjustColor(formData.color, -20)})`;

        const projectData = {
            ...formData,
            shortName: formData.shortName || getInitials(formData.name),
            gradient,
            tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '')
        };

        try {
            await addProject(projectData);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error al crear el proyecto. Por favor intenta de nuevo.');
        }
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
                            color: 'hsl(var(--text-muted))',
                            padding: '0.5rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Section 1: General Info */}
                    <div className="form-section">
                        <h3 style={{ fontSize: '0.9rem', color: 'hsl(var(--accent-primary))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'hsl(var(--accent-primary))' }}>1</span>
                            Información General
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                    Nombre del Proyecto <span style={{ color: 'hsl(var(--accent-error))' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="ej. Rediseño de Portal Corporativo"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'hsl(var(--bg-secondary))',
                                        border: '1px solid hsl(var(--border-color))',
                                        borderRadius: '8px',
                                        color: 'hsl(var(--text-primary))',
                                        fontSize: '0.95rem'
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Abreviatura (ID)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.shortName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, shortName: e.target.value.toUpperCase() }))}
                                        placeholder="ej. BLC-HUB"
                                        maxLength={10}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'hsl(var(--bg-secondary))',
                                            border: '1px solid hsl(var(--border-color))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--text-primary))',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Portfolio <span style={{ color: 'hsl(var(--accent-error))' }}>*</span>
                                    </label>
                                    <select
                                        value={formData.portfolioId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, portfolioId: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'hsl(var(--bg-secondary))',
                                            border: '1px solid hsl(var(--border-color))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--text-primary))',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer'
                                        }}
                                        required
                                    >
                                        <option value="" disabled>Selecciona un portfolio</option>
                                        {portfolios.map(p => (
                                            <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Planning & Team */}
                    <div className="form-section">
                        <h3 style={{ fontSize: '0.9rem', color: 'hsl(var(--accent-primary))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'hsl(var(--accent-primary))' }}>2</span>
                            Planificación y Equipo
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Responsable (Manager) <span style={{ color: 'hsl(var(--accent-error))' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        {portfolioTeam.length > 0 && !isCustomManager ? (
                                            <div style={{ position: 'relative' }}>
                                                <select
                                                    value={formData.manager}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'custom') {
                                                            setIsCustomManager(true);
                                                            setFormData(prev => ({ ...prev, manager: '' }));
                                                        } else {
                                                            setFormData(prev => ({ ...prev, manager: e.target.value }));
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid hsl(var(--border-color))',
                                                        background: 'hsl(var(--bg-secondary))',
                                                        color: 'hsl(var(--text-primary))',
                                                        fontSize: '0.9rem',
                                                        appearance: 'none'
                                                    }}
                                                >
                                                    <option value="" disabled>Seleccionar integrante...</option>
                                                    {portfolioTeam.map((tm: TeamMember) => (
                                                        <option key={tm.id} value={`${tm.firstName} ${tm.lastName}`}>
                                                            {tm.firstName} {tm.lastName} ({tm.role})
                                                        </option>
                                                    ))}
                                                    <option value="custom">+ Agregar nombre manualmente...</option>
                                                </select>
                                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>▼</div>
                                            </div>
                                        ) : (
                                            <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    value={formData.manager}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                                                    placeholder={isCustomManager ? "Ingresa nombre manualmente" : "Nombre del responsable"}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid hsl(var(--border-color))',
                                                        background: 'hsl(var(--bg-secondary))',
                                                        color: 'hsl(var(--text-primary))',
                                                        fontSize: '0.9rem'
                                                    }}
                                                    required
                                                />
                                                {isCustomManager && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCustomManager(false)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '8px',
                                                            border: '1px solid hsl(var(--border-color))',
                                                            background: 'hsl(var(--bg-secondary))',
                                                            cursor: 'pointer',
                                                            color: 'hsl(var(--text-primary))'
                                                        }}
                                                    >
                                                        Volver
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                                        {portfolioTeam.length === 0 ? "No hay equipo ligado a este portfolio." : "Equipo ligado al portfolio seleccionado."}
                                    </p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Fecha de Entrega <span style={{ color: 'hsl(var(--accent-error))' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'hsl(var(--bg-secondary))',
                                            border: '1px solid hsl(var(--border-color))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--text-primary))',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Estado Inicial
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'hsl(var(--bg-secondary))',
                                            border: '1px solid hsl(var(--border-color))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--text-primary))',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="planning">Planeación</option>
                                        <option value="active">Activo</option>
                                        <option value="on-hold">En Pausa</option>
                                        <option value="completed">Completado</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Prioridad Negocio
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'hsl(var(--bg-secondary))',
                                            border: '1px solid hsl(var(--border-color))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--text-primary))',
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
                        </div>
                    </div>

                    {/* Section 3: Visual Identity & Tags */}
                    <div className="form-section">
                        <h3 style={{ fontSize: '0.9rem', color: 'hsl(var(--accent-primary))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'hsl(var(--accent-primary))' }}>3</span>
                            Identidad y Etiquetas
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                    Etiquetas (separadas por coma)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="ej. urgente, q1, marketing"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'hsl(var(--bg-secondary))',
                                        border: '1px solid hsl(var(--border-color))',
                                        borderRadius: '8px',
                                        color: 'hsl(var(--text-primary))',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Icono Representativo
                                    </label>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '0.5rem',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        padding: '0.5rem',
                                        border: '1px solid hsl(var(--border-color))',
                                        borderRadius: '8px',
                                        background: 'rgba(255, 255, 255, 0.03)'
                                    }}>
                                        {allIconOptions.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                                style={{
                                                    padding: '0.5rem',
                                                    fontSize: '1.2rem',
                                                    background: formData.icon === icon ? 'hsl(var(--accent-primary))' : 'transparent',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s',
                                                    color: formData.icon === icon ? 'white' : 'inherit'
                                                }}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Show uploaded icon if it's a URL */}
                                    {formData.icon.startsWith('http') && !allIconOptions.includes(formData.icon) && (
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '6px',
                                            border: '2px solid hsl(var(--accent-primary))',
                                            overflow: 'hidden',
                                            background: 'white',
                                            marginTop: '0.75rem'
                                        }}>
                                            <img src={formData.icon} alt="Custom icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                                        <label
                                            className="btn-secondary"
                                            style={{
                                                fontSize: '0.8rem',
                                                padding: '0.5rem 1rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                border: '1px dashed hsl(var(--accent-primary))',
                                                color: 'hsl(var(--accent-primary))',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {uploadingIcon ? 'Subiendo...' : '📁 Subir Archivo'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                style={{ display: 'none' }}
                                                disabled={uploadingIcon}
                                            />
                                        </label>
                                        <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>PNG, JPG soportados</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        Color del Proyecto
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        {colorOptions.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, color }))}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: color,
                                                    border: `2px solid ${formData.color === color ? 'white' : 'transparent'}`,
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: formData.color === color ? '0 0 0 1px hsl(var(--accent-primary))' : 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                    Descripción del Proyecto
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Define los objetivos y alcances del proyecto..."
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'hsl(var(--bg-secondary))',
                                        border: '1px solid hsl(var(--border-color))',
                                        borderRadius: '8px',
                                        color: 'hsl(var(--text-primary))',
                                        fontSize: '0.95rem',
                                        resize: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.875rem',
                                background: 'transparent',
                                border: '1px solid hsl(var(--border-color))',
                                borderRadius: '8px',
                                color: 'hsl(var(--text-primary))',
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
                                flex: 1.5,
                                padding: '0.875rem',
                                fontSize: '0.95rem',
                                fontWeight: 600
                            }}
                        >
                            Guardar Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
