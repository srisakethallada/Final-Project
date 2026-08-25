import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 focus:ring-brand-500 active:scale-[0.98]',
    gradient: 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-lg shadow-brand-500/25 focus:ring-brand-500 active:scale-[0.98]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400',
    outline: 'border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 text-slate-700 focus:ring-brand-500',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md shadow-red-500/20'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

// ============================================================================
// CARD COMPONENT
// ============================================================================
export const Card: React.FC<{ children: React.ReactNode; className?: string; hoverable?: boolean; onClick?: () => void }> = ({
  children,
  className,
  hoverable = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm transition-all duration-200',
        hoverable && 'hover:shadow-md hover:border-brand-300 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================================================
// BADGE COMPONENT
// ============================================================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  className
}) => {
  const variants = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium border',
    md: 'text-xs px-2.5 py-1 rounded-lg font-semibold border'
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

// ============================================================================
// AGENT BADGE COMPONENT (SRS Requirement for visual agent identity)
// ============================================================================
export const AgentBadge: React.FC<{ code: string; name: string }> = ({ code, name }) => {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
      <span className="font-bold">{code}</span>
      <span className="text-indigo-400">|</span>
      <span className="font-sans font-medium text-slate-600">{name}</span>
    </span>
  );
};

// ============================================================================
// MATCH SCORE BADGE COMPONENT
// ============================================================================
export const MatchScoreBadge: React.FC<{ score: number; label?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  score,
  label = 'Match Score',
  size = 'md'
}) => {
  let colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score < 75) colorClass = 'text-amber-600 bg-amber-50 border-amber-200';
  if (score < 60) colorClass = 'text-rose-600 bg-rose-50 border-rose-200';

  if (size === 'sm') {
    return (
      <span className={cn('font-bold text-xs px-2 py-0.5 rounded-md border inline-flex items-center gap-1', colorClass)}>
        <span>{score}%</span> {label}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={cn('flex flex-col items-center justify-center p-4 rounded-2xl border bg-white shadow-sm', colorClass)}>
        <span className="text-3xl font-extrabold font-outfit">{score}%</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{label}</span>
      </div>
    );
  }

  return (
    <div className={cn('px-3 py-1.5 rounded-xl border flex items-center gap-2 font-semibold text-sm', colorClass)}>
      <span className="text-base font-bold font-outfit">{score}%</span>
      <span className="text-xs text-slate-600 font-medium">{label}</span>
    </div>
  );
};

// ============================================================================
// PROGRESS BAR COMPONENT
// ============================================================================
export const Progress: React.FC<{ value: number; max?: number; className?: string; color?: string }> = ({
  value,
  max = 100,
  className,
  color = 'bg-brand-600'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full bg-slate-100 rounded-full h-2.5 overflow-hidden', className)}>
      <div
        className={cn('h-full transition-all duration-500 ease-out rounded-full', color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// ============================================================================
// MODAL / DIALOG COMPONENT
// ============================================================================
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  const widthMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={cn('w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]', widthMap[maxWidth])}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 font-outfit">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================
export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-sm">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-1 font-outfit">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};

// ============================================================================
// INPUT COMPONENT
// ============================================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: React.FC<InputProps> = ({ className, error, ...props }) => {
  return (
    <div className="w-full">
      <input
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-sans text-slate-800 placeholder:text-slate-400',
          error && 'border-rose-400 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
    </div>
  );
};

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================
export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Processing with AI Agent...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-brand-600 animate-ping"></div>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-700 font-outfit">{label}</p>
      <p className="text-xs text-slate-400 mt-1">Preserving workflow context and data lineage</p>
    </div>
  );
};
