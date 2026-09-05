// ============================================================================
// AI CAREER OPERATING SYSTEM - DOMAIN TYPES & DATA LAYER SCHEMAS
// (Mapped to DATA-001 through DATA-027 in SRS Section 22)
// ============================================================================

export type UserRole = 'JOB_SEEKER' | 'ADMIN';

export interface User {
  id: string; // DATA-001
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  emailAuthorized: boolean; // Authorization for AG-009 read-only inbox scan
  connectedAccounts: {
    google: boolean;
    linkedin: boolean;
    github: boolean;
  };
}

export interface UserProfile {
  id: string; // DATA-002
  userId: string;
  headline: string;
  phone: string;
  location: string;
  bio: string;
  education: Education[];
  skills: string[]; // Reference DATA-005
  technicalSkills: string[];
  softSkills: string[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  preferences: UserPreferences;
  completeness: number; // percentage 0-100
  jobRole?: string; // Analyzed best-supported job role from complete resume
  jobRoleEvidence?: string[]; // Evidence bullet points supporting the role
  jobRoleConfidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  jobRoleNeedsConfirmation?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
}

export interface UserPreferences {
  targetRoles: string[];
  preferredLocation: string;
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'ANY';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  minSalary?: number;
  maxSalary?: number;
  targetCompanies: string[];
}

export interface Resume {
  id: string; // DATA-003
  userId: string;
  originalFileName: string;
  fileType: 'PDF' | 'DOC' | 'DOCX' | 'IMAGE';
  fileSize: number;
  uploadDate: string;
  currentVersionId: string;
}

export interface ResumeVersion {
  id: string; // DATA-004
  resumeId: string;
  versionName: string;
  isOriginal: boolean;
  tailoredForJobId?: string;
  tailoredForCompanyName?: string;
  createdAt: string;
  profileSnapshot: Partial<UserProfile>;
  strengths: string[];
  weaknesses: string[];
  structureNotes: string[];
  matchedKeywords?: string[];
  contentPdfUrl?: string;
  detectedJobRole?: string;
  rawText?: string;
}

export interface Job {
  id: string; // DATA-006
  title: string;
  company: string;
  companyId: string;
  location: string;
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  jobType: 'FULL_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salaryRange?: string;
  postedDate: string;
  descriptionId: string; // DATA-007
  sourceUrl?: string;
  relevanceScore: number; // 0-100
  isSaved?: boolean;
  isRecommended?: boolean;
}

export interface JobDescription {
  id: string; // DATA-007
  jobId: string;
  fullText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  experienceYearsRequired: number;
}

export interface ResponsibilityAlignmentItem {
  responsibility: string;
  alignmentLevel: 'STRONG' | 'PARTIAL' | 'NO_EVIDENCE';
  evidence: string;
}

export interface JDAnalysis {
  id: string; // DATA-008
  jobId: string;
  userId: string;
  createdAt: string;
  resumeVersionId?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  matchedSkills: string[];
  skillGaps: string[]; // Critical gap breakdown
  responsibilitiesSummary: string[];
  responsibilityAlignment?: ResponsibilityAlignmentItem[];
  matchScore: number; // DATA-009 Match score 0-100
  scoreBreakdown: {
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    keywordMatch: number;
  };
  experienceAlignment?: {
    candidateYears: number;
    requiredYears: number;
    isAligned: boolean;
    evidence: string;
  };
  educationAlignment?: {
    candidateEducation: string;
    requiredEducation: string;
    isAligned: boolean;
    evidence: string;
  };
  certificationAlignment?: {
    candidateCerts: string[];
    requiredCerts: string[];
    isAligned: boolean;
    evidence: string;
  };
  strengths?: string[];
  recommendations?: string[];
  isApprovedForOptimization?: boolean;
  approvedAt?: string;
}

export interface CoverLetter {
  id: string; // DATA-010
  jobId: string;
  userId: string;
  resumeVersionId: string;
  content: string;
  createdAt: string;
  companyName: string;
  jobTitle: string;
}

export type ApplicationStatusType = 
  | 'SAVED' 
  | 'APPLIED' 
  | 'APPLICATION_RECEIVED' 
  | 'SCREENING' 
  | 'INTERVIEW' 
  | 'REJECTED' 
  | 'OFFER';

export interface Application {
  id: string; // DATA-011
  jobId: string;
  userId: string;
  resumeVersionId: string;
  coverLetterId?: string;
  companyName: string;
  jobTitle: string;
  appliedDate: string;
  status: ApplicationStatusType; // DATA-012 current status
  jobUrl?: string;
  notes?: string;
  history: ApplicationStatusEvent[];
}

export interface ApplicationStatusEvent {
  id: string; // DATA-012
  applicationId: string;
  status: ApplicationStatusType;
  timestamp: string;
  note?: string;
}

export interface NotificationItem {
  id: string; // DATA-013
  userId: string;
  title: string;
  message: string;
  type: 'INTERVIEW_ALERT' | 'APPLICATION_UPDATE' | 'MATCH_ALERT' | 'SYSTEM';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface EmailInterviewEvent {
  id: string; // DATA-014 & DATA-016
  userId: string;
  senderEmail: string;
  subject: string;
  detectedAt: string;
  companyName: string;
  roleTitle: string;
  interviewDate: string;
  interviewTime: string;
  meetingLink?: string;
  confidenceScore: number; // 0-100
  isConfirmed: boolean;
}

export interface Interview {
  id: string; // DATA-015 & DATA-017
  userId: string;
  jobId?: string;
  applicationId?: string;
  companyName: string;
  companyId: string;
  roleTitle: string;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink?: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  sourceEventId?: string;
}

export interface Company {
  id: string; // DATA-018
  name: string;
  logoUrl?: string;
  industry: string;
  website: string;
  headquarters: string;
  size: string;
}

export interface CompanyResearch {
  id: string; // DATA-019
  companyId: string;
  companyName: string;
  overview: string;
  productsAndServices: string[];
  businessModel: string;
  recentNews: string[];
  cultureHighlights: string[];
  interviewTips: string[];
  createdAt: string;
}

export interface InterviewPreparation {
  id: string; // DATA-020
  interviewId: string;
  userId: string;
  roleTitle: string;
  companyName: string;
  technicalTopics: {
    topic: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  practiceQuestions: {
    id: string;
    question: string;
    category: 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN' | 'COMPANY_SPECIFIC';
    sampleAnswerKeyPoints: string[];
  }[];
  hrQuestions: string[];
  focusAreas: string[];
  preparationChecklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
}

export interface MockInterviewSession {
  id: string; // DATA-021
  interviewId: string;
  userId: string;
  roleTitle: string;
  companyName: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  startedAt: string;
  endedAt?: string;
  questions: MockQuestionPair[];
}

export interface MockQuestionPair {
  questionId: string; // DATA-022
  question: string;
  category: string;
  userAnswer?: string; // DATA-023
  feedbackNote?: string;
  score?: number; // 0-100
}

export interface Feedback {
  id: string; // DATA-024
  mockSessionId: string;
  userId: string;
  overallScore: number; // 0-100
  technicalScore: number;
  communicationScore: number;
  answerQualityScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  questionFeedback: {
    question: string;
    userAnswer: string;
    score: number;
    feedback: string;
  }[];
}

export interface ReadinessScore {
  id: string; // DATA-025
  userId: string;
  currentScore: number; // 0-100
  categoryScores: {
    technical: number;
    behavioral: number;
    resumeAlignment: number;
    communication: number;
  };
  scoreHistory: {
    date: string;
    score: number;
  }[];
  lastUpdated: string;
}

export interface LearningRoadmap {
  id: string; // DATA-026
  userId: string;
  title: string;
  targetRole: string;
  overallProgress: number; // 0-100
  items: RoadmapItem[];
}

export interface RoadmapItem {
  id: string;
  skillOrTopic: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  estimatedHours: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  resources?: string[];
}

export interface AgentExecutionLog {
  id: string; // DATA-027
  agentId: string; // AG-001 through AG-012
  agentName: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE' | 'RETRYING' | 'IN_PROGRESS';
  inputSummary: string;
  outputSummary: string;
  durationMs: number;
}
