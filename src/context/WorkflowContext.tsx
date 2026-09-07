import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  User,
  UserProfile,
  UserPreferences,
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
  INITIAL_USER,
  INITIAL_PROFILE,
  INITIAL_RESUMES,
  INITIAL_RESUME_VERSIONS,
  INITIAL_JOBS,
  INITIAL_JDS,
  INITIAL_JD_ANALYSIS,
  INITIAL_APPLICATIONS,
  INITIAL_EMAIL_EVENT,
  INITIAL_INTERVIEWS,
  INITIAL_COMPANY_RESEARCH,
  INITIAL_INTERVIEW_PREP,
  INITIAL_MOCK_SESSIONS,
  INITIAL_FEEDBACK,
  INITIAL_READINESS_SCORE,
  INITIAL_LEARNING_ROADMAP,
  INITIAL_NOTIFICATIONS,
  INITIAL_AGENT_LOGS
} from '../services/mockData';

import * as services from '../services/agentServices';
import { persistenceService } from '../services/persistenceService';

export const EMPTY_USER_PROFILE: UserProfile = {
  id: 'prof_current',
  userId: 'usr_current',
  headline: '',
  phone: '',
  location: '',
  bio: '',
  education: [],
  skills: [],
  technicalSkills: [],
  softSkills: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  preferences: {
    targetRoles: [],
    preferredLocation: '',
    workMode: 'HYBRID',
    experienceLevel: 'ENTRY',
    targetCompanies: []
  },
  completeness: 0
};

interface WorkflowContextType {
  // State Entities
  user: User;
  profile: UserProfile;
  resumes: Resume[];
  resumeVersions: ResumeVersion[];
  activeResumeVersion: ResumeVersion | null;
  jobs: Job[];
  allJds: Record<string, JobDescription>;
  selectedJob: Job | null;
  selectedJD: JobDescription | null;
  jdAnalysis: JDAnalysis | null;
  allJdAnalyses: Record<string, JDAnalysis>;
  tailoredResume: ResumeVersion | null;
  allTailoredResumes: Record<string, ResumeVersion>;
  coverLetter: CoverLetter | null;
  allCoverLetters: Record<string, CoverLetter>;
  applications: Application[];
  activeApplication: Application | null;
  emailEvent: EmailInterviewEvent | null;
  interviews: Interview[];
  activeInterview: Interview | null;
  companyResearch: CompanyResearch | null;
  interviewPrep: InterviewPreparation | null;
  mockSession: MockInterviewSession | null;
  feedback: Feedback | null;
  readinessScore: ReadinessScore;
  learningRoadmap: LearningRoadmap;
  notifications: NotificationItem[];
  agentLogs: AgentExecutionLog[];
  isLoading: boolean;
  analysisError: string | null;
  jobSearchError: string | null;

  // Actions / Handlers
  updateProfile: (updated: Partial<UserProfile>) => void;
  uploadAndAnalyzeResume: (file: File | string) => Promise<void>;
  confirmJobRole: (confirmedRole: string) => void;
  clearAnalysisError: () => void;
  clearJobSearchError: () => void;
  runJobSearch: (
    query?: string,
    filters?: {
      workMode?: string;
      location?: string;
      country?: string;
      state?: string;
      city?: string;
    }
  ) => Promise<void>;
  selectJob: (job: Job) => Promise<void>;
  runJDAnalysis: (job: Job, customJd?: JobDescription) => Promise<void>;
  approveJdAnalysis: () => void;
  analyzeManualJd: (title: string, company: string, fullJdText: string) => Promise<void>;
  runResumeOptimization: () => Promise<void>;
  approveResumeOptimization: () => Promise<void>;
  generateCoverLetterForSelectedJob: () => Promise<void>;
  updateCoverLetterContent: (newContent: string) => Promise<void>;
  recordJobApplication: (notes?: string) => Promise<void>;
  authorizeEmailAndScan: () => Promise<void>;
  startCompanyResearchAndPrep: (interview: Interview) => Promise<void>;
  submitAnswerInMockInterview: (questionIndex: number, answerText: string) => Promise<void>;
  finishMockInterviewAndGetFeedback: () => Promise<void>;
  markNotificationRead: (id: string) => void;
  updateEmailAuthorization: (authorized: boolean) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, userProfile } = useAuth();

  const [user, setUser] = useState<User>(INITIAL_USER);
  const [profile, setProfile] = useState<UserProfile>(EMPTY_USER_PROFILE);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [activeResumeVersion, setActiveResumeVersion] = useState<ResumeVersion | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJds, setAllJds] = useState<Record<string, JobDescription>>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJD, setSelectedJD] = useState<JobDescription | null>(null);
  const [jobSearchError, setJobSearchError] = useState<string | null>(null);
  const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(null);
  const [allJdAnalyses, setAllJdAnalyses] = useState<Record<string, JDAnalysis>>({});
  
  const [tailoredResume, setTailoredResume] = useState<ResumeVersion | null>(null);
  const [allTailoredResumes, setAllTailoredResumes] = useState<Record<string, ResumeVersion>>({});
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [allCoverLetters, setAllCoverLetters] = useState<Record<string, CoverLetter>>({});
  
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [activeApplication, setActiveApplication] = useState<Application | null>(INITIAL_APPLICATIONS[0]);
  
  const [emailEvent, setEmailEvent] = useState<EmailInterviewEvent | null>(INITIAL_EMAIL_EVENT);
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(INITIAL_INTERVIEWS[0]);
  
  const [companyResearch, setCompanyResearch] = useState<CompanyResearch | null>(INITIAL_COMPANY_RESEARCH);
  const [interviewPrep, setInterviewPrep] = useState<InterviewPreparation | null>(INITIAL_INTERVIEW_PREP);
  
  const [mockSession, setMockSession] = useState<MockInterviewSession | null>(INITIAL_MOCK_SESSIONS[0]);
  const [feedback, setFeedback] = useState<Feedback | null>(INITIAL_FEEDBACK);
  const [readinessScore, setReadinessScore] = useState<ReadinessScore>(INITIAL_READINESS_SCORE);
  const [learningRoadmap, setLearningRoadmap] = useState<LearningRoadmap>(INITIAL_LEARNING_ROADMAP);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [agentLogs, setAgentLogs] = useState<AgentExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronize authenticated user identity into workflow state
  useEffect(() => {
    if (authUser || userProfile) {
      const displayName = userProfile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || INITIAL_USER.name;
      const displayEmail = userProfile?.email || authUser?.email || INITIAL_USER.email;
      const avatarUrl = userProfile?.avatar_url || authUser?.user_metadata?.avatar_url || INITIAL_USER.avatarUrl;

      setUser(prev => ({
        ...prev,
        id: authUser?.id || prev.id,
        name: displayName,
        email: displayEmail,
        avatarUrl
      }));
    }
  }, [authUser, userProfile]);

  // Startup Hydration Effect: Restore DATA-002 User Profile, DATA-003 Resume, DATA-004 Resume Versions, DATA-010 Cover Letters, and AG-003 JD Analyses on App load
  useEffect(() => {
    let isMounted = true;

    async function hydrateFromPersistentStorage() {
      const currentUserId = authUser?.id || userProfile?.user_id || profile.userId || 'usr_current';

      try {
        const storedProfile = await persistenceService.getUserProfile(currentUserId);
        const storedResumes = await persistenceService.getResumes(currentUserId);
        const storedVersions = await persistenceService.getResumeVersions(currentUserId);
        const storedAnalyses = await persistenceService.getAllJdAnalyses(currentUserId);
        const storedJobs = await persistenceService.getJobs(currentUserId);
        const storedJds = await persistenceService.getJds(currentUserId);
        const storedCoverLetters = await persistenceService.getCoverLetters(currentUserId);

        if (!isMounted) return;

        if (storedProfile && storedProfile.completeness > 0) {
          setProfile(storedProfile);
        } else {
          setProfile(prev => ({
            ...prev,
            id: userProfile?.id || authUser?.id || prev.id,
            userId: currentUserId,
          }));
        }

        if (storedResumes && storedResumes.length > 0) {
          setResumes(storedResumes);
        }

        if (storedVersions && storedVersions.length > 0) {
          setResumeVersions(storedVersions);
          const latest = storedVersions.reduce((acc, curr) =>
            new Date(curr.createdAt).getTime() > new Date(acc.createdAt).getTime() ? curr : acc
          , storedVersions[0]);
          setActiveResumeVersion(latest);

          const tailoredDict: Record<string, ResumeVersion> = {};
          storedVersions.forEach(v => {
            if (v.tailoredForJobId) {
              tailoredDict[v.tailoredForJobId] = v;
            }
          });
          setAllTailoredResumes(tailoredDict);
        }

        if (storedCoverLetters && storedCoverLetters.length > 0) {
          const coverLetterDict: Record<string, CoverLetter> = {};
          storedCoverLetters.forEach(cl => {
            if (cl.jobId) {
              coverLetterDict[cl.jobId] = cl;
            }
          });
          setAllCoverLetters(coverLetterDict);
        }

        if (storedAnalyses && Object.keys(storedAnalyses).length > 0) {
          setAllJdAnalyses(storedAnalyses);
        }

        if (storedJobs && storedJobs.length > 0) {
          setJobs(storedJobs);
        }

        if (storedJds && Object.keys(storedJds).length > 0) {
          setAllJds(storedJds);
        }
      } catch (err) {
        console.error('Failed to hydrate AG-001/AG-003 persisted data from storage:', err);
      }
    }

    hydrateFromPersistentStorage();

    return () => {
      isMounted = false;
    };
  }, [authUser, userProfile]);

  const addLog = (log: AgentExecutionLog) => {
    setAgentLogs(prev => [log, ...prev]);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProf = { ...prev, ...updated };
      persistenceService.saveUserProfile(newProf);
      return newProf;
    });
  };

  const clearAnalysisError = () => setAnalysisError(null);

  const confirmJobRole = async (confirmedRole: string) => {
    const updatedProfile: UserProfile = {
      ...profile,
      jobRole: confirmedRole,
      jobRoleConfidence: 'HIGH',
      jobRoleNeedsConfirmation: false,
      headline: profile.headline || `${confirmedRole} Professional`
    };
    setProfile(updatedProfile);
    await persistenceService.saveUserProfile(updatedProfile);

    if (activeResumeVersion) {
      const updatedVersion: ResumeVersion = {
        ...activeResumeVersion,
        detectedJobRole: confirmedRole
      };
      setActiveResumeVersion(updatedVersion);
      await persistenceService.saveResumeVersion(updatedVersion, profile.userId);
    }
  };

  const uploadAndAnalyzeResume = async (file: File | string) => {
    setIsLoading(true);
    setAnalysisError(null);
    try {
      const res = await services.analyzeResume(file, profile);
      setResumes(prev => [res.resume, ...prev.filter(r => r.id !== res.resume.id)]);
      setResumeVersions(prev => [res.version, ...prev.filter(v => v.id !== res.version.id)]);
      setActiveResumeVersion(res.version);
      setProfile(res.updatedProfile);
      addLog(res.log);

      // PERSIST DATA IMMEDIATELY TO PERSISTENT DATABASE LAYER (DATA-002, DATA-003, DATA-004)
      await persistenceService.saveUserProfile(res.updatedProfile);
      await persistenceService.saveResume(res.resume);
      await persistenceService.saveResumeVersion(res.version, res.updatedProfile.userId);

      if (res.dataUrl) {
        await persistenceService.saveResumeFile(res.resume.id, res.updatedProfile.userId, {
          fileName: res.resume.originalFileName,
          fileType: res.resume.fileType,
          fileSize: res.resume.fileSize,
          dataUrl: res.dataUrl
        });
      }
    } catch (err: any) {
      console.error('Resume analysis error:', err);
      setAnalysisError(err.message || 'Failed to analyze resume.');
      if (err.executionLog) {
        addLog(err.executionLog);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearJobSearchError = () => setJobSearchError(null);

  const runJobSearch = async (
    query?: string,
    filters?: {
      workMode?: string;
      location?: string;
      country?: string;
      state?: string;
      city?: string;
    }
  ) => {
    setIsLoading(true);
    setJobSearchError(null);
    try {
      // 1. Update & Persist Location Preferences in User Profile
      const country = filters?.country !== undefined ? filters.country : profile.preferences?.country;
      const state = filters?.state !== undefined ? filters.state : profile.preferences?.state;
      const city = filters?.city !== undefined ? filters.city : profile.preferences?.city;
      const workMode = (filters?.workMode as any) || profile.preferences?.workMode || 'HYBRID';

      const parts: string[] = [];
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (country) parts.push(country);
      const preferredLocation = parts.length > 0 ? parts.join(', ') : profile.preferences?.preferredLocation || '';

      const updatedPrefs: UserPreferences = {
        targetRoles: profile.preferences?.targetRoles || [],
        experienceLevel: profile.preferences?.experienceLevel || 'MID',
        targetCompanies: profile.preferences?.targetCompanies || [],
        ...(profile.preferences || {}),
        country,
        state,
        city,
        preferredLocation,
        workMode: workMode as any
      };

      const updatedProfile: UserProfile = {
        ...profile,
        preferences: updatedPrefs
      };
      setProfile(updatedProfile);
      await persistenceService.saveUserProfile(updatedProfile);

      // 2. Build location filter structure for external job API
      const locationObj = { country, state, city, workMode };

      const res = await services.searchJobs(updatedProfile, query, {
        workMode: filters?.workMode,
        location: locationObj
      });

      setJobs(res.jobs);
      setAllJds(prev => {
        const next = { ...prev, ...res.jds };
        persistenceService.saveJds(next, updatedProfile.userId);
        return next;
      });
      await persistenceService.saveJobs(res.jobs, updatedProfile.userId);
      addLog(res.log);
    } catch (err: any) {
      console.error('AG-002 Job Search error:', err);
      setJobSearchError(err.message || 'Failed to fetch job listings.');
      if (err.executionLog) {
        addLog(err.executionLog);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const selectJob = async (job: Job) => {
    setSelectedJob(job);
    const targetJd = allJds[job.descriptionId];
    if (targetJd) {
      setSelectedJD(targetJd);
    }

    let existingAnalysis = allJdAnalyses[job.id];
    if (!existingAnalysis) {
      const currentUserId = profile.userId || 'usr_current';
      const storedAnalyses = await persistenceService.getAllJdAnalyses(currentUserId);
      if (storedAnalyses && storedAnalyses[job.id]) {
        existingAnalysis = storedAnalyses[job.id];
        setAllJdAnalyses(storedAnalyses);
      }
    }

    if (existingAnalysis) {
      setJdAnalysis(existingAnalysis);
    } else {
      await runJDAnalysis(job);
    }

    // Restore job-isolated tailored resume version if available
    if (allTailoredResumes[job.id]) {
      setTailoredResume(allTailoredResumes[job.id]);
    } else {
      const matchVersion = resumeVersions.find(v => v.tailoredForJobId === job.id);
      setTailoredResume(matchVersion || null);
    }

    // Restore job-isolated cover letter if available
    if (allCoverLetters[job.id]) {
      setCoverLetter(allCoverLetters[job.id]);
    } else {
      const currentUserId = profile.userId || 'usr_current';
      const storedCL = await persistenceService.getCoverLetterForJob(currentUserId, job.id);
      if (storedCL) {
        setCoverLetter(storedCL);
        setAllCoverLetters(prev => ({ ...prev, [job.id]: storedCL }));
      } else {
        setCoverLetter(null);
      }
    }
  };

  const runJDAnalysis = async (job: Job, customJd?: JobDescription) => {
    setIsLoading(true);
    try {
      const targetJd = customJd || allJds[job.descriptionId];
      const res = await services.analyzeJobDescription(job, profile, targetJd, activeResumeVersion?.id);
      setSelectedJob(job);
      setSelectedJD(res.jd);
      setJdAnalysis(res.analysis);
      setAllJds(prev => ({ ...prev, [res.jd.id]: res.jd }));
      setAllJdAnalyses(prev => ({ ...prev, [job.id]: res.analysis }));
      addLog(res.log);

      // PERSIST AG-003 ANALYSIS PER JOB ID
      await persistenceService.saveJdAnalysis(res.analysis);
    } finally {
      setIsLoading(false);
    }
  };

  const approveJdAnalysis = async () => {
    if (!jdAnalysis) return;
    const updated: JDAnalysis = {
      ...jdAnalysis,
      isApprovedForOptimization: true,
      approvedAt: new Date().toISOString()
    };
    setJdAnalysis(updated);
    setAllJdAnalyses(prev => ({ ...prev, [updated.jobId]: updated }));
    await persistenceService.saveJdAnalysis(updated);
  };

  const analyzeManualJd = async (title: string, company: string, fullJdText: string) => {
    if (!fullJdText || fullJdText.trim().length < 10) {
      throw new Error('Please enter a valid job description before analyzing.');
    }

    const manualJobId = `job_manual_${Date.now()}`;
    const manualJdId = `jd_${manualJobId}`;

    const manualJob: Job = {
      id: manualJobId,
      title: title.trim() || 'Custom Software Role',
      company: company.trim() || 'Target Company',
      companyId: `comp_manual_${Date.now()}`,
      location: profile.location || 'Remote / Flexible',
      workMode: 'HYBRID',
      jobType: 'FULL_TIME',
      salaryRange: 'Competitive',
      postedDate: new Date().toISOString().split('T')[0],
      descriptionId: manualJdId,
      relevanceScore: 85
    };

    const manualJd: JobDescription = {
      id: manualJdId,
      jobId: manualJobId,
      fullText: fullJdText.trim(),
      requiredSkills: [],
      preferredSkills: [],
      responsibilities: [],
      qualifications: [],
      experienceYearsRequired: 2
    };

    await runJDAnalysis(manualJob, manualJd);
  };

  const runResumeOptimization = async () => {
    if (!selectedJob || !jdAnalysis) {
      throw new Error('Select a job and run JD Analysis before optimizing your resume.');
    }
    if (jdAnalysis.isApprovedForOptimization !== true) {
      throw new Error('Approve the JD Analysis before optimizing your resume.');
    }

    setIsLoading(true);
    try {
      const targetJd = selectedJD || allJds[selectedJob.descriptionId];
      const res = await services.optimizeResumeForJob(
        selectedJob,
        jdAnalysis,
        profile,
        targetJd,
        activeResumeVersion?.id
      );

      setTailoredResume(res.tailoredVersion);
      setAllTailoredResumes(prev => ({ ...prev, [selectedJob.id]: res.tailoredVersion }));
      setResumeVersions(prev => [res.tailoredVersion, ...prev.filter(v => v.id !== res.tailoredVersion.id)]);
      addLog(res.log);

      // PERSIST AG-004 TAILORED VERSION TO INDEXEDDB (DATA-004)
      await persistenceService.saveResumeVersion(res.tailoredVersion, profile.userId);
    } finally {
      setIsLoading(false);
    }
  };

  const approveResumeOptimization = async () => {
    if (!tailoredResume || !selectedJob) return;
    const approvedVersion: ResumeVersion = {
      ...tailoredResume,
      isApproved: true,
      approvedAt: new Date().toISOString()
    } as any;

    setTailoredResume(approvedVersion);
    setAllTailoredResumes(prev => ({ ...prev, [selectedJob.id]: approvedVersion }));
    setResumeVersions(prev => [approvedVersion, ...prev.filter(v => v.id !== approvedVersion.id)]);

    await persistenceService.saveResumeVersion(approvedVersion, profile.userId);
  };

  const generateCoverLetterForSelectedJob = async () => {
    if (!selectedJob) {
      throw new Error('Select a job before generating a cover letter.');
    }
    const versionToUse = tailoredResume || activeResumeVersion;
    if (!versionToUse) {
      throw new Error('An optimized resume version (AG-004) is required before generating a cover letter.');
    }

    setIsLoading(true);
    try {
      const targetJd = selectedJD || allJds[selectedJob.descriptionId];
      const targetAnalysis = allJdAnalyses[selectedJob.id] || jdAnalysis || undefined;
      const res = await services.generateCoverLetter(
        selectedJob,
        versionToUse,
        profile,
        targetJd,
        targetAnalysis
      );

      setCoverLetter(res.coverLetter);
      setAllCoverLetters(prev => ({ ...prev, [selectedJob.id]: res.coverLetter }));
      addLog(res.log);

      // PERSIST DATA-010 COVER LETTER TO INDEXEDDB / STORAGE
      await persistenceService.saveCoverLetter(res.coverLetter);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCoverLetterContent = async (newContent: string) => {
    if (!coverLetter || !selectedJob) return;
    const updated: CoverLetter = {
      ...coverLetter,
      content: newContent
    };
    setCoverLetter(updated);
    setAllCoverLetters(prev => ({ ...prev, [selectedJob.id]: updated }));
    await persistenceService.saveCoverLetter(updated);
  };

  const recordJobApplication = async (notes?: string) => {
    if (!selectedJob) return;
    setIsLoading(true);
    try {
      const versionToUse = tailoredResume?.id || activeResumeVersion.id;
      const res = await services.recordApplication(selectedJob, versionToUse, coverLetter?.id, notes);
      setApplications(prev => [res.application, ...prev]);
      setActiveApplication(res.application);
      addLog(res.log);
    } finally {
      setIsLoading(false);
    }
  };

  const authorizeEmailAndScan = async () => {
    setIsLoading(true);
    try {
      setUser(prev => ({ ...prev, emailAuthorized: true }));
      const res = await services.scanInboxForInterviews(true);
      if (res.event) setEmailEvent(res.event);
      if (res.interview) {
        setInterviews(prev => [res.interview!, ...prev]);
        setActiveInterview(res.interview);
        // SRS Requirement: Automatic handoff from confirmed interview to Company Research & Interview Prep!
        await startCompanyResearchAndPrep(res.interview);
      }
      if (res.log) addLog(res.log);
    } finally {
      setIsLoading(false);
    }
  };

  const startCompanyResearchAndPrep = async (interview: Interview) => {
    setIsLoading(true);
    try {
      const resResearch = await services.fetchCompanyResearch(interview.companyName);
      setCompanyResearch(resResearch.research);
      addLog(resResearch.log);

      const resPrep = await services.generateInterviewPrep(interview, resResearch.research, profile);
      setInterviewPrep(resPrep.prep);
      addLog(resPrep.log);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswerInMockInterview = async (questionIndex: number, answerText: string) => {
    if (!mockSession) return;
    setIsLoading(true);
    try {
      const res = await services.submitMockAnswer(mockSession, questionIndex, answerText);
      setMockSession(res.updatedSession);
      addLog(res.log);
    } finally {
      setIsLoading(false);
    }
  };

  const finishMockInterviewAndGetFeedback = async () => {
    if (!mockSession) return;
    setIsLoading(true);
    try {
      const res = await services.generateFeedbackAndCoach(mockSession);
      setFeedback(res.feedback);
      setReadinessScore(res.readinessScore);
      setLearningRoadmap(res.roadmap);
      addLog(res.log);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateEmailAuthorization = (authorized: boolean) => {
    setUser(prev => ({ ...prev, emailAuthorized: authorized }));
  };

  return (
    <WorkflowContext.Provider value={{
      user,
      profile,
      resumes,
      resumeVersions,
      activeResumeVersion,
      jobs,
      allJds,
      selectedJob,
      selectedJD,
      jdAnalysis,
      allJdAnalyses,
      tailoredResume,
      allTailoredResumes,
      coverLetter,
      allCoverLetters,
      applications,
      activeApplication,
      emailEvent,
      interviews,
      activeInterview,
      companyResearch,
      interviewPrep,
      mockSession,
      feedback,
      readinessScore,
      learningRoadmap,
      notifications,
      agentLogs,
      isLoading,
      analysisError,
      jobSearchError,
      updateProfile,
      uploadAndAnalyzeResume,
      confirmJobRole,
      clearAnalysisError,
      clearJobSearchError,
      runJobSearch,
      selectJob,
      runJDAnalysis,
      approveJdAnalysis,
      analyzeManualJd,
      runResumeOptimization,
      approveResumeOptimization,
      generateCoverLetterForSelectedJob,
      updateCoverLetterContent,
      recordJobApplication,
      authorizeEmailAndScan,
      startCompanyResearchAndPrep,
      submitAnswerInMockInterview,
      finishMockInterviewAndGetFeedback,
      markNotificationRead,
      updateEmailAuthorization
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
