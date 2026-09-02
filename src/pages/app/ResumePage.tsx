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
    <div className="space-y-8 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Resume & Structured Profile</h1>
            <AgentBadge code="AG-001" name="Resume Analysis" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            AG-001 parses uploaded resumes into machine-readable JSON schema stored in User Profile DB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md transition-colors">
              <Upload className="w-4 h-4 text-black" /> Re-upload Resume
            </span>
            <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.png,.jpg" className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Resume Overview Banner */}
      <Card className="p-6 bg-[#1A1A1A] border-white/12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-xl border border-white/15 shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{resumes[0]?.originalFileName || 'Master Resume'}</h2>
                <Badge variant="success" size="sm">AG-001 Verified</Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Uploaded: {resumes[0]?.uploadDate.split('T')[0] || '2026-08-20'} • File Size: {Math.round((resumes[0]?.fileSize || 348000) / 1024)} KB
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs font-medium text-neutral-300">
                <span>Skills Extracted: <strong className="text-white">{profile.skills.length}</strong></span>
                <span>Work Experience: <strong className="text-white">{profile.experience.length} roles</strong></span>
                <span>Education: <strong className="text-white">{profile.education.length} degree</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="bg-[#111111] p-3 rounded-xl border border-white/12 text-center w-full md:w-40">
              <span className="text-xl font-extrabold font-display text-white">{profile.completeness}%</span>
              <span className="block text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Completeness</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/12 text-xs font-semibold text-neutral-400">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'OVERVIEW' ? 'border-white text-white font-bold' : 'border-transparent hover:text-white'}`}
        >
          Extracted Overview
        </button>
        <button
          onClick={() => setActiveTab('SKILLS')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'SKILLS' ? 'border-white text-white font-bold' : 'border-transparent hover:text-white'}`}
        >
          Skills Taxonomy ({profile.skills.length})
        </button>
        <button
          onClick={() => setActiveTab('EXPERIENCE')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'EXPERIENCE' ? 'border-white text-white font-bold' : 'border-transparent hover:text-white'}`}
        >
          Work & Projects
        </button>
        <button
          onClick={() => setActiveTab('VERSIONS')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'VERSIONS' ? 'border-white text-white font-bold' : 'border-transparent hover:text-white'}`}
        >
          Resume Versions ({resumeVersions.length})
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Strengths & Structure Notes */}
            <Card className="p-6 bg-[#1A1A1A] border-white/12">
              <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Resume Strengths (AG-001)
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                {activeResumeVersion.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#111111] border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-[#1A1A1A] border-white/12">
              <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Structure & Gap Notes
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                {activeResumeVersion.weaknesses.concat(activeResumeVersion.structureNotes).map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#111111] border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-[#1A1A1A] border-white/12">
              <h3 className="font-bold text-base text-white mb-3">Extracted Personal Info</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Headline</span>
                  <span className="font-bold text-white">{profile.headline}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-semibold text-neutral-300">{profile.location}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="font-semibold text-neutral-300">{profile.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Summary</span>
                  <p className="text-neutral-400 leading-relaxed mt-1">{profile.bio}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SKILLS */}
      {activeTab === 'SKILLS' && (
        <Card className="p-6 space-y-6 bg-[#1A1A1A] border-white/12">
          <div>
            <h3 className="font-bold text-base text-white mb-1">Technical Skills Taxonomy</h3>
            <p className="text-xs text-neutral-400">Normalized skill records feeding AG-002 Job Search and AG-003 Match Score</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-[#111111] text-white border border-white/15 text-xs font-bold font-mono">
                {skill}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* TAB CONTENT: VERSIONS */}
      {activeTab === 'VERSIONS' && (
        <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
          <h3 className="font-bold text-base text-white mb-2">Resume Versions History</h3>
          <div className="space-y-3">
            {resumeVersions.map(ver => (
              <div key={ver.id} className="p-4 rounded-2xl border border-white/10 bg-[#111111] flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ver.versionName}</span>
                    {ver.isOriginal ? <Badge variant="dark" size="sm">Original</Badge> : <Badge variant="slate" size="sm">Tailored ATS</Badge>}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">Created: {ver.createdAt.split('T')[0]}</p>
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
