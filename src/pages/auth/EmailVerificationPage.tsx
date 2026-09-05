import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Card } from '../../components/ui';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EmailVerificationPage: React.FC = () => {
  const location = useLocation();
  const { resendVerificationEmail } = useAuth();
  const email = (location.state as any)?.email || 'your email';

  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email || email === 'your email') return;
    setIsLoading(true);
    setResendStatus(null);
    try {
      await resendVerificationEmail(email);
      setResendStatus('Verification link resent to your email!');
    } catch (err: any) {
      setResendStatus(err.message || 'Failed to resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-white selection:text-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white text-black font-bold text-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-2xl font-sans text-white">AI Career <span className="text-neutral-400">OS</span></span>
          </Link>
          <h2 className="text-2xl font-bold font-sans text-white">Check your email</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">We sent a verification link to your inbox.</p>
        </div>

        <Card className="p-8 bg-[#1A1A1A] border-white/12 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#111111] text-white border border-white/15 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-neutral-300">
              A confirmation email has been dispatched to <span className="font-bold text-white">{email}</span>.
            </p>
            <p className="text-xs text-neutral-400">
              Please click the link inside the email to verify your account and activate your multi-agent workspace.
            </p>
          </div>

          {resendStatus && (
            <div className="p-3 rounded-xl bg-[#111111] border border-white/12 text-xs text-white">
              {resendStatus}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <Button
              variant="darkPill"
              size="md"
              className="w-full text-xs font-semibold py-2.5"
              onClick={handleResend}
              isLoading={isLoading}
            >
              Resend Verification Email
            </Button>

            <Link to="/auth/signin">
              <Button variant="ghost" size="sm" className="w-full text-xs text-neutral-400 hover:text-white" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
