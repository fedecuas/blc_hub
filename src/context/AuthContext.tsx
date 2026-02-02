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
            console.log('[AuthContext] Starting baseline session check...');
            try {
                // Short timeout for initial session retrieval. If it's stuck, it's likely a client-side corruption.
                const sessionRes = await withAuthTimeout<any>(supabase.auth.getSession(), 5000);
                const session = sessionRes?.data?.session;

                if (session?.user) {
                    console.log('[AuthContext] Session located. Retrieval from Profiles...');
                    try {
                        const result = await withAuthTimeout<any>(
                            supabase
                                .from('profiles')
                                .select('*')
                                .eq('id', session.user.id)
                                .maybeSingle() as any,
                            5000
                        );
                        const profile = result?.data;

                        setUser({
                            id: session.user.id,
                            email: session.user.email || '',
                            name: profile?.name || session.user.user_metadata?.full_name || '', // No fallback to email prefix here
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
                        console.warn('[AuthContext] Profile fetch delayed. Providing base identity.');
                        setUser({
                            id: session.user.id,
                            email: session.user.email || '',
                            name: session.user.user_metadata?.full_name || '',
                            role: 'Panel Senior',
                            avatarUrl: session.user.user_metadata?.avatar_url
                        } as any);
                    }
                } else {
                    console.log('[AuthContext] No active session found.');
                }
            } catch (err: any) {
                console.error('[AuthContext] Pre-flight session check failed or timed out:', err);
            } finally {
                setIsLoading(false);
                console.log('[AuthContext] Initialization cycle complete.');
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('[AuthContext] Auth state changed:', _event);
            try {
                if (session?.user) {
                    console.log('[AuthContext] User detected, fetching profile with safety timeout...');
                    // Add safety timeout to profile fetch in state change
                    const profileRes = await withAuthTimeout<any>(
                        supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .maybeSingle() as any,
                        10000
                    );
                    const profile = profileRes?.data;

                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: profile?.name || session.user.user_metadata?.full_name || 'Usuario',
                        role: profile?.role || 'Panel Senior',
                        avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                        firstName: profile?.first_name || '',
                        lastName: profile?.last_name || '',
                        bio: profile?.bio || '',
                        phone: profile?.phone || '',
                        location: profile?.location || '',
                        language: profile?.language || 'es'
                    } as any);
                    console.log('[AuthContext] Active user profile synced.');
                } else {
                    console.log('[AuthContext] Session cleared.');
                    setUser(null);
                }
            } catch (err) {
                console.error('[AuthContext] Error in auth state change handling:', err);
                // Even on profile error, if we have a session, we set the user to at least let them see the UI
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name || 'Usuario',
                        role: 'Panel Senior'
                    } as any);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            console.log('[AuthContext] Attempting login for:', email);

            // 30 second timeout for production reliability
            const result = await withAuthTimeout<any>(
                supabase.auth.signInWithPassword({ email, password }),
                30000
            );

            if (result.error) {
                console.error('[AuthContext] Supabase returned error:', result.error.message);
                return { success: false, error: result.error.message };
            }

            console.log('[AuthContext] Login successful.');
            return { success: true };
        } catch (err: any) {
            console.error('[AuthContext] Login exception:', err.message);

            // Check for missing environment variables
            const isUrlMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'undefined';
            const isKeyMissing = !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'undefined';

            if (isUrlMissing || isKeyMissing) {
                return {
                    success: false,
                    error: `ERROR CRÍTICO: Las credenciales de base de datos no están configuradas en Vercel. (URL: ${!isUrlMissing}, Key: ${!isKeyMissing}). Contacta con soporte.`
                };
            }

            if (err.message === 'AUTH_TIMEOUT') {
                return { success: false, error: 'La conexión ha excedido el tiempo límite. Tu internet podría estar bloqueando el servidor de base de datos. Dale a "Reparar" abajo.' };
            }
            return { success: false, error: 'Error al iniciar sesión. Verifica credenciales y conexión.' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const result = await withAuthTimeout<any>(supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            }), 10000);
            if (result.error) return { success: false, error: result.error.message };
            return { success: true };
        } catch (err: any) {
            console.error('[AuthContext] Registration failed or timed out:', err);
            return { success: false, error: 'Error al registrar. Revisa tu conexión.' };
        } finally {
            setIsLoading(false);
        }
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

    // If we are on the login page, we MUST show it even if we are still checking session
    // This prevented the lockout the user experienced
    if (isLoading && !pathname.startsWith('/login')) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                color: 'white',
                zIndex: 10000,
                position: 'fixed'
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
