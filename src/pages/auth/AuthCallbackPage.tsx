import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { authService } from '../../services/authService';
import { LoadingSpinner, Card, Button } from '../../components/ui';
import { AlertCircle } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const profile = await authService.getUserProfile(session.user.id);
          if (!profile) {
            await authService.createOrUpdateProfile({
              id: session.user.id,
              user_id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'AI Career OS User',
              email: session.user.email || '',
              avatar_url: session.user.user_metadata?.avatar_url,
              onboarding_completed: false
            });
            navigate('/onboarding', { replace: true });
          } else if (profile.onboarding_completed) {
            navigate('/app/dashboard', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        } else {
          // If session is missing after callback delay
          setTimeout(() => {
            navigate('/auth/signin', { replace: true });
          }, 1500);
        }
      } catch (err: any) {
        console.error('OAuth Callback Error:', err);
        setErrorMessage(err.message || 'OAuth authentication was cancelled or failed.');
      }
    }

    handleAuthCallback();
  }, [navigate]);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-[#1A1A1A] border-white/12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#111111] text-rose-400 border border-rose-800/50 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Authentication Callback Error</h3>
          <p className="text-xs text-neutral-400">{errorMessage}</p>
          <Button variant="whitePill" size="md" className="w-full" onClick={() => navigate('/auth/signin')}>
            Return to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <LoadingSpinner label="Completing authentication session..." />
    </div>
  );
};
