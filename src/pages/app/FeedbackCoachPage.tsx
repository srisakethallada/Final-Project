import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge, Progress } from '../../components/ui';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckSquare
} from 'lucide-react';

export const FeedbackCoachPage: React.FC = () => {
  const navigate = useNavigate();
  const { feedback, readinessScore, learningRoadmap } = useWorkflow();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-900">Feedback & Career Coach</h1>
            <AgentBadge code="AG-012.2" name="Career Coach" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates mock interview performance, computes Readiness Score %, and generates a personalized Learning Roadmap.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => navigate('/app/dashboard')}>
          Return to Dashboard
        </Button>
      </div>

      {/* OVERALL PERFORMANCE HERO CARD */}
      <Card className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <Badge variant="brand" className="bg-brand-900/80 text-brand-300 border-brand-700">
              Session Evaluation Complete
            </Badge>
            <h2 className="text-3xl font-extrabold font-outfit text-white">
              Mock Interview Performance: {feedback?.overallScore || 90}%
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Demonstrated strong technical depth in React stream buffering and quantitative STAR method examples.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center min-w-[150px]">
              <span className="text-3xl font-extrabold font-outfit text-emerald-400">{readinessScore.currentScore}%</span>
              <span className="block text-[10px] text-slate-300 uppercase tracking-wider font-bold mt-0.5">Readiness Score</span>
            </div>
          </div>
        </div>
      </Card>

      {/* PERFORMANCE BREAKDOWN & STRENGTHS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Strengths, Weaknesses, Question Feedback */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-base font-outfit text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Key Identified Strengths
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {feedback?.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-base font-outfit text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Areas for Improvement
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {feedback?.weaknesses.concat(feedback?.improvementSuggestions || []).map((note, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Question-by-Question Detailed Feedback */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base font-outfit text-slate-900">Question-by-Question Turn Evaluation</h3>
            <div className="space-y-3">
              {feedback?.questionFeedback.map((qf, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Q{i + 1}: {qf.question}</span>
                    <span className="text-emerald-600 font-outfit text-sm">{qf.score}%</span>
                  </div>
                  <p className="text-slate-600 italic">"{qf.userAnswer}"</p>
                  <p className="text-brand-800 font-medium pt-1 border-t border-slate-200/60">Feedback: {qf.feedback}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Personalized Learning Roadmap */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base font-outfit text-slate-900">Personalized Learning Roadmap</h3>
              <Badge variant="brand" size="sm">DATA-026</Badge>
            </div>
            <p className="text-xs text-slate-500">Action items to bridge skill gaps identified during JD matching & mock evaluation.</p>

            <div className="space-y-3">
              {learningRoadmap.items.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-outfit">{item.skillOrTopic}</span>
                    <Badge variant={item.priority === 'HIGH' ? 'danger' : 'brand'} size="sm">{item.priority}</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.recommendedAction}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Est. {item.estimatedHours} hrs</span>
                    <span className="font-bold text-brand-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
