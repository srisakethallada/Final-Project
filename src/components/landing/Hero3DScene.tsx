import React from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Award,
  ShieldCheck,
  Zap,
  TrendingUp,
  Building2,
  Bot
} from 'lucide-react';
import { Badge, AgentBadge } from '../ui';

export const Hero3DScene: React.FC = () => {
  return (
    <div className="w-full min-h-[500px] lg:min-h-[560px] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/60 selection:bg-brand-500 selection:text-white">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-brand-400/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[240px] h-[240px] bg-purple-400/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Header Row within Hero Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 pb-6 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base font-outfit text-slate-900">AI Career Operating System</h3>
              <Badge variant="brand" size="sm">Pipeline Active</Badge>
            </div>
            <p className="text-xs text-slate-500">Connected Multi-Agent Context • User: Sri Saketh</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AgentBadge code="AG-001..AG-012" name="12 Agents Live" />
        </div>
      </div>

      {/* Hero Showcase Floating Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-8 relative z-10">
        {/* Card 1: ATS-Tailored Resume (NO percentage!) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md shadow-slate-200/50 hover:shadow-lg hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </span>
              <Badge variant="brand" size="sm">ATS Ready</Badge>
            </div>
            <h4 className="font-bold text-sm font-outfit text-slate-900 mb-1">ATS-Tailored Resume</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Optimized keyword placement for Frontend Software Engineer. Zero fabricated skills.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>AG-004 Optimized</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        {/* Card 2: Job Match Analysis (88% Match Score) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md shadow-slate-200/50 hover:shadow-lg hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs font-outfit border border-emerald-200">
                88% Match
              </span>
            </div>
            <h4 className="font-bold text-sm font-outfit text-slate-900 mb-1">Job Match Analysis</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Anthropic • AI Applications. Matched 9 core technical skills; 2 gap areas identified.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>AG-003 Analyzed</span>
            <span className="text-emerald-600 font-bold">High Fit</span>
          </div>
        </div>

        {/* Card 3: Cover Letter AG-005 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md shadow-slate-200/50 hover:shadow-lg hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </span>
              <Badge variant="purple" size="sm">AG-005 Linked</Badge>
            </div>
            <h4 className="font-bold text-sm font-outfit text-slate-900 mb-1">Custom Cover Letter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Role-specific draft linked to tailored resume and user project achievements.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Ready for Application</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
          </div>
        </div>

        {/* Card 4: Interview Readiness (87% Readiness Score) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md shadow-slate-200/50 hover:shadow-lg hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs font-outfit border border-emerald-200">
                87% Readiness
              </span>
            </div>
            <h4 className="font-bold text-sm font-outfit text-slate-900 mb-1">Interview Readiness</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              AG-012 turn-by-turn mock score with personalized learning roadmap action items.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>AG-012 Evaluated</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar within Card */}
      <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 relative z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span className="font-semibold text-slate-800">Context Preserved End-to-End</span>
          <span className="text-slate-400">• Resume → Job → Application → Interview → Coach</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Zero Re-Entry Required</span>
        </div>
      </div>
    </div>
  );
};
