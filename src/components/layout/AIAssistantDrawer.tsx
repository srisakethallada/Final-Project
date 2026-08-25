import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  X,
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle2,
  FileText,
  Briefcase,
  Video,
  ChevronRight
} from 'lucide-react';
import { Button, Badge, AgentBadge } from '../ui';

export const AIAssistantDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    selectedJob,
    jdAnalysis,
    tailoredResume,
    emailEvent,
    interviews,
    approveResumeOptimization,
    isLoading
  } = useWorkflow();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; actionBtn?: React.ReactNode }>>([
    {
      sender: 'ai',
      text: selectedJob
        ? `Hello! I see you are currently reviewing ${selectedJob.title} at ${selectedJob.company}.`
        : `Hello! I am your central AI Career Assistant. I am monitoring your context across all 12 agents.`
    }
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `I understand you're asking about "${userText}". Based on your structured profile and active job selection (${selectedJob?.company || 'None'}), I recommend reviewing your match score breakdown or proceeding to interview prep.`
        }
      ]);
    }, 600);
  };

  const handleOptimizeClick = async () => {
    await approveResumeOptimization();
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: 'AG-004 generated your Tailored ATS Resume! Zero fabricated claims were added. Would you like to view the diff or generate a cover letter?',
        actionBtn: (
          <Button variant="gradient" size="sm" onClick={() => { onClose(); navigate('/app/resume/optimize'); }}>
            View Tailored Resume Diff
          </Button>
        )
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-outfit text-slate-900">Context-Aware AI Assistant</h3>
              <p className="text-[10px] text-slate-500 font-mono">Central Orchestrator Supervisor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Context Card Pill */}
        <div className="p-3 bg-brand-50/80 border-b border-brand-100 px-4">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-900 mb-1">
            <span>Workflow Context</span>
            <AgentBadge code="AG-003" name="JD Context" />
          </div>
          {selectedJob ? (
            <p className="text-xs text-slate-700">
              Selected Role: <span className="font-bold text-slate-900">{selectedJob.title}</span> at <span className="font-bold text-slate-900">{selectedJob.company}</span> (Match: {selectedJob.relevanceScore}%)
            </p>
          ) : (
            <p className="text-xs text-slate-500">No specific job selected yet.</p>
          )}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[85%] p-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                {msg.actionBtn && <div className="mt-3">{msg.actionBtn}</div>}
              </div>
            </div>
          ))}

          {/* Contextual Smart Prompt Cards */}
          {selectedJob && !tailoredResume && (
            <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 text-xs">
              <p className="font-semibold text-indigo-900 mb-2">
                Your current resume matches "{selectedJob.title}" at {selectedJob.relevanceScore}%. Would you like me to generate a tailored ATS resume?
              </p>
              <div className="flex gap-2">
                <Button variant="gradient" size="sm" onClick={handleOptimizeClick} isLoading={isLoading}>
                  Yes, Optimize Resume
                </Button>
                <Button variant="outline" size="sm" onClick={() => {}}>
                  Not Now
                </Button>
              </div>
            </div>
          )}

          {emailEvent && (
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Interview Invitation Detected!
              </div>
              <p className="text-emerald-800 mb-2">
                Detected invitation for <span className="font-bold">{emailEvent.roleTitle}</span> at {emailEvent.companyName} on {emailEvent.interviewDate}.
              </p>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => { onClose(); navigate('/app/interviews'); }}
              >
                Go to Company Research & Prep
              </Button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask your career assistant..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button type="submit" className="p-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
