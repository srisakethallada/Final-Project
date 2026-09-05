import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  User,
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
  tailoredResume: ResumeVersion | null;
  coverLetter: CoverLetter | null;
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
  runJobSearch: (query?: string, filters?: { workMode?: string; location?: string }) => Promise<void>;
  selectJob: (job: Job) => Promise<void>;
  runJDAnalysis: (job: Job) => Promise<void>;
  approveResumeOptimization: () => Promise<void>;
  generateCoverLetterForSelectedJob: () => Promise<void>;
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
  
  const [tailoredResume, setTailoredResume] = useState<ResumeVersion | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  
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

      setProfile(prev => ({
        ...prev,
        id: userProfile?.id || authUser?.id || prev.id,
        userId: authUser?.id || prev.userId,
      }));
    }
  }, [authUser, userProfile]);

  const addLog = (log: AgentExecutionLog) => {
    setAgentLogs(prev => [log, ...prev]);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const clearAnalysisError = () => setAnalysisError(null);

  const confirmJobRole = (confirmedRole: string) => {
    setProfile(prev => ({
      ...prev,
      jobRole: confirmedRole,
      jobRoleConfidence: 'HIGH',
      jobRoleNeedsConfirmation: false,
      headline: prev.headline || `${confirmedRole} Professional`
    }));
    if (activeResumeVersion) {
      setActiveResumeVersion(prev => prev ? { ...prev, detectedJobRole: confirmedRole } : null);
    }
  };

  const uploadAndAnalyzeResume = async (file: File | string) => {
    setIsLoading(true);
    setAnalysisError(null);
    try {
      const res = await services.analyzeResume(file, profile);
      setResumes(prev => [res.resume, ...prev]);
      setResumeVersions(prev => [res.version, ...prev]);
      setActiveResumeVersion(res.version);
      setProfile(res.updatedProfile);
      addLog(res.log);
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

  const runJobSearch = async (query?: string, filters?: { workMode?: string; location?: string }) => {
    setIsLoading(true);
    setJobSearchError(null);
    try {
      const res = await services.searchJobs(profile, query, filters);
      setJobs(res.jobs);
      setAllJds(prev => ({ ...prev, ...res.jds }));
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
    await runJDAnalysis(job);
  };

  const runJDAnalysis = async (job: Job) => {
    setIsLoading(true);
    try {
      const res = await services.analyzeJobDescription(job, profile);
      setSelectedJD(res.jd);
      setJdAnalysis(res.analysis);
      addLog(res.log);
    } finally {
      setIsLoading(false);
    }
  };

  const approveResumeOptimization = async () => {
    if (!selectedJob || !jdAnalysis) return;
    setIsLoading(true);
    try {
      const res = await services.optimizeResumeForJob(selectedJob, jdAnalysis, profile);
      setTailoredResume(res.tailoredVersion);
      setResumeVersions(prev => [res.tailoredVersion, ...prev]);
      addLog(res.log);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCoverLetterForSelectedJob = async () => {
    if (!selectedJob) return;
    setIsLoading(true);
    try {
      const versionToUse = tailoredResume || activeResumeVersion;
      const res = await services.generateCoverLetter(selectedJob, versionToUse, profile);
      setCoverLetter(res.coverLetter);
      addLog(res.log);
    } finally {
      setIsLoading(false);
    }
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
      tailoredResume,
      coverLetter,
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
      approveResumeOptimization,
      generateCoverLetterForSelectedJob,
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
