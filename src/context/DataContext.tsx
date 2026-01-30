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
    updateUserProfile: (updates: Partial<UserProfile>) => void;

    // Utility
    isLoaded: boolean;
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

    // Sync currentUser with Auth User (Initial Only)
    useEffect(() => {
        if (user && !currentUser.email) {
            console.log('[DataContext] Initializing profile from Auth session...');
            setCurrentUser({
                firstName: (user as any).firstName || user.name?.split(' ')[0] || '',
                lastName: (user as any).lastName || user.name?.split(' ').slice(1).join(' ') || '',
                name: user.name,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl,
                bio: (user as any).bio || '',
                phone: (user as any).phone || '',
                location: (user as any).location || '',
                language: (user as any).language || 'es',
                updatedAt: new Date().toISOString()
            });
        }
    }, [user, currentUser.email]);

    // Initial Fetch from Supabase
    useEffect(() => {
        if (!user) {
            setIsLoaded(true);
            return;
        }

        const fetchData = async () => {
            setIsLoaded(false);
            try {
                console.log('[DataContext] Fetching data with 30s timeout...');
                const [pRes, prRes, tRes, tmRes, ptmRes, uRes] = await withTimeout<any[]>(
                    Promise.all([
                        supabase.from('portfolios').select('*') as any,
                        supabase.from('projects').select('*') as any,
                        supabase.from('tasks').select('*') as any,
                        supabase.from('team_members').select('*') as any,
                        supabase.from('portfolio_team_members').select('*') as any,
                        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle() as any
                    ]),
                    30000
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
                        tags: p.tags,
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
                        tags: t.tags,
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

                // We'll store ptm relations in a ref or state if needed for faster lookup
                setPortfolioRelations(ptmRes.data || []);

                // Profile Sync - Merge DB data with local state to avoid losing fields
                const profile = uRes.data;
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

            } catch (error) {
                console.error('Error fetching data from Supabase:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchData();
    }, [user]);

    // ============================================
    // PORTFOLIO CRUD
    // ============================================

    const addPortfolio = async (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');

        // Optimistic update
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

            if (error) {
                console.error('Error adding portfolio, rolling back:', error);
                setPortfolios(prev => prev.filter(p => p.id !== tempId));
                throw error;
            }

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

            // Replace temp with real
            setPortfolios(prev => prev.map(p => p.id === tempId ? newPortfolio : p));
            return newPortfolio;
        } catch (error) {
            console.error('Add portfolio exception:', error);
            setPortfolios(prev => prev.filter(p => p.id !== tempId));
            throw error;
        }
    };

    const updatePortfolio = async (id: string, updates: Partial<Portfolio>) => {
        // Map updates to snake_case
        const mappedUpdates: any = {};
        if (updates.name !== undefined) mappedUpdates.name = updates.name;
        if (updates.shortName !== undefined) mappedUpdates.short_name = updates.shortName;
        if (updates.icon !== undefined) mappedUpdates.icon = updates.icon;
        if (updates.color !== undefined) mappedUpdates.color = updates.color;
        if (updates.gradient !== undefined) mappedUpdates.gradient = updates.gradient;
        if (updates.description !== undefined) mappedUpdates.description = updates.description;
        if (updates.companyName !== undefined) mappedUpdates.company_name = updates.companyName;
        if (updates.website !== undefined) mappedUpdates.website = updates.website;
        if (updates.industry !== undefined) mappedUpdates.industry = updates.industry;
        if (updates.logoUrl !== undefined) mappedUpdates.logo_url = updates.logoUrl;

        const { error } = await supabase
            .from('portfolios')
            .update(mappedUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating portfolio:', error);
            return;
        }

        setPortfolios(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    };

    const deletePortfolio = async (id: string) => {
        const { error } = await supabase
            .from('portfolios')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting portfolio:', error);
            return;
        }

        setPortfolios(prev => prev.filter(p => p.id !== id));
        setProjects(prev => prev.filter(p => p.portfolioId !== id));
        // Tasks will be deleted by Cascade in Supabase
    };

    const getPortfolioById = (id: string) => portfolios.find(p => p.id === id);

    // ============================================
    // PROJECT CRUD
    // ============================================

    const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                name: project.name,
                portfolio_id: project.portfolioId,
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
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding project:', error);
            throw error;
        }

        const newProject: Project = {
            id: data.id,
            portfolioId: data.portfolio_id,
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
        setProjects(prev => [...prev, newProject]);
        return newProject;
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        const mappedUpdates: any = {};
        if (updates.name !== undefined) mappedUpdates.name = updates.name;
        if (updates.portfolioId !== undefined) mappedUpdates.portfolio_id = updates.portfolioId;
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

        const { error } = await supabase
            .from('projects')
            .update(mappedUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating project:', error);
            return;
        }

        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    };

    const deleteProject = async (id: string) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            return;
        }

        setProjects(prev => prev.filter(p => p.id !== id));
        setTasks(prev => prev.filter(t => t.projectId !== id));
    };

    const getProjectById = (id: string) => projects.find(p => p.id === id);

    const getProjectsByPortfolio = (portfolioId: string) => {
        return projects.filter(p => p.portfolioId === portfolioId);
    };

    // ============================================
    // TASK CRUD
    // ============================================

    const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
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
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding task:', error);
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
            tags: data.tags,
            estimatedHours: data.estimated_hours,
            actualHours: data.actual_hours,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
        setTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const mappedUpdates: any = {};
        if (updates.title !== undefined) mappedUpdates.title = updates.title;
        if (updates.projectId !== undefined) mappedUpdates.project_id = updates.projectId;
        if (updates.description !== undefined) mappedUpdates.description = updates.description;
        if (updates.status !== undefined) mappedUpdates.status = updates.status;
        if (updates.priority !== undefined) mappedUpdates.priority = updates.priority;
        if (updates.assignee !== undefined) mappedUpdates.assignee = updates.assignee;
        if (updates.dueDate !== undefined) mappedUpdates.due_date = updates.dueDate;
        if (updates.completed !== undefined) mappedUpdates.completed = updates.completed;
        if (updates.tags !== undefined) mappedUpdates.tags = updates.tags;
        if (updates.estimatedHours !== undefined) mappedUpdates.estimated_hours = updates.estimatedHours;
        if (updates.actualHours !== undefined) mappedUpdates.actual_hours = updates.actualHours;

        const { error } = await supabase
            .from('tasks')
            .update(mappedUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating task:', error);
            return;
        }

        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    };

    const deleteTask = async (id: string) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            return;
        }
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
    // TEAM MEMBER CRUD
    // ============================================

    // Team Member CRUD (Partial Implementation for now)
    const addTeamMember = async (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');
        const { data, error } = await supabase.from('team_members').insert([{
            first_name: member.firstName,
            last_name: member.lastName,
            email: member.email,
            phone: member.phone,
            role: member.role,
            department: member.department,
            specialties: member.specialties,
            avatar_url: member.avatarUrl,
            status: member.status,
            hourly_rate: member.hourlyRate,
            user_id: user.id
        }]).select().single();

        if (error) throw error;

        const newMember: TeamMember = {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            department: data.department,
            specialties: data.specialties,
            avatarUrl: data.avatar_url,
            status: data.status,
            hourlyRate: data.hourly_rate,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
        setTeamMembers(prev => [...prev, newMember]);
        return newMember;
    };

    const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
        const mappedUpdates: any = {};
        if (updates.firstName !== undefined) mappedUpdates.first_name = updates.firstName;
        if (updates.lastName !== undefined) mappedUpdates.last_name = updates.lastName;
        if (updates.email !== undefined) mappedUpdates.email = updates.email;
        if (updates.phone !== undefined) mappedUpdates.phone = updates.phone;
        if (updates.role !== undefined) mappedUpdates.role = updates.role;
        if (updates.department !== undefined) mappedUpdates.department = updates.department;
        if (updates.specialties !== undefined) mappedUpdates.specialties = updates.specialties;
        if (updates.avatarUrl !== undefined) mappedUpdates.avatar_url = updates.avatarUrl;
        if (updates.status !== undefined) mappedUpdates.status = updates.status;
        if (updates.hourlyRate !== undefined) mappedUpdates.hourly_rate = updates.hourlyRate;

        const { error } = await supabase.from('team_members').update(mappedUpdates).eq('id', id);
        if (error) throw error;
        setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
    };

    const deleteTeamMember = async (id: string) => {
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) throw error;
        setTeamMembers(prev => prev.filter(m => m.id !== id));
    };

    const getTeamMembersByPortfolio = (portfolioId: string): TeamMember[] => {
        const memberIds = portfolioRelations
            .filter(r => r.portfolio_id === portfolioId)
            .map(r => r.member_id);
        return teamMembers.filter(m => memberIds.includes(m.id));
    };

    // ============================================
    // USER PROFILE CRUD
    // ============================================

    // Utility for network timeouts to prevent UI hangs in production
    const withTimeout = async <T,>(promise: any, timeoutMs: number = 6000): Promise<T> => {
        return Promise.race([
            promise,
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
            )
        ]);
    };

    const updateUserProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;

        // 1. Optimistic Update: Refresh UI immediately
        const firstName = updates.firstName !== undefined ? updates.firstName : currentUser.firstName;
        const lastName = updates.lastName !== undefined ? updates.lastName : currentUser.lastName;
        const fullName = updates.name !== undefined ? updates.name : `${firstName} ${lastName}`.trim() || user.name;

        console.log('[DataContext] Applying optimistic update to local state');
        setCurrentUser(prev => ({
            ...prev,
            ...updates,
            firstName,
            lastName,
            name: fullName,
            updatedAt: new Date().toISOString()
        }));

        // 2. Map to Supabase schema - ONLY if we have valid non-null data
        const mappedUpdates: any = {
            id: user.id,
            updated_at: new Date().toISOString()
        };

        if (fullName) mappedUpdates.name = fullName;
        if (firstName) mappedUpdates.first_name = firstName;
        if (lastName) mappedUpdates.last_name = lastName;
        if (updates.role !== undefined) mappedUpdates.role = updates.role;
        if (updates.avatarUrl !== undefined) mappedUpdates.avatar_url = updates.avatarUrl;
        if (updates.bio !== undefined) mappedUpdates.bio = updates.bio;
        if (updates.phone !== undefined) mappedUpdates.phone = updates.phone;
        if (updates.location !== undefined) mappedUpdates.location = updates.location;
        if (updates.language !== undefined) mappedUpdates.language = updates.language;

        try {
            console.log('[DataContext] Sending to Supabase with 6s timeout guard...', mappedUpdates);
            // We use upsert to ensure the row exists
            const result = await withTimeout<any>(supabase.from('profiles').upsert(mappedUpdates));

            if (result.error) {
                console.error('[DataContext] Database write failed:', result.error);
                throw result.error;
            }

            console.log('[DataContext] Cloud save confirmed successful.');

            // 3. Background Sync (Non-blocking)
            if (refreshProfile) {
                console.log('[DataContext] Triggering fire-and-forget background sync');
                refreshProfile().catch(err => console.error('[Background Sync] Error:', err));
            }
        } catch (err: any) {
            console.error('[DataContext] Update failed or timed out:', err.message);
            // If it's a timeout, we keep the optimistic state but warn the user through the modal
            throw err;
        }
    };

    // ============================================
    // CONTEXT VALUE
    // ============================================

    const value: DataContextType = {
        portfolios,
        projects,
        tasks,
        clients,
        teamMembers,
        invoices,
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        getPortfolioById,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        getProjectsByPortfolio,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByProject,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        getTeamMembersByPortfolio,
        currentUser,
        updateUserProfile,
        isLoaded
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
