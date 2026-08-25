import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { Sparkles, Mail, Lock, User as UserIcon, Github, Linkedin, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

// ============================================================================
// SIGN IN PAGE
// ============================================================================
export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useWorkflow();
  const [email, setEmail] = useState('saketh@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      navigate('/app/dashboard');
    }, 700);
  };

  const handleOAuthSignIn = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/app/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center font-outfit shadow-md shadow-brand-500/20">
              AI
            </div>
            <span className="font-bold text-2xl font-outfit text-slate-900">AI Career <span className="text-brand-600">OS</span></span>
          </Link>
          <h2 className="text-2xl font-bold font-outfit text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Access your multi-agent career workspace.</p>
        </div>

        <Card className="p-8 shadow-xl border-slate-200">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                <Link to="/auth/forgot-password" className="text-xs text-brand-600 font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full mt-2" isLoading={isLoading}>
              Sign In with Email
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOAuthSignIn('Google')}
              className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
            >
              Google
            </button>
            <button
              onClick={() => handleOAuthSignIn('LinkedIn')}
              className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
            </button>
            <button
              onClick={() => handleOAuthSignIn('GitHub')}
              className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 gap-1.5"
            >
              <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account? <Link to="/auth/signup" className="text-brand-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// SIGN UP PAGE
// ============================================================================
export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center font-outfit shadow-md shadow-brand-500/20">
              AI
            </div>
            <span className="font-bold text-2xl font-outfit text-slate-900">AI Career <span className="text-brand-600">OS</span></span>
          </Link>
          <h2 className="text-2xl font-bold font-outfit text-slate-900">Create your account</h2>
          <p className="text-sm text-slate-500 mt-1">Start your context-preserving multi-agent career journey.</p>
        </div>

        <Card className="p-8 shadow-xl border-slate-200">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Sri Saketh"
                  className="pl-10"
                  required
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="pl-10"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full mt-2" isLoading={isLoading}>
              Create Account & Onboard
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account? <Link to="/auth/signin" className="text-brand-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// FORGOT PASSWORD PAGE
// ============================================================================
export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center font-outfit shadow-md shadow-brand-500/20">
              AI
            </div>
            <span className="font-bold text-2xl font-outfit text-slate-900">AI Career <span className="text-brand-600">OS</span></span>
          </Link>
          <h2 className="text-2xl font-bold font-outfit text-slate-900">Reset your password</h2>
        </div>

        <Card className="p-8 shadow-xl border-slate-200">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-outfit text-slate-900 mb-2">Check your inbox</h3>
              <p className="text-xs text-slate-600 mb-6">
                If an account exists for <span className="font-semibold text-slate-800">{email}</span>, we have sent password reset instructions.
              </p>
              <Link to="/auth/signin">
                <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 mb-4">
                Enter your email address and we'll send you a password reset link.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <Button type="submit" variant="gradient" className="w-full" isLoading={isLoading}>
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link to="/auth/signin" className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
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
