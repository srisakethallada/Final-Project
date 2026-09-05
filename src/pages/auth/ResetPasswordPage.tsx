import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { Lock, Cpu, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      await updatePassword(password);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password. Session may have expired.');
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
          <h2 className="text-2xl font-bold font-sans text-white">Set new password</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">Update your password securely.</p>
        </div>

        <Card className="p-8 bg-[#1A1A1A] border-white/12 shadow-2xl">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#111111] text-emerald-400 border border-emerald-800/50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Password Updated</h3>
              <p className="text-xs text-neutral-400">
                Your password has been changed successfully. You can now sign in with your new credentials.
              </p>
              <Link to="/auth/signin">
                <Button variant="whitePill" size="md" className="w-full mt-2">
                  Continue to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-[#111111] border border-rose-800/50 flex items-center gap-2.5 text-xs text-rose-300 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="pl-10"
                    autoComplete="new-password"
                    required
                  />
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="pl-10"
                    autoComplete="new-password"
                    required
                  />
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <Button type="submit" variant="whitePill" className="w-full mt-2 py-3 font-semibold" isLoading={isLoading}>
                Update Password
              </Button>

              <div className="text-center pt-2">
                <Link to="/auth/signin" className="text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
