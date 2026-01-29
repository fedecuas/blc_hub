"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
    Portfolio,
    Project,
    Task,
    Client,
    TeamMember,
    Invoice,
    BLCData,
    UserProfile
} from '@/types/entities';

// ============================================
// UTILS
// ============================================

export const getInitials = (name: string): string => {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

interface DataContextType {
    // Core State
    portfolios: Portfolio[];
    projects: Project[];
    tasks: Task[];
    clients: Client[];
    teamMembers: TeamMember[];
    invoices: Invoice[];

    // Portfolio CRUD
    addPortfolio: (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => Portfolio;
    updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
    deletePortfolio: (id: string) => void;
    getPortfolioById: (id: string) => Portfolio | undefined;

    // Project CRUD
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    getProjectById: (id: string) => Project | undefined;
    getProjectsByPortfolio: (portfolioId: string) => Project[];

    // Task CRUD
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    getTaskById: (id: string) => Task | undefined;
    getTasksByProject: (projectId: string) => Task[];

    // Client CRUD (prepared for CRM module)
    addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
    updateClient: (id: string, updates: Partial<Client>) => void;
    deleteClient: (id: string) => void;
    getClientById: (id: string) => Client | undefined;

    // User Profile
    currentUser: UserProfile;
    updateUserProfile: (updates: Partial<UserProfile>) => void;

    // Utility
    isLoaded: boolean;
}

// ============================================
// INITIAL DATA
// ============================================

const INITIAL_USER: UserProfile = {
    firstName: 'Federico',
    lastName: 'Antillon',
    name: 'Federico Antillon',
    email: 'federico@example.com',
    role: 'Panel Senior',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    language: 'es',
    updatedAt: new Date().toISOString()
};

const INITIAL_PORTFOLIOS: Portfolio[] = [
    { id: 'personal', name: 'Personal', shortName: 'PER', icon: '👤', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'techo', name: 'Un Techo Propio', shortName: 'UTP', icon: '🏠', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'faliberries', name: 'Faliberries', shortName: 'FAL', icon: '🍓', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sanfede', name: 'San Fede Produce', shortName: 'SFP', icon: '🥬', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'unecapital', name: 'Une Capital', shortName: 'UNC', icon: '💰', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'biolink', name: 'Biolink Pro', shortName: 'BLP', icon: '🔗', color: '#00c7b7', gradient: 'linear-gradient(135deg, #00c7b7, #00a99d)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const INITIAL_PROJECTS: Project[] = [
    { id: 'gh', portfolioId: 'biolink', name: 'Green House', shortName: 'GH', manager: 'John Doe', status: 'active', priority: 'high', progress: 67, deadline: '2026-02-15', color: '#00c7b7', gradient: 'linear-gradient(135deg, #00c7b7, #00a99d)', icon: '🏠', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'cp', portfolioId: 'personal', name: 'Cyber Punk', shortName: 'CP', manager: 'Jane Smith', status: 'active', priority: 'medium', progress: 33, deadline: '2026-03-01', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)', icon: '🎮', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ec', portfolioId: 'unecapital', name: 'Easy Crypto', shortName: 'EC', manager: 'Mike Johnson', status: 'planning', priority: 'high', progress: 37, deadline: '2026-02-28', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', icon: '💎', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ta', portfolioId: 'personal', name: 'Travel App', shortName: 'TA', manager: 'Sarah Lee', status: 'active', priority: 'low', progress: 75, deadline: '2026-03-15', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: '✈️', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'lp', portfolioId: 'faliberries', name: 'Landing Page', shortName: 'LP', manager: 'Tom Brown', status: 'completed', priority: 'medium', progress: 100, deadline: '2026-02-10', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', icon: '🎯', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const INITIAL_TASKS: Task[] = [
    { id: 'task-gh-1', projectId: 'gh', title: 'Setup automation infrastructure', status: 'in_progress', priority: 'high', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-gh-2', projectId: 'gh', title: 'Design control panel UI', status: 'approved', priority: 'medium', completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-cp-1', projectId: 'cp', title: 'Create 3D asset library', status: 'in_review', priority: 'high', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-cp-2', projectId: 'cp', title: 'Implement neon effects', status: 'in_progress', priority: 'medium', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ============================================
// CONTEXT CREATION
// ============================================

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function DataProvider({ children }: { children: ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>(INITIAL_PORTFOLIOS);
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [clients, setClients] = useState<Client[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);

    // Load data from localStorage on mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('blc_data');
            if (savedData) {
                const parsed: BLCData = JSON.parse(savedData);
                setPortfolios(parsed.portfolios || INITIAL_PORTFOLIOS);
                setProjects(parsed.projects || INITIAL_PROJECTS);
                setTasks(parsed.tasks || INITIAL_TASKS);
                setClients(parsed.clients || []);
                setTeamMembers(parsed.teamMembers || []);
                setInvoices(parsed.invoices || []);
                setCurrentUser(parsed.user || INITIAL_USER);
            }
        } catch (error) {
            console.error('Error loading BLC data from localStorage:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            const dataToSave: BLCData = {
                portfolios,
                projects,
                tasks,
                clients,
                teamMembers,
                invoices,
                version: '1.0',
                lastUpdated: new Date().toISOString(),
                user: currentUser
            };
            localStorage.setItem('blc_data', JSON.stringify(dataToSave));
        }
    }, [isLoaded, portfolios, projects, tasks, clients, teamMembers, invoices, currentUser]);

    // ============================================
    // PORTFOLIO CRUD
    // ============================================

    const addPortfolio = (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newPortfolio: Portfolio = {
            ...portfolio,
            id: `portfolio-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
        };
        setPortfolios(prev => [...prev, newPortfolio]);
        return newPortfolio;
    };

    const updatePortfolio = (id: string, updates: Partial<Portfolio>) => {
        setPortfolios(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    };

    const deletePortfolio = (id: string) => {
        setPortfolios(prev => prev.filter(p => p.id !== id));
        // Also delete related projects and tasks
        const portfolioProjects = projects.filter(p => p.portfolioId === id);
        portfolioProjects.forEach(project => deleteProject(project.id));
    };

    const getPortfolioById = (id: string) => portfolios.find(p => p.id === id);

    // ============================================
    // PROJECT CRUD
    // ============================================

    const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newProject: Project = {
            ...project,
            shortName: project.shortName || getInitials(project.name),
            id: `project-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
        };
        setProjects(prev => [...prev, newProject]);
        return newProject;
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    };

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        // Also delete related tasks
        setTasks(prev => prev.filter(t => t.projectId !== id));
    };

    const getProjectById = (id: string) => projects.find(p => p.id === id);

    const getProjectsByPortfolio = (portfolioId: string) => {
        return projects.filter(p => p.portfolioId === portfolioId);
    };

    // ============================================
    // TASK CRUD
    // ============================================

    const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newTask: Task = {
            ...task,
            id: `task-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
        };
        setTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const getTaskById = (id: string) => tasks.find(t => t.id === id);

    const getTasksByProject = (projectId: string) => {
        return tasks.filter(t => t.projectId === projectId);
    };

    // ============================================
    // CLIENT CRUD (Prepared for CRM module)
    // ============================================

    const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newClient: Client = {
            ...client,
            id: `client-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
        };
        setClients(prev => [...prev, newClient]);
        return newClient;
    };

    const updateClient = (id: string, updates: Partial<Client>) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    };

    const deleteClient = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
    };

    const getClientById = (id: string) => clients.find(c => c.id === id);

    // ============================================
    // USER PROFILE CRUD
    // ============================================

    const updateUserProfile = (updates: Partial<UserProfile>) => {
        setCurrentUser(prev => {
            const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
            // Auto-calculate full name if first or last name changes
            if (updates.firstName || updates.lastName) {
                updated.name = `${updated.firstName} ${updated.lastName}`.trim();
            }
            return updated;
        });
    };

    // ============================================
    // CONTEXT VALUE
    // ============================================

    const value: DataContextType = {
        // State
        portfolios,
        projects,
        tasks,
        clients,
        teamMembers,
        invoices,

        // Portfolio
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        getPortfolioById,

        // Project
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        getProjectsByPortfolio,

        // Task
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByProject,

        // Client
        addClient,
        updateClient,
        deleteClient,
        getClientById,

        // User Profile
        currentUser,
        updateUserProfile,

        // Utility
        isLoaded,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
}
