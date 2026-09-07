import { createClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' ? import.meta.env : (process?.env || {});
const supabaseUrl = env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id'));

// Provide safe fallback client instance so initialization doesn't throw if env variables are empty during development
const fallbackUrl = supabaseUrl || 'https://placeholder.supabase.co';
const fallbackKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(fallbackUrl, fallbackKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
