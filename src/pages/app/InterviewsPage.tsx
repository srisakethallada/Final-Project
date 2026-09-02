import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge, Progress } from '../../components/ui';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Video,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const InterviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    interviews,
    emailEvent,
    companyResearch,
    interviewPrep,
    authorizeEmailAndScan,
    isLoading
  } = useWorkflow();

  const activeInt = interviews[0];

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Interview Invitation & Preparation</h1>
            <AgentBadge code="AG-009, 010, 011" name="Detection & Prep" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Read-only email scan detects interview invitations and automatically initiates Company Research & Interview Preparation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="whitePill"
            size="sm"
            onClick={() => navigate('/app/mock-interview')}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Start Interactive Mock Interview (AG-012)
          </Button>
        </div>
      </div>

      {/* 1. AG-009 EMAIL OAUTH AUTHORIZATION & DETECTION STATUS CARD */}
      <Card className="p-6 bg-[#1A1A1A] border-white/12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-bold border border-white/10 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Email Inbox Scan Authorization</h3>
                <Badge variant={user.emailAuthorized ? 'success' : 'warning'} size="sm">
                  {user.emailAuthorized ? 'Read-Only Access Granted' : 'Authorization Required'}
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Connected: <span className="font-semibold text-white">{user.email}</span> • Read-only OAuth scope. System never sends emails on your behalf.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            {!user.emailAuthorized ? (
              <Button variant="whitePill" size="sm" onClick={authorizeEmailAndScan} isLoading={isLoading}>
                Authorize & Scan Inbox
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={authorizeEmailAndScan} isLoading={isLoading} leftIcon={<Sparkles className="w-4 h-4" />}>
                Rescan Inbox Now
              </Button>
            )}
          </div>
        </div>

        {/* DETECTED EVENT DETAILS CARD */}
        {emailEvent && (
          <div className="mt-6 p-4 rounded-2xl bg-[#111111] border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="success" size="sm">Confirmed Invitation ({emailEvent.confidenceScore}% Confidence)</Badge>
                <span className="text-neutral-500 font-mono text-[10px]">Detected: {emailEvent.detectedAt.split('T')[0]}</span>
              </div>
              <p className="font-bold text-white text-sm">{emailEvent.roleTitle} at {emailEvent.companyName}</p>
              <p className="text-neutral-400 mt-0.5">
                From: <span className="font-mono text-white">{emailEvent.senderEmail}</span> • Meeting Link: <a href={emailEvent.meetingLink} target="_blank" rel="noreferrer" className="text-white underline font-mono">Google Meet</a>
              </p>
            </div>

            <div className="bg-[#1A1A1A] p-3 rounded-xl border border-white/12 text-center min-w-[140px]">
              <span className="font-bold text-white block text-xs">{emailEvent.interviewDate}</span>
              <span className="text-[11px] text-neutral-400 font-medium">{emailEvent.interviewTime}</span>
            </div>
          </div>
        )}
      </Card>

      {/* 2. AG-010 COMPANY RESEARCH WORKSPACE */}
      {companyResearch && (
        <Card className="p-6 space-y-6 bg-[#1A1A1A] border-white/12">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Company Intelligence: {companyResearch.companyName}</h2>
                <AgentBadge code="AG-010" name="Company Research" />
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Automated insights compiled to support your upcoming technical interview.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-2">
              <span className="font-bold text-white text-sm block">Company Overview</span>
              <p className="text-neutral-300 leading-relaxed">{companyResearch.overview}</p>
              <span className="font-bold text-white block pt-2">Business Model:</span>
              <p className="text-neutral-400">{companyResearch.businessModel}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-2">
              <span className="font-bold text-white text-sm block">Products & Services</span>
              <ul className="space-y-1.5 text-neutral-300">
                {companyResearch.productsAndServices.map((prod, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>{prod}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-2">
              <span className="font-bold text-white text-sm block">Interview Guidance & Culture</span>
              <ul className="space-y-1.5 text-neutral-300">
                {companyResearch.interviewTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* 3. AG-011 INTERVIEW PREPARATION WORKSPACE */}
      {interviewPrep && (
        <Card className="p-6 space-y-6 bg-[#1A1A1A] border-white/12">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Personalized Prep Workspace: {interviewPrep.roleTitle} at {interviewPrep.companyName}
                </h2>
                <AgentBadge code="AG-011" name="Interview Prep" />
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Synthesized specifically for your target role, resume skills, and JD analysis.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technical Topics & Focus Areas */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-white">Technical Focus Topics</h3>
              <div className="space-y-3">
                {interviewPrep.technicalTopics.map((top, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-white/10 bg-[#111111] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{top.topic}</span>
                      <Badge variant={top.priority === 'HIGH' ? 'danger' : 'dark'} size="sm">{top.priority} PRIORITY</Badge>
                    </div>
                    <p className="text-xs text-neutral-400">{top.description}</p>
                  </div>
                ))}
              </div>

              {/* Sample Practice Questions */}
              <h3 className="font-bold text-sm text-white pt-4">Targeted Practice Questions</h3>
              <div className="space-y-3">
                {interviewPrep.practiceQuestions.map(pq => (
                  <div key={pq.id} className="p-4 rounded-2xl border border-white/10 bg-[#111111] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{pq.question}</span>
                      <Badge variant="dark" size="sm">{pq.category}</Badge>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-300">
                      <span className="font-bold text-white block mb-1">Key Answer Points to Highlight:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-neutral-400">
                        {pq.sampleAnswerKeyPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Checklist */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Preparation Checklist</h3>
              <Card className="p-4 bg-[#111111] border-white/10 space-y-3">
                {interviewPrep.preparationChecklist.map(chk => (
                  <label key={chk.id} className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer">
                    <input type="checkbox" defaultChecked={chk.completed} className="mt-0.5 rounded text-white bg-black border-white/20" />
                    <span className={chk.completed ? 'line-through text-neutral-500' : 'font-medium'}>{chk.task}</span>
                  </label>
                ))}
              </Card>

              <Button
                variant="whitePill"
                className="w-full mt-4"
                onClick={() => navigate('/app/mock-interview')}
                rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
              >
                Launch Mock Interview Session
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
