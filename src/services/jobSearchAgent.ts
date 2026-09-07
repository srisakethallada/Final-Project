// ============================================================================
// AG-002: JOB SEARCH AGENT (AI CAREER OS CORE INTELLIGENCE ENGINE)
// Data-Driven External Job Search, Deduplication, & Deterministic Relevance Ranking
// ============================================================================

import { UserProfile, Job, JobDescription } from '../types';
import { isLocationMatching } from '../data/locationData';

export interface RawJSearchResponse {
  status: string;
  data: any[];
}

export interface StructuredLocationFilter {
  country?: string;
  state?: string;
  city?: string;
  workMode?: string;
}

export interface PipelineMetrics {
  rawCount: number;
  normalizedCount: number;
  locationFilteredCount: number;
  relevanceFilteredCount: number;
  workModeFilteredCount: number;
  dedupedCount: number;
  finalCount: number;
}

/**
 * Builds search query dynamically using AG-001 career profile and structured location filters
 */
export const buildSearchQuery = (
  profile: UserProfile,
  filterQuery?: string,
  locationFilter?: string | StructuredLocationFilter
): string => {
  const queryParts: string[] = [];

  // 1. Role or search query term
  if (filterQuery && filterQuery.trim()) {
    queryParts.push(filterQuery.trim());
  } else if (profile.jobRole && profile.jobRole.trim()) {
    queryParts.push(profile.jobRole.trim());
  } else if (profile.headline && profile.headline.trim()) {
    queryParts.push(profile.headline.trim());
  } else {
    queryParts.push('Software Engineer');
  }

  // 2. Structured Geographic Location
  let locationStr = '';
  if (typeof locationFilter === 'object' && locationFilter !== null) {
    const parts: string[] = [];
    if (locationFilter.city && locationFilter.city.trim()) parts.push(locationFilter.city.trim());
    if (locationFilter.state && locationFilter.state.trim()) parts.push(locationFilter.state.trim());
    if (locationFilter.country && locationFilter.country.trim()) parts.push(locationFilter.country.trim());
    locationStr = parts.join(', ');
  } else if (typeof locationFilter === 'string' && locationFilter.trim()) {
    locationStr = locationFilter.trim();
  } else {
    const prefs = profile.preferences;
    if (prefs?.city || prefs?.state || prefs?.country) {
      const parts: string[] = [];
      if (prefs.city && prefs.city.trim()) parts.push(prefs.city.trim());
      if (prefs.state && prefs.state.trim()) parts.push(prefs.state.trim());
      if (prefs.country && prefs.country.trim()) parts.push(prefs.country.trim());
      locationStr = parts.join(', ');
    } else {
      locationStr = profile.location || prefs?.preferredLocation || '';
    }
  }

  if (locationStr && !locationStr.toLowerCase().includes('remote') && locationStr.length >= 2) {
    queryParts.push(`in ${locationStr}`);
  }

  return queryParts.join(' ');
};

/**
 * Calculates flexible relevance score (0-100%) matching job against AG-001 profile
 */
export const calculateRelevanceScore = (
  title: string,
  descriptionText: string,
  workMode: string,
  location: string,
  profile: UserProfile
): number => {
  let score = 50; // Baseline relevance for real external job result

  const targetRole = (profile.jobRole || profile.headline || '').toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerJd = descriptionText.toLowerCase();

  // 1. Role Title Alignment (up to +30 points)
  if (targetRole && lowerTitle.includes(targetRole)) {
    score += 30;
  } else {
    // Check partial title match & token overlap (e.g. Cloud, DevOps, SRE, Systems, Engineer, Developer)
    const roleWords = targetRole
      .replace(/[^a-z0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && w !== 'engineer' && w !== 'developer');

    if (roleWords.length > 0) {
      const matchedWords = roleWords.filter(w => lowerTitle.includes(w) || lowerJd.includes(w));
      score += Math.round((matchedWords.length / roleWords.length) * 20);
    }
  }

  // 2. Technical Skill Matching (up to +30 points)
  const skillsToMatch = profile.technicalSkills.length > 0 ? profile.technicalSkills : profile.skills;
  if (skillsToMatch.length > 0) {
    let matchedSkillCount = 0;
    for (const skill of skillsToMatch) {
      if (lowerTitle.includes(skill.toLowerCase()) || lowerJd.includes(skill.toLowerCase())) {
        matchedSkillCount++;
      }
    }
    const skillRatio = matchedSkillCount / skillsToMatch.length;
    score += Math.round(skillRatio * 30);
  }

  // 3. Work Mode & Location Match (+10 points)
  const prefWorkMode = profile.preferences?.workMode || 'ANY';
  if (prefWorkMode === 'ANY' || workMode === prefWorkMode || workMode === 'REMOTE') {
    score += 10;
  }

  return Math.min(99, Math.max(45, score));
};

/**
 * Normalizes raw JSearch API item into project Job and JobDescription domain objects
 */
export const normalizeJSearchItem = (
  item: any,
  idx: number,
  profile: UserProfile
): { job: Job; jd: JobDescription; rawItem: any } => {
  const jobId = `job_${item.job_id || Date.now()}_${idx}`;
  const descriptionId = `jd_${jobId}`;

  const title = item.job_title || 'Software Engineering Role';
  const company = item.employer_name || 'Technology Company';
  const companyId = `comp_${company.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  const city = item.job_city || '';
  const state = item.job_state || '';
  const country = item.job_country || '';
  const location = item.job_is_remote
    ? 'Remote'
    : city
    ? `${city}${state ? `, ${state}` : ''}${country ? ` (${country})` : ''}`
    : country || 'United States';

  const workMode: 'REMOTE' | 'HYBRID' | 'ONSITE' = item.job_is_remote
    ? 'REMOTE'
    : (item.job_employment_type || '').toUpperCase().includes('HYBRID')
    ? 'HYBRID'
    : 'ONSITE';

  const jobType: 'FULL_TIME' | 'CONTRACT' | 'INTERNSHIP' = (item.job_employment_type || '')
    .toUpperCase()
    .includes('CONTRACT')
    ? 'CONTRACT'
    : (item.job_employment_type || '').toUpperCase().includes('INTERN')
    ? 'INTERNSHIP'
    : 'FULL_TIME';

  let salaryRange: string | undefined = undefined;
  if (item.job_min_salary && item.job_max_salary) {
    const minK = Math.round(item.job_min_salary / 1000);
    const maxK = Math.round(item.job_max_salary / 1000);
    const currency = item.job_salary_currency === 'USD' ? '$' : item.job_salary_currency || '$';
    salaryRange = `${currency}${minK}k - ${currency}${maxK}k/yr`;
  } else if (item.job_min_salary) {
    const minK = Math.round(item.job_min_salary / 1000);
    salaryRange = `$${minK}k+/yr`;
  }

  const postedDate = item.job_posted_at_datetime_utc
    ? new Date(item.job_posted_at_datetime_utc).toISOString().split('T')[0]
    : 'Recently';

  const fullText = item.job_description || `${title} position at ${company}. ${location}.`;

  const relevanceScore = calculateRelevanceScore(title, fullText, workMode, location, profile);

  const sourceUrl = item.job_apply_link || item.job_google_link || undefined;

  const job: Job = {
    id: jobId,
    title,
    company,
    companyId,
    location,
    workMode,
    jobType,
    salaryRange,
    postedDate,
    descriptionId,
    sourceUrl,
    relevanceScore
  };

  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];

  if (profile.technicalSkills && profile.technicalSkills.length > 0) {
    for (const skill of profile.technicalSkills) {
      if (fullText.toLowerCase().includes(skill.toLowerCase())) {
        requiredSkills.push(skill);
      }
    }
  }

  const jd: JobDescription = {
    id: descriptionId,
    jobId,
    fullText,
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : (profile.skills || []).slice(0, 5),
    preferredSkills: preferredSkills,
    responsibilities: [
      `Design and implement engineering solutions for ${title} role.`,
      `Collaborate with engineering teams at ${company}.`,
      'Maintain code quality, performance, and automation standards.'
    ],
    qualifications: [
      'Bachelor degree in technical discipline or equivalent industry experience.',
      'Hands-on experience with modern software development and cloud tools.'
    ],
    experienceYearsRequired: lowerTextIncludesSenior(title, fullText) ? 4 : 2
  };

  return { job, jd, rawItem: item };
};

const lowerTextIncludesSenior = (title: string, fullText: string): boolean => {
  const combined = (title + ' ' + fullText).toLowerCase();
  return combined.includes('senior') || combined.includes('sr.') || combined.includes('lead');
};

/**
 * Deduplicates jobs based on company + title + location hash
 */
export const deduplicateJobs = (
  jobPairs: { job: Job; jd: JobDescription }[]
): { job: Job; jd: JobDescription }[] => {
  const seenKeys = new Set<string>();
  const uniquePairs: { job: Job; jd: JobDescription }[] = [];

  for (const pair of jobPairs) {
    const key = `${pair.job.company.toLowerCase()}_${pair.job.title.toLowerCase()}_${pair.job.location.toLowerCase()}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniquePairs.push(pair);
    }
  }

  return uniquePairs;
};

/**
 * Executes AG-002 Job Search pipeline against server API backend with full diagnostic metrics
 */
export const fetchJobsFromApi = async (
  profile: UserProfile,
  filterQuery?: string,
  filterLocation?: string | StructuredLocationFilter
): Promise<{ jobs: Job[]; jds: Record<string, JobDescription>; pipelineMetrics: PipelineMetrics }> => {
  const searchQuery = buildSearchQuery(profile, filterQuery, filterLocation);
  const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';

  let response: Response | null = null;
  let lastErr: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const currentHost = attempt % 2 === 1 ? 'http://localhost:3000' : 'http://127.0.0.1:3000';
      const targetUrl = typeof window !== 'undefined' ? '/api/search-jobs' : `${currentHost}/api/search-jobs`;
      response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          page: 1
        })
      });
      if (response && response.ok) break;
    } catch (err: any) {
      lastErr = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }

  if (!response || !response.ok) {
    const errorText = response ? await response.text().catch(() => '') : '';
    let message = response ? `Job Search API Error (${response.status})` : (lastErr?.message || 'Job Search network request failed');
    try {
      if (errorText) {
        const errJson = JSON.parse(errorText);
        message = errJson?.error?.message || message;
      }
    } catch {}
    throw new Error(message);
  }

  const rawJson = await response.json();
  const rawItems = Array.isArray(rawJson.data?.jobs)
    ? rawJson.data.jobs
    : Array.isArray(rawJson.data)
    ? rawJson.data
    : Array.isArray(rawJson)
    ? rawJson
    : [];

  const rawCount = rawItems.length;

  if (rawCount === 0) {
    const emptyMetrics: PipelineMetrics = {
      rawCount: 0,
      normalizedCount: 0,
      locationFilteredCount: 0,
      relevanceFilteredCount: 0,
      workModeFilteredCount: 0,
      dedupedCount: 0,
      finalCount: 0
    };
    return { jobs: [], jds: {}, pipelineMetrics: emptyMetrics };
  }

  // 1. Normalize raw items into domain models
  const normalizedPairs = rawItems.map((item: any, idx: number) => normalizeJSearchItem(item, idx, profile));
  const normalizedCount = normalizedPairs.length;

  // Extract location targets
  let targetCity = '';
  let targetState = '';
  let targetCountry = '';
  let targetWorkMode = 'ALL';

  if (typeof filterLocation === 'object' && filterLocation !== null) {
    targetCity = filterLocation.city || '';
    targetState = filterLocation.state || '';
    targetCountry = filterLocation.country || '';
    targetWorkMode = filterLocation.workMode || 'ALL';
  } else {
    targetCity = profile.preferences?.city || '';
    targetState = profile.preferences?.state || '';
    targetCountry = profile.preferences?.country || '';
    targetWorkMode = profile.preferences?.workMode || 'ALL';
  }

  // 2. Filter by normalized location evidence
  const locationFilteredPairs = normalizedPairs.filter(p => {
    const item = p.rawItem;
    return isLocationMatching(
      item.job_city || '',
      item.job_state || '',
      item.job_country || '',
      p.job.location || '',
      targetCity,
      targetState,
      targetCountry
    );
  });
  const locationFilteredCount = locationFilteredPairs.length;

  // 3. Filter by role/relevance score (relevanceScore >= 45)
  const relevanceFilteredPairs = locationFilteredPairs.filter(p => p.job.relevanceScore >= 45);
  const relevanceFilteredCount = relevanceFilteredPairs.length;

  // 4. Filter by work mode (if workMode is not ALL/ANY)
  const workModeFilteredPairs = relevanceFilteredPairs.filter(p => {
    if (!targetWorkMode || targetWorkMode === 'ALL' || targetWorkMode === 'ANY') return true;
    return p.job.workMode === targetWorkMode || p.job.workMode === 'REMOTE';
  });
  const workModeFilteredCount = workModeFilteredPairs.length;

  // 5. Deduplicate pairs
  const deduplicatedPairs = deduplicateJobs(workModeFilteredPairs);
  const dedupedCount = deduplicatedPairs.length;

  // 6. Sort by deterministic relevance score descending
  deduplicatedPairs.sort((a, b) => b.job.relevanceScore - a.job.relevanceScore);

  const jobs = deduplicatedPairs.map(p => p.job);
  const jds: Record<string, JobDescription> = {};
  for (const p of deduplicatedPairs) {
    jds[p.job.id] = p.jd;
    jds[p.jd.id] = p.jd;
  }

  const pipelineMetrics: PipelineMetrics = {
    rawCount,
    normalizedCount,
    locationFilteredCount,
    relevanceFilteredCount,
    workModeFilteredCount,
    dedupedCount,
    finalCount: jobs.length
  };

  return { jobs, jds, pipelineMetrics };
};
