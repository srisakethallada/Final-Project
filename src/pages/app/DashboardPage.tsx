import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import {
  Card,
  Button,
  Badge,
  MatchScoreBadge,
  Progress,
  AgentBadge,
  EmptyState
} from '../../components/ui';
import { ConnectedWorkflowPipeline } from '../../components/dashboard/ConnectedWorkflowPipeline';
import { AIAgentSystemOverview } from '../../components/dashboard/AIAgentSystemOverview';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { DashboardErrorState } from '../../components/dashboard/DashboardErrorState';
import {
  Sparkles,
  FileText,
  Search,
  Briefcase,
  Video,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  ShieldCheck,
  User as UserIcon,
  Bell,
  Activity,
  Zap,
  BookOpen,
  MapPin
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    profile,
    resumes,
    jobs,
    applications,
    interviews,
    readinessScore,
    learningRoadmap,
    notifications,
    agentLogs,
    selectJob,
    isLoading
  } = useWorkflow();

  const [hasError, setHasError] = useState<boolean>(false);

  // Real Calculated Workflow Helpers
  const activeApps = applications.filter(a => a.status !== 'REJECTED');
  const upcomingInterview = interviews.find(i => i.status === 'UPCOMING');
  const activeResume = resumes[0];
  const unreadNotifs = notifications.filter(n => !n.read);

  // Dynamic Real Application Pipeline Stats
  const appStats = {
    applied: applications.filter(a => a.status === 'APPLIED' || a.status === 'APPLICATION_RECEIVED').length,
    screening: applications.filter(a => a.status === 'SCREENING').length,
    interview: applications.filter(a => a.status === 'INTERVIEW').length,
    offer: applications.filter(a => a.status === 'OFFER').length,
  };

  // Determine dynamic primary next action based on real user state
  const getPrimaryAction = () => {
    if (resumes.length === 0) {
      return {
        title: 'Upload your master resume to activate Career OS',
        subtitle: 'AG-001 will parse your resume into a structured intelligence profile.',
        buttonText: 'Upload Resume',
        path: '/app/resume'
      };
    }
    if (upcomingInterview) {
      return {
        title: `Upcoming Interview: ${upcomingInterview.roleTitle} at ${upcomingInterview.companyName}`,
        subtitle: `Scheduled for ${upcomingInterview.scheduledDate} at ${upcomingInterview.scheduledTime}. AG-010 & AG-011 research ready.`,
        buttonText: 'Prepare for Interview',
        path: '/app/interviews'
      };
    }
    if (jobs.length > 0) {
      return {
        title: 'Explore recommended target job matches',
        subtitle: `AG-002 matched ${jobs.length} candidate roles for your skill vector.`,
        buttonText: 'Find Matching Jobs',
        path: '/app/jobs'
      };
    }
    return {
      title: 'Continue your AI career optimization journey',
      subtitle: 'All agents are monitoring your application pipeline and readiness context.',
      buttonText: 'Explore Jobs',
      path: '/app/jobs'
    };
  };

  const primaryAction = getPrimaryAction();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (hasError) {
    return <DashboardErrorState onRetry={() => setHasError(false)} />;
  }

  return (
    <div className="space-y-8 text-white selection:bg-white selection:text-black font-sans pb-12">
      {/* 1. DASHBOARD HEADER & GREETING */}
      <div className="bg-[#1A1A1A] border border-white/12 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">
                <Sparkles className="w-3.5 h-3.5 text-white" /> Central Control Center
              </Badge>
              <span className="text-[11px] font-mono text-neutral-400">Dashboard / Overview</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Good morning, {user.name || 'User'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Your career intelligence workspace at a glance. Live monitoring of your active career context.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-[#111111] px-5 py-3 rounded-2xl border border-white/12 text-center min-w-[140px]">
              <span className="text-2xl font-extrabold font-display text-white">
                {readinessScore && readinessScore.currentScore > 0 ? `${readinessScore.currentScore}%` : 'N/A'}
              </span>
              <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Career Readiness</span>
            </div>
            <Button
              variant="whitePill"
              size="md"
              onClick={() => navigate(primaryAction.path)}
              rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
            >
              {primaryAction.buttonText}
            </Button>
          </div>
        </div>

        {/* Profile Completeness & Status Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-semibold text-neutral-300">Profile Completeness:</span>
            <div className="w-36 sm:w-48">
              <Progress value={profile.completeness || 0} color="bg-white" />
            </div>
            <span className="font-bold text-white">{profile.completeness || 0}%</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Real User Data Architecture • No Mock Data</span>
          </div>
        </div>
      </div>

      {/* 2. TOP OVERVIEW METRICS STRIP (4 PANELS - REAL USER DATA CALCULATED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Resume */}
        <Card
          hoverable
          onClick={() => navigate('/app/resume')}
          className="p-5 flex items-center justify-between bg-[#1A1A1A] border-white/12"
        >
          <div>
            <p className="text-xs text-neutral-400 font-medium">Resume</p>
            <h3 className="text-xl font-bold font-sans text-white mt-1">
              {resumes.length > 0 ? 'Uploaded' : 'Not Uploaded'}
            </h3>
            <span className="text-[11px] font-mono font-semibold flex items-center gap-1 mt-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              {resumes.length > 0 ? 'AG-001 Parsed' : 'AG-001 Not Started'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center border border-white/10">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 2: Jobs */}
        <Card
          hoverable
          onClick={() => navigate('/app/jobs')}
          className="p-5 flex items-center justify-between bg-[#1A1A1A] border-white/12"
        >
          <div>
            <p className="text-xs text-neutral-400 font-medium">Jobs</p>
            <h3 className="text-xl font-bold font-sans text-white mt-1">
              {jobs.length} Matched
            </h3>
            <span className="text-[11px] font-mono font-semibold flex items-center gap-1 mt-1 text-neutral-400">
              <Search className="w-3 h-3" />
              {jobs.length > 0 ? 'AG-002 Ranked' : 'AG-002 Not Started'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center border border-white/10">
            <Search className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 3: Applications */}
        <Card
          hoverable
          onClick={() => navigate('/app/applications')}
          className="p-5 flex items-center justify-between bg-[#1A1A1A] border-white/12"
        >
          <div>
            <p className="text-xs text-neutral-400 font-medium">Applications</p>
            <h3 className="text-xl font-bold font-sans text-white mt-1">
              {activeApps.length} Active
            </h3>
            <span className="text-[11px] font-mono font-semibold flex items-center gap-1 mt-1 text-neutral-400">
              <Briefcase className="w-3 h-3" />
              {applications.length > 0 ? 'AG-007 Tracked' : 'AG-007 Not Started'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center border border-white/10">
            <Briefcase className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 4: Interviews */}
        <Card
          hoverable
          onClick={() => navigate('/app/interviews')}
          className="p-5 flex items-center justify-between bg-[#1A1A1A] border-white/12"
        >
          <div>
            <p className="text-xs text-neutral-400 font-medium">Interviews</p>
            <h3 className="text-xl font-bold font-sans text-white mt-1">
              {interviews.length} Upcoming
            </h3>
            <span className="text-[11px] font-mono font-semibold flex items-center gap-1 mt-1 text-emerald-400">
              <Video className="w-3 h-3" />
              {interviews.length > 0 ? 'AG-009 Confirmed' : 'AG-009 Not Started'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center border border-white/10">
            <Video className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* 3. CONNECTED WORKFLOW PIPELINE VISUALIZATION (REAL DATA DERIVED) */}
      <ConnectedWorkflowPipeline />

      {/* 4. PRIMARY DYNAMIC NEXT-ACTION BANNER */}
      <Card className="bg-[#1A1A1A] border-white/15 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold shrink-0 shadow-md">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand" size="sm">Recommended Next Step</Badge>
              <span className="text-[10px] font-mono text-neutral-400">Contextual Workflow Handoff</span>
            </div>
            <h3 className="font-bold text-white text-base sm:text-lg">
              {primaryAction.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 max-w-xl">
              {primaryAction.subtitle}
            </p>
          </div>
        </div>

        <Button
          variant="whitePill"
          size="sm"
          onClick={() => navigate(primaryAction.path)}
          rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          className="shrink-0 w-full md:w-auto"
        >
          {primaryAction.buttonText}
        </Button>
      </Card>

      {/* 5. MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN (2/3 width on desktop): RESUME, CAREER PROFILE, JOBS & APPLICATIONS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* RESUME STATUS OVERVIEW SECTION */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-white" /> Resume Overview
                  </h3>
                  <AgentBadge code="AG-001" name="Resume Analysis" />
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">Master resume parsing and optimization status</p>
              </div>
              {resumes.length > 0 ? (
                <Badge variant="success">Analysis Complete</Badge>
              ) : (
                <Badge variant="dark">Not Uploaded</Badge>
              )}
            </div>

            {resumes.length > 0 ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white font-bold">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold font-mono">Analyzed Target Role</span>
                        <Badge variant="brand" size="sm">{profile.jobRoleConfidence || 'HIGH'} Confidence</Badge>
                      </div>
                      <h4 className="font-extrabold text-white text-lg mt-0.5">
                        {profile.jobRole || 'Software Engineer'}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1">
                        File: {activeResume?.originalFileName} • {profile.skills.length} skills extracted • Completeness: {profile.completeness}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="whitePill"
                      size="sm"
                      onClick={() => navigate('/app/resume')}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="darkPill"
                      size="sm"
                      onClick={() => navigate('/app/resume')}
                    >
                      Re-upload
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#111111] border border-white/10">
                    <span className="text-neutral-400 text-[11px] block">Upload Status</span>
                    <span className="font-bold text-white text-sm mt-0.5 block flex items-center gap-1.5 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Uploaded ({activeResume?.fileType})
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#111111] border border-white/10">
                    <span className="text-neutral-400 text-[11px] block">Analysis Engine</span>
                    <span className="font-bold text-white text-sm mt-0.5 block flex items-center gap-1.5 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AG-001 Verified
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#111111] border border-white/10">
                    <span className="text-neutral-400 text-[11px] block">Target Role Context</span>
                    <span className="font-bold text-white text-sm mt-0.5 block truncate font-sans">
                      {profile.jobRole || 'Software Engineer'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="w-8 h-8 text-neutral-400" />}
                title="No Master Resume Uploaded"
                description="Upload your master resume to determine your career profile and activate downstream agents."
                action={
                  <Button
                    variant="whitePill"
                    size="sm"
                    onClick={() => navigate('/app/resume')}
                    rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
                  >
                    Upload Resume
                  </Button>
                }
              />
            )}
          </Card>

          {/* CAREER PROFILE OVERVIEW SECTION */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-white" /> Career Profile Overview
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Target role, skills, and work preferences</p>
              </div>
              <Button
                variant="darkPill"
                size="sm"
                onClick={() => navigate('/app/profile')}
              >
                View Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-2">
                <span className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">Target Roles</span>
                <p className="font-bold text-white text-sm">
                  {profile.preferences?.targetRoles?.length ? profile.preferences.targetRoles.join(', ') : 'Not specified yet'}
                </p>
                <div className="flex items-center gap-4 text-neutral-400 text-[11px] pt-1">
                  <span>Exp Level: <strong className="text-white">{profile.preferences?.experienceLevel || 'Unspecified'}</strong></span>
                  <span>Work Mode: <strong className="text-white">{profile.preferences?.workMode || 'Unspecified'}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-2">
                <span className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-400" /> Preferred Location
                </span>
                <p className="font-bold text-white text-sm">
                  {profile.preferences?.preferredLocation || profile.location || 'Not specified yet'}
                </p>
                {profile.preferences?.minSalary && profile.preferences?.maxSalary && (
                  <p className="text-[11px] text-neutral-400 pt-1">
                    Salary Target: <strong className="text-white">${profile.preferences.minSalary.toLocaleString()} - ${profile.preferences.maxSalary.toLocaleString()}</strong>
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                Primary Profile Skills ({profile.skills?.length || 0})
              </span>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#111111] text-neutral-200 border border-white/10 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">No skills recorded yet. Complete profile or upload resume to extract skills.</p>
              )}
            </div>
          </Card>

          {/* JOB ACTIVITY OVERVIEW SECTION (REAL DATA MATCH SCORE) */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-white" /> Recommended Job Activity
                  </h3>
                  <AgentBadge code="AG-002" name="Job Search" />
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">Matched and ranked roles based on your skill vector</p>
              </div>
              <Button variant="darkPill" size="sm" onClick={() => navigate('/app/jobs')}>
                View All Jobs ({jobs.length})
              </Button>
            </div>

            {jobs.length > 0 ? (
              <div className="space-y-3.5">
                {jobs.slice(0, 3).map(job => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111111]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{job.title}</span>
                        {job.isSaved && <Badge variant="dark" size="sm">Saved</Badge>}
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">
                        {job.company} • {job.location} • {job.salaryRange || 'Competitive'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <MatchScoreBadge score={job.relevanceScore} label="MATCH SCORE" size="sm" />
                      <Button
                        variant="whitePill"
                        size="sm"
                        onClick={() => {
                          selectJob(job);
                          navigate(`/app/jobs/${job.id}/analysis`);
                        }}
                      >
                        Analyze Match
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search className="w-8 h-8 text-neutral-400" />}
                title="No Matched Jobs Yet"
                description="Your matched jobs will appear here after job search."
                action={
                  <Button variant="whitePill" size="sm" onClick={() => navigate('/app/jobs')}>
                    Explore Jobs
                  </Button>
                }
              />
            )}
          </Card>

          {/* APPLICATION ACTIVITY SECTION (REAL CALCULATED COUNTS) */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-white" /> Application Pipeline Activity
                  </h3>
                  <AgentBadge code="AG-007" name="Tracking" />
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">Active applications lifecycle status</p>
              </div>
              <Button variant="darkPill" size="sm" onClick={() => navigate('/app/applications')}>
                View Applications ({applications.length})
              </Button>
            </div>

            {/* Pipeline Funnel Breakdown (Dynamically calculated from real user records) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#111111] border border-white/10">
                <span className="text-xl font-bold font-sans text-white">{appStats.applied}</span>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Applied</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#111111] border border-white/10">
                <span className="text-xl font-bold font-sans text-white">{appStats.screening}</span>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Screening</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#111111] border border-white/10">
                <span className="text-xl font-bold font-sans text-emerald-400">{appStats.interview}</span>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Interview</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#111111] border border-white/10">
                <span className="text-xl font-bold font-sans text-white">{appStats.offer}</span>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Offer</span>
              </div>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="p-4 rounded-2xl border border-white/10 bg-[#111111] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{app.companyName}</h4>
                        <p className="text-xs text-neutral-400">
                          {app.jobTitle} • Applied {app.appliedDate.split('T')[0]}
                        </p>
                      </div>
                    </div>

                    <Badge variant={app.status === 'INTERVIEW' ? 'success' : 'dark'}>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Briefcase className="w-8 h-8 text-neutral-400" />}
                title="No Applications Tracked Yet"
                description="Applications you track will appear here."
                action={
                  <Button variant="whitePill" size="sm" onClick={() => navigate('/app/applications')}>
                    Track Application
                  </Button>
                }
              />
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN (1/3 width on desktop): INTERVIEWS, AGENTS, READINESS, ROADMAP & NOTIFS */}
        <div className="space-y-8">

          {/* UPCOMING INTERVIEWS SECTION */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-white" /> Upcoming Interviews
                </h3>
              </div>
              <AgentBadge code="AG-009" name="Detection" />
            </div>

            {upcomingInterview ? (
              <div className="p-4 rounded-2xl bg-[#111111] border border-emerald-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success">Confirmed Invitation</Badge>
                  <span className="text-[10px] font-mono text-neutral-400">AG-009 Inbox Scan</span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{upcomingInterview.roleTitle}</h4>
                  <p className="text-xs text-neutral-400">{upcomingInterview.companyName}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neutral-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{upcomingInterview.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{upcomingInterview.scheduledTime}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Button
                    variant="whitePill"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/app/interviews')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5 text-black" />}
                  >
                    Prepare
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Calendar className="w-8 h-8 text-neutral-400" />}
                title="No Upcoming Interviews"
                description="Your detected interviews will appear here."
              />
            )}
          </Card>

          {/* AI AGENT SYSTEM OVERVIEW (12 AGENTS REAL LOG AUDIT) */}
          <AIAgentSystemOverview />

          {/* CAREER READINESS SECTION (ONLY SHOWN IF CALCULATED) */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-white" /> Career Readiness
              </h3>
              <AgentBadge code="AG-012.2" name="Coach" />
            </div>

            {readinessScore && readinessScore.currentScore > 0 ? (
              <>
                <div className="text-center py-4 bg-[#111111] rounded-2xl border border-white/10">
                  <span className="text-4xl font-extrabold font-display text-white">{readinessScore.currentScore}%</span>
                  <span className="block text-xs font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Overall Score</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-neutral-300 mb-1">
                      <span>Technical Knowledge</span>
                      <span>{readinessScore.categoryScores?.technical || 0}%</span>
                    </div>
                    <Progress value={readinessScore.categoryScores?.technical || 0} color="bg-white" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-neutral-300 mb-1">
                      <span>Behavioral & STAR Method</span>
                      <span>{readinessScore.categoryScores?.behavioral || 0}%</span>
                    </div>
                    <Progress value={readinessScore.categoryScores?.behavioral || 0} color="bg-white" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-neutral-300 mb-1">
                      <span>Resume Alignment</span>
                      <span>{readinessScore.categoryScores?.resumeAlignment || 0}%</span>
                    </div>
                    <Progress value={readinessScore.categoryScores?.resumeAlignment || 0} color="bg-white" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-neutral-300 mb-1">
                      <span>Communication</span>
                      <span>{readinessScore.categoryScores?.communication || 0}%</span>
                    </div>
                    <Progress value={readinessScore.categoryScores?.communication || 0} color="bg-white" />
                  </div>
                </div>

                <Button
                  variant="darkPill"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/app/mock-interview')}
                >
                  Start Interactive Mock Interview
                </Button>
              </>
            ) : (
              <EmptyState
                icon={<Award className="w-8 h-8 text-neutral-400" />}
                title="No Readiness Score Calculated Yet"
                description="Career readiness will appear after completing interview practice or career evaluation."
                action={
                  <Button
                    variant="whitePill"
                    size="sm"
                    onClick={() => navigate('/app/mock-interview')}
                  >
                    Start Mock Interview
                  </Button>
                }
              />
            )}
          </Card>

          {/* LEARNING ROADMAP PREVIEW SECTION */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white" /> Learning Roadmap
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/career-coach')}>
                View Roadmap
              </Button>
            </div>

            {learningRoadmap?.items?.length > 0 ? (
              <div className="space-y-3">
                {learningRoadmap.items.slice(0, 3).map(item => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-[#111111] border border-white/10 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{item.skillOrTopic}</span>
                      <Badge variant={item.priority === 'HIGH' ? 'danger' : 'dark'} size="sm">
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">{item.recommendedAction}</p>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-1">
                      <span>Est. {item.estimatedHours} hrs</span>
                      <span className="font-semibold text-white uppercase">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="w-8 h-8 text-neutral-400" />}
                title="No Learning Roadmap Items"
                description="Your personalized learning roadmap will appear after career analysis."
                action={
                  <Button variant="whitePill" size="sm" onClick={() => navigate('/app/career-coach')}>
                    View Career Coach
                  </Button>
                }
              />
            )}
          </Card>

          {/* NOTIFICATIONS PREVIEW SECTION */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-white" /> Notifications
                </h3>
                {unreadNotifs.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-black font-bold text-[10px] flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/notifications')}>
                View Notifications
              </Button>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.slice(0, 3).map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => navigate('/app/notifications')}
                    className={`p-3 rounded-xl text-xs transition-all cursor-pointer border ${
                      !notif.read ? 'bg-[#111111] border-white/20 text-white' : 'bg-[#111111]/60 border-white/5 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="truncate">{notif.title}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Bell className="w-6 h-6 text-neutral-400" />}
                title="No Notifications"
                description="You're all caught up."
              />
            )}
          </Card>

          {/* RECENT AGENT ACTIVITY FEED SECTION */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-white" /> Recent Agent Activity
              </h3>
              <Badge variant="dark" size="sm">Log Feed</Badge>
            </div>

            {agentLogs.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-[11px]">
                {agentLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#111111] text-neutral-300 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-white">{log.agentId} • {log.agentName}</span>
                      <span className="text-emerald-400">{log.durationMs}ms</span>
                    </div>
                    <p className="text-neutral-400 text-[10px] truncate">{log.outputSummary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Activity className="w-6 h-6 text-neutral-400" />}
                title="No Agent Logs Yet"
                description="Activity will appear here as agents execute tasks."
              />
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
