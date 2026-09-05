import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, MatchScoreBadge, AgentBadge, Input, EmptyState } from '../../components/ui';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  ShieldCheck,
  FileText,
  ExternalLink,
  PlusCircle,
  Clock,
  Award,
  BookOpen,
  HelpCircle,
  Check
} from 'lucide-react';

export const JDAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedJob,
    selectedJD,
    jdAnalysis,
    profile,
    runJDAnalysis,
    approveJdAnalysis,
    analyzeManualJd,
    isLoading
  } = useWorkflow();

  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [manualJdText, setManualJdText] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Check 1: Profile availability
  if (!profile.jobRole && profile.completeness === 0) {
    return (
      <div className="space-y-6 text-white font-sans">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">Job Description Analysis</h1>
          <AgentBadge code="AG-003" name="JD Analysis" />
        </div>
        <Card className="p-8 text-center bg-[#1A1A1A] border-amber-500/30 text-white space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Resume Profile Required</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Upload and analyze your resume before analyzing a job.
          </p>
          <Button
            variant="whitePill"
            size="md"
            onClick={() => navigate('/app/resume')}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Upload Master Resume
          </Button>
        </Card>
      </div>
    );
  }

  // Check 2: No job selected from AG-002 and no active analysis
  if (!selectedJob || !jdAnalysis) {
    const handleManualSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setManualError(null);
      try {
        await analyzeManualJd(manualTitle, manualCompany, manualJdText);
      } catch (err: any) {
        setManualError(err.message || 'Failed to analyze custom Job Description.');
      }
    };

    return (
      <div className="space-y-8 text-white font-sans pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Job Description Analysis</h1>
              <AgentBadge code="AG-003" name="JD Analysis" />
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              AG-003 parses requirements from a Job Description and compares against your AG-001 profile vector.
            </p>
          </div>

          <Button
            variant="darkPill"
            size="sm"
            onClick={() => navigate('/app/jobs')}
            rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
          >
            Browse Matched Jobs
          </Button>
        </div>

        <Card className="p-8 text-center bg-[#1A1A1A] border-white/12 text-white space-y-4">
          <FileText className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Job Currently Selected</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Select a job from Job Search to analyze its JD.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="whitePill"
              size="md"
              onClick={() => navigate('/app/jobs')}
              rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
            >
              Select Job from AG-002
            </Button>
            <Button
              variant="darkPill"
              size="md"
              onClick={() => setShowManualForm(!showManualForm)}
              leftIcon={<PlusCircle className="w-4 h-4 text-white" />}
            >
              {showManualForm ? 'Hide Manual Form' : 'Paste Custom JD'}
            </Button>
          </div>
        </Card>

        {showManualForm && (
          <Card className="p-6 bg-[#1A1A1A] border-white/15 space-y-5">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-white" /> Manual Job Description Analysis
            </h3>

            {manualError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300">
                {manualError}
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Job Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={manualTitle}
                    onChange={e => setManualTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="text-xs bg-[#111111]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Company Name
                  </label>
                  <Input
                    value={manualCompany}
                    onChange={e => setManualCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="text-xs bg-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Job Description Text <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={manualJdText}
                  onChange={e => setManualJdText(e.target.value)}
                  placeholder="Paste complete job description text here including requirements, responsibilities, and qualifications..."
                  rows={6}
                  className="w-full p-3 rounded-xl border border-white/15 bg-[#111111] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/35 font-sans"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="whitePill"
                size="md"
                isLoading={isLoading}
                rightIcon={<Sparkles className="w-4 h-4 text-black" />}
              >
                Analyze Job Description
              </Button>
            </form>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white font-sans pb-12">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Job Description Analysis</h1>
            <AgentBadge code="AG-003" name="JD Analysis" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            AG-003 extracts requirements from the JD and compares against your AG-001 profile vector to calculate Match Score & skill gaps.
          </p>
        </div>

        <Button variant="darkPill" size="sm" onClick={() => navigate('/app/jobs')}>
          Change Selected Job
        </Button>
      </div>

      {/* Active Job Context Card */}
      <Card className="p-6 bg-[#1A1A1A] border-white/12 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="dark">Active Job Context</Badge>
              {selectedJob.workMode && <Badge variant="dark" size="sm">{selectedJob.workMode}</Badge>}
            </div>
            <h2 className="text-2xl font-extrabold text-white">{selectedJob.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-neutral-500" /> {selectedJob.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {selectedJob.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-neutral-500" /> {selectedJob.salaryRange || 'Competitive'}
              </span>
              {selectedJob.sourceUrl && (
                <>
                  <span>•</span>
                  <a
                    href={selectedJob.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center gap-1 font-semibold"
                  >
                    View Original Posting <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Match Score Display */}
          <div className="bg-[#111111] px-6 py-5 rounded-2xl border border-white/15 text-center min-w-[170px] shrink-0">
            <span className="text-4xl font-extrabold font-display text-white">{jdAnalysis.matchScore}%</span>
            <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-bold mt-1">Resume Match Score</span>
            <span className="block text-[9px] text-neutral-500 mt-0.5 font-mono">Resume-to-JD Compatibility</span>
          </div>
        </div>
      </Card>

      {/* MATCH SCORE BREAKDOWN & SKILL MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Skills Alignment Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Matched Skills */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Matched Skills ({jdAnalysis.matchedSkills.length})
              </h3>
              <Badge variant="success" size="sm">Evidence Verified</Badge>
            </div>

            <p className="text-xs text-neutral-400">
              Skills requested in the Job Description that are supported by explicit evidence in your master profile.
            </p>

            {jdAnalysis.matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {jdAnalysis.matchedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-[#111111] text-emerald-300 border border-emerald-800/40 text-xs font-bold font-mono flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">No direct technical skill matches found in candidate profile.</p>
            )}
          </Card>

          {/* Identified Skill Gaps */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Identified Skill Gaps ({jdAnalysis.skillGaps.length})
              </h3>
              <Badge variant="dark" size="sm">No Profile Evidence</Badge>
            </div>

            <p className="text-xs text-neutral-400">
              Requirements in the JD without explicit evidence in your resume profile. Zero fake skills will be added.
            </p>

            {jdAnalysis.skillGaps.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {jdAnalysis.skillGaps.map((gap, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-[#111111] text-amber-300 border border-amber-800/40 text-xs font-bold font-mono flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {gap}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Excellent! All key technical requirements are supported by your profile.
              </p>
            )}
          </Card>

          {/* Required vs Preferred Requirements Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 bg-[#1A1A1A] border-white/12 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-300 font-mono">
                Required Technical Skills ({jdAnalysis.requiredSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(jdAnalysis.requiredSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#111111] text-white text-xs border border-white/10 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-[#1A1A1A] border-white/12 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 font-mono">
                Preferred / Nice-to-Have Skills ({jdAnalysis.preferredSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(jdAnalysis.preferredSkills || []).length > 0 ? (
                  jdAnalysis.preferredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#111111] text-neutral-300 text-xs border border-white/10 font-mono"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic">No specific preferred skills listed.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Evidence-Based Alignment Breakdown */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-white" /> Evidence-Based Qualification Alignment
            </h3>

            <div className="space-y-4 text-xs">
              {/* Responsibility Alignment Section */}
              <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-neutral-400" /> Responsibility Alignment
                </span>
                {jdAnalysis.responsibilityAlignment && jdAnalysis.responsibilityAlignment.length > 0 ? (
                  <div className="space-y-2.5">
                    {jdAnalysis.responsibilityAlignment.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white text-xs">{item.responsibility}</span>
                          <Badge
                            variant={
                              item.alignmentLevel === 'STRONG'
                                ? 'success'
                                : item.alignmentLevel === 'PARTIAL'
                                ? 'brand'
                                : 'dark'
                            }
                            size="sm"
                          >
                            {item.alignmentLevel === 'STRONG'
                              ? 'Strong Alignment'
                              : item.alignmentLevel === 'PARTIAL'
                              ? 'Partial Alignment'
                              : 'No Evidence'}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-mono">{item.evidence}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 italic font-sans text-xs">
                    Responsibility alignment evaluated against candidate experience highlights and project records.
                  </p>
                )}
              </div>

              {/* Experience Alignment */}
              <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-neutral-400" /> Experience Alignment
                  </span>
                  <Badge variant={jdAnalysis.experienceAlignment?.isAligned ? 'success' : 'dark'}>
                    {jdAnalysis.experienceAlignment?.isAligned ? 'Requirement Met' : 'Partial Match'}
                  </Badge>
                </div>
                <p className="text-neutral-300 leading-relaxed font-sans">
                  {jdAnalysis.experienceAlignment?.evidence || 'Candidate experience evaluated against JD requirements.'}
                </p>
              </div>

              {/* Education Alignment */}
              <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-neutral-400" /> Education Requirement
                  </span>
                  <Badge variant={jdAnalysis.educationAlignment?.isAligned ? 'success' : 'dark'}>
                    {jdAnalysis.educationAlignment?.isAligned ? 'Requirement Met' : 'No Evidence'}
                  </Badge>
                </div>
                <p className="text-neutral-300 leading-relaxed font-sans">
                  {jdAnalysis.educationAlignment?.evidence || 'Candidate education degree compared with JD requirements.'}
                </p>
              </div>

              {/* Certification Alignment */}
              <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-neutral-400" /> Certification Requirements
                  </span>
                  <Badge variant={jdAnalysis.certificationAlignment?.isAligned ? 'success' : 'dark'}>
                    {jdAnalysis.certificationAlignment?.isAligned ? 'Requirement Met' : 'No Evidence'}
                  </Badge>
                </div>
                <p className="text-neutral-300 leading-relaxed font-sans">
                  {jdAnalysis.certificationAlignment?.evidence || 'Candidate certifications compared with JD requirements.'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Score Breakdown & Recommendations */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
            <h3 className="font-bold text-base text-white">Score Weighting Breakdown</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-400">Technical Skill Match (40%)</span>
                  <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.skillMatch}%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-400">Preferred Skill Density (20%)</span>
                  <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.keywordMatch}%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-400">Experience Alignment (25%)</span>
                  <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.experienceMatch}%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-400">Education & Qualification (15%)</span>
                  <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.educationMatch}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations Card */}
          {jdAnalysis.recommendations && jdAnalysis.recommendations.length > 0 && (
            <Card className="p-6 space-y-3 bg-[#1A1A1A] border-white/12">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" /> Recommended Action Points
              </h3>
              <ul className="space-y-2 text-xs text-neutral-300">
                {jdAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-white font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* HUMAN-IN-THE-LOOP APPROVAL CHECKPOINT CARD */}
      <Card className="p-8 bg-[#1A1A1A] text-white rounded-3xl border border-white/15 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="brand">Human-in-the-Loop Checkpoint</Badge>
              <AgentBadge code="AG-004" name="Resume Optimization Boundary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Approve JD Analysis for Resume Optimization?
            </h3>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              By approving, you confirm that this JD Analysis accurately represents your target job requirements.
              AG-004 will consume this approved analysis. Clicking approve will <strong>NOT</strong> auto-execute AG-004.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            {jdAnalysis.isApprovedForOptimization ? (
              <div className="px-5 py-3 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Approved for Optimization
              </div>
            ) : (
              <Button
                variant="whitePill"
                size="lg"
                onClick={approveJdAnalysis}
                rightIcon={<CheckCircle2 className="w-5 h-5 text-black" />}
                className="w-full sm:w-auto"
              >
                Approve JD Analysis
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
