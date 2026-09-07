import { fetchJobsFromApi } from '../src/services/jobSearchAgent';
import { runJdAnalysisAgent } from '../src/services/jdAnalysisAgent';

const candidateProfile = {
  id: 'prof_test_5',
  userId: 'usr_test_5',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  jobRole: 'Full Stack Engineer',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'Git', 'REST APIs', 'PostgreSQL', 'Docker'],
  technicalSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'Git', 'REST APIs', 'PostgreSQL', 'Docker'],
  experience: [
    {
      id: 'exp1',
      company: 'Tech Solutions Inc',
      role: 'Full Stack Engineer',
      title: 'Full Stack Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      isCurrent: true,
      description: 'Built web applications using React, TypeScript, Node.js, Express, and PostgreSQL. Deployed applications with Docker.',
      bulletPoints: [
        'Developed interactive frontend features using React and TypeScript.',
        'Created RESTful backend services using Node.js and Express.',
        'Managed PostgreSQL database schemas and optimized SQL queries.',
        'Containerized microservices using Docker and Git version control.'
      ],
      highlights: [
        'Developed interactive frontend features using React and TypeScript.',
        'Created RESTful backend services using Node.js and Express.',
        'Managed PostgreSQL database schemas and optimized SQL queries.',
        'Containerized microservices using Docker and Git version control.'
      ],
      technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git']
    }
  ],
  education: [
    {
      id: 'ed1',
      institution: 'State University',
      degree: "Bachelor's Degree",
      fieldOfStudy: 'Computer Science',
      startDate: '2018',
      endDate: '2022',
      isCompleted: true
    }
  ],
  projects: [
    {
      id: 'proj1',
      name: 'E-Commerce Platform',
      title: 'E-Commerce Platform',
      description: 'Full stack online web store built with React, Node.js, and PostgreSQL.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Express', 'Docker']
    }
  ],
  certifications: [],
  preferences: {
    targetRoles: ['Full Stack Engineer'],
    preferredLocations: ['Remote'],
    workMode: 'REMOTE',
    country: 'United States',
    state: 'California',
    city: 'San Francisco'
  }
};

const testQueries = [
  "Senior DevOps Engineer",
  "Senior Full Stack Engineer",
  "Frontend Developer (React)",
  "Data Engineer (Python & Spark)",
  "Cloud Solutions Architect"
];

async function runTest5Jobs() {
  console.log("================================================================================");
  console.log("TESTING AG-003 ON 5 DISTINCT REAL JOBS FROM JSEARCH API");
  console.log("Candidate Skills:", candidateProfile.skills.join(', '));
  console.log("================================================================================\n");

  const resultsTable = [];

  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    console.log(`--- JOB ${i + 1}: Query "${query}" ---`);
    
    try {
      const searchRes = await fetchJobsFromApi(candidateProfile, query, { country: 'United States' });
      if (!searchRes.jobs || searchRes.jobs.length === 0) {
        console.warn(`0 jobs returned for query "${query}". Skipping.`);
        continue;
      }

      const job = searchRes.jobs[0];
      const jd = searchRes.jds[job.id] || { id: `jd_${job.id}`, jobId: job.id, fullText: `${job.title} at ${job.company}. ${job.location}` };

      console.log(`Job Selected: "${job.title}" at "${job.company}" (${job.location})`);
      console.log(`JD Character Length: ${(jd.fullText || '').length}`);

      const analysis = await runJdAnalysisAgent(job, jd, candidateProfile);

      console.log(`Match Score: ${analysis.matchScore}%`);
      console.log(`Extracted Required Skills (${analysis.requiredSkills.length}):`, analysis.requiredSkills.join(', '));
      console.log(`Matched Skills (${analysis.matchedSkills.length}):`, analysis.matchedSkills.join(', '));
      console.log(`Identified Skill Gaps (${analysis.skillGaps.length}):`, analysis.skillGaps.join(', '));
      console.log(`Responsibilities Summary (${analysis.responsibilitiesSummary.length} items)`);
      console.log("--------------------------------------------------------------------------------\n");

      resultsTable.push({
        jobNum: i + 1,
        query,
        jobTitle: job.title,
        company: job.company,
        jdLength: (jd.fullText || '').length,
        requiredCount: analysis.requiredSkills.length,
        matchedCount: analysis.matchedSkills.length,
        gapCount: analysis.skillGaps.length,
        matchScore: `${analysis.matchScore}%`
      });

    } catch (err) {
      console.error(`Error processing job query "${query}":`, err.message);
    }
  }

  console.log("================================================================================");
  console.log("5 REAL JOBS SUMMARY MATRIX");
  console.log("================================================================================");
  console.table(resultsTable);
}

runTest5Jobs().catch(console.error);
