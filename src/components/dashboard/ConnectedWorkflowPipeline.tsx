import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import {
  FileText,
  Search,
  FileSearch,
  Sparkles,
  Mail,
  Briefcase,
  Video,
  Building2,
  Bot,
  Award,
  ChevronRight
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  stepNumber: number;
  name: string;
  agentCode: string;
  path: string;
  status: 'COMPLETED' | 'ACTIVE' | 'NOT_STARTED';
  icon: React.ReactNode;
}

export const ConnectedWorkflowPipeline: React.FC = () => {
  const navigate = useNavigate();
  const {
    resumes,
    jobs,
    jdAnalysis,
    tailoredResume,
    coverLetter,
    applications,
    interviews,
    interviewPrep,
    mockSession,
    feedback,
    agentLogs
  } = useWorkflow();

  // Helper function to check if an agent completed or data exists
  const isAgentCompleted = (code: string) => {
    return agentLogs.some(log => (log.agentId === code || log.agentId.startsWith(code)) && log.status === 'SUCCESS');
  };

  const steps: WorkflowStep[] = [
    {
      id: 'step_1',
      stepNumber: 1,
      name: 'Resume Analysis',
      agentCode: 'AG-001',
      path: '/app/resume',
      status: resumes.length > 0 || isAgentCompleted('AG-001') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <FileText className="w-3.5 h-3.5" />
    },
    {
      id: 'step_2',
      stepNumber: 2,
      name: 'Job Search',
      agentCode: 'AG-002',
      path: '/app/jobs',
      status: jobs.length > 0 || isAgentCompleted('AG-002') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Search className="w-3.5 h-3.5" />
    },
    {
      id: 'step_3',
      stepNumber: 3,
      name: 'JD Analysis',
      agentCode: 'AG-003',
      path: '/app/jobs',
      status: jdAnalysis !== null || isAgentCompleted('AG-003') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <FileSearch className="w-3.5 h-3.5" />
    },
    {
      id: 'step_4',
      stepNumber: 4,
      name: 'Resume Optimization',
      agentCode: 'AG-004',
      path: '/app/resume/optimize',
      status: tailoredResume !== null || isAgentCompleted('AG-004') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Sparkles className="w-3.5 h-3.5" />
    },
    {
      id: 'step_5',
      stepNumber: 5,
      name: 'Cover Letter',
      agentCode: 'AG-005',
      path: '/app/cover-letter',
      status: coverLetter !== null || isAgentCompleted('AG-005') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Mail className="w-3.5 h-3.5" />
    },
    {
      id: 'step_6',
      stepNumber: 6,
      name: 'Application Hub',
      agentCode: 'AG-006/007',
      path: '/app/applications',
      status: applications.length > 0 || isAgentCompleted('AG-006') || isAgentCompleted('AG-007') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Briefcase className="w-3.5 h-3.5" />
    },
    {
      id: 'step_7',
      stepNumber: 7,
      name: 'Interview Detection',
      agentCode: 'AG-009',
      path: '/app/interviews',
      status: interviews.length > 0 || isAgentCompleted('AG-009') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Video className="w-3.5 h-3.5" />
    },
    {
      id: 'step_8',
      stepNumber: 8,
      name: 'Company Prep',
      agentCode: 'AG-010/011',
      path: '/app/interviews',
      status: interviewPrep !== null || isAgentCompleted('AG-010') || isAgentCompleted('AG-011') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Building2 className="w-3.5 h-3.5" />
    },
    {
      id: 'step_9',
      stepNumber: 9,
      name: 'Mock Interview',
      agentCode: 'AG-012.1',
      path: '/app/mock-interview',
      status: (mockSession !== null && mockSession.status === 'COMPLETED') || isAgentCompleted('AG-012.1') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Bot className="w-3.5 h-3.5" />
    },
    {
      id: 'step_10',
      stepNumber: 10,
      name: 'Career Coach',
      agentCode: 'AG-012.2',
      path: '/app/career-coach',
      status: feedback !== null || isAgentCompleted('AG-012.2') ? 'COMPLETED' : 'NOT_STARTED',
      icon: <Award className="w-3.5 h-3.5" />
    }
  ];

  // Determine active current stage dynamically
  const completedStepsCount = steps.filter(s => s.status === 'COMPLETED').length;
  const currentActiveStep = steps.find(s => s.status !== 'COMPLETED') || steps[steps.length - 1];

  return (
    <div className="bg-[#1A1A1A] border border-white/12 rounded-3xl p-5 sm:p-6 text-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-white">Connected AI Career Pipeline</h3>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
              Real User State
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            End-to-end career workflow dynamically reflecting real user data lineage
          </p>
        </div>
        
        <span className="text-[11px] font-mono text-neutral-400">
          Pipeline Progress: <span className="text-emerald-400 font-bold">{completedStepsCount} of 10 Stages Completed</span>
        </span>
      </div>

      {/* Desktop Horizontal Workflow Pipeline */}
      <div className="hidden lg:flex items-center justify-between gap-1 overflow-x-auto py-2">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          let badgeBg = 'bg-[#111111] text-neutral-400 border-white/10 hover:border-white/25';
          let iconBg = 'bg-white/5 text-neutral-400';
          let statusDot = 'bg-neutral-600';

          if (step.status === 'COMPLETED') {
            badgeBg = 'bg-[#111111] text-white border-white/20 hover:border-white/40 hover:bg-[#181818]';
            iconBg = 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40';
            statusDot = 'bg-emerald-400';
          } else if (step.id === currentActiveStep.id && completedStepsCount > 0) {
            badgeBg = 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-neutral-200';
            iconBg = 'bg-black text-white';
            statusDot = 'bg-emerald-500 animate-ping';
          }

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => navigate(step.path)}
                title={`Navigate to ${step.name} (${step.agentCode})`}
                className={`flex-1 min-w-[100px] p-2.5 rounded-2xl border transition-all text-left flex flex-col justify-between h-24 ${badgeBg}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${iconBg}`}>
                    {step.icon}
                  </div>
                  <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono font-bold opacity-75">{step.agentCode}</span>
                  </div>
                  <p className="text-[11px] font-bold leading-tight truncate mt-0.5">{step.name}</p>
                </div>
              </button>

              {!isLast && (
                <div className="shrink-0 text-neutral-600">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile / Tablet Responsive Pipeline */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {steps.map(step => {
            let badgeBg = 'bg-[#111111] text-neutral-300 border-white/10';
            if (step.status === 'COMPLETED') {
              badgeBg = 'bg-[#111111] text-white border-white/20';
            } else if (step.id === currentActiveStep.id && completedStepsCount > 0) {
              badgeBg = 'bg-white text-black font-bold';
            }

            return (
              <button
                key={step.id}
                onClick={() => navigate(step.path)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${badgeBg}`}
              >
                <div className="shrink-0">{step.icon}</div>
                <div className="min-w-0">
                  <p className="font-bold text-[11px] truncate">{step.name}</p>
                  <p className="text-[9px] font-mono opacity-70 truncate">{step.agentCode}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
