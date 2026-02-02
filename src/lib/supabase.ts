import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
        console.warn('[Supabase] Warning: Missing environment variables during build time.');
    } else {
        console.error('[Supabase] CRITICAL: Missing environment variables in client-side.');
    }
}

// Inicializar con valores vacíos si faltan para evitar crashes en el build, 
// las llamadas fallarán en runtime pero el despliegue se completará.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);
