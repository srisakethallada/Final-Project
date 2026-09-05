import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, MatchScoreBadge, Input, AgentBadge, EmptyState } from '../../components/ui';
import {
  Search,
  MapPin,
  DollarSign,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Job } from '../../types';

export const JobSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    jobs,
    allJds,
    profile,
    selectJob,
    runJobSearch,
    isLoading,
    jobSearchError,
    clearJobSearchError
  } = useWorkflow();

  const [searchQuery, setSearchQuery] = useState(profile.jobRole || '');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('ALL');

  // Trigger initial job search if profile exists and no jobs loaded yet
  useEffect(() => {
    if (jobs.length === 0 && profile.jobRole && !isLoading && !jobSearchError) {
      runJobSearch(searchQuery, { workMode: selectedWorkMode === 'ALL' ? undefined : selectedWorkMode });
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runJobSearch(searchQuery, { workMode: selectedWorkMode === 'ALL' ? undefined : selectedWorkMode });
  };

  const handleWorkModeChange = (newMode: string) => {
    setSelectedWorkMode(newMode);
    runJobSearch(searchQuery, { workMode: newMode === 'ALL' ? undefined : newMode });
  };

  const handleSelectJob = async (job: Job) => {
    await selectJob(job);
    navigate(`/app/jobs/${job.id}/analysis`);
  };

  const filteredJobs = jobs.filter(j => {
    const queryLower = searchQuery.toLowerCase();
    const jd = allJds[j.descriptionId];
    const matchesQuery = !searchQuery.trim() ||
                         j.title.toLowerCase().includes(queryLower) ||
                         j.company.toLowerCase().includes(queryLower) ||
                         j.location.toLowerCase().includes(queryLower) ||
                         (jd && jd.requiredSkills && jd.requiredSkills.some(s => s.toLowerCase().includes(queryLower)));
    const matchesMode = selectedWorkMode === 'ALL' || j.workMode === selectedWorkMode;
    return matchesQuery && matchesMode;
  });

  return (
    <div className="space-y-8 text-white font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Job Search & Match Discovery</h1>
            <AgentBadge code="AG-002" name="Job Search" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            AG-002 dynamically discovers, ranks, and matches real job listings against your AG-001 profile vector.
          </p>
        </div>

        <Button
          variant="darkPill"
          size="sm"
          onClick={() => runJobSearch(searchQuery, { workMode: selectedWorkMode === 'ALL' ? undefined : selectedWorkMode })}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          disabled={isLoading}
        >
          Refresh Jobs
        </Button>
      </div>

      {/* Active Profile Career Context Banner */}
      {profile.jobRole ? (
        <Card className="p-5 bg-[#1A1A1A] border-white/12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold font-mono">
                  AG-001 Career Context Source
                </span>
                <Badge variant="brand" size="sm">
                  {profile.jobRoleConfidence || 'HIGH'} Confidence
                </Badge>
              </div>
              <h3 className="font-extrabold text-white text-base mt-0.5">
                Target Role: {profile.jobRole}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Skills vector: {(profile.technicalSkills && profile.technicalSkills.length > 0 ? profile.technicalSkills : profile.skills).slice(0, 6).join(', ') || 'General profile'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Badge variant="dark" size="sm">
              {profile.preferences?.workMode || 'HYBRID'}
            </Badge>
            {profile.location && <span>• {profile.location}</span>}
          </div>
        </Card>
      ) : (
        <Card className="p-5 bg-[#1A1A1A] border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-sm">Resume Analysis Incomplete</h3>
              <p className="text-xs text-neutral-400">
                Upload your resume in AG-001 to automatically extract your career role and skills vector for personalized job matching.
              </p>
            </div>
          </div>
          <Button
            variant="whitePill"
            size="sm"
            onClick={() => navigate('/app/resume')}
            rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
          >
            Upload Resume
          </Button>
        </Card>
      )}

      {/* Error Alert Banner if Job Search fails */}
      {jobSearchError && (
        <Card className="p-4 bg-red-950/40 border-red-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-200 text-sm">Job Search Error</h4>
              <p className="text-xs text-red-300/80 mt-0.5">{jobSearchError}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="darkPill"
              size="sm"
              onClick={clearJobSearchError}
            >
              Dismiss
            </Button>
            <Button
              variant="whitePill"
              size="sm"
              onClick={() => runJobSearch(searchQuery, { workMode: selectedWorkMode === 'ALL' ? undefined : selectedWorkMode })}
            >
              Retry Search
            </Button>
          </div>
        </Card>
      )}

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearchSubmit}>
        <Card className="p-4 flex flex-col md:flex-row items-center gap-4 bg-[#1A1A1A] border-white/12">
          <div className="relative flex-1 w-full">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search job title, company, skills, or keywords..."
              className="pl-10 text-xs bg-[#111111]"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <select
              value={selectedWorkMode}
              onChange={e => handleWorkModeChange(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-xs bg-[#111111] text-white focus:outline-none focus:border-white/35 font-semibold"
            >
              <option value="ALL">All Work Modes</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">On-site</option>
            </select>

            <Button
              type="submit"
              variant="whitePill"
              size="md"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Card>
      </form>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6 bg-[#1A1A1A] border-white/12 space-y-4 animate-pulse">
              <div className="h-5 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/5 rounded w-1/2"></div>
              <div className="h-12 bg-white/5 rounded w-full"></div>
              <div className="h-8 bg-white/10 rounded w-full"></div>
            </Card>
          ))}
        </div>
      )}

      {/* Jobs Grid */}
      {!isLoading && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map(job => {
            const jd = allJds[job.descriptionId];
            const skills = jd?.requiredSkills || [];

            return (
              <Card key={job.id} className="p-6 flex flex-col justify-between hoverable bg-[#1A1A1A] border-white/12">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-white leading-snug">{job.title}</h3>
                      <p className="text-xs font-semibold text-neutral-400 mt-0.5">{job.company}</p>
                    </div>
                    <MatchScoreBadge score={job.relevanceScore} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-4 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-neutral-500" /> {job.salaryRange || 'Competitive'}
                    </span>
                    <span>•</span>
                    <Badge variant="dark" size="sm">{job.workMode}</Badge>
                  </div>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {skills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#111111] text-neutral-300 text-[10px] border border-white/10 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-500">
                    {job.postedDate ? `Posted ${job.postedDate}` : 'Recently posted'}
                  </span>

                  <div className="flex items-center gap-2">
                    {job.sourceUrl && (
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#111111] border border-white/15 text-neutral-400 hover:text-white hover:border-white/30 transition-all"
                        title="View Job Source"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <Button
                      variant="whitePill"
                      size="sm"
                      onClick={() => handleSelectJob(job)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 text-black" />}
                    >
                      Analyze JD & Skills
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State when no jobs match */}
      {!isLoading && filteredJobs.length === 0 && (
        <EmptyState
          icon={<Search className="w-10 h-10 text-neutral-500" />}
          title="No Matching Jobs Found"
          description={
            jobs.length === 0
              ? 'No jobs have been fetched yet. Click "Refresh Jobs" or search with a specific query.'
              : 'No jobs match your current search query or work mode filter. Try adjusting your query or resetting filters.'
          }
          action={
            <Button
              variant="whitePill"
              size="sm"
              onClick={() => {
                setSearchQuery(profile.jobRole || '');
                setSelectedWorkMode('ALL');
                runJobSearch(profile.jobRole || 'Software Engineer', { workMode: undefined });
              }}
              leftIcon={<RefreshCw className="w-4 h-4 text-black" />}
            >
              Fetch Target Jobs
            </Button>
          }
        />
      )}
    </div>
  );
};
