import { fetchJobsFromApi } from '../src/services/jobSearchAgent';
import { runJdAnalysisAgent } from '../src/services/jdAnalysisAgent';

const dummyProfile = {
  id: 'prof_test',
  userId: 'usr_test',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  jobRole: 'DevOps Engineer',
  skills: ['Git', 'Linux'],
  technicalSkills: ['Git', 'Linux'],
  experience: [
    {
      id: 'exp1',
      company: 'Tech Corp',
      role: 'DevOps Engineer',
      title: 'DevOps Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      isCurrent: true,
      description: 'Worked with Git and Linux servers.',
      bulletPoints: ['Managed Git repositories and Linux servers.'],
      highlights: ['Managed Git repositories and Linux servers.'],
      technologies: ['Git', 'Linux']
    }
  ],
  education: [],
  projects: [],
  certifications: [],
  preferences: {
    targetRoles: ['DevOps Engineer'],
    preferredLocations: ['Remote'],
    workMode: 'REMOTE',
    country: 'United States',
    state: 'California',
    city: 'San Francisco'
  }
};

async function testBarclays() {
  console.log("Fetching Barclays job from JSearch API...");
  const searchResult = await fetchJobsFromApi(dummyProfile, "Senior DevOps Engineer", { country: 'United States' });
  console.log(`Found ${searchResult.jobs.length} jobs.`);
  
  if (searchResult.jobs.length === 0) {
    console.error("No jobs found.");
    return;
  }

  const job = searchResult.jobs[0];
  const jd = searchResult.jds[job.id];

  console.log("\n--- JOB RECORD ---");
  console.log("Job ID:", job.id);
  console.log("Title:", job.title);
  console.log("Company:", job.company);
  console.log("Location:", job.location);
  console.log("JD Character Count:", (jd.fullText || '').length);
  console.log("JD Word Count:", (jd.fullText || '').split(/\s+/).length);
  console.log("JD First 300 Chars:\n", (jd.fullText || '').substring(0, 300));
  console.log("...\nJD Last 300 Chars:\n", (jd.fullText || '').substring((jd.fullText || '').length - 300));

  console.log("\n--- RUNNING CURRENT AG-003 ANALYSIS ---");
  const analysis = await runJdAnalysisAgent(job, jd, dummyProfile);

  console.log("Match Score:", analysis.matchScore);
  console.log("Required Skills:", analysis.requiredSkills);
  console.log("Preferred Skills:", analysis.preferredSkills);
  console.log("Matched Skills:", analysis.matchedSkills);
  console.log("Skill Gaps:", analysis.skillGaps);
}

testBarclays().catch(err => console.error("Test failed:", err));
