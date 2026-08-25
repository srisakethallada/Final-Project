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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-900">Interview Invitation & Preparation</h1>
            <AgentBadge code="AG-009, 010, 011" name="Detection & Prep" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Read-only email scan detects interview invitations and automatically initiates Company Research & Interview Preparation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gradient"
            size="sm"
            onClick={() => navigate('/app/mock-interview')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Interactive Mock Interview (AG-012)
          </Button>
        </div>
      </div>

      {/* 1. AG-009 EMAIL OAUTH AUTHORIZATION & DETECTION STATUS CARD */}
      <Card className="p-6 bg-white border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base font-outfit">Email Inbox Scan Authorization</h3>
                <Badge variant={user.emailAuthorized ? 'success' : 'warning'} size="sm">
                  {user.emailAuthorized ? 'Read-Only Access Granted' : 'Authorization Required'}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Connected: <span className="font-semibold text-slate-800">{user.email}</span> • Read-only OAuth scope. System never sends emails on your behalf.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            {!user.emailAuthorized ? (
              <Button variant="primary" size="sm" onClick={authorizeEmailAndScan} isLoading={isLoading}>
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
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="success" size="sm">Confirmed Invitation ({emailEvent.confidenceScore}% Confidence)</Badge>
                <span className="text-slate-400 font-mono text-[10px]">Detected: {emailEvent.detectedAt.split('T')[0]}</span>
              </div>
              <p className="font-bold text-slate-900 text-sm font-outfit">{emailEvent.roleTitle} at {emailEvent.companyName}</p>
              <p className="text-slate-600 mt-0.5">
                From: <span className="font-mono text-slate-800">{emailEvent.senderEmail}</span> • Meeting Link: <a href={emailEvent.meetingLink} target="_blank" rel="noreferrer" className="text-brand-600 underline font-mono">Google Meet</a>
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center min-w-[140px]">
              <span className="font-bold text-slate-900 block text-xs">{emailEvent.interviewDate}</span>
              <span className="text-[11px] text-slate-500 font-medium">{emailEvent.interviewTime}</span>
            </div>
          </div>
        )}
      </Card>

      {/* 2. AG-010 COMPANY RESEARCH WORKSPACE */}
      {companyResearch && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-outfit text-slate-900">Company Intelligence: {companyResearch.companyName}</h2>
                <AgentBadge code="AG-010" name="Company Research" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Automated insights compiled to support your upcoming technical interview.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 text-sm font-outfit block">Company Overview</span>
              <p className="text-slate-700 leading-relaxed">{companyResearch.overview}</p>
              <span className="font-bold text-slate-800 block pt-2">Business Model:</span>
              <p className="text-slate-600">{companyResearch.businessModel}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 text-sm font-outfit block">Products & Services</span>
              <ul className="space-y-1.5 text-slate-700">
                {companyResearch.productsAndServices.map((prod, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                    <span>{prod}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-900 text-sm font-outfit block">Interview Guidance & Culture</span>
              <ul className="space-y-1.5 text-indigo-900">
                {companyResearch.interviewTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
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
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-outfit text-slate-900">
                  Personalized Prep Workspace: {interviewPrep.roleTitle} at {interviewPrep.companyName}
                </h2>
                <AgentBadge code="AG-011" name="Interview Prep" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Synthesized specifically for your target role, resume skills, and JD analysis.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technical Topics & Focus Areas */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-sm font-outfit text-slate-900">Technical Focus Topics</h3>
              <div className="space-y-3">
                {interviewPrep.technicalTopics.map((top, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs font-outfit">{top.topic}</span>
                      <Badge variant={top.priority === 'HIGH' ? 'danger' : 'brand'} size="sm">{top.priority} PRIORITY</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{top.description}</p>
                  </div>
                ))}
              </div>

              {/* Sample Practice Questions */}
              <h3 className="font-bold text-sm font-outfit text-slate-900 pt-4">Targeted Practice Questions</h3>
              <div className="space-y-3">
                {interviewPrep.practiceQuestions.map(pq => (
                  <div key={pq.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{pq.question}</span>
                      <Badge variant="purple" size="sm">{pq.category}</Badge>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800 block mb-1">Key Answer Points to Highlight:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
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
              <h3 className="font-bold text-sm font-outfit text-slate-900">Preparation Checklist</h3>
              <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
                {interviewPrep.preparationChecklist.map(chk => (
                  <label key={chk.id} className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked={chk.completed} className="mt-0.5 rounded text-brand-600" />
                    <span className={chk.completed ? 'line-through text-slate-400' : 'font-medium'}>{chk.task}</span>
                  </label>
                ))}
              </Card>

              <Button
                variant="gradient"
                className="w-full mt-4"
                onClick={() => navigate('/app/mock-interview')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
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
