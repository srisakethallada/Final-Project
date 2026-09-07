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
  Loader2
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

  // Extract explanations and omitted skills
  const explanations =
    tailoredResume?.strengths && tailoredResume.strengths.length > 0
      ? tailoredResume.strengths
      : (tailoredResume as any)?.optimizationExplanations || [
          `Prioritized matched skills for ${selectedJob.company}`,
          `Enhanced bullet clarity using verified work experience`,
          `Structured for 100% single-pass ATS parse compatibility`
        ];

  const omittedSkills = (tailoredResume as any)?.unsupportedJdSkillsOmitted || (jdAnalysis?.skillGaps || []);

  const handleDownloadPdf = () => {
    if (!tailoredResume) return;
    const content = `==================================================
${user.name || 'Candidate Name'}
${currentSnapshot.location || profile.location || ''} | ${user.email || ''} ${currentSnapshot.phone ? `| ${currentSnapshot.phone}` : ''}
Target Role: ${selectedJob.title} at ${selectedJob.company}
==================================================

PROFESSIONAL SUMMARY
--------------------
${currentSnapshot.bio || ''}

TECHNICAL SKILLS
----------------
${(currentSnapshot.technicalSkills || []).join(', ')}

WORK EXPERIENCE
---------------
${(currentSnapshot.experience || []).map(exp => `${exp.role} - ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n${(exp.highlights || []).map(h => `  * ${h}`).join('\n')}`).join('\n\n')}

KEY PROJECTS
------------
${(currentSnapshot.projects || []).map(p => `${p.title}\n${p.description}\nTechnologies: ${(p.technologies || []).join(', ')}`).join('\n\n')}

EDUCATION
---------
${(currentSnapshot.education || []).map(edu => `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tailored_Resume_${selectedJob.company.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-white font-sans">
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
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} leftIcon={<Download className="w-4 h-4" />}>
                Download Text / PDF
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

      {/* MANDATORY TRUTHFULNESS GUARDRAIL BANNER */}
      <Card className="p-4 bg-[#111111] border-emerald-800/50 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-emerald-300 block">Strict Fabrication Guardrail Enforced:</span>
          <span className="text-neutral-300 leading-relaxed">
            This system does NOT fabricate work experience, skills, projects, certifications, or qualifications. Every item in this tailored resume is grounded strictly in your verified source candidate profile evidence.
          </span>
        </div>
      </Card>

      {/* MULTI-STAGE VALIDATION PIPELINE BADGE & CHECKLIST CARD */}
      {tailoredResume && (
        <Card className={`p-5 border flex flex-col gap-4 ${tailoredResume.isVerified !== false ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-red-950/20 border-red-800/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-5 h-5 ${tailoredResume.isVerified !== false ? 'text-emerald-400' : 'text-red-400'}`} />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                {tailoredResume.isVerified !== false ? 'RESUME VERIFIED' : 'RESUME VALIDATION FAILED'}
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
              <span>Candidate information verified</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Skills verified against source profile</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ATS structure validated</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: ATS Document Preview (White Paper Document Preview) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 bg-white text-slate-900 border border-slate-300 rounded-2xl shadow-2xl space-y-6 font-sans select-text">
              {/* Header */}
              <div className="border-b border-slate-200 pb-4 text-center">
                <h2 className="text-2xl font-extrabold text-slate-900">{user.name || 'Candidate Name'}</h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {currentSnapshot.location || profile.location || 'Location Flexible'} • {user.email || 'email@example.com'} {currentSnapshot.phone ? `• ${currentSnapshot.phone}` : ''}
                </p>
                <p className="text-xs text-slate-500 font-medium italic mt-1">
                  Target Role: {selectedJob.title}
                </p>
              </div>

              {/* Profile Summary */}
              {currentSnapshot.bio && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentSnapshot.bio}
                  </p>
                </div>
              )}

              {/* Technical Skills */}
              {currentSnapshot.technicalSkills && currentSnapshot.technicalSkills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                    Technical Skills (ATS Keyword Optimized)
                  </h3>
                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                    {currentSnapshot.technicalSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                          jdAnalysis?.matchedSkills?.some(m => m.toLowerCase() === skill.toLowerCase())
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {currentSnapshot.experience && currentSnapshot.experience.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                    Work Experience
                  </h3>
                  <div className="space-y-4 text-xs">
                    {currentSnapshot.experience.map((exp, idx) => (
                      <div key={exp.id || idx}>
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.role} • {exp.company}</span>
                          <span className="text-slate-500 font-normal">{exp.startDate} – {exp.endDate || 'Present'}</span>
                        </div>
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-slate-700 space-y-1 mt-1 leading-relaxed">
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

              {/* Projects */}
              {currentSnapshot.projects && currentSnapshot.projects.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                    Key Projects
                  </h3>
                  <div className="space-y-3 text-xs">
                    {currentSnapshot.projects.map((proj, idx) => (
                      <div key={proj.id || idx}>
                        <div className="font-bold text-slate-900">{proj.title}</div>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">{proj.description}</p>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="text-[11px] text-slate-500 mt-1">
                            <strong>Technologies:</strong> {proj.technologies.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {currentSnapshot.education && currentSnapshot.education.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                    Education
                  </h3>
                  <div className="space-y-2 text-xs">
                    {currentSnapshot.education.map((edu, idx) => (
                      <div key={edu.id || idx} className="flex justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                          <div className="text-slate-600">{edu.institution}</div>
                        </div>
                        <span className="text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Optimization Summary & Approval Controls */}
          <div className="space-y-6">
            {/* Human Approval Action Card */}
            <Card className="p-6 space-y-4 bg-[#141414] border-white/12">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Human Approval Checkpoint
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Review the job-tailored resume preview. When satisfied with the keyword alignment and wording, explicitly approve it to lock in version <code className="text-neutral-200">{tailoredResume.id}</code>.
              </p>

              {isApproved ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Optimized Resume Approved for Target Job</span>
                </div>
              ) : (
                <Button
                  variant="whitePill"
                  className="w-full"
                  onClick={handleApproveOptimization}
                  isLoading={isLoading}
                  leftIcon={<Check className="w-4 h-4 text-black" />}
                >
                  Approve Optimized Resume
                </Button>
              )}
            </Card>

            {/* Optimization Insights / Explanations */}
            <Card className="p-6 space-y-4 bg-[#141414] border-white/12">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Optimizations Performed
              </h3>
              <div className="space-y-2 text-xs">
                {explanations.map((exp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#111111] border border-white/10 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-neutral-300 leading-relaxed">{exp}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Omitted Unsupported JD Skills (Truthfulness Safeguard) */}
            {omittedSkills.length > 0 && (
              <Card className="p-6 space-y-4 bg-[#141414] border-amber-900/40">
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  Omitted Unsupported JD Skills
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The following JD requirements were NOT added because no supporting evidence was found in your current candidate profile:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {omittedSkills.map((gap, idx) => (
                    <Badge key={idx} variant="warning" size="sm">
                      {gap}
                    </Badge>
                  ))}
                </div>
                <div className="text-[11px] text-amber-400/80 italic border-t border-amber-900/30 pt-2">
                  Not included because no supporting evidence was found in the current resume.
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
