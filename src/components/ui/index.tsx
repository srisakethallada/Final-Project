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
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'darkPill' | 'whitePill';
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
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-white text-black hover:bg-neutral-100 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 active:scale-[0.98]',
    whitePill: 'bg-white text-black hover:bg-neutral-100 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 active:scale-[0.98]',
    gradient: 'bg-white text-black hover:bg-neutral-100 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 active:scale-[0.98]',
    darkPill: 'bg-[#28282A] text-[#C8C8C8] hover:bg-[#323234] hover:text-white border border-white/12 hover:-translate-y-0.5 active:scale-[0.98]',
    secondary: 'bg-[#28282A] text-[#C8C8C8] hover:bg-[#323234] hover:text-white border border-white/12 hover:-translate-y-0.5 active:scale-[0.98]',
    outline: 'bg-[#111111] border border-white/12 hover:border-white/20 hover:bg-[#181818] text-white active:scale-[0.98]',
    ghost: 'hover:bg-white/10 text-neutral-400 hover:text-white',
    danger: 'bg-[#1A1A1A] border border-rose-800/50 text-rose-300 hover:bg-rose-950/60'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5'
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
        'bg-[#1A1A1A] rounded-2xl border border-white/12 p-6 transition-all duration-200 text-white',
        hoverable && 'hover:border-white/25 hover:-translate-y-0.5 cursor-pointer',
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
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'purple' | 'dark' | 'info';
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
    brand: 'bg-[#28282A] text-[#C8C8C8] border-white/12',
    dark: 'bg-[#28282A] text-[#C8C8C8] border-white/12',
    success: 'bg-emerald-950/70 text-[#B8F5D0] border-emerald-800/40',
    warning: 'bg-amber-950/70 text-[#FFE7A3] border-amber-800/40',
    danger: 'bg-rose-950/70 text-[#FFB3B3] border-rose-800/40',
    slate: 'bg-white/10 text-neutral-300 border-white/12',
    purple: 'bg-neutral-900 text-neutral-300 border-white/12',
    info: 'bg-blue-950/70 text-[#C9D7FF] border-blue-800/40'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium border',
    md: 'text-xs px-3 py-1 rounded-full font-semibold border'
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

// ============================================================================
// AGENT BADGE COMPONENT
// ============================================================================
export const AgentBadge: React.FC<{ code: string; name: string }> = ({ code, name }) => {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-white border border-white/15">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span className="font-bold text-white">{code}</span>
      <span className="text-neutral-500">|</span>
      <span className="font-sans font-medium text-neutral-300">{name}</span>
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
  let indicatorColor = 'bg-emerald-400';
  if (score < 75) indicatorColor = 'bg-amber-400';
  if (score < 60) indicatorColor = 'bg-rose-400';

  if (size === 'sm') {
    return (
      <span className="font-bold text-xs px-2.5 py-1 rounded-lg border border-white/15 bg-[#111111] text-white inline-flex items-center gap-1.5">
        <span className={cn('w-1.5 h-1.5 rounded-full', indicatorColor)}></span>
        <span className="font-mono">{score}%</span> {label}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/12 bg-[#1A1A1A] text-white">
        <div className="flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 rounded-full', indicatorColor)}></span>
          <span className="text-4xl font-extrabold font-display text-white">{score}%</span>
        </div>
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-1">{label}</span>
      </div>
    );
  }

  return (
    <div className="px-3.5 py-1.5 rounded-xl border border-white/12 bg-[#111111] text-white flex items-center gap-2 font-semibold text-sm">
      <span className={cn('w-2 h-2 rounded-full', indicatorColor)}></span>
      <span className="text-base font-bold font-display text-white">{score}%</span>
      <span className="text-xs font-medium text-neutral-400">{label}</span>
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
  color = 'bg-white'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full bg-[#111111] rounded-full h-2.5 overflow-hidden border border-white/12', className)}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={cn('w-full bg-[#181818] rounded-3xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh] text-white shadow-2xl', widthMap[maxWidth])}>
        <div className="px-6 py-4 border-b border-white/12 flex items-center justify-between bg-[#111111]">
          <h3 className="text-lg font-bold text-white font-sans">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
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
    <div className="flex flex-col items-center justify-center text-center p-12 bg-[#1A1A1A] rounded-3xl border border-dashed border-white/15">
      <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4 border border-white/10">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">{description}</p>
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
          'w-full px-4 py-2.5 rounded-xl border border-white/15 text-xs bg-[#111111] text-white focus:outline-none focus:border-white/35 transition-all font-sans placeholder:text-neutral-500',
          error && 'border-rose-500 focus:border-rose-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
};

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================
export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Processing with AI Agent...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-white">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-white animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white animate-ping"></div>
        </div>
      </div>
      <p className="text-sm font-semibold text-white font-sans">{label}</p>
      <p className="text-xs text-neutral-400 mt-1">Preserving workflow context and data lineage</p>
    </div>
  );
};
