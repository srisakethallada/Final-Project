import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge } from '../../components/ui';
import {
  FileText,
  Copy,
  Download,
  RefreshCw,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Edit2
} from 'lucide-react';

export const CoverLetterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedJob,
    coverLetter,
    generateCoverLetterForSelectedJob,
    recordJobApplication,
    isLoading
  } = useWorkflow();

  const [copied, setCopied] = useState(false);
  const [editableContent, setEditableContent] = useState(coverLetter?.content || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent || coverLetter?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRecordApp = async () => {
    await recordJobApplication('Applied with AG-005 Tailored Cover Letter.');
    navigate('/app/applications');
  };

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Job-Specific Cover Letter</h1>
            <AgentBadge code="AG-005" name="Cover Letter" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            AG-005 produces a custom cover letter linking your profile highlights to the specific requirements of {selectedJob?.company || 'Target Company'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={<Copy className="w-4 h-4" />}>
            {copied ? 'Copied to Clipboard!' : 'Copy Text'}
          </Button>
          <Button
            variant="whitePill"
            size="sm"
            onClick={handleRecordApp}
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Record Application (AG-006)
          </Button>
        </div>
      </div>

      {/* Main Cover Letter Document Card (White Paper Preview) */}
      <div className="p-8 bg-white text-slate-900 border border-slate-300 rounded-2xl shadow-2xl max-w-3xl mx-auto space-y-6 select-text">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Cover Letter for {selectedJob?.title || 'Frontend Software Engineer'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Company: <span className="font-semibold text-slate-800">{selectedJob?.company || 'Anthropic'}</span>
              </p>
            </div>
            <Badge variant="dark" size="sm">AG-005 Linked</Badge>
          </div>
        </div>

        {/* Editable Cover Letter Text */}
        <textarea
          value={editableContent || coverLetter?.content || ''}
          onChange={e => setEditableContent(e.target.value)}
          rows={14}
          className="w-full p-4 rounded-xl border border-slate-200 text-xs leading-relaxed font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">Linked to Tailored ATS Resume Version</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-700 hover:text-slate-900"
            onClick={() => generateCoverLetterForSelectedJob()}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Regenerate Draft
          </Button>
        </div>
      </div>
    </div>
  );
};
