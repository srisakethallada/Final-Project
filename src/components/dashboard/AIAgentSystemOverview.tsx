import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Badge } from '../ui';
import { Cpu, CheckCircle2, Circle, AlertTriangle, Clock } from 'lucide-react';
import { AgentExecutionLog } from '../../types';

interface AgentDefinition {
  code: string;
  name: string;
  category: string;
  description: string;
}

export const AIAgentSystemOverview: React.FC = () => {
  const { agentLogs } = useWorkflow();

  const agents: AgentDefinition[] = [
    {
      code: 'AG-001',
      name: 'Resume Analysis Agent',
      category: 'Foundation',
      description: 'Parses master resume into structured JSON schema and evaluates completeness.'
    },
    {
      code: 'AG-002',
      name: 'Job Search & Matching Agent',
      category: 'Discovery',
      description: 'Discovers and ranks candidate roles based on profile skill vectors.'
    },
    {
      code: 'AG-003',
      name: 'JD Analysis Agent',
      category: 'Intelligence',
      description: 'Extracts required skills, responsibilities, and computes match scores.'
    },
    {
      code: 'AG-004',
      name: 'Resume Optimization Agent',
      category: 'Optimization',
      description: 'Tailors resume bullet points to target job descriptions truthful to profile.'
    },
    {
      code: 'AG-005',
      name: 'Cover Letter Generation Agent',
      category: 'Content',
      description: 'Generates role-specific cover letters aligned with tailored resume.'
    },
    {
      code: 'AG-006',
      name: 'Application Management Agent',
      category: 'Operations',
      description: 'Manages candidate application submissions and package versions.'
    },
    {
      code: 'AG-007',
      name: 'Application Tracking Agent',
      category: 'Operations',
      description: 'Tracks application lifecycle stages from Applied to Offer.'
    },
    {
      code: 'AG-008',
      name: 'Notification & Alert Agent',
      category: 'Alerting',
      description: 'Delivers proactive alerts for matches, application updates, and interviews.'
    },
    {
      code: 'AG-009',
      name: 'Interview Detection Agent',
      category: 'Detection',
      description: 'Scans authorized inbox for interview invitations with confidence scoring.'
    },
    {
      code: 'AG-010',
      name: 'Company Research Agent',
      category: 'Intelligence',
      description: 'Compiles enterprise overview, culture, products, and news briefing.'
    },
    {
      code: 'AG-011',
      name: 'Interview Preparation Agent',
      category: 'Preparation',
      description: 'Generates technical focus areas, practice questions, and prep checklists.'
    },
    {
      code: 'AG-012',
      name: 'Mock Interview & Coach Agent',
      category: 'Coaching',
      description: 'Conducts interactive mock interviews, evaluates answers, and builds roadmap.'
    }
  ];

  // Derive counts dynamically from real execution logs
  const completedCount = agents.filter(agent =>
    agentLogs.some(log => (log.agentId === agent.code || log.agentId.startsWith(agent.code)) && log.status === 'SUCCESS')
  ).length;

  const activeCount = agents.filter(agent =>
    agentLogs.some(log => (log.agentId === agent.code || log.agentId.startsWith(agent.code)) && log.status === 'IN_PROGRESS')
  ).length;

  const notStartedCount = agents.length - completedCount - activeCount;

  return (
    <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-white" /> 12 AI Agent System Execution Status
            </h3>
            <Badge variant="dark" size="sm">Real Runtime Audit</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Agent status derived strictly from current user persisted execution records
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed ({completedCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Processing ({activeCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-600"></span> Not Started ({notStartedCount})
          </span>
        </div>
      </div>

      {/* Grid of 12 Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map(agent => {
          // Find matching real log for this agent
          const latestLog = agentLogs.find(
            log => log.agentId === agent.code || log.agentId.startsWith(agent.code)
          );

          let statusType: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'NOT_STARTED' = 'NOT_STARTED';
          if (latestLog) {
            if (latestLog.status === 'SUCCESS') statusType = 'COMPLETED';
            else if (latestLog.status === 'IN_PROGRESS' || latestLog.status === 'RETRYING') statusType = 'PROCESSING';
            else if (latestLog.status === 'FAILURE') statusType = 'FAILED';
          }

          return (
            <div
              key={agent.code}
              className="p-3.5 rounded-2xl bg-[#111111] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-extrabold text-white">{agent.code}</span>
                  
                  {statusType === 'COMPLETED' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-800/40 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Completed
                    </span>
                  )}
                  {statusType === 'PROCESSING' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 font-semibold border border-amber-800/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span> Processing
                    </span>
                  )}
                  {statusType === 'FAILED' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 font-semibold border border-rose-800/40 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> Failed
                    </span>
                  )}
                  {statusType === 'NOT_STARTED' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 font-medium border border-white/10 flex items-center gap-1">
                      <Circle className="w-2 h-2 text-neutral-500" /> Not Started
                    </span>
                  )}
                </div>
                
                <h4 className="font-bold text-xs text-white">{agent.name}</h4>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>Domain: {agent.category}</span>
                {latestLog ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-emerald-400" /> {latestLog.durationMs}ms
                  </span>
                ) : (
                  <span className="text-neutral-500">No logs</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
