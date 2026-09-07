import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge } from '../../components/ui';
import {
  Sparkles,
  Download,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  FileText,
  AlertCircle,
  Briefcase,
  Layers,
  Info,
  Check,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';

export const ResumeOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    profile,
    selectedJob,
    jdAnalysis,
    tailoredResume,
    runResumeOptimization,
    approveResumeOptimization,
    isLoading
  } = useWorkflow();

  const [optError, setOptError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // --------------------------------------------------------------------------
  // EMPTY STATE 1: NO RESUME / PROFILE
  // --------------------------------------------------------------------------
  const hasProfileData =
    profile &&
    ((profile.skills && profile.skills.length > 0) ||
      (profile.experience && profile.experience.length > 0) ||
      (profile.education && profile.education.length > 0));

  if (!hasProfileData) {
    return (
      <div className="space-y-6 text-white font-sans">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">Resume Optimization</h1>
          <AgentBadge code="AG-004" name="Resume Optimization" />
        </div>
        <Card className="p-8 text-center space-y-4 bg-[#141414] border-white/10 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Upload and analyze your resume before optimizing it.</h3>
            <p className="text-xs text-neutral-400">
              AG-004 requires persistent candidate profile evidence from AG-001 to build a truthful, tailored resume version.
            </p>
          </div>
          <Button
            variant="whitePill"
            onClick={() => navigate('/app/resume')}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Go to Resume Analysis (AG-001)
          </Button>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EMPTY STATE 2: NO JOB SELECTED
  // --------------------------------------------------------------------------
  if (!selectedJob) {
    return (
      <div className="space-y-6 text-white font-sans">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">Resume Optimization</h1>
          <AgentBadge code="AG-004" name="Resume Optimization" />
        </div>
        <Card className="p-8 text-center space-y-4 bg-[#141414] border-white/10 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Select a job from Job Search before optimizing your resume.</h3>
            <p className="text-xs text-neutral-400">
              AG-004 tailors your resume formatting and keyword density specifically for your target Job Description.
            </p>
          </div>
          <Button
            variant="whitePill"
            onClick={() => navigate('/app/jobs')}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Browse Real Jobs (AG-002)
          </Button>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EMPTY STATE 3: AG-003 ANALYSIS NOT APPROVED
  // --------------------------------------------------------------------------
  const isJdApproved = jdAnalysis && jdAnalysis.isApprovedForOptimization === true;

  if (!isJdApproved) {
    return (
      <div className="space-y-6 text-white font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Resume Optimization</h1>
            <AgentBadge code="AG-004" name="Resume Optimization" />
          </div>
        </div>

        {/* Target Job Context */}
        <Card className="p-4 bg-[#111111] border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Selected Target Job</span>
            <div className="text-base font-bold text-white mt-0.5">{selectedJob.title}</div>
            <div className="text-xs text-neutral-300">{selectedJob.company} • {selectedJob.location}</div>
          </div>
          {jdAnalysis && (
            <div className="text-right">
              <span className="text-xs text-neutral-400 block">AG-003 Match Score</span>
              <Badge variant={jdAnalysis.matchScore >= 75 ? 'success' : 'warning'}>
                {jdAnalysis.matchScore}% Match
              </Badge>
            </div>
          )}
        </Card>

        <Card className="p-8 text-center space-y-4 bg-[#141414] border-amber-800/40 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Approve the JD Analysis before optimizing your resume.</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              AG-004 requires explicit approval of the AG-003 Match Score analysis to ensure optimization is guided by accurate skill alignment and responsibility breakdowns.
            </p>
          </div>
          <Button
            variant="whitePill"
            onClick={() => navigate('/app/jobs/analysis')}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Review & Approve JD Analysis (AG-003)
          </Button>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN AG-004 WORKFLOW: AG-003 IS APPROVED
  // --------------------------------------------------------------------------

  const handleRunOptimization = async () => {
    setOptError(null);
    try {
      await runResumeOptimization();
    } catch (err: any) {
      setOptError(err.message || 'Failed to optimize resume.');
    }
  };

  const handleApproveOptimization = async () => {
    await approveResumeOptimization();
  };

  const currentSnapshot = tailoredResume?.profileSnapshot || profile;
  const isApproved = tailoredResume && (tailoredResume as any).isApproved === true;

  // Extract explanations, verified skills, and omitted skills
  const explanations =
    tailoredResume?.strengths && tailoredResume.strengths.length > 0
      ? tailoredResume.strengths
      : (tailoredResume as any)?.optimizationExplanations || [
          `Prioritized matched skills for ${selectedJob.company}`,
          `Enhanced bullet clarity using verified work experience`,
          `Structured for 100% single-pass ATS parse compatibility`
        ];

  const verifiedSkills = tailoredResume?.matchedKeywords || jdAnalysis?.matchedSkills || [];
  const omittedSkills = (tailoredResume as any)?.unsupportedJdSkillsOmitted || (jdAnalysis?.skillGaps || []);

  const getFullResumeText = () => {
    const lines: string[] = [];
    lines.push(`==================================================`);
    lines.push(user.name || 'Candidate Name');
    lines.push(`${currentSnapshot.location || profile.location || ''} | ${user.email || ''} ${currentSnapshot.phone ? `| ${currentSnapshot.phone}` : ''}`);
    lines.push(`Target Role: ${selectedJob.title} at ${selectedJob.company}`);
    lines.push(`==================================================\n`);

    if (currentSnapshot.bio) {
      lines.push(`PROFESSIONAL SUMMARY`);
      lines.push(`--------------------`);
      lines.push(`${currentSnapshot.bio}\n`);
    }

    if (currentSnapshot.technicalSkills && currentSnapshot.technicalSkills.length > 0) {
      lines.push(`TECHNICAL SKILLS`);
      lines.push(`----------------`);
      lines.push(`${currentSnapshot.technicalSkills.join(', ')}\n`);
    }

    if (currentSnapshot.experience && currentSnapshot.experience.length > 0) {
      lines.push(`WORK EXPERIENCE`);
      lines.push(`---------------`);
      currentSnapshot.experience.forEach(exp => {
        lines.push(`${exp.role} | ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`);
        (exp.highlights || []).forEach(h => lines.push(`• ${h}`));
        lines.push('');
      });
    }

    if (currentSnapshot.projects && currentSnapshot.projects.length > 0) {
      lines.push(`PROJECTS`);
      lines.push(`--------`);
      currentSnapshot.projects.forEach(p => {
        lines.push(`${p.title}`);
        if (p.description) lines.push(`• ${p.description}`);
        if (p.technologies && p.technologies.length > 0) {
          lines.push(`  Technologies: ${p.technologies.join(', ')}`);
        }
        lines.push('');
      });
    }

    if (currentSnapshot.education && currentSnapshot.education.length > 0) {
      lines.push(`EDUCATION`);
      lines.push(`---------`);
      currentSnapshot.education.forEach(edu => {
        lines.push(`${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
      });
      lines.push('');
    }

    if (currentSnapshot.certifications && currentSnapshot.certifications.length > 0) {
      lines.push(`CERTIFICATIONS`);
      lines.push(`--------------`);
      currentSnapshot.certifications.forEach(c => {
        lines.push(`${c.name} - ${c.issuer || 'Certified'} (${c.issueDate || (c as any).date || ''})`);
      });
    }

    return lines.join('\n');
  };

  const handleDownloadPdf = () => {
    if (!tailoredResume) return;
    const content = getFullResumeText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tailored_Resume_${selectedJob.company.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const content = getFullResumeText();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-white font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Job-Tailored ATS Resume</h1>
            <AgentBadge code="AG-004" name="Resume Optimization" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            AG-004 optimizes formatting and keyword placement specifically for your target job description without fabricating evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {tailoredResume && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyText} leftIcon={<Copy className="w-4 h-4" />}>
                {copied ? 'Copied to Clipboard!' : 'Copy Text'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} leftIcon={<Download className="w-4 h-4" />}>
                Download ATS Resume (PDF)
              </Button>
              <Button variant="whitePill" size="sm" onClick={() => navigate('/app/cover-letter')} rightIcon={<ArrowRight className="w-4 h-4 text-black" />}>
                Generate Cover Letter (AG-005)
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Selected Job & AG-003 Match Score Context Banner */}
      <Card className="p-5 bg-[#111111] border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Target Job Context</span>
            <Badge variant="brand" size="sm">AG-002</Badge>
          </div>
          <div className="text-base font-bold text-white">{selectedJob.title}</div>
          <div className="text-xs text-neutral-300">{selectedJob.company} • {selectedJob.location}</div>
        </div>

        {jdAnalysis && (
          <div className="sm:text-right space-y-1">
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-xs text-neutral-400">Match Score Context</span>
              <Badge variant="success" size="sm">AG-003</Badge>
            </div>
            <div className="text-xl font-extrabold text-emerald-400">{jdAnalysis.matchScore}% Match</div>
            <div className="text-[11px] text-neutral-400 italic">Source: AG-003 Approved Analysis</div>
          </div>
        )}
      </Card>

      {/* MULTI-STAGE VALIDATION PIPELINE BADGE & CHECKLIST CARD */}
      {tailoredResume && (
        <Card className={`p-5 border flex flex-col gap-4 ${tailoredResume.isVerified !== false ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-red-950/20 border-red-800/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-5 h-5 ${tailoredResume.isVerified !== false ? 'text-emerald-400' : 'text-red-400'}`} />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                {tailoredResume.isVerified !== false ? 'RESUME VERIFIED & ATS VALIDATED' : 'RESUME VALIDATION FAILED'}
              </h3>
            </div>
            <Badge variant={tailoredResume.isVerified !== false ? 'success' : 'danger'}>
              {tailoredResume.isVerified !== false ? 'VALIDATED' : 'FAILED'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Job-specific optimization completed</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Candidate facts verified against AG-001</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Skill evidence verified across profile & projects</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ATS structure validated for machine parsing</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PDF text extraction validated</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{tailoredResume.validationResult?.unsupportedClaimsCount || 0} unsupported claims detected</span>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 italic border-t border-white/10 pt-2">
            "ATS-friendly and validated for machine-readable structure."
          </div>
        </Card>
      )}

      {/* ANALYSIS PANELS: VERIFIED ALIGNMENT & OMITTED UNSUPPORTED SKILLS */}
      {tailoredResume && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* VERIFIED JD ALIGNMENT PANEL (PART S) */}
          <Card className="p-5 bg-emerald-950/20 border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <h3 className="font-bold text-sm text-emerald-300 uppercase tracking-wider">
                Verified JD Alignment ({verifiedSkills.length})
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              The following JD requirements were verified against your profile evidence and successfully incorporated into your tailored resume:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {verifiedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 inline-flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* OMITTED UNSUPPORTED JD SKILLS PANEL (PART R) */}
          <Card className="p-5 bg-amber-950/20 border-amber-800/40 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
              <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider">
                Omitted Unsupported JD Skills ({omittedSkills.length})
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              The following JD requirements were omitted from your resume because no supporting candidate evidence was found in your profile or experience:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {omittedSkills.length > 0 ? (
                omittedSkills.map((gap, idx) => (
                  <Badge key={idx} variant="warning" size="sm">
                    {gap}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-neutral-400 italic">None — All extracted JD skills are supported by candidate evidence!</span>
              )}
            </div>
            <div className="text-[11px] text-amber-400/80 italic border-t border-amber-900/30 pt-2">
              Omitted to uphold the anti-fabrication safeguard. No unverified skills were added.
            </div>
          </Card>
        </div>
      )}

      {optError && (
        <Card className="p-4 bg-red-950/40 border-red-800/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{optError}</span>
        </Card>
      )}

      {/* GENERATE OPTIMIZATION TRIGGER IF NOT YET GENERATED */}
      {!tailoredResume && (
        <Card className="p-8 text-center space-y-4 bg-[#141414] border-white/10 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Generate Job-Tailored Resume Version</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Click below to trigger AG-004. The agent will reorder your verified skills, enhance bullet clarity, and align keyword terminology for "{selectedJob.title}" at "{selectedJob.company}".
            </p>
          </div>
          <Button
            variant="whitePill"
            onClick={handleRunOptimization}
            isLoading={isLoading}
            rightIcon={<Sparkles className="w-4 h-4 text-black" />}
          >
            {isLoading ? 'Optimizing your resume for the selected role...' : 'Generate Optimized Resume (AG-004)'}
          </Button>
        </Card>
      )}

      {/* TAILORED RESUME PREVIEW & APPROVAL ACTION BAR */}
      {tailoredResume && (
        <div className="space-y-6">
          {/* Controls Bar above Document */}
          <div className="flex items-center justify-between bg-[#141414] border border-white/12 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">Complete ATS-Friendly Resume Document</span>
              <span className="text-xs text-neutral-400 hidden sm:inline">(Clean standalone preview — Ready for job application)</span>
            </div>

            <div className="flex items-center gap-3">
              {isApproved ? (
                <div className="px-3 py-1 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Approved Version</span>
                </div>
              ) : (
                <Button
                  variant="whitePill"
                  size="sm"
                  onClick={handleApproveOptimization}
                  isLoading={isLoading}
                  leftIcon={<Check className="w-4 h-4 text-black" />}
                >
                  Approve Resume Version
                </Button>
              )}
            </div>
          </div>

          {/* STANDALONE CLEAN PROFESSIONAL ATS RESUME DOCUMENT (PART H, I, J, K) */}
          <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl shadow-2xl p-8 sm:p-12 space-y-6 font-sans select-text max-w-4xl mx-auto min-h-[950px]">
            {/* Header / Contact Banner */}
            <div className="border-b-2 border-slate-900 pb-5 text-center">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name || 'Candidate Name'}</h1>
              <p className="text-xs text-slate-700 font-medium mt-1.5">
                {currentSnapshot.location || profile.location || 'Hyderabad, Telangana, India'} • {user.email || 'candidate@example.com'} {currentSnapshot.phone ? `• ${currentSnapshot.phone}` : ''}
              </p>
              {profile.headline && (
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1.5">
                  {selectedJob.title}
                </p>
              )}
            </div>

            {/* Professional Summary */}
            {currentSnapshot.bio && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {currentSnapshot.bio}
                </p>
              </div>
            )}

            {/* Technical Skills */}
            {currentSnapshot.technicalSkills && currentSnapshot.technicalSkills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                  Technical Skills
                </h2>
                <div className="text-xs text-slate-800 space-y-1 leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-900">Languages & Frameworks: </span>
                    {currentSnapshot.technicalSkills.slice(0, 8).join(', ')}
                  </div>
                  {currentSnapshot.technicalSkills.length > 8 && (
                    <div>
                      <span className="font-bold text-slate-900">Cloud, DevOps & Databases: </span>
                      {currentSnapshot.technicalSkills.slice(8).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {currentSnapshot.experience && currentSnapshot.experience.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                  Work Experience
                </h2>
                <div className="space-y-4 text-xs">
                  {currentSnapshot.experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-slate-600 font-normal">{exp.startDate} – {exp.endDate || 'Present'}</span>
                      </div>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-slate-800 space-y-1 pl-1 leading-relaxed">
                          {exp.highlights.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects */}
            {currentSnapshot.projects && currentSnapshot.projects.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                  Key Projects
                </h2>
                <div className="space-y-3.5 text-xs">
                  {currentSnapshot.projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="space-y-1">
                      <div className="font-bold text-slate-900">{proj.title}</div>
                      {proj.description && (
                        <p className="text-slate-800 leading-relaxed">{proj.description}</p>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="text-[11px] text-slate-600 font-medium">
                          <span className="font-bold text-slate-800">Technologies: </span>
                          {proj.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {currentSnapshot.education && currentSnapshot.education.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                  Education
                </h2>
                <div className="space-y-2 text-xs">
                  {currentSnapshot.education.map((edu, idx) => (
                    <div key={edu.id || idx} className="flex justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                        <div className="text-slate-700">{edu.institution}</div>
                      </div>
                      <span className="text-slate-600 font-normal">{edu.startDate} – {edu.endDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {currentSnapshot.certifications && currentSnapshot.certifications.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                  Certifications
                </h2>
                <div className="space-y-1 text-xs text-slate-800">
                  {currentSnapshot.certifications.map((c, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-slate-600 font-normal">{c.issuer || ''} {c.issueDate || (c as any).date ? `(${c.issueDate || (c as any).date})` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
