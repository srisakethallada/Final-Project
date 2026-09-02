import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Menu,
  X,
  Cpu,
  Compass,
  ArrowDownRight,
  Layers,
  Activity
} from 'lucide-react';
import { Button, Card, AgentBadge } from '../../components/ui';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      
      {/* ============================================================================ */}
      {/* VIEWPORT 1: SINGLE-VIEWPORT CINEMATIC HERO EXPERIENCE (MotionSites Reference)  */}
      {/* ============================================================================ */}
      <section id="home" className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between items-center bg-black">
        
        {/* Full-Screen Looping Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
        />

        {/* Controlled Dark Overlay for High Legibility */}
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>

        {/* 1. HEADER (CENTERED COMPOSITION) */}
        <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
          
          {/* LEFT: CIRCULAR WHITE LOGO CONTAINER */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-200 group-hover:scale-[1.04]">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="hidden sm:inline font-mono text-xs font-semibold tracking-wider text-neutral-300">
              AI CAREER <span className="text-white font-bold">OS</span>
            </span>
          </Link>

          {/* CENTER: DESKTOP WHITE NAVIGATION PILL */}
          <nav className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.2)] text-xs font-semibold">
            <a href="#home" className="hover:opacity-100 transition-opacity flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              Home
            </a>
            <span className="text-neutral-300">•</span>
            <a href="#workflow" className="opacity-70 hover:opacity-100 transition-opacity">How It Works</a>
            <span className="text-neutral-300">•</span>
            <a href="#agents" className="opacity-70 hover:opacity-100 transition-opacity">Agent Pipeline</a>
            <span className="text-neutral-300">•</span>
            <a href="#capabilities" className="opacity-70 hover:opacity-100 transition-opacity">Capabilities</a>
            <span className="text-neutral-300">•</span>
            <a href="#journey" className="opacity-70 hover:opacity-100 transition-opacity">Journey</a>
          </nav>

          {/* RIGHT: DARK SIGN-IN PILL */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth/signin">
              <button className="bg-[#28282A] text-[#C8C8C8] hover:bg-[#343438] hover:text-white px-5 py-2 rounded-full text-xs font-semibold border border-white/10 transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
                Sign In
              </button>
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON (<= 720px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-[#28282A] border border-white/15 text-white flex items-center justify-center shadow-md"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* MOBILE NAVIGATION MENU OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 space-y-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#28282A] text-white flex items-center justify-center border border-white/15"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col items-center gap-6 text-lg font-medium">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-white font-bold">Home</a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">How It Works</a>
              <a href="#agents" onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">Agent Pipeline</a>
              <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">Capabilities</a>
              <a href="#journey" onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">Journey</a>
            </nav>
            <div className="pt-6 border-t border-white/10 w-full max-w-xs flex flex-col gap-3">
              <Link to="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-[#28282A] text-[#C8C8C8] hover:text-white py-3 rounded-full text-sm font-semibold border border-white/15">
                  Sign In
                </button>
              </Link>
              <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-white text-black py-3 rounded-full text-sm font-semibold shadow-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* 2. HERO CONTENT (VERTICALLY CENTERED IN VIEWPORT) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center my-auto flex flex-col items-center justify-center space-y-6">
          
          {/* TRUST / STATUS ROW */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-neutral-300">
            <div className="flex items-center -space-x-1">
              <span className="w-5 h-5 rounded-full bg-white/20 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-white/30">AI</span>
              <span className="w-5 h-5 rounded-full bg-white/30 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-white/30">12</span>
              <span className="w-5 h-5 rounded-full bg-white/40 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-white/30">OS</span>
            </div>
            <span className="font-mono text-[11px] font-medium tracking-wide text-neutral-200">
              12 Specialized AI Agents • One Connected Career Workflow
            </span>
          </div>

          {/* LARGE RETRO DOT-MATRIX HEADLINE (2 EXACT LINES, SOLID WHITE) */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tight leading-none uppercase text-center select-none drop-shadow-2xl">
            Career Intelligence<br />
            Designed To Evolve
          </h1>

          {/* HERO SUBHEAD */}
          <p className="text-sm sm:text-base lg:text-lg text-[#C8C8C8] max-w-2xl mx-auto leading-relaxed font-normal">
            One connected AI career system that analyzes your resume, finds relevant jobs, optimizes applications, detects interviews, and prepares you to succeed.
          </p>

          {/* PRIMARY & SECONDARY CTA PILLS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="whitePill"
              size="lg"
              onClick={() => navigate('/onboarding')}
              rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
              className="px-8 py-3.5 text-sm font-semibold"
            >
              Get Started
            </Button>

            <a href="#workflow">
              <Button
                variant="darkPill"
                size="lg"
                className="px-6 py-3.5 text-sm font-semibold"
              >
                Explore Workflow
              </Button>
            </a>
          </div>
        </div>

        {/* 3. BOTTOM STATISTICS FOOTER (RETRO METRICS) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-6 sm:pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold">12</div>
              <div className="text-[11px] font-mono text-[#8E8E8E] uppercase tracking-wider mt-0.5">Specialized Agents</div>
            </div>

            <div className="text-center border-l border-white/10">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold">01</div>
              <div className="text-[11px] font-mono text-[#8E8E8E] uppercase tracking-wider mt-0.5">Connected Workflow</div>
            </div>

            <div className="text-center border-l border-white/10">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold">360°</div>
              <div className="text-[11px] font-mono text-[#8E8E8E] uppercase tracking-wider mt-0.5">Career Assistance</div>
            </div>

            <div className="text-center border-l border-white/10">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold">∞</div>
              <div className="text-[11px] font-mono text-[#8E8E8E] uppercase tracking-wider mt-0.5">Context Preservation</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 2: HOW IT WORKS / CONNECTED OPERATING SYSTEM                         */}
      {/* ============================================================================ */}
      <section id="workflow" className="py-24 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">Architectural Foundation</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-sans text-white mb-4">
              Not Random AI Tools. <br />
              <span className="text-neutral-400">One Connected Operating System.</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Traditional job tools force you to copy-paste data between isolated platforms. AI Career OS maintains full data lineage and context from your initial resume upload to post-interview coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-[#121212] border-white/10 hover:border-white/25">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Strict Context Preservation</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                The same selected job target, resume parsing entities, company research notes, and application status stay automatically synchronized across every agent step.
              </p>
            </Card>

            <Card className="p-8 bg-[#121212] border-white/10 hover:border-white/25">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Resume Fabrication</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Our strict ATS optimization guardrails ensure no fake experience, invented qualifications, or false projects are ever hallucinated on your behalf.
              </p>
            </Card>

            <Card className="p-8 bg-[#121212] border-white/10 hover:border-white/25">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Human-in-the-Loop Control</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Consequential steps like generating tailored resume PDFs, logging application submissions, or connecting email access require explicit user approval.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 3: 12-AGENT CAREER PIPELINE                                         */}
      {/* ============================================================================ */}
      <section id="agents" className="py-24 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">12 Autonomous Agents</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              The 12-Agent Pipeline
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Each specialized AI agent executes a dedicated domain task in sequence, feeding verified data into the unified profile layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: 'AG-001', name: 'Resume Analysis', desc: 'Parses PDF/DOCX into structured user profile schema.', icon: <FileText className="w-4 h-4 text-white" /> },
              { code: 'AG-002', name: 'Job Search', desc: 'Discovers candidate jobs matching profile & preferences.', icon: <Search className="w-4 h-4 text-white" /> },
              { code: 'AG-003', name: 'JD Analysis', desc: 'Computes objective Match Score % & skill gaps.', icon: <BarChart3 className="w-4 h-4 text-white" /> },
              { code: 'AG-004', name: 'Resume Optimization', desc: 'Generates truthful ATS-tailored resume upon approval.', icon: <Sparkles className="w-4 h-4 text-white" /> },
              { code: 'AG-005', name: 'Cover Letter', desc: 'Drafts role-tailored cover letter tied to resume version.', icon: <FileText className="w-4 h-4 text-white" /> },
              { code: 'AG-006', name: 'Application Mgmt', desc: 'Records application tying job, resume & cover letter.', icon: <Briefcase className="w-4 h-4 text-white" /> },
              { code: 'AG-007', name: 'Application Tracking', desc: 'Maintains status history timeline (Applied -> Interview).', icon: <CheckCircle2 className="w-4 h-4 text-white" /> },
              { code: 'AG-008', name: 'Notifications', desc: 'Delivers in-app & email alerts for status updates.', icon: <Mail className="w-4 h-4 text-white" /> },
              { code: 'AG-009', name: 'Interview Detection', desc: 'Scans authorized inbox for interview invitations.', icon: <Mail className="w-4 h-4 text-white" /> },
              { code: 'AG-010', name: 'Company Research', desc: 'Compiles company culture, news, and prep insights.', icon: <Building2 className="w-4 h-4 text-white" /> },
              { code: 'AG-011', name: 'Interview Prep', desc: 'Generates role-specific technical prep material.', icon: <Video className="w-4 h-4 text-white" /> },
              { code: 'AG-012', name: 'Mock Interview & Coach', desc: 'Multi-turn practice session + Readiness Score & Roadmap.', icon: <Award className="w-4 h-4 text-white" /> }
            ].map((agent, i) => (
              <Card key={i} className="p-5 flex flex-col justify-between bg-[#121212] border-white/10 hover:border-white/25">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <AgentBadge code={agent.code} name={agent.name} />
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      {agent.icon}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{agent.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Step {i + 1} of 12</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 4: CONNECTED CAREER WORKFLOW TIMELINE                                */}
      {/* ============================================================================ */}
      <section id="journey" className="py-24 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">End-to-End Pipeline</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Connected Career Workflow
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              The continuous automated flow ensuring seamless data lineage from initial upload to final feedback.
            </p>
          </div>

          <div className="space-y-4">
            {/* Phase 1: Foundation & Job Discovery */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Phase 1: Profile & Job Intelligence</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { step: '01', title: 'Resume Upload', agent: 'User' },
                  { step: '02', title: 'Resume Analysis', agent: 'AG-001' },
                  { step: '03', title: 'User Profile', agent: 'Core' },
                  { step: '04', title: 'Job Search', agent: 'AG-002' },
                  { step: '05', title: 'JD Analysis', agent: 'AG-003' },
                  { step: '06', title: 'Match Score', agent: 'AG-003' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black border border-white/10 text-center">
                    <span className="font-mono text-[10px] text-neutral-500 font-bold block">{item.step} • {item.agent}</span>
                    <span className="text-xs font-semibold text-white mt-1 block">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2: Tailoring & Application */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Phase 2: ATS Tailoring & Tracking</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { step: '07', title: 'User Approval', agent: 'Human' },
                  { step: '08', title: 'Resume Optimization', agent: 'AG-004' },
                  { step: '09', title: 'Cover Letter', agent: 'AG-005' },
                  { step: '10', title: 'Application Mgmt', agent: 'AG-006' },
                  { step: '11', title: 'Application Tracking', agent: 'AG-007' },
                  { step: '12', title: 'Notifications', agent: 'AG-008' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black border border-white/10 text-center">
                    <span className="font-mono text-[10px] text-neutral-500 font-bold block">{item.step} • {item.agent}</span>
                    <span className="text-xs font-semibold text-white mt-1 block">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 3: Interviewing & Coaching */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Phase 3: Interview Readiness & Growth</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { step: '13', title: 'Interview Detection', agent: 'AG-009' },
                  { step: '14', title: 'Company Research', agent: 'AG-010' },
                  { step: '15', title: 'Interview Prep', agent: 'AG-011' },
                  { step: '16', title: 'Mock Interview', agent: 'AG-012' },
                  { step: '17', title: 'Feedback & Coach', agent: 'AG-012' },
                  { step: '18', title: 'Learning Roadmap', agent: 'AG-012' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black border border-white/10 text-center">
                    <span className="font-mono text-[10px] text-neutral-500 font-bold block">{item.step} • {item.agent}</span>
                    <span className="text-xs font-semibold text-white mt-1 block">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 5: KEY CAPABILITIES                                                 */}
      {/* ============================================================================ */}
      <section id="capabilities" className="py-24 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Designed specifically for software engineers, students, and early-career tech candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white text-black font-display font-bold flex items-center justify-center shrink-0 text-base">
                01
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Resume Analysis & Parser</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  AG-001 parses PDF/DOCX into structured skills, work history, and identifies resume gaps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white text-black font-display font-bold flex items-center justify-center shrink-0 text-base">
                02
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Job Search & Match Score</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  AG-002 and AG-003 analyze job descriptions, computing objective Match Scores and skill gaps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white text-black font-display font-bold flex items-center justify-center shrink-0 text-base">
                03
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">ATS-Friendly Optimization</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Generate tailored, ATS-friendly resume versions and matching cover letters with 1-click download.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white text-black font-display font-bold flex items-center justify-center shrink-0 text-base">
                04
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Interview Detection</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Inbox scan automatically detects interview invitations and auto-triggers company prep workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white text-black font-display font-bold flex items-center justify-center shrink-0 text-base">
                05
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Interactive Mock Practice</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Practice turn-by-turn mock interviews tailored to your target company with instant feedback.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#121212] border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white text-black font-display font-bold flex items-center justify-center shrink-0 text-base">
                06
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Readiness Score & Roadmap</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Receive a quantitative Readiness Score % and personalized Learning Roadmap for career growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 6: FINAL CTA SECTION                                                */}
      {/* ============================================================================ */}
      <section className="py-24 bg-[#0A0A0A] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-3">Get Started Today</span>
          <h2 className="text-3xl sm:text-5xl font-bold font-sans text-white mb-6">
            Ready to Experience the AI Career OS?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Take the guided tour through resume upload, job analysis, ATS optimization, and mock interview coaching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/signup">
              <Button variant="whitePill" size="lg" className="px-8 py-3.5 text-sm font-semibold">
                Launch Application
              </Button>
            </Link>
            <Link to="/app/dashboard">
              <Button variant="darkPill" size="lg" className="px-7 py-3.5 text-sm font-semibold">
                View Command Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 7: FOOTER                                                           */}
      {/* ============================================================================ */}
      <footer className="bg-black text-neutral-400 py-12 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white text-black font-bold flex items-center justify-center">
              <Cpu className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-white font-mono text-sm">AI Career OS</span>
          </div>
          <p className="text-neutral-500 text-center">
            Final-Year B.Tech Computer Science Engineering Project • Primary Source of Truth: SRS v1.0
          </p>
          <div className="flex items-center gap-6 text-neutral-400">
            <Link to="/auth/signin" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/app/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
