import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge } from '../../components/ui';
import { Bot, Send, Sparkles, User as UserIcon } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { selectedJob, activeInterview, readinessScore } = useWorkflow();
  const [inputMsg, setInputMsg] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: selectedJob
        ? `Hello! I'm your AI Career Assistant. Currently focused on your selected job "${selectedJob.title}" at ${selectedJob.company}. How can I assist your workflow?`
        : `Hello! I'm your central AI Career Assistant supervising all 12 specialized agents.`
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Regarding "${userText}": Based on your active Readiness Score of ${readinessScore.currentScore}%, I suggest completing a Mock Interview session or tailoring your ATS resume.`
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900">AI Career Assistant Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">Central context-aware chatbot backing the multi-agent operating system.</p>
        </div>
        <AgentBadge code="ORCHESTRATOR" name="Multi-Agent Supervisor" />
      </div>

      {/* Main Chat Panel */}
      <Card className="flex-1 flex flex-col p-6 bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none font-medium'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80 leading-relaxed'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-4 border-t border-slate-100 flex gap-3">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="Type your question or career command..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button type="submit" variant="gradient" size="md" rightIcon={<Send className="w-4 h-4" />}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
};
