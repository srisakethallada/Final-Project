import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero3DScene } from '../../components/landing/Hero3DScene';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Search,
  CheckCircle2,
  BrainCircuit,
  Briefcase,
  Mail,
  Building2,
  Video,
  Award,
  ChevronRight,
  Zap,
  ShieldCheck,
  BarChart3,
  Bot
} from 'lucide-react';
import { Button, Badge, Card, AgentBadge } from '../../components/ui';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* 1. PUBLIC NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-bold text-xl font-outfit">
              AI
            </div>
            <div>
              <span className="font-extrabold text-xl font-outfit text-slate-900 tracking-tight">
                AI Career <span className="text-brand-600">OS</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-mono font-medium tracking-wide">
                MULTI-AGENT OPERATING SYSTEM
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#workflow" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#agents" className="hover:text-brand-600 transition-colors">Agent Pipeline</a>
            <a href="#capabilities" className="hover:text-brand-600 transition-colors">Capabilities</a>
            <a href="#journey" className="hover:text-brand-600 transition-colors">Journey</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Badge variant="brand" className="mb-4 px-3 py-1 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Integrated Multi-Agent Career Assistant Platform
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-outfit leading-tight tracking-tight mb-6">
              Your Entire Career Journey Powered by <span className="text-gradient">Specialized AI Agents</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8">
              From resume analysis and job matching to ATS optimization, cover letters, email interview detection, mock practice, and career coaching — in one connected workflow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => navigate('/onboarding')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Upload Resume & Start
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/app/dashboard')}
                leftIcon={<Briefcase className="w-5 h-5 text-brand-600" />}
              >
                Explore Live Demo
              </Button>
            </div>
          </div>

          {/* HERO SHOWCASE CARD */}
          <div className="relative rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-md shadow-2xl overflow-hidden my-6">
            <Hero3DScene />
          </div>
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 mb-4">
              Not a Collection of Random AI Tools. <br />
              <span className="text-brand-600">One Connected Operating System.</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Traditional job tools make you copy-paste your resume into dozens of separate sites. AI Career OS preserves context automatically from your first resume upload to your final interview feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Strict Context Preservation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The same selected job, resume version, company research, and application record remain connected across every single agent step.
              </p>
            </Card>

            <Card className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Zero Resume Fabrication</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our ATS optimization guardrails ensure that no fake experience, qualifications, or fake projects are ever invented on your behalf.
              </p>
            </Card>

            <Card className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Human-in-the-Loop Control</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Consequential actions like generating tailored resumes, applying to positions, or connecting email access require explicit user confirmation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4 & 5. WORKFLOW & 12-AGENT VISUALIZATION */}
      <section id="workflow" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="brand" className="mb-3">Architectural Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 mb-4">
              The 12-Agent Career Pipeline
            </h2>
            <p className="text-slate-600">
              Each specialized agent performs a dedicated task in sequence, feeding verified data into the shared profile data layer.
            </p>
          </div>

          {/* Connected Agent Pipeline Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: 'AG-001', name: 'Resume Analysis', desc: 'Parses PDF/DOCX into structured user profile schema.', icon: <FileText /> },
              { code: 'AG-002', name: 'Job Search', desc: 'Discovers candidate jobs matching profile & salary preferences.', icon: <Search /> },
              { code: 'AG-003', name: 'JD Analysis', desc: 'Computes Match Score % & identifies critical skill gaps.', icon: <BarChart3 /> },
              { code: 'AG-004', name: 'Resume Optimization', desc: 'Generates truthful ATS-tailored resume upon user approval.', icon: <Sparkles /> },
              { code: 'AG-005', name: 'Cover Letter', desc: 'Drafts role-specific cover letter linked to tailored resume.', icon: <FileText /> },
              { code: 'AG-006', name: 'Application Mgmt', desc: 'Records application tying job, resume version & cover letter.', icon: <Briefcase /> },
              { code: 'AG-007', name: 'Application Tracking', desc: 'Maintains status history timeline (Applied -> Interview -> Offer).', icon: <CheckCircle2 /> },
              { code: 'AG-008', name: 'Notifications', desc: 'Delivers in-app & email notifications for critical alerts.', icon: <Mail /> },
              { code: 'AG-009', name: 'Interview Detection', desc: 'Scans authorized inbox for interview invitations.', icon: <Mail /> },
              { code: 'AG-010', name: 'Company Research', desc: 'Compiles company culture, news, and interview guidance.', icon: <Building2 /> },
              { code: 'AG-011', name: 'Interview Prep', desc: 'Generates role & company-specific technical prep material.', icon: <Video /> },
              { code: 'AG-012', name: 'Mock Interview & Coach', desc: 'Multi-turn practice session + Readiness Score & Learning Roadmap.', icon: <Award /> }
            ].map((agent, i) => (
              <Card key={i} className="p-5 flex flex-col justify-between border-slate-200/80 hover:border-brand-300">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <AgentBadge code={agent.code} name={agent.name} />
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-sm">
                      {agent.icon}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{agent.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Step {i + 1} of 12</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. KEY CAPABILITIES */}
      <section id="capabilities" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 mb-4">
              Everything You Need to Land Your Target Role
            </h2>
            <p className="text-slate-600">
              Designed from the ground up for modern job seekers, students, and early-career software professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                01
              </div>
              <div>
                <h4 className="font-bold text-lg font-outfit text-slate-900 mb-1">Resume Analysis & Parser</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload PDF, DOCX, or images. AG-001 extracts structured skills, work history, and identifies resume gaps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                02
              </div>
              <div>
                <h4 className="font-bold text-lg font-outfit text-slate-900 mb-1">Job Search & Match Score</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  AG-002 and AG-003 analyze candidate jobs against your profile, computing objective match scores and skill gaps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                03
              </div>
              <div>
                <h4 className="font-bold text-lg font-outfit text-slate-900 mb-1">ATS-Tailored Resume & Cover Letter</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generate tailored, ATS-friendly resumes and matching cover letters for specific jobs with 1-click downloads.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                04
              </div>
              <div>
                <h4 className="font-bold text-lg font-outfit text-slate-900 mb-1">Interview Detection Pipeline</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Read-only email scan automatically detects interview invitations and auto-triggers company research & preparation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                05
              </div>
              <div>
                <h4 className="font-bold text-lg font-outfit text-slate-900 mb-1">Interactive Mock Interviews</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Practice turn-by-turn interviews tailored to your target company and job description with real-time feedback.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                06
              </div>
              <div>
                <h4 className="font-bold text-lg font-outfit text-slate-900 mb-1">Readiness Score & Roadmap</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Receive a quantitative Readiness Score % and a personalized Learning Roadmap with prioritized action items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LIGHT PREMIUM CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-blue-50/90 border-y border-indigo-100/80 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <Badge variant="brand" className="mb-4 bg-white/80 text-brand-700 border-brand-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Portfolio-Ready Reference Architecture
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-outfit text-slate-900 mb-6 leading-tight">
            Ready to Experience the Multi-Agent Career Assistant?
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
            Take the guided tour through resume upload, job analysis, ATS optimization, interview preparation, and mock interview coaching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/signup">
              <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Launch Application
              </Button>
            </Link>
            <Link to="/app/dashboard">
              <Button variant="outline" size="lg" className="bg-white">
                View Command Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-white text-slate-600 py-12 border-t border-slate-200 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm font-outfit">
              AI
            </div>
            <span className="font-bold text-slate-900 font-outfit">AI Career Operating System</span>
          </div>
          <p className="text-xs text-slate-500">
            Final-Year B.Tech Computer Science Engineering Project • Batch 2023–2027 • Primary Source of Truth: SRS v1.0
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link to="/auth/signin" className="hover:text-brand-600">Sign In</Link>
            <Link to="/app/dashboard" className="hover:text-brand-600">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
