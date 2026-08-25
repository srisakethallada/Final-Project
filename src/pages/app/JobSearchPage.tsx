import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, MatchScoreBadge, Input, AgentBadge } from '../../components/ui';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  DollarSign,
  Bookmark,
  ArrowRight,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Job } from '../../types';

export const JobSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, selectJob, profile } = useWorkflow();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('ALL');

  const filteredJobs = jobs.filter(j => {
    const matchesQuery = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         j.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedWorkMode === 'ALL' || j.workMode === selectedWorkMode;
    return matchesQuery && matchesMode;
  });

  const handleSelectJob = async (job: Job) => {
    await selectJob(job);
    navigate(`/app/jobs/${job.id}/analysis`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-900">Job Search & Match Discovery</h1>
            <AgentBadge code="AG-002" name="Job Search" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AG-002 continuously identifies job opportunities aligned with your structured profile & preferences.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4 bg-white">
        <div className="relative flex-1 w-full">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search job title, company, or keywords..."
            className="pl-10 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedWorkMode}
            onChange={e => setSelectedWorkMode(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
          >
            <option value="ALL">All Work Modes</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => (
          <Card key={job.id} className="p-6 flex flex-col justify-between hoverable">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-base font-outfit text-slate-900 leading-snug">{job.title}</h3>
                  <p className="text-xs font-semibold text-brand-600 mt-0.5">{job.company}</p>
                </div>
                <MatchScoreBadge score={job.relevanceScore} size="sm" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salaryRange}</span>
                <span>•</span>
                <Badge variant="slate" size="sm">{job.workMode}</Badge>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                Seeking a Frontend Software Engineer to build intuitive, high-performance UI components with React, TypeScript, and streaming AI backend integrations.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Posted {job.postedDate}</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelectJob(job)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Analyze JD & Skills
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
