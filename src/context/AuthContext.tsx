import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { authService, UserProfileRecord } from '../services/authService';

export type AuthStatus = 'IDLE' | 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  userProfile: UserProfileRecord | null;
  authStatus: AuthStatus;
  isConfigured: boolean;
  error: string | null;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (fn: string, e: string, p: string) => Promise<{ needVerification: boolean }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'linkedin') => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileRecord | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('LOADING');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (!isSupabaseConfigured) {
        if (mounted) {
          // Development Fallback: allow mock session or default user state
          setAuthStatus('UNAUTHENTICATED');
        }
        return;
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            const profile = await authService.getUserProfile(initialSession.user.id);
            setUserProfile(profile);
            setAuthStatus('AUTHENTICATED');
          } else {
            setAuthStatus('UNAUTHENTICATED');
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Error fetching auth session');
          setAuthStatus('UNAUTHENTICATED');
        }
      }
    }

    initializeAuth();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const profile = await authService.getUserProfile(currentSession.user.id);
        setUserProfile(profile);
        setAuthStatus('AUTHENTICATED');
      } else {
        setUserProfile(null);
        setAuthStatus('UNAUTHENTICATED');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    setAuthStatus('LOADING');
    try {
      const data = await authService.signInWithEmail(email, password);
      setSession(data.session);
      setUser(data.user);
      if (data.user) {
        const profile = await authService.getUserProfile(data.user.id);
        setUserProfile(profile);
      }
      setAuthStatus('AUTHENTICATED');
    } catch (err: any) {
      setAuthStatus('UNAUTHENTICATED');
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const signUpWithEmail = async (fullName: string, email: string, password: string) => {
    setError(null);
    setAuthStatus('LOADING');
    try {
      const data = await authService.signUpWithEmail(fullName, email, password);
      setSession(data.session);
      setUser(data.user);

      const needVerification = !data.session && Boolean(data.user);
      if (data.user) {
        const profileData: UserProfileRecord = {
          id: data.user.id,
          user_id: data.user.id,
          full_name: fullName,
          email,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
          onboarding_completed: false
        };
        setUserProfile(profileData);
      }

      setAuthStatus(data.session ? 'AUTHENTICATED' : 'UNAUTHENTICATED');
      return { needVerification };
    } catch (err: any) {
      setAuthStatus('UNAUTHENTICATED');
      setError(err.message || 'Failed to create account');
      throw err;
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'linkedin') => {
    setError(null);
    try {
      await authService.signInWithOAuth(provider);
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await authService.signOut();
    } finally {
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setAuthStatus('UNAUTHENTICATED');
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    setError(null);
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  const updatePassword = async (newPassword: string) => {
    setError(null);
    try {
      await authService.updatePassword(newPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      throw err;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setError(null);
    try {
      await authService.resendVerificationEmail(email);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
      throw err;
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    try {
      const updated = await authService.createOrUpdateProfile({
        user_id: user.id,
        onboarding_completed: true
      });
      if (updated) {
        setUserProfile(updated);
      } else {
        setUserProfile(prev => prev ? { ...prev, onboarding_completed: true } : null);
      }
    } catch {
      setUserProfile(prev => prev ? { ...prev, onboarding_completed: true } : null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userProfile,
      authStatus,
      isConfigured: isSupabaseConfigured,
      error,
      signInWithEmail,
      signUpWithEmail,
      signInWithOAuth,
      signOut,
      sendPasswordResetEmail,
      updatePassword,
      resendVerificationEmail,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
