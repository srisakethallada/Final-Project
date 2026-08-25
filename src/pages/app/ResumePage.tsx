import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge, Progress } from '../../components/ui';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Eye,
  RefreshCw,
  X,
  Code,
  GraduationCap,
  Briefcase,
  Award
} from 'lucide-react';

export const ResumePage: React.FC = () => {
  const {
    resumes,
    resumeVersions,
    activeResumeVersion,
    profile,
    uploadAndAnalyzeResume,
    isLoading
  } = useWorkflow();

  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SKILLS' | 'EXPERIENCE' | 'VERSIONS'>('OVERVIEW');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadAndAnalyzeResume(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-900">Resume & Structured Profile</h1>
            <AgentBadge code="AG-001" name="Resume Analysis" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AG-001 parses uploaded resumes into machine-readable JSON schema stored in User Profile DB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-colors">
              <Upload className="w-4 h-4" /> Re-upload Resume
            </span>
            <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.png,.jpg" className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Resume Overview Banner */}
      <Card className="p-6 bg-gradient-to-br from-white via-slate-50 to-brand-50/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-500/20 shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-outfit text-slate-900">{resumes[0]?.originalFileName || 'Master Resume'}</h2>
                <Badge variant="success" size="sm">AG-001 Verified</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Uploaded: {resumes[0]?.uploadDate.split('T')[0] || '2026-08-20'} • File Size: {Math.round((resumes[0]?.fileSize || 348000) / 1024)} KB
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-600">
                <span>Skills Extracted: <strong className="text-slate-900">{profile.skills.length}</strong></span>
                <span>Work Experience: <strong className="text-slate-900">{profile.experience.length} roles</strong></span>
                <span>Education: <strong className="text-slate-900">{profile.education.length} degree</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center w-full md:w-40 shadow-xs">
              <span className="text-xl font-extrabold font-outfit text-emerald-600">{profile.completeness}%</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Completeness</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'OVERVIEW' ? 'border-brand-600 text-brand-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Extracted Overview
        </button>
        <button
          onClick={() => setActiveTab('SKILLS')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'SKILLS' ? 'border-brand-600 text-brand-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Skills Taxonomy ({profile.skills.length})
        </button>
        <button
          onClick={() => setActiveTab('EXPERIENCE')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'EXPERIENCE' ? 'border-brand-600 text-brand-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Work & Projects
        </button>
        <button
          onClick={() => setActiveTab('VERSIONS')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'VERSIONS' ? 'border-brand-600 text-brand-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Resume Versions ({resumeVersions.length})
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Strengths & Structure Notes */}
            <Card className="p-6">
              <h3 className="font-bold text-base font-outfit text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Key Resume Strengths (AG-001)
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {activeResumeVersion.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-base font-outfit text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Structure & Gap Notes
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {activeResumeVersion.weaknesses.concat(activeResumeVersion.structureNotes).map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-base font-outfit text-slate-900 mb-3">Extracted Personal Info</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Headline</span>
                  <span className="font-bold text-slate-900">{profile.headline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-semibold text-slate-800">{profile.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="font-semibold text-slate-800">{profile.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Summary</span>
                  <p className="text-slate-600 leading-relaxed mt-1">{profile.bio}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SKILLS */}
      {activeTab === 'SKILLS' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base font-outfit text-slate-900 mb-1">Technical Skills Taxonomy</h3>
            <p className="text-xs text-slate-500">Normalized skill records feeding AG-002 Job Search and AG-003 Match Score</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold font-mono">
                {skill}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* TAB CONTENT: VERSIONS */}
      {activeTab === 'VERSIONS' && (
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-base font-outfit text-slate-900 mb-2">Resume Versions History</h3>
          <div className="space-y-3">
            {resumeVersions.map(ver => (
              <div key={ver.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-outfit">{ver.versionName}</span>
                    {ver.isOriginal ? <Badge variant="slate" size="sm">Original</Badge> : <Badge variant="brand" size="sm">Tailored ATS</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Created: {ver.createdAt.split('T')[0]}</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
