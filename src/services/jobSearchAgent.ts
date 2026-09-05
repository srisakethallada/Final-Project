// ============================================================================
// AG-002: JOB SEARCH AGENT (AI CAREER OS CORE INTELLIGENCE ENGINE)
// Data-Driven External Job Search, Deduplication, & Deterministic Relevance Ranking
// ============================================================================

import { UserProfile, Job, JobDescription } from '../types';

export interface RawJSearchResponse {
  status: string;
  data: any[];
}

/**
 * Builds search query using AG-001 career profile and user filters
 */
export const buildSearchQuery = (
  profile: UserProfile,
  filterQuery?: string,
  filterLocation?: string
): string => {
  const queryParts: string[] = [];

  if (filterQuery && filterQuery.trim()) {
    queryParts.push(filterQuery.trim());
  } else if (profile.jobRole && profile.jobRole.trim()) {
    queryParts.push(profile.jobRole.trim());
  } else if (profile.headline && profile.headline.trim()) {
    queryParts.push(profile.headline.trim());
  } else {
    queryParts.push('Software Engineer');
  }

  const location = filterLocation?.trim() || profile.location || profile.preferences?.preferredLocation;
  if (location && !location.toLowerCase().includes('remote') && location.length > 2) {
    queryParts.push(`in ${location}`);
  }

  return queryParts.join(' ');
};

/**
 * Calculates deterministic relevance score (0-100%) matching job against AG-001 profile
 */
export const calculateRelevanceScore = (
  title: string,
  descriptionText: string,
  workMode: string,
  location: string,
  profile: UserProfile
): number => {
  let score = 40; // Baseline candidate score

  const targetRole = (profile.jobRole || profile.headline || '').toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerJd = descriptionText.toLowerCase();

  // 1. Role Title Alignment (up to +35 points)
  if (targetRole && lowerTitle.includes(targetRole)) {
    score += 35;
  } else {
    // Check partial title match
    const roleWords = targetRole.split(/\s+/).filter(w => w.length > 3);
    const matchedWords = roleWords.filter(w => lowerTitle.includes(w));
    if (roleWords.length > 0) {
      score += Math.round((matchedWords.length / roleWords.length) * 25);
    }
  }

  // 2. Technical Skill Matching (up to +40 points)
  const skillsToMatch = profile.technicalSkills.length > 0 ? profile.technicalSkills : profile.skills;
  if (skillsToMatch.length > 0) {
    let matchedSkillCount = 0;
    for (const skill of skillsToMatch) {
      if (lowerJd.includes(skill.toLowerCase())) {
        matchedSkillCount++;
      }
    }
    const skillRatio = matchedSkillCount / skillsToMatch.length;
    score += Math.round(skillRatio * 40);
  }

  // 3. Work Mode & Location Match (+15 points)
  const prefWorkMode = profile.preferences?.workMode || 'HYBRID';
  if (workMode === prefWorkMode || workMode === 'REMOTE' || prefWorkMode === 'ANY') {
    score += 15;
  }

  // 4. Experience Level Alignment (+10 points)
  if (lowerJd.includes('senior') && (profile.experience.length >= 2 || lowerTitle.includes('senior'))) {
    score += 10;
  } else if (!lowerJd.includes('senior') && profile.experience.length < 2) {
    score += 10;
  }

  return Math.min(99, Math.max(50, score));
};

/**
 * Normalizes raw JSearch API item into project Job and JobDescription domain objects
 */
export const normalizeJSearchItem = (
  item: any,
  idx: number,
  profile: UserProfile
): { job: Job; jd: JobDescription } => {
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

  // Extract required and preferred skills from job description text
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
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : profile.skills.slice(0, 5),
    preferredSkills: preferredSkills,
    responsibilities: [
      `Design and implement scalable engineering solutions for ${title} role.`,
      `Collaborate with cross-functional product and engineering teams at ${company}.`,
      'Maintain automated testing, code quality, and performance optimization standards.'
    ],
    qualifications: [
      'Bachelor degree in Computer Science, Software Engineering, or related technical field.',
      'Hands-on experience with modern software development frameworks and cloud platforms.'
    ],
    experienceYearsRequired: lowerTextIncludesSenior(title, fullText) ? 4 : 2
  };

  return { job, jd };
};

const lowerTextIncludesSenior = (title: string, fullText: string): boolean => {
  const combined = (title + ' ' + fullText).toLowerCase();
  return combined.includes('senior') || combined.includes('sr.') || combined.includes('lead');
};

/**
 * Deduplicates jobs based on job ID or company + title + location hash
 */
export const deduplicateJobs = (jobPairs: { job: Job; jd: JobDescription }[]): { job: Job; jd: JobDescription }[] => {
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
 * Executes AG-002 Job Search pipeline against server API backend
 */
export const fetchJobsFromApi = async (
  profile: UserProfile,
  filterQuery?: string,
  filterLocation?: string
): Promise<{ jobs: Job[]; jds: Record<string, JobDescription> }> => {
  const searchQuery = buildSearchQuery(profile, filterQuery, filterLocation);

  const response = await fetch('/api/search-jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: searchQuery,
      page: 1
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = `Job Search API Error (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      message = errJson?.error?.message || message;
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

  if (rawItems.length === 0) {
    return { jobs: [], jds: {} };
  }

  // Normalize raw items into domain models
  const normalizedPairs = rawItems.map((item: any, idx: number) => normalizeJSearchItem(item, idx, profile));

  // Deduplicate pairs
  const deduplicatedPairs = deduplicateJobs(normalizedPairs);

  // Sort by deterministic relevance score descending
  deduplicatedPairs.sort((a, b) => b.job.relevanceScore - a.job.relevanceScore);

  const jobs = deduplicatedPairs.map(p => p.job);
  const jds: Record<string, JobDescription> = {};
  for (const p of deduplicatedPairs) {
    jds[p.jd.id] = p.jd;
  }

  return { jobs, jds };
};
