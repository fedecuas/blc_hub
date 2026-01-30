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
                // Increase startup timeout to 20s to prevent premature logout on slow networks
                const sessionRes = await withAuthTimeout<any>(supabase.auth.getSession(), 20000);
                const session = sessionRes?.data?.session;

                if (session?.user) {
                    console.log('[AuthContext] Session found, fetching profile...');
                    try {
                        const result = await withAuthTimeout<any>(
                            supabase
                                .from('profiles')
                                .select('*')
                                .eq('id', session.user.id)
                                .maybeSingle() as any,
                            4000
                        );
                        const profile = result?.data;

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
            } catch (err: any) {
                console.error('[AuthContext] Session check failed or timed out:', err);

                // PERMANENT FIX: If the session check hangs or fails repeatedly, 
                // it's likely corrupted local storage. We clear it to allow a fresh start.
                if (err.message === 'AUTH_TIMEOUT') {
                    console.warn('[AuthContext] Session check timed out. User might need to re-login if network is extremely slow.');
                }
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
        try {
            console.log('[AuthContext] Attempting login for:', email);
            console.log('[AuthContext] Timeout guard set to 90 seconds...');

            const result = await withAuthTimeout<any>(supabase.auth.signInWithPassword({ email, password }), 90000);

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
                return { success: false, error: 'La conexión con el servidor es lenta. Por favor verifica tu internet o intenta de nuevo.' };
            }
            return { success: false, error: 'Ocurrió un error inesperado al iniciar sesión.' };
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
