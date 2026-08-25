import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge, Progress } from '../../components/ui';
import {
  Bot,
  User as UserIcon,
  Send,
  Clock,
  CheckCircle2,
  ArrowRight,
  Award,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const MockInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    mockSession,
    submitAnswerInMockInterview,
    finishMockInterviewAndGetFeedback,
    isLoading
  } = useWorkflow();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswerInput, setUserAnswerInput] = useState('');

  if (!mockSession) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-500">No active mock interview session found.</p>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/app/interviews')}>
          Go to Interview Preparation
        </Button>
      </Card>
    );
  }

  const currentQ = mockSession.questions[currentQIndex];

  const handleSubmitTurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswerInput.trim()) return;

    await submitAnswerInMockInterview(currentQIndex, userAnswerInput);
    setUserAnswerInput('');

    if (currentQIndex < mockSession.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Session finished -> transition to AG-012.2 Feedback & Career Coach!
      await finishMockInterviewAndGetFeedback();
      navigate('/app/career-coach');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-900">Interactive Practice Interview</h1>
            <AgentBadge code="AG-012.1" name="Mock Interview" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded in your resume, JD Analysis, and {mockSession.companyName} company prep context.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="brand">
            Question {currentQIndex + 1} of {mockSession.questions.length}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={((currentQIndex + 1) / mockSession.questions.length) * 100} />

      {/* AI INTERVIEWER SPEECH CARD */}
      <Card className="p-6 bg-white border-brand-200 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm font-outfit">AI Senior Engineering Interviewer</span>
            <span className="block text-[11px] text-slate-400 font-mono">Simulating {mockSession.companyName} Culture</span>
          </div>
          <Badge variant="purple" className="ml-auto text-xs">{currentQ.category}</Badge>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-900 leading-relaxed font-outfit">
          "{currentQ.question}"
        </div>
      </Card>

      {/* USER ANSWER INPUT FORM */}
      <Card className="p-6 space-y-4 bg-white border-slate-200">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-brand-600" /> Your Response (Microphone / Written Input)
          </span>
          <span className="text-slate-400 font-mono">STAR Method Recommended</span>
        </div>

        <form onSubmit={handleSubmitTurn} className="space-y-4">
          <textarea
            value={userAnswerInput}
            onChange={e => setUserAnswerInput(e.target.value)}
            placeholder="Type your response clearly. Address performance metrics, architectural choices, or situational context..."
            rows={6}
            className="w-full p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed font-sans"
            required
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">Pressing submit evaluates turn-by-turn response quality</span>
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={isLoading}
              rightIcon={<Send className="w-4 h-4" />}
            >
              {currentQIndex < mockSession.questions.length - 1 ? 'Submit & Next Question' : 'Finish Interview & Get Feedback'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
