// ============================================================================
// AI CAREER OS — MULTI-LOCATION REAL API DIAGNOSTIC SUITE (11 LOCATIONS)
// ============================================================================

import http from 'http';
import { isLocationMatching } from '../src/data/locationData.ts';
import { calculateRelevanceScore, deduplicateJobs, normalizeJSearchItem } from '../src/services/jobSearchAgent.ts';

const SAMPLE_PROFILE = {
  id: 'prof_test_real',
  userId: 'usr_multiloc_test',
  headline: 'Cloud Engineer',
  jobRole: 'Cloud Engineer',
  skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform', 'Linux'],
  technicalSkills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform', 'Linux'],
  experience: [{ id: 'exp1', company: 'Tech', role: 'Cloud Engineer', location: 'Remote', startDate: '2022', endDate: 'Present', isCurrent: true, highlights: [] }],
  preferences: {
    targetRoles: ['Cloud Engineer'],
    preferredLocation: '',
    workMode: 'ANY',
    experienceLevel: 'MID',
    targetCompanies: []
  }
};

const TEST_LOCATIONS = [
  { id: 1, country: 'India', state: 'Telangana', city: 'Hyderabad', queryRole: 'Cloud Engineer' },
  { id: 2, country: 'India', state: 'Andhra Pradesh', city: 'Visakhapatnam', queryRole: 'Cloud Engineer' },
  { id: 3, country: 'India', state: 'Andhra Pradesh', city: 'Vijayawada', queryRole: 'Software Engineer' },
  { id: 4, country: 'India', state: 'Karnataka', city: 'Bengaluru', queryRole: 'Cloud Engineer' },
  { id: 5, country: 'India', state: 'Maharashtra', city: 'Mumbai', queryRole: 'DevOps Engineer' },
  { id: 6, country: 'India', state: 'Tamil Nadu', city: 'Chennai', queryRole: 'Cloud Engineer' },
  { id: 7, country: 'United States', state: 'California', city: 'San Francisco', queryRole: 'DevOps Engineer' },
  { id: 8, country: 'United States', state: 'New York', city: 'New York City', queryRole: 'Cloud Engineer' },
  { id: 9, country: 'United Kingdom', state: 'England', city: 'London', queryRole: 'DevOps Engineer' },
  { id: 10, country: 'Canada', state: 'Ontario', city: 'Toronto', queryRole: 'Cloud Engineer' },
  { id: 11, country: 'Australia', state: 'New South Wales', city: 'Sydney', queryRole: 'Cloud Engineer' }
];

function makeApiCall(queryString) {
  const postData = JSON.stringify({ query: queryString, page: 1 });
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/search-jobs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const rawItems = Array.isArray(json.data?.jobs)
            ? json.data.jobs
            : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json)
            ? json
            : [];
          resolve({ statusCode: res.statusCode, rawItems });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runDiagnosticForLocation(loc) {
  console.log(`\n---------------------------------------------------------------`);
  console.log(`TEST ${loc.id}: ${loc.country} -> ${loc.state} -> ${loc.city}`);
  console.log(`---------------------------------------------------------------`);

  const locationStr = `${loc.city}, ${loc.state}, ${loc.country}`;
  const searchQuery = `${loc.queryRole} in ${locationStr}`;
  console.log(`Query string sent: "${searchQuery}"`);

  let apiRes;
  try {
    apiRes = await makeApiCall(searchQuery);
  } catch (err) {
    console.error(`[API ERROR] ${err.message}`);
    return {
      location: locationStr,
      statusCode: 500,
      counts: { raw: 0, norm: 0, locF: 0, relF: 0, modeF: 0, dedup: 0, final: 0 },
      sampleJobs: [],
      notes: `API Request Error: ${err.message}`
    };
  }

  const rawItems = apiRes.rawItems;
  const rawCount = rawItems.length;

  // 1. Normalization
  const normalizedPairs = rawItems.map((item, idx) => normalizeJSearchItem(item, idx, SAMPLE_PROFILE));
  const normCount = normalizedPairs.length;

  // 2. Location Filtering
  const locationFilteredPairs = normalizedPairs.filter(p => {
    const item = p.rawItem;
    return isLocationMatching(
      item.job_city || '',
      item.job_state || '',
      item.job_country || '',
      p.job.location || '',
      loc.city,
      loc.state,
      loc.country
    );
  });
  const locFCount = locationFilteredPairs.length;

  // 3. Role / Relevance Filtering (>= 45%)
  const relevanceFilteredPairs = locationFilteredPairs.filter(p => p.job.relevanceScore >= 45);
  const relFCount = relevanceFilteredPairs.length;

  // 4. Work Mode Filtering (ANY)
  const workModeFilteredPairs = relevanceFilteredPairs;
  const modeFCount = workModeFilteredPairs.length;

  // 5. Deduplication
  const deduplicatedPairs = deduplicateJobs(workModeFilteredPairs);
  const dedupCount = deduplicatedPairs.length;

  // Sort
  deduplicatedPairs.sort((a, b) => b.job.relevanceScore - a.job.relevanceScore);

  console.log(`Diagnostic Pipeline Stage Counts:`);
  console.log(`  JSearch raw results: ${rawCount}`);
  console.log(`  After normalization: ${normCount}`);
  console.log(`  After location filter: ${locFCount}`);
  console.log(`  After role/relevance filter: ${relFCount}`);
  console.log(`  After work-mode filter: ${modeFCount}`);
  console.log(`  After deduplication: ${dedupCount}`);
  console.log(`  Final jobs displayed: ${deduplicatedPairs.length}`);

  const samples = deduplicatedPairs.slice(0, 3).map(p => ({
    title: p.job.title,
    company: p.job.company,
    returnedLocation: p.job.location,
    sourceUrl: p.job.sourceUrl || 'N/A',
    score: p.job.relevanceScore
  }));

  if (samples.length > 0) {
    console.log(`Sample Real Jobs:`);
    samples.forEach((s, idx) => {
      console.log(`  ${idx + 1}. "${s.title}" at "${s.company}" [Location: ${s.returnedLocation}] (Score: ${s.score}%)`);
      console.log(`     URL: ${s.sourceUrl}`);
    });
  } else if (rawCount === 0) {
    console.log(`Result: JSearch API returned 0 results for "${locationStr}". Triggered clean empty state. Zero mock data.`);
  } else {
    console.log(`Result: Filtered out ${rawCount - deduplicatedPairs.length} jobs due to geographic mismatch or low relevance.`);
  }

  return {
    location: locationStr,
    statusCode: apiRes.statusCode,
    counts: {
      raw: rawCount,
      norm: normCount,
      locF: locFCount,
      relF: relFCount,
      modeF: modeFCount,
      dedup: dedupCount,
      final: deduplicatedPairs.length
    },
    sampleJobs: samples
  };
}

async function runAll() {
  console.log('===============================================================');
  console.log('STARTING MULTI-LOCATION REAL DATA DIAGNOSTIC SUITE');
  console.log('===============================================================\n');

  const results = [];
  for (const loc of TEST_LOCATIONS) {
    const res = await runDiagnosticForLocation(loc);
    results.push(res);
    // Pause briefly between calls to avoid API rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n===============================================================');
  console.log('SUMMARY TABLE OF ALL 11 TESTED LOCATIONS');
  console.log('===============================================================\n');

  console.log(
    'Location'.padEnd(42) +
    'Raw'.padStart(6) +
    'LocFilter'.padStart(11) +
    'RelFilter'.padStart(11) +
    'Final'.padStart(8)
  );
  console.log('-'.repeat(78));

  for (const r of results) {
    console.log(
      r.location.padEnd(42) +
      String(r.counts.raw).padStart(6) +
      String(r.counts.locF).padStart(11) +
      String(r.counts.relF).padStart(11) +
      String(r.counts.final).padStart(8)
    );
  }

  console.log('\nMULTI-LOCATION DIAGNOSTIC SUITE COMPLETED.');
}

runAll();
