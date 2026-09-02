import React from 'react';
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
  Copy,
  Eye,
  RefreshCw
} from 'lucide-react';

export const ResumeOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedJob,
    tailoredResume,
    activeResumeVersion,
    generateCoverLetterForSelectedJob,
    isLoading
  } = useWorkflow();

  const activeVersion = tailoredResume || activeResumeVersion;

  const handleGenerateCoverLetter = async () => {
    await generateCoverLetterForSelectedJob();
    navigate('/app/cover-letter');
  };

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Tailored ATS Resume</h1>
            <AgentBadge code="AG-004" name="Resume Optimization" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            AG-004 optimizes formatting and keyword placement specifically for your target job description.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Download PDF
          </Button>
          <Button
            variant="whitePill"
            size="sm"
            onClick={handleGenerateCoverLetter}
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Generate Cover Letter (AG-005)
          </Button>
        </div>
      </div>

      {/* MANDATORY TRUTHFULNESS GUARDRAIL BANNER */}
      <Card className="p-4 bg-[#111111] border-emerald-800/50 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-emerald-300 block">Strict Fabrication Guardrail Enforced:</span>
          <span className="text-neutral-300">
            This system does NOT fabricate work experience, skills, projects, certifications, or qualifications. Every item in this tailored resume is grounded only in your verified source profile.
          </span>
        </div>
      </Card>

      {/* Main Resume Comparison & Tailored Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Tailored Resume Document Preview (White Paper Document Preview) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-white text-slate-900 border border-slate-300 rounded-2xl shadow-2xl space-y-6 font-sans select-text">
            <div className="border-b border-slate-200 pb-4 text-center">
              <h2 className="text-2xl font-extrabold text-slate-900">Sri Saketh</h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                San Francisco, CA • saketh@example.com • +1 (555) 234-5678
              </p>
              <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                Target Role: {selectedJob?.title || 'Frontend Software Engineer'}
              </p>
            </div>

            {/* Profile Summary */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Full Stack & Frontend Engineer with 2+ years of experience building high-performance web applications using React, TypeScript, Node.js, and AWS. Proven track record of reducing rendering latency by 35% and constructing real-time data integrations.
              </p>
            </div>

            {/* Re-ordered ATS Matched Skills */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                Technical Skills (ATS Keyword Optimized)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Core Frontend & Languages:</strong> React, TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS, REST APIs<br />
                <strong>Backend & Cloud:</strong> Node.js, Python, AWS (Certified Cloud Practitioner), Docker, PostgreSQL, Git
              </p>
            </div>

            {/* Work History */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                Work Experience
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Frontend Engineering Intern • TechPulse Solutions</span>
                    <span>May 2025 – Aug 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 mt-1 leading-relaxed">
                    <li>Developed responsive React component library reducing UI rendering latency by 35%.</li>
                    <li>Integrated RESTful microservices and state management using TypeScript and Redux Toolkit.</li>
                    <li>Collaborated with UX designers to translate Figma designs into pixel-perfect frontend code.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Optimization Highlights */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
            <h3 className="font-bold text-base text-white">Optimization Insights</h3>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-[#111111] border border-white/10">
                <span className="font-bold text-white block mb-1">ATS Parse Compatibility</span>
                <span>Single-column format, standard font hierarchy, zero table layout traps.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-emerald-800/40">
                <span className="font-bold text-emerald-300 block mb-1">Matched Keywords</span>
                <span>React, TypeScript, REST APIs, Tailwind CSS, AWS, Docker</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
