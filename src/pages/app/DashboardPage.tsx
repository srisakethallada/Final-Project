import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import {
  Card,
  Button,
  Badge,
  MatchScoreBadge,
  Progress,
  AgentBadge
} from '../../components/ui';
import {
  Sparkles,
  FileText,
  Search,
  Briefcase,
  Video,
  Award,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  Building2,
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  ShieldCheck
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
    authorizeEmailAndScan
  } = useWorkflow();

  const activeApps = applications.filter(a => a.status !== 'REJECTED');
  const upcomingInterview = interviews.find(i => i.status === 'UPCOMING');

  return (
    <div className="space-y-8">
      {/* 1. HERO WELCOME HEADER & PROFILE COMPLETENESS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge variant="brand" className="mb-3 bg-brand-900/80 text-brand-300 border-brand-700">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Career Command Center
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              All 12 AI Agents are active and monitoring your context across jobs, applications, and interview preparation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center min-w-[140px]">
              <span className="text-2xl font-extrabold font-outfit text-emerald-400">{readinessScore.currentScore}%</span>
              <span className="block text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Readiness Score</span>
            </div>
            <Button
              variant="gradient"
              size="md"
              onClick={() => navigate('/app/jobs')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Discover Target Jobs
            </Button>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-semibold text-slate-300">Profile Completeness:</span>
            <div className="w-48">
              <Progress value={profile.completeness} color="bg-emerald-400" />
            </div>
            <span className="font-bold text-emerald-400">{profile.completeness}%</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Strict Truthfulness Guardrail Enabled</span>
          </div>
        </div>
      </div>

      {/* 2. AUTOMATED INTERVIEW ALERT BANNER (AG-009) */}
      {upcomingInterview && (
        <Card className="bg-emerald-50/80 border-emerald-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-emerald-600/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="success">Interview Invitation Confirmed</Badge>
                <AgentBadge code="AG-009" name="Email Detection" />
              </div>
              <h3 className="font-bold text-slate-900 text-base font-outfit">
                {upcomingInterview.roleTitle} at {upcomingInterview.companyName}
              </h3>
              <p className="text-xs text-slate-600">
                Scheduled for <span className="font-bold">{upcomingInterview.scheduledDate}</span> at {upcomingInterview.scheduledTime}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/app/interviews')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Interview Prep Workspace
            </Button>
          </div>
        </Card>
      )}

      {/* 3. KEY METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Master Resumes</p>
            <h3 className="text-2xl font-bold font-outfit text-slate-900 mt-1">{resumes.length}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> AG-001 Parsed Clean
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Recommended Jobs</p>
            <h3 className="text-2xl font-bold font-outfit text-slate-900 mt-1">{jobs.length}</h3>
            <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1 mt-1">
              <Search className="w-3 h-3" /> AG-002 Ranked
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Applications</p>
            <h3 className="text-2xl font-bold font-outfit text-slate-900 mt-1">{activeApps.length}</h3>
            <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-1">
              <Briefcase className="w-3 h-3" /> AG-007 Tracked
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Interview Readiness</p>
            <h3 className="text-2xl font-bold font-outfit text-slate-900 mt-1">{readinessScore.currentScore}%</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> AG-012 Evaluated
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* 4. MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2-COLUMNS: RECOMMENDED JOBS & APPLICATION STATUS FUNNEL */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Recommended Jobs Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg font-outfit text-slate-900">Recommended Jobs for Your Profile</h3>
                  <AgentBadge code="AG-002" name="Job Search" />
                </div>
                <p className="text-xs text-slate-500">Filtered by your skills: React, TypeScript, Node.js, Python</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/app/jobs')}>
                View All ({jobs.length})
              </Button>
            </div>

            <div className="space-y-4">
              {jobs.slice(0, 3).map(job => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm font-outfit">{job.title}</span>
                      {job.isSaved && <Badge variant="brand" size="sm">Saved</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {job.company} • {job.location} • {job.salaryRange}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <MatchScoreBadge score={job.relevanceScore} size="sm" />
                    <Button
                      variant="primary"
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
          </Card>

          {/* Applications & Status History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg font-outfit text-slate-900">Application Pipeline Status</h3>
                  <AgentBadge code="AG-007" name="Tracking" />
                </div>
                <p className="text-xs text-slate-500">Connected to tailored resume versions and cover letters</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/app/applications')}>
                Manage Applications
              </Button>
            </div>

            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm font-outfit">{app.companyName}</h4>
                      <p className="text-xs text-slate-500">{app.jobTitle} • Applied {app.appliedDate.split('T')[0]}</p>
                    </div>
                  </div>

                  <Badge variant={app.status === 'INTERVIEW' ? 'success' : 'brand'}>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: READINESS SCORE & LEARNING ROADMAP & AGENT LOGS */}
        <div className="space-y-8">
          {/* Readiness Score Breakdown */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base font-outfit text-slate-900">Interview Readiness</h3>
              <AgentBadge code="AG-012.2" name="Coach" />
            </div>

            <div className="text-center py-4 bg-brand-50/50 rounded-2xl border border-brand-100 mb-6">
              <span className="text-4xl font-extrabold font-outfit text-brand-700">{readinessScore.currentScore}%</span>
              <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">Overall Score</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Technical Knowledge</span>
                  <span>{readinessScore.categoryScores.technical}%</span>
                </div>
                <Progress value={readinessScore.categoryScores.technical} color="bg-brand-600" />
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Behavioral & STAR Method</span>
                  <span>{readinessScore.categoryScores.behavioral}%</span>
                </div>
                <Progress value={readinessScore.categoryScores.behavioral} color="bg-indigo-600" />
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Resume Alignment</span>
                  <span>{readinessScore.categoryScores.resumeAlignment}%</span>
                </div>
                <Progress value={readinessScore.categoryScores.resumeAlignment} color="bg-emerald-600" />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-6"
              onClick={() => navigate('/app/mock-interview')}
            >
              Start Interactive Mock Interview
            </Button>
          </Card>

          {/* Learning Roadmap Priority Items */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base font-outfit text-slate-900">Learning Roadmap</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/career-coach')}>View All</Button>
            </div>

            <div className="space-y-3">
              {learningRoadmap.items.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{item.skillOrTopic}</span>
                    <Badge variant={item.priority === 'HIGH' ? 'danger' : 'brand'} size="sm">
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{item.recommendedAction}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Est. {item.estimatedHours} hrs</span>
                    <span className="font-semibold text-brand-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Orchestration Log Feed (Observability) */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm font-outfit text-slate-900">Agent Execution Activity Log</h3>
              <Badge variant="slate" size="sm">DATA-027</Badge>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
              {agentLogs.slice(0, 4).map(log => (
                <div key={log.id} className="p-2 rounded-lg bg-slate-900 text-slate-200">
                  <div className="flex items-center justify-between text-[10px] text-brand-400 font-bold">
                    <span>{log.agentId} • {log.agentName}</span>
                    <span className="text-emerald-400">{log.durationMs}ms</span>
                  </div>
                  <p className="text-slate-300 mt-1 truncate">{log.outputSummary}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
