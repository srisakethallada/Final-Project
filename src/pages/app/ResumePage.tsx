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
  Award,
  ShieldCheck,
  Edit3,
  Check,
  Cpu,
  AlertCircle
} from 'lucide-react';

export const ResumePage: React.FC = () => {
  const {
    resumes,
    resumeVersions,
    activeResumeVersion,
    profile,
    uploadAndAnalyzeResume,
    confirmJobRole,
    isLoading,
    analysisError,
    clearAnalysisError
  } = useWorkflow();

  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SKILLS' | 'EXPERIENCE' | 'VERSIONS'>('OVERVIEW');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await uploadAndAnalyzeResume(e.target.files[0]);
      } catch (err) {
        // Error managed in WorkflowContext
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      try {
        await uploadAndAnalyzeResume(e.dataTransfer.files[0]);
      } catch (err) {
        // Error managed in WorkflowContext
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleConfirmRole = () => {
    const roleToConfirm = customRoleInput.trim() || profile.jobRole || 'Software Engineer';
    confirmJobRole(roleToConfirm);
    setIsEditingRole(false);
  };

  const activeVersion = activeResumeVersion || (resumeVersions.length > 0 ? resumeVersions[0] : null);

  return (
    <div className="space-y-8 text-white font-sans pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Resume & Structured Profile</h1>
            <AgentBadge code="AG-001" name="Resume Analysis" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            AG-001 parses uploaded resumes into a single machine-readable profile powering downstream agents.
          </p>
        </div>

        {resumes.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md transition-colors">
                <Upload className="w-4 h-4 text-black" /> Re-upload Resume
              </span>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>
        )}
      </div>

      {/* ERROR STATE BANNER */}
      {analysisError && (
        <Card className="p-6 bg-red-950/40 border-red-500/30 text-white space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-red-200">Resume Processing Failed</h3>
              <pre className="text-xs text-red-300 font-mono mt-1 whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-xl border border-red-500/20">
                {analysisError}
              </pre>
              <div className="flex items-center gap-3 mt-4">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Try Upload Again
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                  />
                </label>
                <Button variant="ghost" size="sm" onClick={clearAnalysisError} className="text-neutral-400">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* LOADING / PROCESSING STATE */}
      {isLoading && (
        <Card className="p-8 bg-[#1A1A1A] border-white/12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto animate-pulse">
            <Cpu className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AG-001 Analyzing Entire Resume...</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              Extracting structural content, normalizing skills taxonomy, and determining best-fit job role across complete resume evidence.
            </p>
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <Progress value={65} className="h-2" />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Parsing File Streams</span>
              <span>Analyzing Career Evidence</span>
              <span>Persisting Profile</span>
            </div>
          </div>
        </Card>
      )}

      {/* EMPTY STATE — NO RESUME UPLOADED YET */}
      {resumes.length === 0 && !isLoading && !analysisError && (
        <Card className="p-10 bg-[#1A1A1A] border-white/12 text-center space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
              dragActive ? 'border-white bg-white/10 scale-[0.99]' : 'border-white/20 hover:border-white/40 bg-[#111111]'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-4 border border-white/15">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Your Master Resume</h3>
            <p className="text-xs text-neutral-400 max-w-lg mx-auto mb-6">
              AG-001 will parse your resume into a single structured, machine-readable career profile.
              Supports PDF, DOC, DOCX, and Image formats (Max 10MB). Zero fake user data.
            </p>

            <label className="cursor-pointer inline-block">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-sm font-semibold shadow-xl transition-all hover:scale-105">
                <FileText className="w-4 h-4 text-black" /> Select Resume File
              </span>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                className="hidden"
              />
            </label>
          </div>
        </Card>
      )}

      {/* RESUME LOADED STATE */}
      {resumes.length > 0 && !isLoading && (
        <>
          {/* Main Resume Overview Header Banner */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-xl border border-white/15 shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{resumes[0]?.originalFileName}</h2>
                    <Badge variant="success" size="sm">AG-001 Active</Badge>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Uploaded: {new Date(resumes[0]?.uploadDate).toLocaleDateString()} • Format: {resumes[0]?.fileType} • File Size: {Math.round((resumes[0]?.fileSize || 0) / 1024)} KB
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium text-neutral-300">
                    <span>Skills Extracted: <strong className="text-white">{profile.skills.length}</strong></span>
                    <span>Work Experience: <strong className="text-white">{profile.experience.length} roles</strong></span>
                    <span>Education: <strong className="text-white">{profile.education.length} entries</strong></span>
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

          {/* CRITICAL FEATURE: ANALYZED JOB ROLE & CAREER EVIDENCE BANNER */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Analyzed Target Job Role</span>
                  <Badge
                    variant={profile.jobRoleConfidence === 'HIGH' ? 'success' : profile.jobRoleConfidence === 'MEDIUM' ? 'brand' : 'warning'}
                    size="sm"
                  >
                    {profile.jobRoleConfidence || 'HIGH'} Confidence
                  </Badge>
                  {profile.jobRoleNeedsConfirmation && (
                    <Badge variant="warning" size="sm">Confirmation Suggested</Badge>
                  )}
                </div>

                {!isEditingRole ? (
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">
                      {profile.jobRole || 'Software Engineer'}
                    </h3>
                    <button
                      onClick={() => {
                        setCustomRoleInput(profile.jobRole || '');
                        setIsEditingRole(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
                      title="Edit detected role"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      value={customRoleInput}
                      onChange={e => setCustomRoleInput(e.target.value)}
                      className="px-3 py-1.5 bg-[#111111] border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-white flex-1"
                      placeholder="Enter job role..."
                    />
                    <Button variant="whitePill" size="sm" onClick={handleConfirmRole} leftIcon={<Check className="w-3.5 h-3.5" />}>
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingRole(false)}>
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Role Evidence Bullet Points */}
                <div className="pt-2">
                  <span className="text-xs text-neutral-400 font-semibold block mb-2">
                    Evidence from complete resume analysis:
                  </span>
                  {profile.jobRoleEvidence && profile.jobRoleEvidence.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {profile.jobRoleEvidence.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      Role calculated from cumulative work experience, technical skill taxonomy, and project highlights.
                    </p>
                  )}
                </div>
              </div>

              {profile.jobRoleNeedsConfirmation && !isEditingRole && (
                <div className="bg-[#111111] p-4 rounded-2xl border border-amber-500/30 space-y-3 shrink-0 max-w-xs">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" /> Role Confirmation Required
                  </div>
                  <p className="text-xs text-neutral-300">
                    Is <strong>"{profile.jobRole}"</strong> your exact intended target role?
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="whitePill" size="sm" onClick={handleConfirmRole} className="w-full">
                      Confirm Role
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Navigation Tabs */}
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
              Work & Projects ({profile.experience.length + profile.projects.length})
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
                {/* Strengths */}
                {activeVersion && activeVersion.strengths && activeVersion.strengths.length > 0 && (
                  <Card className="p-6 bg-[#1A1A1A] border-white/12">
                    <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Evidence-Supported Strengths
                    </h3>
                    <ul className="space-y-2.5 text-xs text-neutral-300">
                      {activeVersion.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#111111] border border-white/10">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Structure & Weakness Notes */}
                {activeVersion && (activeVersion.weaknesses?.length > 0 || activeVersion.structureNotes?.length > 0) && (
                  <Card className="p-6 bg-[#1A1A1A] border-white/12">
                    <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" /> Structure & Development Gaps
                    </h3>
                    <ul className="space-y-2.5 text-xs text-neutral-300">
                      {(activeVersion.weaknesses || []).concat(activeVersion.structureNotes || []).map((note, i) => (
                        <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#111111] border border-white/10">
                          <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-[#1A1A1A] border-white/12">
                  <h3 className="font-bold text-base text-white mb-3">Extracted Personal Information</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Stated Designation / Headline</span>
                      <span className="font-bold text-white">{profile.headline || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Location</span>
                      <span className="font-semibold text-neutral-300">{profile.location || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Phone</span>
                      <span className="font-semibold text-neutral-300">{profile.phone || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold">Summary</span>
                      <p className="text-neutral-400 leading-relaxed mt-1">{profile.bio || 'No professional summary section found.'}</p>
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
                <p className="text-xs text-neutral-400">Normalized skill records extracted from your uploaded resume file.</p>
              </div>

              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-[#111111] text-white border border-white/15 text-xs font-bold font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">No skills taxonomy extracted yet.</p>
              )}
            </Card>
          )}

          {/* TAB CONTENT: EXPERIENCE */}
          {activeTab === 'EXPERIENCE' && (
            <div className="space-y-6">
              <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
                <h3 className="font-bold text-base text-white">Extracted Work Experience</h3>
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-4">
                    {profile.experience.map(exp => (
                      <div key={exp.id} className="p-4 rounded-2xl border border-white/10 bg-[#111111] space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                            <span className="text-xs text-neutral-400">{exp.company} • {exp.location}</span>
                          </div>
                          <span className="text-xs text-neutral-500 font-mono">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="space-y-1 text-xs text-neutral-300 pt-2">
                            {exp.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 shrink-0"></span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No work experience entries extracted.</p>
                )}
              </Card>

              <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
                <h3 className="font-bold text-base text-white">Extracted Projects</h3>
                {profile.projects && profile.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.projects.map(proj => (
                      <div key={proj.id} className="p-4 rounded-2xl border border-white/10 bg-[#111111] space-y-2">
                        <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                        <p className="text-xs text-neutral-400">{proj.description}</p>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {proj.technologies.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No project entries extracted.</p>
                )}
              </Card>
            </div>
          )}

          {/* TAB CONTENT: VERSIONS */}
          {activeTab === 'VERSIONS' && (
            <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
              <h3 className="font-bold text-base text-white mb-2">Resume Versions History (DATA-004)</h3>
              <div className="space-y-3">
                {resumeVersions.map(ver => (
                  <div key={ver.id} className="p-4 rounded-2xl border border-white/10 bg-[#111111] flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{ver.versionName}</span>
                        {ver.isOriginal ? <Badge variant="dark" size="sm">Original</Badge> : <Badge variant="slate" size="sm">Tailored ATS</Badge>}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Created: {new Date(ver.createdAt).toLocaleString()} • Detected Role: {ver.detectedJobRole || 'Software Engineer'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
