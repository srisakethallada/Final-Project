import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface UserProfileRecord {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export const authService = {
  isConfigured: () => isSupabaseConfigured,

  // 1. Sign In with Email & Password
  async signInWithEmail(email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase Auth environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured yet.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // 2. Sign Up with Email & Password
  async signUpWithEmail(fullName: string, email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase Auth environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured yet.');
    }
    const originUrl = window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${originUrl}/auth/callback`,
        data: {
          full_name: fullName
        }
      }
    });
    if (error) throw error;

    // Create profile record if user was created
    if (data.user) {
      await this.createOrUpdateProfile({
        id: data.user.id,
        user_id: data.user.id,
        full_name: fullName,
        email: email,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
        onboarding_completed: false
      });
    }

    return data;
  },

  // 3. OAuth Login (Google, GitHub, LinkedIn)
  async signInWithOAuth(provider: 'google' | 'github' | 'linkedin_oidc' | 'linkedin') {
    if (!isSupabaseConfigured) {
      throw new Error(`Provider "${provider}" is not configured yet. Please set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY and configure OAuth in Supabase Dashboard.`);
    }

    const originUrl = window.location.origin;
    const targetProvider = provider === 'linkedin' ? 'linkedin_oidc' : provider;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: targetProvider as any,
      options: {
        redirectTo: `${originUrl}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  },

  // 4. Sign Out
  async signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 5. Send Password Reset Email
  async sendPasswordResetEmail(email: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase Auth environment variables are not configured yet.');
    }
    const originUrl = window.location.origin;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${originUrl}/auth/reset-password`
    });
    if (error) throw error;
    return data;
  },

  // 6. Update Password (from Reset Password Session)
  async updatePassword(newPassword: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase Auth environment variables are not configured yet.');
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  },

  // 7. Resend Email Verification
  async resendVerificationEmail(email: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase Auth environment variables are not configured yet.');
    }
    const originUrl = window.location.origin;
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${originUrl}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  },

  // 8. Fetch User Profile
  async getUserProfile(userId: string): Promise<UserProfileRecord | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Profile fetch note:', error.message);
      }
      return data as UserProfileRecord || null;
    } catch {
      return null;
    }
  },

  // 9. Create or Update Profile
  async createOrUpdateProfile(profile: Partial<UserProfileRecord>): Promise<UserProfileRecord | null> {
    if (!isSupabaseConfigured || !profile.user_id) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.user_id,
          user_id: profile.user_id,
          full_name: profile.full_name || 'AI Career OS User',
          email: profile.email || '',
          avatar_url: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.full_name || 'User')}`,
          onboarding_completed: profile.onboarding_completed ?? false,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.warn('Profile upsert note:', error.message);
      }
      return data as UserProfileRecord || null;
    } catch {
      return null;
    }
  }
};
