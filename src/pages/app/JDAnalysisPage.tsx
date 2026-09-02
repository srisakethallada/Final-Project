import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, MatchScoreBadge, AgentBadge } from '../../components/ui';
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
  FileText
} from 'lucide-react';

export const JDAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedJob,
    selectedJD,
    jdAnalysis,
    profile,
    approveResumeOptimization,
    isLoading
  } = useWorkflow();

  const [optPromptAnswered, setOptPromptAnswered] = useState(false);

  if (!selectedJob || !jdAnalysis) {
    return (
      <Card className="p-8 text-center bg-[#1A1A1A] border-white/12 text-white">
        <p className="text-neutral-400">No job selected for analysis. Please choose a job from search results.</p>
        <Button variant="whitePill" className="mt-4" onClick={() => navigate('/app/jobs')}>
          Back to Job Search
        </Button>
      </Card>
    );
  }

  const handleOptimizeClick = async () => {
    await approveResumeOptimization();
    navigate('/app/resume/optimize');
  };

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Context Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Job Description Analysis</h1>
            <AgentBadge code="AG-003" name="JD Analysis" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            AG-003 parses requirements from the JD and compares against your structured profile to calculate Match Score & skill gaps.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => navigate('/app/jobs')}>
          Change Selected Job
        </Button>
      </div>

      {/* Selected Job Context Card */}
      <Card className="p-6 bg-[#1A1A1A] border-white/12 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Badge variant="dark" className="mb-2">
              Active Job Context
            </Badge>
            <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
            <p className="text-sm text-neutral-300 font-semibold mt-1">
              {selectedJob.company} • {selectedJob.location} • {selectedJob.salaryRange}
            </p>
          </div>

          {/* Match Score Display */}
          <div className="bg-[#111111] px-6 py-4 rounded-2xl border border-white/15 text-center min-w-[160px]">
            <span className="text-3xl font-extrabold font-display text-white">{jdAnalysis.matchScore}%</span>
            <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-bold mt-0.5">Resume Match Score</span>
          </div>
        </div>
      </Card>

      {/* MATCH BREAKDOWN & SKILL GAPS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Skills Alignment & Responsibilities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Matched Skills */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Matched Skills ({jdAnalysis.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {jdAnalysis.matchedSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-[#111111] text-emerald-300 border border-emerald-800/40 text-xs font-bold font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Critical Skill Gaps */}
          <Card className="p-6 bg-[#1A1A1A] border-white/12">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Identified Skill Gaps ({jdAnalysis.skillGaps.length})
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              These are skills requested by the JD that are not currently in your master profile. Zero fake claims will be added during optimization.
            </p>
            <div className="flex flex-wrap gap-2">
              {jdAnalysis.skillGaps.map((gap, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-[#111111] text-amber-300 border border-amber-800/40 text-xs font-bold font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {gap}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Score Breakdown */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
            <h3 className="font-bold text-base text-white">Score Breakdown</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-neutral-400">Technical Skill Match</span>
                <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.skillMatch}%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-neutral-400">Experience Alignment</span>
                <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.experienceMatch}%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-neutral-400">Education Requirement</span>
                <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.educationMatch}%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-neutral-400">Keyword Density</span>
                <span className="font-bold text-white">{jdAnalysis.scoreBreakdown.keywordMatch}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* HUMAN-IN-THE-LOOP RESUME OPTIMIZATION PROMPT CARD */}
      <Card className="p-8 bg-[#1A1A1A] text-white rounded-3xl border border-white/15 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge variant="dark">Human-in-the-Loop Checkpoint</Badge>
              <AgentBadge code="AG-004" name="Resume Optimization" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Would you like to optimize your resume for "{selectedJob.title}"?
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              AG-004 will re-order verified skills and apply ATS formatting rules specifically for {selectedJob.company}. No experience or skills will be fabricated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              variant="whitePill"
              size="lg"
              onClick={handleOptimizeClick}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5 text-black" />}
            >
              Yes, Optimize My Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setOptPromptAnswered(true)}
            >
              Not Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
