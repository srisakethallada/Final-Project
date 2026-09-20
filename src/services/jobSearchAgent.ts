// ============================================================================
// AG-002: JOB SEARCH AGENT (AI CAREER OS CORE INTELLIGENCE ENGINE)
// Location-First Discovery Engine, Multi-Query Fallback Strategy, API Pagination
// Deduplication, & Non-Destructive Relevance Ranking
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
  workModeFilteredCount: number;
  dedupedCount: number;
  finalCount: number;
  queriesExecuted?: string[];
  pagesFetched?: number;
}

export interface QueryStrategy {
  query: string;
  description: string;
}

/**
 * Generates dynamic location-first multi-query search strategies based on AG-001 career profile and selected location
 */
export const generateSearchQueries = (
  profile: UserProfile,
  filterQuery?: string,
  locationFilter?: string | StructuredLocationFilter
): QueryStrategy[] => {
  let targetCity = '';
  let targetState = '';
  let targetCountry = '';

  if (typeof locationFilter === 'object' && locationFilter !== null) {
    targetCity = (locationFilter.city || '').trim();
    targetState = (locationFilter.state || '').trim();
    targetCountry = (locationFilter.country || '').trim();
  } else if (typeof locationFilter === 'string' && locationFilter.trim()) {
    targetCity = locationFilter.trim();
  } else {
    targetCity = (profile.preferences?.city || '').trim();
    targetState = (profile.preferences?.state || '').trim();
    targetCountry = (profile.preferences?.country || profile.location || '').trim();
  }

  // Determine geographic scope string (City is strongest constraint if present)
  let primaryLocStr = '';
  if (targetCity) {
    primaryLocStr = targetCity;
  } else if (targetState && targetCountry) {
    primaryLocStr = `${targetState}, ${targetCountry}`;
  } else if (targetState) {
    primaryLocStr = targetState;
  } else if (targetCountry) {
    primaryLocStr = targetCountry;
  }

  const secondaryLocStr = targetState && targetCountry
    ? `${targetState}, ${targetCountry}`
    : targetCountry || primaryLocStr;

  // Extract base role from user input or AG-001 profile
  const baseRole = (filterQuery && filterQuery.trim())
    ? filterQuery.trim()
    : (profile.jobRole && profile.jobRole.trim())
    ? profile.jobRole.trim()
    : (profile.headline && profile.headline.trim())
    ? profile.headline.trim()
    : 'Software Engineer';

  const queries: QueryStrategy[] = [];

  // Query 1: Primary Role + Primary Location
  const q1 = primaryLocStr ? `${baseRole} in ${primaryLocStr}` : baseRole;
  queries.push({ query: q1, description: `Primary Role + Location (${q1})` });

  // Extract tokens from baseRole for fallback variations
  // E.g. "Cloud & DevOps Engineer" -> ["DevOps Engineer", "Cloud Engineer"]
  const roleTokens = baseRole
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && t.toLowerCase() !== 'and' && t.toLowerCase() !== '&');

  const subRoles: string[] = [];
  if (roleTokens.length >= 2) {
    const hasDevOps = roleTokens.some(t => t.toLowerCase().includes('devops'));
    const hasCloud = roleTokens.some(t => t.toLowerCase().includes('cloud'));
    const hasEngineer = roleTokens.some(t => t.toLowerCase().includes('engineer') || t.toLowerCase().includes('developer'));

    if (hasDevOps && hasEngineer) subRoles.push('DevOps Engineer');
    if (hasCloud && hasEngineer) subRoles.push('Cloud Engineer');
    if (hasDevOps && !subRoles.includes('DevOps Engineer')) subRoles.push('DevOps');
    if (hasCloud && !subRoles.includes('Cloud Engineer')) subRoles.push('Cloud');

    if (subRoles.length === 0) {
      const mainTokens = roleTokens.filter(
        t => t.toLowerCase() !== 'engineer' && t.toLowerCase() !== 'developer' && t.toLowerCase() !== 'senior'
      );
      if (mainTokens.length > 0) {
        subRoles.push(`${mainTokens[0]} Engineer`);
      }
    }
  }

  // Query 2: Sub-Role Variations + Primary Location
  for (const subRole of subRoles) {
    const q = primaryLocStr ? `${subRole} in ${primaryLocStr}` : subRole;
    if (!queries.some(existing => existing.query.toLowerCase() === q.toLowerCase())) {
      queries.push({ query: q, description: `Sub-Role Variation (${q})` });
    }
  }

  // Query 3: Top Verified Technical Skills + Primary Location
  const topSkills = (profile.technicalSkills && profile.technicalSkills.length > 0)
    ? profile.technicalSkills
    : (profile.skills || []);

  if (topSkills.length > 0) {
    const skill1 = topSkills[0];
    const qSkill = primaryLocStr ? `${skill1} in ${primaryLocStr}` : skill1;
    if (!queries.some(existing => existing.query.toLowerCase() === qSkill.toLowerCase())) {
      queries.push({ query: qSkill, description: `Top Verified Skill (${qSkill})` });
    }
  }

  // Query 4: Broader Role Category + Secondary Location (State / Country)
  let broaderCategory = 'Software Engineer';
  const lowerBase = baseRole.toLowerCase();
  if (lowerBase.includes('devops') || lowerBase.includes('cloud') || lowerBase.includes('sre')) {
    broaderCategory = 'DevOps Engineer';
  } else if (lowerBase.includes('data')) {
    broaderCategory = 'Data Engineer';
  } else if (lowerBase.includes('frontend') || lowerBase.includes('react')) {
    broaderCategory = 'Frontend Engineer';
  } else if (lowerBase.includes('backend') || lowerBase.includes('node') || lowerBase.includes('java')) {
    broaderCategory = 'Backend Engineer';
  }

  const qBroader = secondaryLocStr ? `${broaderCategory} in ${secondaryLocStr}` : broaderCategory;
  if (!queries.some(existing => existing.query.toLowerCase() === qBroader.toLowerCase())) {
    queries.push({ query: qBroader, description: `Broader Role Category (${qBroader})` });
  }

  return queries;
};

/**
 * Builds standard single search query for backwards compatibility
 */
export const buildSearchQuery = (
  profile: UserProfile,
  filterQuery?: string,
  locationFilter?: string | StructuredLocationFilter
): string => {
  const strategies = generateSearchQueries(profile, filterQuery, locationFilter);
  return strategies.length > 0 ? strategies[0].query : 'Software Engineer';
};

/**
 * Normalizes work mode from raw JSearch API response into standard domain types
 */
export const normalizeWorkMode = (item: any): 'REMOTE' | 'HYBRID' | 'ONSITE' => {
  if (item.job_is_remote === true || item.job_is_remote === 'true') {
    return 'REMOTE';
  }

  const combined = `${item.job_employment_type || ''} ${item.job_title || ''} ${item.job_description || ''}`.toLowerCase();

  if (combined.includes('remote') || combined.includes('work from home') || combined.includes('wfh')) {
    return 'REMOTE';
  }
  if (combined.includes('hybrid')) {
    return 'HYBRID';
  }
  if (combined.includes('onsite') || combined.includes('on-site') || combined.includes('in-office') || combined.includes('office')) {
    return 'ONSITE';
  }

  return 'HYBRID';
};

/**
 * Checks if normalized work mode matches user target work mode preference
 */
export const isWorkModeMatching = (jobWorkMode: string, targetMode?: string): boolean => {
  if (!targetMode || targetMode === 'ALL' || targetMode === 'ANY') return true;
  const t = targetMode.toUpperCase();
  const j = jobWorkMode.toUpperCase();

  if (t === 'REMOTE') {
    return j === 'REMOTE';
  }
  if (t === 'HYBRID') {
    return j === 'HYBRID' || j === 'REMOTE';
  }
  if (t === 'ONSITE') {
    return j === 'ONSITE' || j === 'HYBRID';
  }
  return true;
};

/**
 * Calculates relevance score (0-100%) matching job against AG-001 profile for SORTING & RANKING
 * NOTE: Non-destructive score; NOT used to cut off or discard valid location results.
 */
export const calculateRelevanceScore = (
  title: string,
  descriptionText: string,
  workMode: string,
  location: string,
  profile: UserProfile
): number => {
  let score = 50; // Baseline score for real external API result

  const targetRole = (profile.jobRole || profile.headline || '').toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerJd = descriptionText.toLowerCase();

  // 1. Role Title Alignment (up to +30 points)
  if (targetRole && lowerTitle.includes(targetRole)) {
    score += 30;
  } else {
    const roleWords = targetRole
      .replace(/[^a-z0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && w !== 'engineer' && w !== 'developer' && w !== 'and');

    if (roleWords.length > 0) {
      const matchedWords = roleWords.filter(w => lowerTitle.includes(w) || lowerJd.includes(w));
      score += Math.round((matchedWords.length / roleWords.length) * 25);
    }
  }

  // 2. Technical Skill Matching (up to +20 points)
  const skillsToMatch = (profile.technicalSkills && profile.technicalSkills.length > 0)
    ? profile.technicalSkills
    : (profile.skills || []);

  if (skillsToMatch.length > 0) {
    let matchedSkillCount = 0;
    for (const skill of skillsToMatch) {
      if (lowerTitle.includes(skill.toLowerCase()) || lowerJd.includes(skill.toLowerCase())) {
        matchedSkillCount++;
      }
    }
    const skillRatio = matchedSkillCount / skillsToMatch.length;
    score += Math.round(skillRatio * 20);
  }

  // 3. Work Mode & Location Match (+10 points)
  const prefWorkMode = profile.preferences?.workMode || 'ANY';
  if (prefWorkMode === 'ANY' || workMode === prefWorkMode || workMode === 'REMOTE') {
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
): { job: Job; jd: JobDescription; rawItem: any } => {
  const stableId = item.job_id || item.job_apply_link || item.job_google_link || `${Date.now()}_${idx}`;
  const jobId = item.job_id ? `job_${item.job_id}` : `job_${Date.now()}_${idx}`;
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

  const workMode = normalizeWorkMode(item);

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

  const candidateSkills = (profile.technicalSkills && profile.technicalSkills.length > 0)
    ? profile.technicalSkills
    : (profile.skills || []);

  for (const skill of candidateSkills) {
    if (fullText.toLowerCase().includes(skill.toLowerCase())) {
      requiredSkills.push(skill);
    }
  }

  const jd: JobDescription = {
    id: descriptionId,
    jobId,
    fullText,
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : candidateSkills.slice(0, 5),
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
 * Deduplicates jobs based on stable job_id, apply URL, or company + title + location key.
 * NOTE: Two jobs with the same title at different companies are NOT deduplicated.
 */
export const deduplicateJobs = (
  jobPairs: { job: Job; jd: JobDescription; rawItem: any }[]
): { job: Job; jd: JobDescription; rawItem: any }[] => {
  const seenKeys = new Set<string>();
  const uniquePairs: { job: Job; jd: JobDescription; rawItem: any }[] = [];

  for (const pair of jobPairs) {
    const rawId = pair.rawItem?.job_id;
    const rawUrl = pair.rawItem?.job_apply_link;
    const compositeKey = `${pair.job.company.toLowerCase()}_${pair.job.title.toLowerCase()}_${pair.job.location.toLowerCase()}`;
    const key = rawId ? `id_${rawId}` : rawUrl ? `url_${rawUrl}` : compositeKey;

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniquePairs.push(pair);
    }
  }

  return uniquePairs;
};

/**
 * Executes AG-002 Location-First Job Discovery pipeline against backend API server
 * Uses dynamic search fallback queries, multi-page API pagination, deduplication, and ranking.
 */
export const fetchJobsFromApi = async (
  profile: UserProfile,
  filterQuery?: string,
  filterLocation?: string | StructuredLocationFilter
): Promise<{ jobs: Job[]; jds: Record<string, JobDescription>; pipelineMetrics: PipelineMetrics }> => {
  const strategies = generateSearchQueries(profile, filterQuery, filterLocation);

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

  const allRawPairs: { job: Job; jd: JobDescription; rawItem: any }[] = [];
  const queriesExecuted: string[] = [];
  let pagesFetched = 0;
  let rawCount = 0;
  let apiErrorsEncountered = 0;
  let lastApiErrorMessage = '';

  const TARGET_JOB_COUNT = 15;
  const MAX_PAGES_PER_QUERY = 2;

  // Execute multi-query strategy sequentially until target result limit is met
  for (const strat of strategies) {
    if (allRawPairs.length >= TARGET_JOB_COUNT) break;

    queriesExecuted.push(strat.query);

    for (let page = 1; page <= MAX_PAGES_PER_QUERY; page++) {
      pagesFetched++;

      let response: Response | null = null;
      let lastErr: any = null;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const currentHost = attempt === 1 ? 'http://localhost:3000' : 'http://127.0.0.1:3000';
          const targetUrl = typeof window !== 'undefined' ? '/api/search-jobs' : `${currentHost}/api/search-jobs`;
          response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: strat.query,
              page
            })
          });
          if (response && response.ok) break;
        } catch (err: any) {
          lastErr = err;
          if (attempt < 2) await new Promise(r => setTimeout(r, 500));
        }
      }

      if (!response || !response.ok) {
        apiErrorsEncountered++;
        const errorText = response ? await response.text().catch(() => '') : '';
        lastApiErrorMessage = response
          ? `Job Search API Error (${response.status})`
          : (lastErr?.message || 'Network connection error while connecting to Job Search API');
        try {
          if (errorText) {
            const errJson = JSON.parse(errorText);
            lastApiErrorMessage = errJson?.error?.message || lastApiErrorMessage;
          }
        } catch {}

        // Break page loop for this query if API error occurred
        break;
      }

      const rawJson = await response.json();
      const items = Array.isArray(rawJson.data?.jobs)
        ? rawJson.data.jobs
        : Array.isArray(rawJson.data)
        ? rawJson.data
        : Array.isArray(rawJson)
        ? rawJson
        : [];

      if (items.length === 0) {
        // No more pages for this query
        break;
      }

      rawCount += items.length;

      const normalized = items.map((item: any, idx: number) => normalizeJSearchItem(item, idx, profile));
      allRawPairs.push(...normalized);

      if (allRawPairs.length >= TARGET_JOB_COUNT) break;
    }
  }

  // If ALL queries encountered API errors and no raw items were retrieved, throw explicit API error
  if (rawCount === 0 && apiErrorsEncountered > 0 && allRawPairs.length === 0) {
    throw new Error(lastApiErrorMessage || 'Unable to retrieve jobs right now. Please try again.');
  }

  const normalizedCount = allRawPairs.length;

  // 1. Filter by location evidence (Location-First Constraint)
  const locationFilteredPairs = allRawPairs.filter(p => {
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

  // 2. Filter by work mode preference
  const workModeFilteredPairs = locationFilteredPairs.filter(p => {
    return isWorkModeMatching(p.job.workMode, targetWorkMode);
  });
  const workModeFilteredCount = workModeFilteredPairs.length;

  // 3. Deduplicate by stable job ID / apply link
  const deduplicatedPairs = deduplicateJobs(workModeFilteredPairs);
  const dedupedCount = deduplicatedPairs.length;

  // 4. Sort by relevance score descending (Non-destructive sorting)
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
    workModeFilteredCount,
    dedupedCount,
    finalCount: jobs.length,
    queriesExecuted,
    pagesFetched
  };

  // Log detailed diagnostic information in development/browser context
  if (typeof console !== 'undefined') {
    console.log('[AG-002 Location-First Discovery Pipeline Log]', {
      locationFilter: { country: targetCountry, state: targetState, city: targetCity, workMode: targetWorkMode },
      queriesExecuted,
      pagesFetched,
      rawCount,
      locationFilteredCount,
      workModeFilteredCount,
      dedupedCount,
      finalCount: jobs.length
    });
  }

  return { jobs, jds, pipelineMetrics };
};
