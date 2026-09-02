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
          <Button variant="whitePill" size="sm" onClick={() => { onClose(); navigate('/app/resume/optimize'); }}>
            View Tailored Resume Diff
          </Button>
        )
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A0A0A] text-white h-full shadow-2xl flex flex-col border-l border-white/12">
        {/* Header */}
        <div className="p-4 border-b border-white/12 flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-md">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-sans text-white">Context-Aware AI Assistant</h3>
              <p className="text-[10px] text-neutral-400 font-mono">Central Orchestrator Supervisor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Context Card Pill */}
        <div className="p-3 bg-[#161618] border-b border-white/12 px-4">
          <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
            <span>Workflow Context</span>
            <AgentBadge code="AG-003" name="JD Context" />
          </div>
          {selectedJob ? (
            <p className="text-xs text-neutral-300">
              Selected Role: <span className="font-bold text-white">{selectedJob.title}</span> at <span className="font-bold text-white">{selectedJob.company}</span> (Match: {selectedJob.relevanceScore}%)
            </p>
          ) : (
            <p className="text-xs text-neutral-400">No specific job selected yet.</p>
          )}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#28282A] text-white flex items-center justify-center shrink-0 font-bold border border-white/12">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[85%] p-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-white text-black font-medium rounded-br-none'
                  : 'bg-[#1A1A1A] text-neutral-200 rounded-bl-none border border-white/12'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                {msg.actionBtn && <div className="mt-3">{msg.actionBtn}</div>}
              </div>
            </div>
          ))}

          {/* Contextual Smart Prompt Cards */}
          {selectedJob && !tailoredResume && (
            <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-white/15 text-xs text-white">
              <p className="font-semibold text-white mb-3">
                Your current resume matches "{selectedJob.title}" at {selectedJob.relevanceScore}%. Would you like me to generate a tailored ATS resume?
              </p>
              <div className="flex gap-2">
                <Button variant="whitePill" size="sm" onClick={handleOptimizeClick} isLoading={isLoading}>
                  Yes, Optimize Resume
                </Button>
                <Button variant="darkPill" size="sm" onClick={() => {}}>
                  Not Now
                </Button>
              </div>
            </div>
          )}

          {emailEvent && (
            <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-emerald-800/50 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Interview Invitation Detected!
              </div>
              <p className="text-neutral-300 mb-3">
                Detected invitation for <span className="font-bold text-white">{emailEvent.roleTitle}</span> at {emailEvent.companyName} on {emailEvent.interviewDate}.
              </p>
              <Button
                variant="whitePill"
                size="sm"
                onClick={() => { onClose(); navigate('/app/interviews'); }}
              >
                Go to Company Research & Prep
              </Button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-white/12 flex gap-2 bg-[#111111]">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask your career assistant..."
            className="flex-1 px-3.5 py-2.5 rounded-full border border-white/15 bg-[#18181A] text-white text-xs focus:outline-none focus:border-white/35 placeholder:text-neutral-500"
          />
          <button type="submit" className="p-2.5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
