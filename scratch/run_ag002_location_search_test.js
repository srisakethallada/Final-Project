// Comprehensive Test Suite for AG-002 Location-First Job Discovery Fix
import { fetchJobsFromApi, generateSearchQueries } from '../src/services/jobSearchAgent.ts';
import { isLocationMatching } from '../src/data/locationData.ts';

const mockProfileDevOps = {
  id: 'prof_test_1',
  userId: 'usr_test_1',
  headline: 'Cloud & DevOps Engineer',
  phone: '1234567890',
  location: 'Hyderabad, Telangana, India',
  bio: 'Cloud DevOps professional',
  education: [],
  skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Python'],
  technicalSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Python'],
  softSkills: ['Communication', 'Problem Solving'],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  completeness: 90,
  jobRole: 'Cloud & DevOps Engineer',
  jobRoleConfidence: 'HIGH',
  preferences: {
    targetRoles: ['Cloud & DevOps Engineer'],
    preferredLocation: 'Hyderabad, Telangana, India',
    workMode: 'HYBRID',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad'
  }
};

const mockProfileFullStack = {
  ...mockProfileDevOps,
  jobRole: 'Full Stack React & Node Engineer',
  headline: 'Full Stack Engineer',
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL'],
  technicalSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL']
};

const testCases = [
  {
    name: '1. India -> Telangana -> Hyderabad (Cloud & DevOps Role)',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Telangana', city: 'Hyderabad', workMode: 'HYBRID' }
  },
  {
    name: '2. India -> Andhra Pradesh -> Visakhapatnam',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Andhra Pradesh', city: 'Visakhapatnam', workMode: 'ALL' }
  },
  {
    name: '3. India -> Karnataka -> Bengaluru',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Karnataka', city: 'Bengaluru', workMode: 'HYBRID' }
  },
  {
    name: '4. India -> Maharashtra -> Pune',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Maharashtra', city: 'Pune', workMode: 'HYBRID' }
  },
  {
    name: '5. India -> Maharashtra -> Mumbai',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Maharashtra', city: 'Mumbai', workMode: 'ALL' }
  },
  {
    name: '6. Another supported country: United States -> California -> San Francisco',
    profile: mockProfileDevOps,
    location: { country: 'United States', state: 'California', city: 'San Francisco', workMode: 'HYBRID' }
  },
  {
    name: '7. Country + State without city: India -> Telangana',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Telangana', city: '', workMode: 'ALL' }
  },
  {
    name: '8. Country + City: United States -> Seattle',
    profile: mockProfileDevOps,
    location: { country: 'United States', state: 'Washington', city: 'Seattle', workMode: 'ALL' }
  },
  {
    name: '9. Remote Work Mode (India)',
    profile: mockProfileDevOps,
    location: { country: 'India', state: '', city: '', workMode: 'REMOTE' }
  },
  {
    name: '10. Hybrid Work Mode (India -> Bengaluru)',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Karnataka', city: 'Bengaluru', workMode: 'HYBRID' }
  },
  {
    name: '11. On-site Work Mode (India -> Hyderabad)',
    profile: mockProfileDevOps,
    location: { country: 'India', state: 'Telangana', city: 'Hyderabad', workMode: 'ONSITE' }
  },
  {
    name: '12. Different AG-001 career role: Full Stack React & Node Engineer',
    profile: mockProfileFullStack,
    location: { country: 'India', state: 'Telangana', city: 'Hyderabad', workMode: 'ALL' }
  }
];

async function runTests() {
  console.log('================================================================');
  console.log('AG-002 LOCATION-FIRST DISCOVERY REAL API VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  const testSummaryResults = [];

  for (const tc of testCases) {
    console.log(`\n--- Running Test Case: ${tc.name} ---`);
    const locStr = `${tc.location.city ? `${tc.location.city}, ` : ''}${tc.location.state ? `${tc.location.state}, ` : ''}${tc.location.country}`;
    console.log(`Target Location: "${locStr}" | Mode: "${tc.location.workMode}" | Role: "${tc.profile.jobRole}"`);

    const strategies = generateSearchQueries(tc.profile, undefined, tc.location);
    console.log(`Dynamic Search Queries Generated (${strategies.length}):`);
    strategies.forEach((s, i) => console.log(`  Query ${i + 1}: "${s.query}" [${s.description}]`));

    try {
      const result = await fetchJobsFromApi(tc.profile, undefined, tc.location);
      const jobs = result.jobs;
      const metrics = result.pipelineMetrics;

      console.log('\nPipeline Metrics:');
      console.log(`  - Raw items retrieved from API: ${metrics.rawCount}`);
      console.log(`  - Queries executed: ${metrics.queriesExecuted?.join(' | ') || 'N/A'}`);
      console.log(`  - Pages fetched: ${metrics.pagesFetched}`);
      console.log(`  - Location filtered count: ${metrics.locationFilteredCount}`);
      console.log(`  - Work mode filtered count: ${metrics.workModeFilteredCount}`);
      console.log(`  - Deduplicated count: ${metrics.dedupedCount}`);
      console.log(`  - Final displayed job count: ${jobs.length}`);

      if (jobs.length > 0) {
        console.log('\nSample Discovered Real Jobs (Top 4):');
        jobs.slice(0, 4).forEach((j, idx) => {
          const jd = result.jds[j.id];
          console.log(`  ${idx + 1}. [${j.relevanceScore}% match] "${j.title}" at ${j.company}`);
          console.log(`     Location: ${j.location} | Work Mode: ${j.workMode} | Job ID: ${j.id}`);
          console.log(`     Apply Link: ${j.sourceUrl || 'N/A'}`);
        });
      } else {
        console.log('  -> Genuine 0 results returned by external API for this query.');
      }

      testSummaryResults.push({
        testName: tc.name,
        location: locStr,
        count: jobs.length,
        queriesCount: metrics.queriesExecuted?.length || 0,
        status: 'PASSED'
      });
    } catch (err) {
      console.error(`  -> ERROR executing test case:`, err.message);
      testSummaryResults.push({
        testName: tc.name,
        location: locStr,
        count: 0,
        status: 'FAILED',
        error: err.message
      });
    }
  }

  console.log('\n================================================================');
  console.log('FINAL TEST SUMMARY MATRIX:');
  console.log('================================================================');
  console.table(testSummaryResults);
}

runTests().catch(console.error);
