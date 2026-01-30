"use client";

import React, { useState } from 'react';
import styles from '../app/tasks/tasks.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { useDataContext } from '@/context/DataContext';
import type { Project } from '@/types/entities';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultProjectId?: string;
    defaultPortfolioId?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, defaultProjectId, defaultPortfolioId }) => {
    const { t } = useLanguage();
    const { portfolios, projects, addTask } = useDataContext();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        portfolioId: defaultPortfolioId || '',
        projectId: defaultProjectId || '',
        priority: 'medium' as const,
        assignee: '',
        dueDate: new Date().toISOString().split('T')[0]
    });

    // Update form when default project changes
    React.useEffect(() => {
        if (defaultProjectId || defaultPortfolioId) {
            setFormData(prev => ({
                ...prev,
                portfolioId: defaultPortfolioId || prev.portfolioId,
                projectId: defaultProjectId || prev.projectId
            }));
        }
    }, [defaultProjectId, defaultPortfolioId]);

    // Filter projects based on selected portfolio
    const filteredProjects = formData.portfolioId
        ? projects.filter(p => p.portfolioId === formData.portfolioId)
        : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.projectId) {
            alert('Por favor completa los campos requeridos (Título y Proyecto)');
            return;
        }

        try {
            await addTask({
                title: formData.title,
                description: formData.description,
                projectId: formData.projectId,
                priority: formData.priority,
                status: 'waiting',
                assignee: formData.assignee,
                dueDate: formData.dueDate,
                completed: false
            });

            // Reset and close
            setFormData({
                title: '',
                description: '',
                portfolioId: '',
                projectId: '',
                priority: 'medium',
                assignee: '',
                dueDate: new Date().toISOString().split('T')[0]
            });
            onClose();
        } catch (error) {
            alert('Error al crear la tarea. Por favor intenta de nuevo.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} glass`} onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
                <header className={styles.modalHeader}>
                    <h3>{t('modal.title') || 'Crear Nueva Tarea'}</h3>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </header>
                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>{t('modal.taskTitle') || 'Título de la Tarea'}</label>
                        <input
                            type="text"
                            placeholder={t('modal.taskPlaceholder') || 'ej. Diseñar login'}
                            className={styles.input}
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>{t('modal.description') || 'Descripción'}</label>
                        <textarea
                            placeholder={t('modal.descPlaceholder') || 'Detalles de la tarea...'}
                            className={styles.input}
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>Portafolio</label>
                            <select
                                className={styles.input}
                                value={formData.portfolioId}
                                onChange={e => setFormData({ ...formData, portfolioId: e.target.value, projectId: '' })}
                            >
                                <option value="">Selecciona Portafolio</option>
                                {portfolios.map(p => (
                                    <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Proyecto</label>
                            <select
                                className={styles.input}
                                value={formData.projectId}
                                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                                disabled={!formData.portfolioId}
                                required
                            >
                                <option value="">Selecciona Proyecto</option>
                                {filteredProjects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>{t('modal.priority') || 'Prioridad'}</label>
                            <select
                                className={styles.input}
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Fecha de Entrega</label>
                            <input
                                type="date"
                                className={styles.input}
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>{t('modal.collaborator') || 'Asignado a'}</label>
                        <input
                            type="text"
                            placeholder={t('modal.collPlaceholder') || 'Nombre del colaborador'}
                            className={styles.input}
                            value={formData.assignee}
                            onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                        />
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>{t('modal.cancel') || 'Cancelar'}</button>
                        <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>{t('modal.create') || 'Crear Tarea'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
