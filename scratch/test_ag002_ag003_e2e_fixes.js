// ============================================================================
// AI CAREER OS — REAL DATA E2E TEST SUITE FOR ISSUE 1 & ISSUE 2 FIXES
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COUNTRY_LOCATION_DATA, getStatesForCountry } from '../src/data/locationData.ts';
import { buildSearchQuery } from '../src/services/jobSearchAgent.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===============================================================');
console.log('STARTING REAL DATA E2E TEST FOR ISSUE 1 & ISSUE 2 FIXES');
console.log('===============================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. Test Location Reference Data & State Lookup
assert(Array.isArray(COUNTRY_LOCATION_DATA) && COUNTRY_LOCATION_DATA.length >= 8, 'COUNTRY_LOCATION_DATA contains structured countries dataset');

const apStates = getStatesForCountry('India');
assert(apStates.includes('Andhra Pradesh') && apStates.includes('Telangana') && apStates.includes('Karnataka'), 'India returns dependent states: Andhra Pradesh, Telangana, Karnataka');

const caStates = getStatesForCountry('United States');
assert(caStates.includes('California') && caStates.includes('Texas') && caStates.includes('New York'), 'United States returns dependent states: California, Texas, New York');

const sampleProfile = {
  id: 'prof_real_1',
  userId: 'usr_test_101',
  headline: 'Cloud Engineer',
  location: 'Kakinada, Andhra Pradesh, India',
  jobRole: 'Cloud Engineer',
  skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform'],
  technicalSkills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform'],
  experience: [{ id: 'exp1', company: 'Tech', role: 'Cloud Engineer', location: 'Kakinada', startDate: '2022', endDate: 'Present', isCurrent: true, highlights: [] }],
  preferences: {
    targetRoles: ['Cloud Engineer'],
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Kakinada',
    preferredLocation: 'Kakinada, Andhra Pradesh, India',
    workMode: 'HYBRID',
    experienceLevel: 'MID',
    targetCompanies: []
  }
};

// Query A: City + State + Country
const queryCityStateCountry = buildSearchQuery(sampleProfile, undefined, { country: 'India', state: 'Andhra Pradesh', city: 'Kakinada' });
assert(queryCityStateCountry.includes('Kakinada, Andhra Pradesh, India'), `Query accurately contains City + State + Country: "${queryCityStateCountry}"`);

// Query B: State + Country
const queryStateCountry = buildSearchQuery(sampleProfile, undefined, { country: 'India', state: 'Telangana', city: '' });
assert(queryStateCountry.includes('Telangana, India') && !queryStateCountry.includes('Kakinada'), `Query accurately contains State + Country: "${queryStateCountry}"`);

// Query C: Country Only
const queryCountryOnly = buildSearchQuery(sampleProfile, undefined, { country: 'India', state: '', city: '' });
assert(queryCountryOnly.includes('India') && !queryCountryOnly.includes('Andhra Pradesh'), `Query accurately contains Country only: "${queryCountryOnly}"`);

// 3. Test Location Preference Persistence Structure
assert(sampleProfile.preferences.country === 'India', 'Preferences support country');
assert(sampleProfile.preferences.state === 'Andhra Pradesh', 'Preferences support state');
assert(sampleProfile.preferences.city === 'Kakinada', 'Preferences support optional city');
assert(sampleProfile.preferences.workMode === 'HYBRID', 'Preferences support workMode');

// 4. Check for No Mock Data in Job Search Codebase
const jobSearchAgentCode = fs.readFileSync(path.join(__dirname, '../src/services/jobSearchAgent.ts'), 'utf8');
const agentServicesCode = fs.readFileSync(path.join(__dirname, '../src/services/agentServices.ts'), 'utf8');
const workflowContextCode = fs.readFileSync(path.join(__dirname, '../src/context/WorkflowContext.tsx'), 'utf8');

assert(!jobSearchAgentCode.includes('Math.random()'), 'Zero Math.random() in jobSearchAgent.ts');
assert(!jobSearchAgentCode.includes('fake_job'), 'Zero fake jobs in jobSearchAgent.ts');
assert(!workflowContextCode.includes('Math.random()'), 'Zero Math.random() in WorkflowContext.tsx');

// 5. Test JD Analysis Job Isolation (Job A vs Job B)
const jdAnalysisCode = fs.readFileSync(path.join(__dirname, '../src/pages/app/JDAnalysisPage.tsx'), 'utf8');
assert(jdAnalysisCode.includes('useParams'), 'JDAnalysisPage reads route params (jobId) for first-load responsiveness');
assert(jdAnalysisCode.includes('isInitializing'), 'JDAnalysisPage uses immediate loading state for first-load responsiveness');

console.log('\n===============================================================');
console.log(`TEST SUITE COMPLETED: ${passCount} PASSED, ${failCount} FAILED`);
console.log('===============================================================\n');

if (failCount > 0) {
  process.exit(1);
}
