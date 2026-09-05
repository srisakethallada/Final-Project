import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { useAuth } from '../../context/AuthContext';
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
  Menu,
  X,
  LogOut,
  Cpu
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, notifications, selectedJob } = useWorkflow();
  const { signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
    <div className="min-h-screen bg-black flex flex-col md:flex-row text-white selection:bg-white selection:text-black">
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0A] border-r border-white/12 sticky top-0 h-screen z-30 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/12 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
            <div className="w-9 h-9 rounded-full bg-white text-black font-bold text-lg flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-extrabold text-base font-sans text-white leading-none block">
                AI Career <span className="text-neutral-400">OS</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">v1.0 • SRS Verified</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white border border-white/15 shadow-sm'
                    : 'text-[#8E8E8E] hover:bg-[#181818] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>

              {item.count ? (
                <span className="w-5 h-5 rounded-full bg-white text-black font-bold text-[10px] flex items-center justify-center">
                  {item.count}
                </span>
              ) : item.badge ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#28282A] text-neutral-300 font-medium border border-white/10">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Trigger Assistant */}
        <div className="p-4 border-t border-white/12 space-y-2">
          <button
            onClick={() => setAssistantOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-full bg-white text-black text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-neutral-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-black" /> AI Assistant Drawer
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate w-28">{user.name}</p>
                <p className="text-[10px] text-neutral-400 truncate w-28">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-[#0A0A0A] border-b border-white/12 px-4 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
          <div className="w-8 h-8 rounded-full bg-white text-black font-bold text-base flex items-center justify-center">
            <Cpu className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-base font-sans text-white">AI Career OS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAssistantOpen(true)}
            className="p-2 rounded-full bg-white text-black text-xs font-bold flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" /> AI
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-neutral-300 hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex">
          <div className="w-4/5 max-w-xs bg-[#0A0A0A] border-r border-white/12 h-full p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/12">
                <span className="font-bold text-white font-sans">Navigation Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-neutral-400" /></button>
              </div>
              <nav className="py-4 space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#8E8E8E] hover:bg-[#181818] hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/12 flex items-center justify-between">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-xs text-rose-400 font-semibold"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-black">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* AI ASSISTANT CONTEXT DRAWER */}
      <AIAssistantDrawer isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
};
