import React, { createContext, useContext, useState } from 'react';
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

interface WorkflowContextType {
  // State Entities
  user: User;
  profile: UserProfile;
  resumes: Resume[];
  resumeVersions: ResumeVersion[];
  activeResumeVersion: ResumeVersion;
  jobs: Job[];
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

  // Actions / Handlers
  updateProfile: (updated: Partial<UserProfile>) => void;
  uploadAndAnalyzeResume: (file: File | string) => Promise<void>;
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
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [resumes, setResumes] = useState<Resume[]>(INITIAL_RESUMES);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>(INITIAL_RESUME_VERSIONS);
  const [activeResumeVersion, setActiveResumeVersion] = useState<ResumeVersion>(INITIAL_RESUME_VERSIONS[0]);
  
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(INITIAL_JOBS[0]);
  const [selectedJD, setSelectedJD] = useState<JobDescription | null>(INITIAL_JDS['jd_001']);
  const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(INITIAL_JD_ANALYSIS);
  
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
  const [agentLogs, setAgentLogs] = useState<AgentExecutionLog[]>(INITIAL_AGENT_LOGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addLog = (log: AgentExecutionLog) => {
    setAgentLogs(prev => [log, ...prev]);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const uploadAndAnalyzeResume = async (file: File | string) => {
    setIsLoading(true);
    try {
      const res = await services.analyzeResume(file, profile);
      setResumes(prev => [res.resume, ...prev]);
      setResumeVersions(prev => [res.version, ...prev]);
      setActiveResumeVersion(res.version);
      setProfile(res.updatedProfile);
      addLog(res.log);
    } finally {
      setIsLoading(false);
    }
  };

  const selectJob = async (job: Job) => {
    setSelectedJob(job);
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
      updateProfile,
      uploadAndAnalyzeResume,
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
