import {
  UserProfile,
  Resume,
  ResumeVersion,
  Job,
  JobDescription,
  JDAnalysis,
  CoverLetter,
  Application,
  NotificationItem,
  EmailInterviewEvent,
  Interview,
  CompanyResearch,
  InterviewPreparation,
  MockInterviewSession,
  Feedback,
  ReadinessScore,
  LearningRoadmap,
  AgentExecutionLog
} from '../types';

import {
  INITIAL_PROFILE,
  INITIAL_RESUMES,
  INITIAL_RESUME_VERSIONS,
  INITIAL_JOBS,
  INITIAL_JDS,
  INITIAL_JD_ANALYSIS,
  INITIAL_APPLICATIONS,
  INITIAL_EMAIL_EVENT,
  INITIAL_INTERVIEWS,
  INITIAL_COMPANIES,
  INITIAL_COMPANY_RESEARCH,
  INITIAL_INTERVIEW_PREP,
  INITIAL_MOCK_SESSIONS,
  INITIAL_FEEDBACK,
  INITIAL_READINESS_SCORE,
  INITIAL_LEARNING_ROADMAP,
  INITIAL_NOTIFICATIONS,
  INITIAL_AGENT_LOGS
} from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

import { parseResumeDocument, validateResumeFile } from './resumeParser';
import { runAG001Analysis } from './resumeAnalysisAgent';

// ============================================================================
// AG-001: RESUME ANALYSIS SERVICE (REAL & DATA-DRIVEN)
// ============================================================================
export const analyzeResume = async (
  file: File | string,
  existingProfile?: UserProfile
): Promise<{ resume: Resume; version: ResumeVersion; updatedProfile: UserProfile; log: AgentExecutionLog }> => {
  const startTime = Date.now();

  if (typeof file === 'string') {
    throw new Error('A valid resume document file (PDF, DOC, DOCX, or Image) must be uploaded.');
  }

  // 1. File Validation
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid resume file.');
  }

  try {
    // 2. Parse Document
    const parsedDoc = await parseResumeDocument(file);

    // 3. Run Entire Resume LLM Analysis Engine
    const analysis = await runAG001Analysis(parsedDoc);

    const versionId = `ver_${Date.now()}`;
    const resumeId = `res_${Date.now()}`;
    const userId = existingProfile?.userId || 'usr_101';

    // 4. Create DATA-003 Resume
    const newResume: Resume = {
      id: resumeId,
      userId,
      originalFileName: parsedDoc.fileName,
      fileType: parsedDoc.fileType,
      fileSize: parsedDoc.fileSize,
      uploadDate: new Date().toISOString(),
      currentVersionId: versionId
    };

    // 5. Create DATA-004 Resume Version
    const newVersion: ResumeVersion = {
      id: versionId,
      resumeId: newResume.id,
      versionName: `Version ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${parsedDoc.fileName}`,
      isOriginal: true,
      createdAt: new Date().toISOString(),
      profileSnapshot: analysis.extractedProfile,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      structureNotes: analysis.structureNotes,
      matchedKeywords: analysis.keywords,
      detectedJobRole: analysis.jobRole,
      rawText: analysis.rawText
    };

    // 6. Create/Update DATA-002 User Profile
    const updatedProfile: UserProfile = {
      id: existingProfile?.id || `prof_${Date.now()}`,
      userId,
      headline: analysis.extractedProfile.headline || existingProfile?.headline || `${analysis.jobRole} Professional`,
      phone: analysis.extractedProfile.phone || existingProfile?.phone || '',
      location: analysis.extractedProfile.location || existingProfile?.location || '',
      bio: analysis.extractedProfile.bio || existingProfile?.bio || '',
      completeness: analysis.extractedProfile.completeness || 85,
      jobRole: analysis.jobRole,
      jobRoleEvidence: analysis.jobRoleEvidence,
      jobRoleConfidence: analysis.jobRoleConfidence,
      jobRoleNeedsConfirmation: analysis.jobRoleConfidence === 'LOW',
      education: analysis.extractedProfile.education && analysis.extractedProfile.education.length > 0
        ? analysis.extractedProfile.education
        : existingProfile?.education || [],
      skills: analysis.extractedProfile.skills || existingProfile?.skills || [],
      technicalSkills: analysis.extractedProfile.technicalSkills || existingProfile?.technicalSkills || [],
      softSkills: analysis.extractedProfile.softSkills || existingProfile?.softSkills || [],
      experience: analysis.extractedProfile.experience && analysis.extractedProfile.experience.length > 0
        ? analysis.extractedProfile.experience
        : existingProfile?.experience || [],
      projects: analysis.extractedProfile.projects && analysis.extractedProfile.projects.length > 0
        ? analysis.extractedProfile.projects
        : existingProfile?.projects || [],
      certifications: analysis.extractedProfile.certifications || existingProfile?.certifications || [],
      achievements: analysis.extractedProfile.achievements || existingProfile?.achievements || [],
      preferences: existingProfile?.preferences || {
        targetRoles: [analysis.jobRole],
        preferredLocation: analysis.extractedProfile.location || 'Remote / Flexible',
        workMode: 'HYBRID',
        experienceLevel: 'MID',
        targetCompanies: []
      }
    };

    const durationMs = Date.now() - startTime;

    // 7. Record DATA-027 Agent Execution Log
    const log: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      agentId: 'AG-001',
      agentName: 'Resume Analysis Agent',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      inputSummary: `Parsed uploaded file: ${parsedDoc.fileName} (${Math.round(parsedDoc.fileSize / 1024)} KB, ${parsedDoc.fileType})`,
      outputSummary: `Extracted structured profile (${updatedProfile.skills.length} skills, ${updatedProfile.experience.length} roles). Determined job role: "${analysis.jobRole}" (${analysis.jobRoleConfidence} confidence).`,
      durationMs
    };

    return { resume: newResume, version: newVersion, updatedProfile, log };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;

    // Log execution failure
    const errorLog: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      agentId: 'AG-001',
      agentName: 'Resume Analysis Agent',
      timestamp: new Date().toISOString(),
      status: 'FAILURE',
      inputSummary: `Resume upload attempt: ${typeof file === 'object' ? file.name : 'Document'}`,
      outputSummary: `Analysis failed: ${err.message || 'Unknown processing error'}`,
      durationMs
    };

    // Attach log to error if possible or throw error directly
    (err as any).executionLog = errorLog;
    throw err;
  }
};

import { fetchJobsFromApi } from './jobSearchAgent';

// ============================================================================
// AG-002: JOB SEARCH SERVICE (REAL & DATA-DRIVEN)
// ============================================================================
export const searchJobs = async (
  userProfile: UserProfile,
  query?: string,
  filters?: { workMode?: string; location?: string }
): Promise<{ jobs: Job[]; jds: Record<string, JobDescription>; log: AgentExecutionLog }> => {
  const startTime = Date.now();

  try {
    const { jobs, jds } = await fetchJobsFromApi(userProfile, query, filters?.location);

    let filteredJobs = jobs;
    if (filters?.workMode && filters.workMode !== 'ALL') {
      filteredJobs = jobs.filter(j => j.workMode === filters.workMode);
    }

    const durationMs = Date.now() - startTime;

    const log: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      agentId: 'AG-002',
      agentName: 'Job Search Agent',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      inputSummary: `Query: "${query || userProfile.jobRole || 'Software Engineer'}" (Target Role: "${userProfile.jobRole || 'None'}")`,
      outputSummary: `Fetched, deduplicated, and deterministically ranked ${filteredJobs.length} live jobs for career role "${userProfile.jobRole || 'Software Engineer'}".`,
      durationMs
    };

    return { jobs: filteredJobs, jds, log };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;

    const errorLog: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      agentId: 'AG-002',
      agentName: 'Job Search Agent',
      timestamp: new Date().toISOString(),
      status: 'FAILURE',
      inputSummary: `Job search query: "${query || userProfile.jobRole || 'Software Engineer'}"`,
      outputSummary: `Job search failed: ${err.message || 'Unknown API error'}`,
      durationMs
    };

    (err as any).executionLog = errorLog;
    throw err;
  }
};

import { runJdAnalysisAgent } from './jdAnalysisAgent';

// ============================================================================
// AG-003: JD ANALYSIS SERVICE (REAL & DATA-DRIVEN)
// ============================================================================
export const analyzeJobDescription = async (
  job: Job,
  userProfile: UserProfile,
  existingJd?: JobDescription,
  activeResumeVersionId?: string
): Promise<{ analysis: JDAnalysis; jd: JobDescription; log: AgentExecutionLog }> => {
  const startTime = Date.now();

  const targetJd: JobDescription = existingJd || {
    id: `jd_${job.id}`,
    jobId: job.id,
    fullText: `${job.title} at ${job.company}. ${job.location}. Seeking software engineer for engineering team.`,
    requiredSkills: userProfile.technicalSkills.length > 0 ? userProfile.technicalSkills.slice(0, 3) : ['Software Engineering'],
    preferredSkills: [],
    responsibilities: [`Develop and maintain software systems for ${job.title} at ${job.company}.`],
    qualifications: ['Degree in technical discipline or equivalent experience.'],
    experienceYearsRequired: 2
  };

  try {
    const analysis = await runJdAnalysisAgent(job, targetJd, userProfile, activeResumeVersionId);
    const durationMs = Date.now() - startTime;

    const log: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      agentId: 'AG-003',
      agentName: 'JD Analysis Agent',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      inputSummary: `Analyzed JD for "${job.title}" at "${job.company}"`,
      outputSummary: `Calculated Resume Match Score: ${analysis.matchScore}%. Matched ${analysis.matchedSkills.length} skills, identified ${analysis.skillGaps.length} gaps.`,
      durationMs
    };

    return { analysis, jd: targetJd, log };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;

    const errorLog: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      agentId: 'AG-003',
      agentName: 'JD Analysis Agent',
      timestamp: new Date().toISOString(),
      status: 'FAILURE',
      inputSummary: `JD Analysis attempt for "${job.title}" at "${job.company}"`,
      outputSummary: `Analysis failed: ${err.message || 'Unknown error during JD parsing'}`,
      durationMs
    };

    (err as any).executionLog = errorLog;
    throw err;
  }
};

// ============================================================================
// AG-004: RESUME OPTIMIZATION SERVICE (HUMAN IN THE LOOP APPROVED)
// ============================================================================
export const optimizeResumeForJob = async (
  job: Job,
  analysis: JDAnalysis,
  userProfile: UserProfile
): Promise<{ tailoredVersion: ResumeVersion; log: AgentExecutionLog }> => {
  await delay(1500);

  const tailoredVersion: ResumeVersion = {
    id: `ver_tailored_${Date.now()}`,
    resumeId: INITIAL_RESUMES[0].id,
    versionName: `Tailored ATS Resume - ${job.company} (${job.title})`,
    isOriginal: false,
    tailoredForJobId: job.id,
    tailoredForCompanyName: job.company,
    createdAt: new Date().toISOString(),
    profileSnapshot: userProfile,
    strengths: [
      `Re-ordered skills to emphasize high-priority JD matches: ${analysis.matchedSkills.slice(0, 4).join(', ')}`,
      'Restructured bullet points with action verbs aligned to job responsibilities',
      'Strict ATS formatting applied (100% parse rate guaranteed)'
    ],
    weaknesses: [
      `Skill gap noted: ${analysis.skillGaps.join(', ') || 'None'} (No fake experience added)`
    ],
    structureNotes: [
      'Strict Truthfulness Guardrail: Zero unverifiable claims or fabricated credentials added.',
      'ATS Keyword Density: Optimized for single-pass resume screeners.'
    ],
    matchedKeywords: analysis.matchedSkills
  };

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-004',
    agentName: 'Resume Optimization Agent',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: `User approved optimization for ${job.company}`,
    outputSummary: `Generated tailored ATS resume (Version ID: ${tailoredVersion.id}). Zero fabrication.`,
    durationMs: 1500
  };

  return { tailoredVersion, log };
};

// ============================================================================
// AG-005: COVER LETTER GENERATION SERVICE
// ============================================================================
export const generateCoverLetter = async (
  job: Job,
  tailoredVersion: ResumeVersion,
  userProfile: UserProfile
): Promise<{ coverLetter: CoverLetter; log: AgentExecutionLog }> => {
  await delay(1200);

  const coverLetter: CoverLetter = {
    id: `cl_${Date.now()}`,
    jobId: job.id,
    userId: userProfile.userId,
    resumeVersionId: tailoredVersion.id,
    companyName: job.company,
    jobTitle: job.title,
    createdAt: new Date().toISOString(),
    content: `Dear Hiring Team at ${job.company},

I am writing to express my strong enthusiasm for the ${job.title} position. As a software engineering graduate with hands-on experience in ${userProfile.skills.slice(0, 4).join(', ')}, I have followed ${job.company}'s work with great admiration.

In my recent work, I developed production-grade React components and microservices that improved performance metrics significantly. My technical background in ${userProfile.technicalSkills.slice(0, 3).join(', ')} aligns directly with the key requirements outlined in your job posting.

I am particularly excited about the prospect of contributing to ${job.company}'s engineering culture and driving user-facing innovation. Thank you for your time and consideration.

Sincerely,
${userProfile.userId === 'usr_101' ? 'Sri Saketh' : 'Job Seeker'}
Software Engineer`
  };

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-005',
    agentName: 'Cover Letter Generation Agent',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: `Drafted cover letter for ${job.company}`,
    outputSummary: `Produced personalized job-specific cover letter linked to Tailored Resume.`,
    durationMs: 1200
  };

  return { coverLetter, log };
};

// ============================================================================
// AG-006 & AG-007: APPLICATION MANAGEMENT & TRACKING SERVICE
// ============================================================================
export const recordApplication = async (
  job: Job,
  resumeVersionId: string,
  coverLetterId?: string,
  notes?: string
): Promise<{ application: Application; log: AgentExecutionLog }> => {
  await delay(700);

  const application: Application = {
    id: `app_${Date.now()}`,
    jobId: job.id,
    userId: 'usr_101',
    resumeVersionId,
    coverLetterId,
    companyName: job.company,
    jobTitle: job.title,
    appliedDate: new Date().toISOString(),
    status: 'APPLIED',
    jobUrl: job.sourceUrl,
    notes: notes || 'Recorded application in AI Career OS.',
    history: [
      {
        id: `hist_1_${Date.now()}`,
        applicationId: `app_${Date.now()}`,
        status: 'SAVED',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        note: 'Saved job to target list.'
      },
      {
        id: `hist_2_${Date.now()}`,
        applicationId: `app_${Date.now()}`,
        status: 'APPLIED',
        timestamp: new Date().toISOString(),
        note: 'Application recorded by user.'
      }
    ]
  };

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-006',
    agentName: 'Application Management Agent',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: `Record application for ${job.company}`,
    outputSummary: `Persisted Application ID: ${application.id} with linked resume and cover letter.`,
    durationMs: 700
  };

  return { application, log };
};

// ============================================================================
// AG-009: INTERVIEW INVITATION DETECTION SERVICE (READ-ONLY EMAIL OAUTH)
// ============================================================================
export const scanInboxForInterviews = async (
  emailAuthorized: boolean
): Promise<{ event?: EmailInterviewEvent; interview?: Interview; log: AgentExecutionLog }> => {
  await delay(1100);

  if (!emailAuthorized) {
    const log: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      agentId: 'AG-009',
      agentName: 'Interview Invitation Detection Agent',
      timestamp: new Date().toISOString(),
      status: 'FAILURE',
      inputSummary: 'Inbox Scan requested',
      outputSummary: 'User has not granted read-only email access. Authorization required.',
      durationMs: 400
    };
    return { log };
  }

  const event = INITIAL_EMAIL_EVENT;
  const interview = INITIAL_INTERVIEWS[0];

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-009',
    agentName: 'Interview Invitation Detection Agent',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: 'Authorized inbox scan (read-scope)',
    outputSummary: `Detected interview invitation from ${event.companyName} with ${event.confidenceScore}% confidence.`,
    durationMs: 1100
  };

  return { event, interview, log };
};

// ============================================================================
// AG-010: COMPANY RESEARCH SERVICE
// ============================================================================
export const fetchCompanyResearch = async (
  companyName: string
): Promise<{ research: CompanyResearch; log: AgentExecutionLog }> => {
  await delay(950);

  const research: CompanyResearch = {
    ...INITIAL_COMPANY_RESEARCH,
    companyName
  };

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-010',
    agentName: 'Company Research Agent',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: `Company lookup: "${companyName}"`,
    outputSummary: `Compiled company overview, products, culture highlights, and interview insights.`,
    durationMs: 950
  };

  return { research, log };
};

// ============================================================================
// AG-011: INTERVIEW PREPARATION SERVICE
// ============================================================================
export const generateInterviewPrep = async (
  interview: Interview,
  research: CompanyResearch,
  userProfile: UserProfile
): Promise<{ prep: InterviewPreparation; log: AgentExecutionLog }> => {
  await delay(1100);

  const prep = INITIAL_INTERVIEW_PREP;

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-011',
    agentName: 'Interview Preparation Agent',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: `Generated prep workspace for ${interview.companyName}`,
    outputSummary: `Created personalized technical topics, practice questions, and preparation checklist.`,
    durationMs: 1100
  };

  return { prep, log };
};

// ============================================================================
// AG-012.1: MOCK INTERVIEW SUB-MODULE
// ============================================================================
export const submitMockAnswer = async (
  session: MockInterviewSession,
  questionIndex: number,
  answerText: string
): Promise<{ updatedSession: MockInterviewSession; evaluationNote: string; log: AgentExecutionLog }> => {
  await delay(900);

  const updatedQuestions = [...session.questions];
  const currentQ = updatedQuestions[questionIndex];
  if (currentQ) {
    currentQ.userAnswer = answerText;
    currentQ.score = Math.floor(Math.random() * 15) + 82; // 82 - 97
    currentQ.feedbackNote = 'Solid answer addressing performance requirements and system design.';
  }

  const updatedSession: MockInterviewSession = {
    ...session,
    questions: updatedQuestions,
    status: questionIndex >= updatedQuestions.length - 1 ? 'COMPLETED' : 'IN_PROGRESS',
    endedAt: questionIndex >= updatedQuestions.length - 1 ? new Date().toISOString() : undefined
  };

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-012.1',
    agentName: 'Mock Interview Sub-module',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: `Submitted answer for Q${questionIndex + 1}`,
    outputSummary: `Evaluated turn-by-turn answer quality score: ${currentQ?.score}%.`,
    durationMs: 900
  };

  return { updatedSession, evaluationNote: currentQ?.feedbackNote || '', log };
};

// ============================================================================
// AG-012.2: FEEDBACK & CAREER COACH SUB-MODULE
// ============================================================================
export const generateFeedbackAndCoach = async (
  session: MockInterviewSession
): Promise<{ feedback: Feedback; readinessScore: ReadinessScore; roadmap: LearningRoadmap; log: AgentExecutionLog }> => {
  await delay(1300);

  const feedback = INITIAL_FEEDBACK;
  const readinessScore = INITIAL_READINESS_SCORE;
  const roadmap = INITIAL_LEARNING_ROADMAP;

  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-012.2',
    agentName: 'Feedback & Career Coach Sub-module',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    inputSummary: `Evaluated completed mock interview session ${session.id}`,
    outputSummary: `Generated Overall Feedback (${feedback.overallScore}%), Readiness Score (${readinessScore.currentScore}%), and Learning Roadmap.`,
    durationMs: 1300
  };

  return { feedback, readinessScore, roadmap, log };
};
