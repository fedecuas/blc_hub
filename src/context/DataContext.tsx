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
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

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
    addPortfolio: (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Portfolio>;
    updatePortfolio: (id: string, updates: Partial<Portfolio>) => Promise<void>;
    deletePortfolio: (id: string) => Promise<void>;
    getPortfolioById: (id: string) => Portfolio | undefined;

    // Project CRUD
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    getProjectById: (id: string) => Project | undefined;
    getProjectsByPortfolio: (portfolioId: string) => Project[];

    // Task CRUD
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    getTaskById: (id: string) => Task | undefined;
    getTasksByProject: (projectId: string) => Task[];

    // Client CRUD (prepared for CRM module)
    addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
    updateClient: (id: string, updates: Partial<Client>) => void;
    deleteClient: (id: string) => void;
    getClientById: (id: string) => Client | undefined;

    // Team Member CRUD
    addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TeamMember>;
    updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
    deleteTeamMember: (id: string) => Promise<void>;
    getTeamMembersByPortfolio: (portfolioId: string) => TeamMember[];

    // User Profile
    currentUser: UserProfile;
    isLoaded: boolean;
    loadStatus: 'loading' | 'success' | 'stale' | 'error';
    updateUserProfile: (updates: Partial<UserProfile>) => void;
    refreshAllData: () => Promise<void>;
}

// ============================================
// INITIAL DATA
// ============================================

const INITIAL_USER: UserProfile = {
    firstName: '',
    lastName: '',
    name: 'Cargando...',
    email: '',
    role: 'Panel Senior',
    avatarUrl: '',
    bio: '',
    phone: '',
    location: '',
    language: 'es',
    updatedAt: new Date().toISOString()
};

// ============================================
// CONTEXT CREATION
// ============================================

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function DataProvider({ children }: { children: ReactNode }) {
    const { user, refreshProfile } = useAuth();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [portfolioRelations, setPortfolioRelations] = useState<{ portfolio_id: string, member_id: string }[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'stale' | 'error'>('loading');

    // Utility for network timeouts to prevent UI hangs
    const withTimeout = async <T,>(promise: any, timeoutMs: number = 8000): Promise<T> => {
        return Promise.race([
            promise,
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
            )
        ]);
    };

    // Initial Fetch logic moved to component scope for external access
    const fetchData = async (retryCount = 0) => {
        if (!user) {
            setIsLoaded(true);
            return;
        }

        if (retryCount === 0) {
            setIsLoaded(false);
            setLoadStatus('loading');
            console.time('[DataContext] Total Load Time');
        }

        try {
            console.log(`[DataContext] Fetching database (Attempt ${retryCount + 1})...`);
            const [pRes, prRes, tRes, tmRes, ptmRes, uRes] = await withTimeout<any[]>(
                Promise.all([
                    supabase.from('portfolios').select('*'),
                    supabase.from('projects').select('*'),
                    supabase.from('tasks').select('*'),
                    supabase.from('team_members').select('*'),
                    supabase.from('portfolio_team_members').select('*'),
                    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
                ]),
                8000
            );

            if (pRes?.data) {
                setPortfolios(pRes.data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    shortName: p.short_name,
                    icon: p.icon,
                    color: p.color,
                    gradient: p.gradient,
                    description: p.description,
                    companyName: p.company_name,
                    website: p.website,
                    industry: p.industry,
                    logoUrl: p.logo_url,
                    createdAt: p.created_at,
                    updatedAt: p.updated_at
                })));
            }

            if (prRes?.data) {
                setProjects(prRes.data.map((p: any) => ({
                    id: p.id,
                    portfolioId: p.portfolio_id,
                    sku: p.sku,
                    name: p.name,
                    shortName: p.short_name,
                    description: p.description,
                    manager: p.manager,
                    status: p.status,
                    priority: p.priority,
                    progress: p.progress,
                    deadline: p.deadline,
                    color: p.color,
                    gradient: p.gradient,
                    icon: p.icon,
                    tags: p.tags || [],
                    createdAt: p.created_at,
                    updatedAt: p.updated_at
                })));
            }

            if (tRes?.data) {
                setTasks(tRes.data.map((t: any) => ({
                    id: t.id,
                    projectId: t.project_id,
                    title: t.title,
                    description: t.description,
                    status: t.status,
                    priority: t.priority,
                    assignee: t.assignee,
                    dueDate: t.due_date,
                    completed: t.completed,
                    tags: t.tags || [],
                    estimatedHours: t.estimated_hours,
                    actualHours: t.actual_hours,
                    createdAt: t.created_at,
                    updatedAt: t.updated_at
                })));
            }

            if (tmRes?.data) {
                setTeamMembers(tmRes.data.map((m: any) => ({
                    id: m.id,
                    firstName: m.first_name,
                    lastName: m.last_name,
                    email: m.email,
                    role: m.role,
                    avatarUrl: m.avatar_url,
                    status: m.status || 'active',
                    specialties: m.specialties || [],
                    createdAt: m.created_at,
                    updatedAt: m.updated_at
                })));
            }

            setPortfolioRelations(ptmRes.data || []);

            const profile = uRes?.data;
            if (profile) {
                setCurrentUser(prev => ({
                    ...prev,
                    firstName: profile.first_name || prev.firstName,
                    lastName: profile.last_name || prev.lastName,
                    name: profile.name || prev.name,
                    role: profile.role || prev.role,
                    avatarUrl: profile.avatar_url || prev.avatarUrl,
                    bio: profile.bio || prev.bio,
                    phone: profile.phone || prev.phone,
                    location: profile.location || prev.location,
                    language: profile.language || prev.language,
                    updatedAt: profile.updated_at || prev.updatedAt
                }));
            }

            setLoadStatus('success');
            setIsLoaded(true);
            console.timeEnd('[DataContext] Total Load Time');
        } catch (error: any) {
            console.error('[DataContext] Fetch error/timeout:', error.message);
            if (retryCount < 2) {
                console.log(`[DataContext] Retrying in 2.5s... (${retryCount + 1}/2)`);
                setTimeout(() => fetchData(retryCount + 1), 2500);
            } else {
                setLoadStatus('error');
                setIsLoaded(true);
                console.timeEnd('[DataContext] Total Load Time');
            }
        }
    };

    // Initial Fetch from Supabase
    useEffect(() => {
        fetchData(0);
    }, [user?.id]);

    // Sync currentUser with Auth User (Initial Only)
    useEffect(() => {
        if (user && (!currentUser.email || currentUser.name === 'Cargando...')) {
            console.log('[DataContext] Initializing profile from Auth session...');
            setCurrentUser(prev => {
                const firstName = (user as any).firstName || user.name?.split(' ')[0] || prev.firstName;
                const lastName = (user as any).lastName || user.name?.split(' ').slice(1).join(' ') || prev.lastName;

                // CRITICAL: Filter out fallback names and placeholders
                const authName = user.name &&
                    !user.name.includes('@') &&
                    user.name !== 'Cargando...' &&
                    user.name !== 'Usuario' ? user.name : '';

                return {
                    ...prev,
                    firstName: firstName || prev.firstName,
                    lastName: lastName || prev.lastName,
                    name: authName || prev.name || user.email.split('@')[0],
                    email: user.email,
                    role: user.role || prev.role,
                    avatarUrl: user.avatarUrl || prev.avatarUrl,
                    updatedAt: new Date().toISOString()
                };
            });
        }
    }, [user, currentUser.email, currentUser.name]);

    // ============================================
    // PORTFOLIO CRUD
    // ============================================

    const addPortfolio = async (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');
        const tempId = `temp-${Date.now()}`;
        const optimisticPortfolio: Portfolio = {
            id: tempId,
            ...portfolio,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setPortfolios(prev => [...prev, optimisticPortfolio]);

        try {
            const { data, error } = await supabase
                .from('portfolios')
                .insert([{
                    name: portfolio.name,
                    short_name: portfolio.shortName,
                    icon: portfolio.icon,
                    color: portfolio.color,
                    gradient: portfolio.gradient,
                    description: portfolio.description,
                    company_name: portfolio.companyName,
                    website: portfolio.website,
                    industry: portfolio.industry,
                    logo_url: portfolio.logoUrl,
                    user_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;
            const newPortfolio: Portfolio = {
                id: data.id,
                name: data.name,
                shortName: data.short_name,
                icon: data.icon,
                color: data.color,
                gradient: data.gradient,
                description: data.description,
                companyName: data.company_name,
                website: data.website,
                industry: data.industry,
                logoUrl: data.logo_url,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };
            setPortfolios(prev => prev.map(p => p.id === tempId ? newPortfolio : p));
            return newPortfolio;
        } catch (error) {
            setPortfolios(prev => prev.filter(p => p.id !== tempId));
            throw error;
        }
    };

    const updatePortfolio = async (id: string, updates: Partial<Portfolio>) => {
        const mappedUpdates: any = {};
        if (updates.name !== undefined) mappedUpdates.name = updates.name;
        if (updates.shortName !== undefined) mappedUpdates.short_name = updates.shortName;
        if (updates.icon !== undefined) mappedUpdates.icon = updates.icon;
        if (updates.color !== undefined) mappedUpdates.color = updates.color;
        if (updates.gradient !== undefined) mappedUpdates.gradient = updates.gradient;
        const { error } = await supabase.from('portfolios').update(mappedUpdates).eq('id', id);
        if (error) throw error;
        setPortfolios(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    };

    const deletePortfolio = async (id: string) => {
        const { error } = await supabase.from('portfolios').delete().eq('id', id);
        if (error) throw error;
        setPortfolios(prev => prev.filter(p => p.id !== id));
        setProjects(prev => prev.filter(p => p.portfolioId !== id));
    };

    const getPortfolioById = (id: string) => portfolios.find(p => p.id === id);

    // ============================================
    // PROJECT CRUD
    // ============================================

    const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const portfolio = portfolios.find(p => p.id === project.portfolioId);
        const portfolioPart = (portfolio?.name || 'PORT').substring(0, 4).toUpperCase().padEnd(4, 'X');
        const projectPart = project.name.substring(0, 2).toUpperCase().padEnd(2, 'X');
        const generatedSku = `${portfolioPart}${projectPart}`;

        const tempId = `temp-${Date.now()}`;
        const optimisticProjectBySchema: Project = {
            ...project,
            id: tempId,
            sku: generatedSku,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setProjects(prev => [...prev, optimisticProjectBySchema]);

        try {
            const { data, error } = await withTimeout<any>(
                supabase.from('projects').insert([{
                    name: project.name,
                    portfolio_id: project.portfolioId,
                    sku: generatedSku,
                    short_name: project.shortName || getInitials(project.name),
                    description: project.description,
                    manager: project.manager,
                    status: project.status,
                    priority: project.priority,
                    progress: project.progress,
                    deadline: project.deadline,
                    color: project.color,
                    gradient: project.gradient,
                    icon: project.icon,
                    tags: project.tags
                }]).select().single()
            );

            if (error) throw error;
            const newProject: Project = {
                id: data.id,
                portfolioId: data.portfolio_id,
                sku: data.sku,
                name: data.name,
                shortName: data.short_name,
                description: data.description,
                manager: data.manager,
                status: data.status,
                priority: data.priority,
                progress: data.progress,
                deadline: data.deadline,
                color: data.color,
                gradient: data.gradient,
                icon: data.icon,
                tags: data.tags,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };
            setProjects(prev => prev.map(p => p.id === tempId ? newProject : p));
            return newProject;
        } catch (error) {
            setProjects(prev => prev.filter(p => p.id !== tempId));
            throw error;
        }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        const mappedUpdates: any = {};
        if (updates.name !== undefined) mappedUpdates.name = updates.name;
        if (updates.shortName !== undefined) mappedUpdates.short_name = updates.shortName;
        if (updates.description !== undefined) mappedUpdates.description = updates.description;
        if (updates.manager !== undefined) mappedUpdates.manager = updates.manager;
        if (updates.status !== undefined) mappedUpdates.status = updates.status;
        if (updates.priority !== undefined) mappedUpdates.priority = updates.priority;
        if (updates.progress !== undefined) mappedUpdates.progress = updates.progress;
        if (updates.deadline !== undefined) mappedUpdates.deadline = updates.deadline;
        if (updates.color !== undefined) mappedUpdates.color = updates.color;
        if (updates.gradient !== undefined) mappedUpdates.gradient = updates.gradient;
        if (updates.icon !== undefined) mappedUpdates.icon = updates.icon;
        if (updates.tags !== undefined) mappedUpdates.tags = updates.tags;

        const { error } = await supabase.from('projects').update(mappedUpdates).eq('id', id);
        if (error) throw error;
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    };

    const deleteProject = async (id: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const getProjectById = (id: string) => projects.find(p => p.id === id);
    const getProjectsByPortfolio = (portfolioId: string) => projects.filter(p => p.portfolioId === portfolioId);

    // ============================================
    // TASK CRUD
    // ============================================

    const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase.from('tasks').insert([{
            title: task.title,
            project_id: task.projectId,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignee: task.assignee,
            due_date: task.dueDate,
            completed: task.completed,
            tags: task.tags,
            estimated_hours: task.estimatedHours,
            actual_hours: task.actualHours
        }]).select().single();

        if (error) {
            console.error('[DataContext] Error adding task:', error);
            throw error;
        }

        const newTask: Task = {
            id: data.id,
            projectId: data.project_id,
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            assignee: data.assignee,
            dueDate: data.due_date,
            completed: data.completed,
            tags: data.tags || [],
            estimatedHours: data.estimated_hours,
            actualHours: data.actual_hours,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };

        setTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    };

    const deleteTask = async (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const getTaskById = (id: string) => tasks.find(t => t.id === id);
    const getTasksByProject = (projectId: string) => tasks.filter(t => t.projectId === projectId);

    // ============================================
    // CLIENT & TEAM (Stub)
    // ============================================

    const addClient = (client: any) => client;
    const updateClient = () => { };
    const deleteClient = () => { };
    const getClientById = () => undefined;

    const addTeamMember = async (member: any) => member;
    const updateTeamMember = async () => { };
    const deleteTeamMember = async () => { };
    const getTeamMembersByPortfolio = () => [];

    // ============================================
    // USER PROFILE CRUD
    // ============================================

    const updateUserProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;
        const firstName = updates.firstName !== undefined ? updates.firstName : currentUser.firstName;
        const lastName = updates.lastName !== undefined ? updates.lastName : currentUser.lastName;
        const potentialFullName = updates.name !== undefined ? updates.name : `${firstName} ${lastName}`.trim();
        const isFallbackName = potentialFullName.includes('@') || potentialFullName === 'Cargando...';
        const fullName = (isFallbackName && currentUser.name && !currentUser.name.includes('@')) ? currentUser.name : (potentialFullName || user.name);

        setCurrentUser(prev => ({ ...prev, ...updates, firstName, lastName, name: fullName, updatedAt: new Date().toISOString() }));

        try {
            const mappedUpdates: any = {
                id: user.id,
                updated_at: new Date().toISOString(),
                name: fullName,
                first_name: firstName,
                last_name: lastName,
                role: updates.role || currentUser.role,
                avatar_url: updates.avatarUrl || currentUser.avatarUrl,
                bio: updates.bio !== undefined ? updates.bio : currentUser.bio,
                phone: updates.phone !== undefined ? updates.phone : currentUser.phone,
                location: updates.location !== undefined ? updates.location : currentUser.location,
                language: updates.language || currentUser.language
            };
            await withTimeout(supabase.from('profiles').upsert(mappedUpdates));
            if (refreshProfile) refreshProfile().catch(e => console.error(e));
        } catch (err) {
            console.error(err);
        }
    };

    const value: DataContextType = {
        portfolios, projects, tasks, clients, teamMembers, invoices,
        addPortfolio, updatePortfolio, deletePortfolio, getPortfolioById,
        addProject, updateProject, deleteProject, getProjectById, getProjectsByPortfolio,
        addTask, updateTask, deleteTask, getTaskById, getTasksByProject,
        addClient, updateClient, deleteClient, getClientById,
        addTeamMember, updateTeamMember, deleteTeamMember, getTeamMembersByPortfolio,
        currentUser, updateUserProfile, refreshAllData: () => fetchData(0), isLoaded, loadStatus,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useDataContext must be used within a DataProvider');
    return context;
}
