// ============================================
// CORE ENTITIES (Portfolio → Projects → Tasks)
// ============================================

export interface Portfolio {
    id: string;
    name: string;
    shortName: string;
    icon: string;
    color: string;
    gradient: string;
    description?: string;
    logoUrl?: string; // Company logo
    companyName?: string;
    website?: string;
    industry?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    portfolioId: string; // Links to Portfolio
    sku?: string; // Standardized SKU (4 Portfolio + 2 Project)
    name: string;
    shortName: string;
    description?: string;
    manager: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    progress: number; // 0-100
    deadline: string;
    color: string;
    gradient: string;
    icon: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    projectId: string; // Links to Project
    title: string;
    description?: string;
    status: 'todo' | 'waiting' | 'approved' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee?: string;
    dueDate?: string;
    completed: boolean;
    tags?: string[];
    estimatedHours?: number;
    actualHours?: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// CRM ENTITIES
// ============================================

export interface Client {
    id: string;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    address?: string;
    industry?: string;
    status: 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
    assignedTo?: string;
    portfolioIds: string[]; // Can be linked to multiple portfolios
    tags?: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    id: string;
    clientId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position?: string;
    isPrimary: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source: 'website' | 'referral' | 'social' | 'campaign' | 'other';
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
    estimatedValue?: number;
    assignedTo?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// FINANCIAL ENTITIES
// ============================================

export interface Invoice {
    id: string;
    clientId: string;
    projectId?: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issueDate: string;
    dueDate: string;
    paidDate?: string;
    items: InvoiceItem[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    currency: string;
    paymentMethod: 'cash' | 'card' | 'transfer' | 'check' | 'other';
    paymentDate: string;
    reference?: string;
    notes?: string;
    createdAt: string;
}

export interface Budget {
    id: string;
    projectId: string;
    name: string;
    totalAmount: number;
    spentAmount: number;
    currency: string;
    startDate: string;
    endDate: string;
    categories: BudgetCategory[];
    createdAt: string;
    updatedAt: string;
}

export interface BudgetCategory {
    id: string;
    name: string;
    allocatedAmount: number;
    spentAmount: number;
}

// ============================================
// TEAM ENTITIES
// ============================================

export interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    department?: string;
    specialties: string[];
    avatarUrl?: string;
    status: 'active' | 'inactive' | 'on-leave';
    hourlyRate?: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    location?: string;
    language: 'en' | 'es';
    updatedAt: string;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    createdAt: string;
}

export interface Assignment {
    id: string;
    memberId: string;
    projectId: string;
    taskId?: string;
    role: string;
    allocationPercentage: number; // 0-100
    startDate: string;
    endDate?: string;
    createdAt: string;
}

// ============================================
// MARKETING ENTITIES
// ============================================

export interface Campaign {
    id: string;
    name: string;
    type: 'email' | 'social' | 'sms' | 'outreach' | 'event';
    status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
    startDate: string;
    endDate?: string;
    budget?: number;
    targetAudience?: string;
    goals?: string;
    metrics?: CampaignMetrics;
    createdAt: string;
    updatedAt: string;
}

export interface CampaignMetrics {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
    revenue: number;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    category: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface SocialPost {
    id: string;
    campaignId?: string;
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
    content: string;
    mediaUrls?: string[];
    scheduledDate?: string;
    publishedDate?: string;
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    metrics?: SocialMetrics;
    createdAt: string;
    updatedAt: string;
}

export interface SocialMetrics {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    engagement: number;
}

// ============================================
// INVENTORY ENTITIES
// ============================================

export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    cost: number;
    currency: string;
    stock: number;
    minStock: number;
    maxStock: number;
    unit: string;
    supplier?: string;
    imageUrl?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface StockMovement {
    id: string;
    productId: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reference?: string;
    notes?: string;
    date: string;
    createdAt: string;
}

// ============================================
// COMMUNICATION ENTITIES
// ============================================

export interface Conversation {
    id: string;
    clientId?: string;
    subject: string;
    status: 'open' | 'pending' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderType: 'team' | 'client';
    content: string;
    attachments?: string[];
    timestamp: string;
}

export interface Meeting {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    attendees: string[];
    clientId?: string;
    projectId?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// SYSTEM TYPES
// ============================================

export interface BLCData {
    portfolios: Portfolio[];
    projects: Project[];
    tasks: Task[];
    clients?: Client[];
    contacts?: Contact[];
    leads?: Lead[];
    invoices?: Invoice[];
    payments?: Payment[];
    budgets?: Budget[];
    teamMembers?: TeamMember[];
    campaigns?: Campaign[];
    products?: Product[];
    conversations?: Conversation[];
    meetings?: Meeting[];
    user?: UserProfile;
    version: string;
    lastUpdated: string;
}

export type EntityType =
    | 'portfolio'
    | 'project'
    | 'task'
    | 'client'
    | 'contact'
    | 'lead'
    | 'invoice'
    | 'payment'
    | 'budget'
    | 'teamMember'
    | 'campaign'
    | 'product'
    | 'conversation'
    | 'meeting';
