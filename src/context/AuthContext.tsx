"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    phone?: string;
    location?: string;
    language?: 'en' | 'es';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Safety timeout helper
    const withAuthTimeout = async <T,>(promise: any, timeoutMs: number = 5000): Promise<T> => {
        return Promise.race([
            promise,
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('AUTH_TIMEOUT')), timeoutMs)
            )
        ]);
    };

    // Check for saved session
    useEffect(() => {
        const checkSession = async () => {
            console.log('[AuthContext] Starting session check...');
            try {
                const { data: { session } } = await withAuthTimeout(supabase.auth.getSession());

                if (session?.user) {
                    console.log('[AuthContext] Session found, fetching profile...');
                    try {
                        const result = await withAuthTimeout<any>(
                            supabase
                                .from('profiles')
                                .select('*')
                                .eq('id', session.user.id)
                                .maybeSingle(),
                            4000
                        );
                        const profile = result.data;

                        setUser({
                            id: session.user.id,
                            email: session.user.email || '',
                            name: profile?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
                            role: profile?.role || 'Panel Senior',
                            avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                            firstName: profile?.first_name || '',
                            lastName: profile?.last_name || '',
                            bio: profile?.bio || '',
                            phone: profile?.phone || '',
                            location: profile?.location || '',
                            language: profile?.language || 'es'
                        } as any);
                    } catch (profileErr) {
                        console.error('[AuthContext] Profile fetch timeout or error:', profileErr);
                        // Fallback to basic session user info
                        setUser({
                            id: session.user.id,
                            email: session.user.email || '',
                            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
                            role: 'Panel Senior',
                            avatarUrl: session.user.user_metadata?.avatar_url
                        } as any);
                    }
                } else {
                    console.log('[AuthContext] No active session found.');
                }
            } catch (err) {
                console.error('[AuthContext] Session check failed or timed out:', err);
            } finally {
                setIsLoading(false);
                console.log('[AuthContext] Initialization complete.');
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: profile?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
                        role: profile?.role || 'Panel Senior',
                        avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                        // Add extended fields for sync
                        firstName: profile?.first_name || '',
                        lastName: profile?.last_name || '',
                        bio: profile?.bio || '',
                        phone: profile?.phone || '',
                        location: profile?.location || '',
                        language: profile?.language || 'es'
                    } as any);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Error in auth state change:', err);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        if (error) return { success: false, error: error.message };
        return { success: true };
    };

    const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });
        setIsLoading(false);
        if (error) return { success: false, error: error.message };
        return { success: true };
    };

    const refreshProfile = async () => {
        console.log('[AuthContext] Refreshing profile...');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (error) {
                    console.error('[AuthContext] Error fetching profile:', error);
                    return;
                }

                console.log('[AuthContext] Profile fetched successfully:', profile?.name);
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: profile?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
                    role: profile?.role || 'Panel Senior',
                    avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                    firstName: profile?.first_name || '',
                    lastName: profile?.last_name || '',
                    bio: profile?.bio || '',
                    phone: profile?.phone || '',
                    location: profile?.location || '',
                    language: profile?.language || 'es'
                } as any);
            }
        } catch (err) {
            console.error('[AuthContext] Unexpected error in refreshProfile:', err);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshProfile } as any}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Route Guard Component
export function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                color: 'white'
            }}>
                <div className="loader">Cargando BLC System...</div>
            </div>
        );
    }

    if (!isAuthenticated && pathname !== '/login') {
        return null;
    }

    return <>{children}</>;
}
