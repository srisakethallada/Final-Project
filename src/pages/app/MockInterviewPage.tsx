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
      <Card className="p-8 text-center bg-[#1A1A1A] border-white/12 text-white">
        <p className="text-neutral-400">No active mock interview session found.</p>
        <Button variant="whitePill" className="mt-4" onClick={() => navigate('/app/interviews')}>
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
    <div className="space-y-8 max-w-4xl mx-auto text-white font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Interactive Practice Interview</h1>
            <AgentBadge code="AG-012.1" name="Mock Interview" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Grounded in your resume, JD Analysis, and {mockSession.companyName} company prep context.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="dark">
            Question {currentQIndex + 1} of {mockSession.questions.length}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={((currentQIndex + 1) / mockSession.questions.length) * 100} color="bg-white" />

      {/* AI INTERVIEWER SPEECH CARD */}
      <Card className="p-6 bg-[#1A1A1A] border-white/12 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold shrink-0 shadow-md">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">AI Senior Engineering Interviewer</span>
            <span className="block text-[11px] text-neutral-400 font-mono">Simulating {mockSession.companyName} Culture</span>
          </div>
          <Badge variant="dark" className="ml-auto text-xs">{currentQ.category}</Badge>
        </div>

        <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 text-sm font-semibold text-white leading-relaxed">
          "{currentQ.question}"
        </div>
      </Card>

      {/* USER ANSWER INPUT FORM */}
      <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
        <div className="flex items-center justify-between text-xs font-semibold text-white">
          <span className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-white" /> Your Response (Microphone / Written Input)
          </span>
          <span className="text-neutral-400 font-mono">STAR Method Recommended</span>
        </div>

        <form onSubmit={handleSubmitTurn} className="space-y-4">
          <textarea
            value={userAnswerInput}
            onChange={e => setUserAnswerInput(e.target.value)}
            placeholder="Type your response clearly. Address performance metrics, architectural choices, or situational context..."
            rows={6}
            className="w-full p-4 rounded-2xl border border-white/15 bg-[#111111] text-xs text-white focus:outline-none focus:border-white/35 leading-relaxed font-sans placeholder:text-neutral-500"
            required
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-neutral-400">Pressing submit evaluates turn-by-turn response quality</span>
            <Button
              type="submit"
              variant="whitePill"
              size="md"
              isLoading={isLoading}
              rightIcon={<Send className="w-4 h-4 text-black" />}
            >
              {currentQIndex < mockSession.questions.length - 1 ? 'Submit & Next Question' : 'Finish Interview & Get Feedback'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
