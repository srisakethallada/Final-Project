import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { AIAssistantDrawer } from './AIAssistantDrawer';
import {
  LayoutDashboard,
  Bot,
  FileText,
  Search,
  Briefcase,
  Video,
  Award,
  Bell,
  User as UserIcon,
  Settings as SettingsIcon,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Badge, AgentBadge } from '../ui';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, notifications, selectedJob, activeInterview, emailEvent } = useWorkflow();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'AI Assistant', path: '/app/assistant', icon: <Bot className="w-4 h-4" />, badge: 'Context' },
    { label: 'Resume & Analysis', path: '/app/resume', icon: <FileText className="w-4 h-4" /> },
    { label: 'Job Search', path: '/app/jobs', icon: <Search className="w-4 h-4" /> },
    { label: 'Applications', path: '/app/applications', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Interviews & Prep', path: '/app/interviews', icon: <Video className="w-4 h-4" /> },
    { label: 'Career Coach', path: '/app/career-coach', icon: <Award className="w-4 h-4" /> },
    { label: 'Notifications', path: '/app/notifications', icon: <Bell className="w-4 h-4" />, count: unreadCount },
    { label: 'Profile', path: '/app/profile', icon: <UserIcon className="w-4 h-4" /> },
    { label: 'Settings', path: '/app/settings', icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center font-outfit shadow-md shadow-brand-500/20">
              AI
            </div>
            <div>
              <span className="font-extrabold text-lg font-outfit text-slate-900 leading-none block">
                AI Career <span className="text-brand-600">OS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">v1.0 • SRS Verified</span>
            </div>
          </div>
        </div>

        {/* Active Context Banner */}
        {selectedJob && (
          <div className="px-4 py-3 bg-brand-50/60 border-b border-brand-100/80 text-xs">
            <div className="flex items-center justify-between text-brand-800 font-semibold mb-0.5">
              <span>Active Job Context:</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="font-bold text-slate-900 truncate">{selectedJob.company}</p>
            <p className="text-[11px] text-slate-500 truncate">{selectedJob.title}</p>
          </div>
        )}

        {/* Main Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {item.count}
                </span>
              ) : item.badge ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 font-medium">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Trigger Assistant */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => setAssistantOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-4 h-4" /> AI Assistant Drawer
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 font-outfit truncate w-28">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate w-28">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-base flex items-center justify-center font-outfit">
            AI
          </div>
          <span className="font-bold text-base font-outfit text-slate-900">AI Career OS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAssistantOpen(true)}
            className="p-2 rounded-lg bg-brand-50 text-brand-600 text-xs font-bold flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" /> AI
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-slate-900 font-outfit">Menu Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <nav className="py-4 space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* AI ASSISTANT CONTEXT DRAWER */}
      <AIAssistantDrawer isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
};
