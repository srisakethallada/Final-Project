import {
  User,
  UserProfile,
  Resume,
  ResumeVersion,
  Job,
  JobDescription,
  JDAnalysis,
  Application,
  NotificationItem,
  EmailInterviewEvent,
  Interview,
  Company,
  CompanyResearch,
  InterviewPreparation,
  MockInterviewSession,
  Feedback,
  ReadinessScore,
  LearningRoadmap,
  AgentExecutionLog
} from '../types';

export const INITIAL_USER: User = {
  id: 'usr_101',
  name: 'Sri Saketh',
  email: 'saketh@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  createdAt: '2026-01-15T09:00:00Z',
  emailAuthorized: true,
  connectedAccounts: {
    google: true,
    linkedin: true,
    github: true
  }
};

export const INITIAL_PROFILE: UserProfile = {
  id: 'prof_101',
  userId: 'usr_101',
  headline: 'Full Stack Software Engineer & AI Enthusiast',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA (Open to Remote)',
  bio: 'Passionate computer science graduate with 2+ years of hands-on experience building web applications, microservices, and AI integrations using React, Node.js, Python, and AWS.',
  completeness: 92,
  education: [
    {
      id: 'edu_1',
      institution: 'State Institute of Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2023',
      endDate: '2027',
      grade: '3.8/4.0 GPA'
    }
  ],
  skills: [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
    'REST APIs', 'GraphQL', 'Tailwind CSS', 'Docker', 'AWS',
    'PostgreSQL', 'MongoDB', 'Git', 'CI/CD', 'Unit Testing'
  ],
  technicalSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL'],
  softSkills: ['Problem Solving', 'Team Collaboration', 'Agile/Scrum', 'Technical Communication'],
  experience: [
    {
      id: 'exp_1',
      company: 'TechPulse Solutions',
      role: 'Frontend Engineering Intern',
      location: 'San Francisco, CA',
      startDate: 'May 2025',
      endDate: 'Aug 2025',
      isCurrent: false,
      highlights: [
        'Developed responsive React component library reducing UI rendering latency by 35%.',
        'Integrated RESTful microservices and optimized state management with Redux Toolkit.',
        'Collaborated with UX designers to convert Figma prototypes into pixel-perfect code.'
      ]
    },
    {
      id: 'exp_2',
      company: 'Innovate AI Labs',
      role: 'Software Developer Assistant',
      location: 'Remote',
      startDate: 'Jan 2025',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'Built automated Python scripts for dataset preprocessing and feature extraction.',
        'Constructed interactive dashboard analytics using React and Chart.js.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Smart AI Agent Workflow Platform',
      description: 'Multi-agent orchestration system for task execution with feedback loops and monitoring.',
      technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'Docker']
    },
    {
      id: 'proj_2',
      title: 'Real-Time E-Commerce Analytics Engine',
      description: 'High-throughput event tracking dashboard with WebSockets and Redis caching.',
      technologies: ['Node.js', 'React', 'MongoDB', 'Redis', 'Tailwind CSS']
    }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: '2025-06-15',
      credentialId: 'AWS-9923814'
    },
    {
      id: 'cert_2',
      name: 'Meta Front-End Developer Specialization',
      issuer: 'Coursera / Meta',
      issueDate: '2024-11-20'
    }
  ],
  achievements: [
    'Dean\'s Honor Roll for 4 consecutive semesters (2023-2025)',
    '1st Place in Regional University Hackathon - Best AI Project'
  ],
  preferences: {
    targetRoles: ['Frontend Engineer', 'Full Stack Engineer', 'Software Engineer', 'AI Platform Engineer'],
    preferredLocation: 'San Francisco, CA / Remote',
    workMode: 'HYBRID',
    experienceLevel: 'ENTRY',
    minSalary: 110000,
    maxSalary: 140000,
    targetCompanies: ['Google', 'Stripe', 'Vercel', 'Meta', 'Anthropic']
  }
};

export const INITIAL_RESUMES: Resume[] = [
  {
    id: 'res_101',
    userId: 'usr_101',
    originalFileName: 'Sri_Saketh_Software_Engineer_Resume.pdf',
    fileType: 'PDF',
    fileSize: 1024 * 340, // 340 KB
    uploadDate: '2026-08-20T10:15:00Z',
    currentVersionId: 'ver_orig_101'
  }
];

export const INITIAL_RESUME_VERSIONS: ResumeVersion[] = [
  {
    id: 'ver_orig_101',
    resumeId: 'res_101',
    versionName: 'Original Master Resume',
    isOriginal: true,
    createdAt: '2026-08-20T10:15:00Z',
    profileSnapshot: INITIAL_PROFILE,
    strengths: [
      'Strong React & TypeScript core foundation',
      'Solid project experience with modern state management',
      'Clear quantifiable impact metrics in work history',
      'Relevant cloud & developer certifications'
    ],
    weaknesses: [
      'Limited Kubernetes deployment exposure',
      'Could highlight GraphQL experience more prominently'
    ],
    structureNotes: [
      'Parsed 100% cleanly into structured schema',
      'ATS compatibility score: High (clean single-column format)'
    ]
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job_001',
    title: 'Frontend Software Engineer - AI Applications',
    company: 'Anthropic',
    companyId: 'comp_anthropic',
    location: 'San Francisco, CA (Hybrid)',
    workMode: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryRange: '$120,000 - $155,000',
    postedDate: '2 days ago',
    descriptionId: 'jd_001',
    sourceUrl: 'https://careers.anthropic.com/jobs/001',
    relevanceScore: 94,
    isSaved: true,
    isRecommended: true
  },
  {
    id: 'job_002',
    title: 'Full Stack Engineer - Developer Experience',
    company: 'Vercel',
    companyId: 'comp_vercel',
    location: 'Remote',
    workMode: 'REMOTE',
    jobType: 'FULL_TIME',
    salaryRange: '$125,000 - $160,000',
    postedDate: '3 days ago',
    descriptionId: 'jd_002',
    sourceUrl: 'https://vercel.com/careers/fs-eng',
    relevanceScore: 88,
    isSaved: false,
    isRecommended: true
  },
  {
    id: 'job_003',
    title: 'Junior Software Engineer - Cloud Platform',
    company: 'Stripe',
    companyId: 'comp_stripe',
    location: 'Seattle, WA (On-site)',
    workMode: 'ONSITE',
    jobType: 'FULL_TIME',
    salaryRange: '$130,000 - $165,000',
    postedDate: '1 week ago',
    descriptionId: 'jd_003',
    sourceUrl: 'https://stripe.com/jobs/cloud-platform',
    relevanceScore: 82,
    isSaved: true,
    isRecommended: false
  },
  {
    id: 'job_004',
    title: 'UI/UX React Engineer',
    company: 'Figma',
    companyId: 'comp_figma',
    location: 'San Francisco, CA',
    workMode: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryRange: '$125,000 - $150,000',
    postedDate: '4 days ago',
    descriptionId: 'jd_004',
    sourceUrl: 'https://figma.com/careers/ui-eng',
    relevanceScore: 86,
    isSaved: false,
    isRecommended: true
  }
];

export const INITIAL_JDS: Record<string, JobDescription> = {
  jd_001: {
    id: 'jd_001',
    jobId: 'job_001',
    fullText: `About Anthropic:
Anthropic is an AI safety and research company. We are seeking a Frontend Software Engineer to build intuitive, high-performance web applications that interface with our frontier AI systems.

Responsibilities:
- Build complex UI workflows in React and TypeScript for AI research tools.
- Collaborate with AI researchers and backend engineers to integrate real-time streaming APIs.
- Optimize frontend performance, web vitals, and complex state synchronization.
- Maintain high testing standards using Jest/Testing Library.

Requirements:
- 0-3 years experience building production React applications with TypeScript.
- Deep understanding of modern JS/TS, state management, REST APIs, and asynchronous programming.
- Experience with CSS frameworks like Tailwind CSS.
- Familiarity with Cloud platforms (AWS) and CI/CD pipelines.

Nice to Have:
- Knowledge of WebSockets, SSE (Server-Sent Events), or web workers.
- Experience with Docker or containerized web apps.`,
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'REST APIs', 'Tailwind CSS', 'AWS', 'Git'],
    preferredSkills: ['WebSockets', 'Docker', 'Jest', 'CI/CD', 'GraphQL'],
    responsibilities: [
      'Build complex UI workflows in React and TypeScript',
      'Integrate real-time streaming APIs with AI models',
      'Optimize web app performance and load latency',
      'Maintain automated testing and modern CI/CD practices'
    ],
    qualifications: [
      'Bachelor degree in Computer Science or equivalent',
      'Proficiency with modern frontend state management',
      'Strong problem-solving and clean code practices'
    ],
    experienceYearsRequired: 1
  }
};

export const INITIAL_JD_ANALYSIS: JDAnalysis = {
  id: 'jda_001',
  jobId: 'job_001',
  userId: 'usr_101',
  createdAt: '2026-08-24T14:30:00Z',
  requiredSkills: ['React', 'TypeScript', 'JavaScript', 'REST APIs', 'Tailwind CSS', 'AWS', 'Git'],
  preferredSkills: ['WebSockets', 'Docker', 'Jest', 'CI/CD', 'GraphQL'],
  matchedSkills: ['React', 'TypeScript', 'JavaScript', 'REST APIs', 'Tailwind CSS', 'AWS', 'Docker', 'Git', 'CI/CD'],
  skillGaps: ['WebSockets / SSE Streaming', 'GraphQL query optimization'],
  responsibilitiesSummary: [
    'Build reactive TypeScript user interfaces for AI products',
    'Connect real-time agent execution feeds to dashboard',
    'Enforce high code quality and test coverage'
  ],
  matchScore: 88,
  scoreBreakdown: {
    skillMatch: 90,
    experienceMatch: 85,
    educationMatch: 95,
    keywordMatch: 84
  }
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_001',
    jobId: 'job_001',
    userId: 'usr_101',
    resumeVersionId: 'ver_tailored_101',
    coverLetterId: 'cl_001',
    companyName: 'Anthropic',
    jobTitle: 'Frontend Software Engineer - AI Applications',
    appliedDate: '2026-08-22T11:00:00Z',
    status: 'INTERVIEW',
    jobUrl: 'https://careers.anthropic.com/jobs/001',
    notes: 'Submitted tailored resume and cover letter. Recruiter reached out via email for technical screening.',
    history: [
      {
        id: 'hist_1',
        applicationId: 'app_001',
        status: 'SAVED',
        timestamp: '2026-08-21T09:00:00Z',
        note: 'Saved job from recommended matches.'
      },
      {
        id: 'hist_2',
        applicationId: 'app_001',
        status: 'APPLIED',
        timestamp: '2026-08-22T11:00:00Z',
        note: 'Applied manually via company portal with Tailored ATS Resume v1.2.'
      },
      {
        id: 'hist_3',
        applicationId: 'app_001',
        status: 'APPLICATION_RECEIVED',
        timestamp: '2026-08-22T11:05:00Z',
        note: 'Received automated submission confirmation email.'
      },
      {
        id: 'hist_4',
        applicationId: 'app_001',
        status: 'INTERVIEW',
        timestamp: '2026-08-24T16:00:00Z',
        note: 'Detected interview invitation email from Recruiting Team!'
      }
    ]
  }
];

export const INITIAL_EMAIL_EVENT: EmailInterviewEvent = {
  id: 'evt_991',
  userId: 'usr_101',
  senderEmail: 'recruiting@anthropic.com',
  subject: 'Interview Invitation: Frontend Software Engineer at Anthropic',
  detectedAt: '2026-08-24T15:45:00Z',
  companyName: 'Anthropic',
  roleTitle: 'Frontend Software Engineer - AI Applications',
  interviewDate: '2026-08-28',
  interviewTime: '10:00 AM PST',
  meetingLink: 'https://meet.google.com/abc-anthropic-interview',
  confidenceScore: 98,
  isConfirmed: true
};

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int_001',
    userId: 'usr_101',
    jobId: 'job_001',
    applicationId: 'app_001',
    companyName: 'Anthropic',
    companyId: 'comp_anthropic',
    roleTitle: 'Frontend Software Engineer - AI Applications',
    scheduledDate: '2026-08-28',
    scheduledTime: '10:00 AM PST',
    meetingLink: 'https://meet.google.com/abc-anthropic-interview',
    status: 'UPCOMING',
    sourceEventId: 'evt_991'
  }
];

export const INITIAL_COMPANIES: Record<string, Company> = {
  comp_anthropic: {
    id: 'comp_anthropic',
    name: 'Anthropic',
    industry: 'Artificial Intelligence & Safety Research',
    website: 'https://anthropic.com',
    headquarters: 'San Francisco, CA',
    size: '500-1,000 employees'
  }
};

export const INITIAL_COMPANY_RESEARCH: CompanyResearch = {
  id: 'cr_001',
  companyId: 'comp_anthropic',
  companyName: 'Anthropic',
  overview: 'Anthropic is an AI safety and research business building reliable, interpretable, and steerable AI systems. Creator of Claude AI.',
  productsAndServices: [
    'Claude 3.5 Sonnet & Haiku models',
    'Anthropic API & Enterprise Workspaces',
    'Constitutional AI framework'
  ],
  businessModel: 'B2B API platform subscription, enterprise AI deployments, and consumer AI subscriptions.',
  recentNews: [
    'Expanded Developer API capabilities with computer use automation.',
    'Announced new AI alignment benchmark suite.'
  ],
  cultureHighlights: [
    'Mission-driven focus on AI safety and public benefit.',
    'Engineering culture prioritizes clarity, correctness, and collaborative code reviews.',
    'Flat hierarchy with high individual contributor autonomy.'
  ],
  interviewTips: [
    'Be ready to discuss async UI state management and web API streaming.',
    'Demonstrate clear structured thinking when solving frontend architectural questions.',
    'Highlight experience with TypeScript, React performance, and user-centric designs.'
  ],
  createdAt: '2026-08-24T16:05:00Z'
};

export const INITIAL_INTERVIEW_PREP: InterviewPreparation = {
  id: 'ip_001',
  interviewId: 'int_001',
  userId: 'usr_101',
  roleTitle: 'Frontend Software Engineer - AI Applications',
  companyName: 'Anthropic',
  technicalTopics: [
    { topic: 'React State Synchronization & Streaming APIs', description: 'Handling Server-Sent Events (SSE) and asynchronous chunks without lag.', priority: 'HIGH' },
    { topic: 'TypeScript Advanced Types & Generics', description: 'Strong typing for API responses and component props.', priority: 'HIGH' },
    { topic: 'Virtualization & UI Performance', description: 'Rendering long chat/log streams smoothly in DOM.', priority: 'MEDIUM' }
  ],
  practiceQuestions: [
    {
      id: 'pq_1',
      question: 'How do you manage real-time streaming data updates in a React application without causing excessive re-renders?',
      category: 'TECHNICAL',
      sampleAnswerKeyPoints: [
        'Use useRef to accumulate stream chunks before flushing to state at controlled intervals (throttling/debouncing).',
        'Leverage memoization (useMemo, React.memo) to isolate updating components.',
        'Use custom hooks to encapsulate Server-Sent Events or Fetch ReadableStream logic.'
      ]
    },
    {
      id: 'pq_2',
      question: 'Tell me about a challenging frontend bug you encountered and how you diagnosed and resolved it.',
      category: 'BEHAVIORAL',
      sampleAnswerKeyPoints: [
        'Structure answer with STAR method (Situation, Task, Action, Result).',
        'Describe debugging steps: Chrome DevTools, performance profiling, identifying memory leak.',
        'Explain solution: cleaning up event listeners in useEffect return block.'
      ]
    },
    {
      id: 'pq_3',
      question: 'Why do you want to join Anthropic\'s AI Applications frontend team?',
      category: 'COMPANY_SPECIFIC',
      sampleAnswerKeyPoints: [
        'Express enthusiasm for building intuitive human-AI interfaces.',
        'Align with Anthropic\'s commitment to AI safety and user empowerment.',
        'Highlight desire to solve cutting-edge real-time UI streaming challenges.'
      ]
    }
  ],
  hrQuestions: [
    'Walk me through your resume and key technical projects.',
    'Where do you see your engineering career in 3 years?'
  ],
  focusAreas: [
    'Practice explaining React stream handling out loud',
    'Review STAR format for TechPulse Solutions internship highlights'
  ],
  preparationChecklist: [
    { id: 'chk_1', task: 'Review Anthropic Product & Claude API overview', completed: true },
    { id: 'chk_2', task: 'Practice STAR stories for key projects', completed: true },
    { id: 'chk_3', task: 'Complete 1 Mock Interview session on AI Career OS', completed: false },
    { id: 'chk_4', task: 'Prepare 3 insightful questions for the interviewer', completed: false }
  ]
};

export const INITIAL_MOCK_SESSIONS: MockInterviewSession[] = [
  {
    id: 'mock_101',
    interviewId: 'int_001',
    userId: 'usr_101',
    roleTitle: 'Frontend Software Engineer - AI Applications',
    companyName: 'Anthropic',
    status: 'COMPLETED',
    startedAt: '2026-08-24T17:00:00Z',
    endedAt: '2026-08-24T17:25:00Z',
    questions: [
      {
        questionId: 'q_1',
        question: 'Welcome! Let\'s start with your technical experience. How do you handle real-time streaming data updates in React when building AI chat interfaces?',
        category: 'TECHNICAL',
        userAnswer: 'I process incoming chunks using the Web Fetch API ReadableStream reader. To avoid lagging the UI, I buffer chunks inside a ref and batch state updates using requestAnimationFrame or a 50ms throttle interval. I also use memoized child components so only the active response bubble re-renders.',
        feedbackNote: 'Excellent technical depth and awareness of rendering performance!',
        score: 92
      },
      {
        questionId: 'q_2',
        question: 'Great approach! Can you give an example of a difficult bug you fixed during your internship at TechPulse Solutions?',
        category: 'BEHAVIORAL',
        userAnswer: 'We had a memory leak where navigating between dashboard pages degraded FPS. I used Chrome DevTools Heap Snapshots to trace uncleaned WebSocket event listeners in custom hooks. Fixing the useEffect cleanup function resolved the issue and reduced latency by 35%.',
        feedbackNote: 'Clear STAR method structure and solid empirical metrics referenced.',
        score: 88
      }
    ]
  }
];

export const INITIAL_FEEDBACK: Feedback = {
  id: 'fb_101',
  mockSessionId: 'mock_101',
  userId: 'usr_101',
  overallScore: 90,
  technicalScore: 92,
  communicationScore: 88,
  answerQualityScore: 90,
  strengths: [
    'Deep understanding of React performance optimization and streaming primitives',
    'Structured behavioral responses using quantitative metrics',
    'Confident, clear communication tone'
  ],
  weaknesses: [
    'Could elaborate slightly more on error handling for interrupted network streams'
  ],
  improvementSuggestions: [
    'Practice adding fallback offline states to technical answers',
    'Review system design patterns for frontend state sync across browser tabs'
  ],
  questionFeedback: [
    {
      question: 'How do you handle real-time streaming data updates in React when building AI chat interfaces?',
      userAnswer: 'I process incoming chunks using the Web Fetch API ReadableStream reader...',
      score: 92,
      feedback: 'Outstanding explanation of state batching and ref buffering.'
    },
    {
      question: 'Can you give an example of a difficult bug you fixed during your internship?',
      userAnswer: 'We had a memory leak where navigating between dashboard pages degraded FPS...',
      score: 88,
      feedback: 'Great use of measurable metrics (35% latency reduction).'
    }
  ]
};

export const INITIAL_READINESS_SCORE: ReadinessScore = {
  id: 'rs_101',
  userId: 'usr_101',
  currentScore: 87,
  categoryScores: {
    technical: 90,
    behavioral: 86,
    resumeAlignment: 92,
    communication: 88
  },
  scoreHistory: [
    { date: 'Aug 10', score: 72 },
    { date: 'Aug 15', score: 78 },
    { date: 'Aug 20', score: 83 },
    { date: 'Aug 24', score: 87 }
  ],
  lastUpdated: '2026-08-24T17:30:00Z'
};

export const INITIAL_LEARNING_ROADMAP: LearningRoadmap = {
  id: 'rm_101',
  userId: 'usr_101',
  title: 'Anthropic Frontend Engineer Mastery Roadmap',
  targetRole: 'Frontend Software Engineer - AI Applications',
  overallProgress: 70,
  items: [
    {
      id: 'rmi_1',
      skillOrTopic: 'Server-Sent Events & ReadableStream Handling',
      category: 'Technical Core',
      priority: 'HIGH',
      recommendedAction: 'Build a mini React demo project consuming streamed JSON tokens with abort controller support.',
      estimatedHours: 4,
      status: 'IN_PROGRESS',
      resources: ['MDN Streams API Guide', 'React Concurrent Mode Docs']
    },
    {
      id: 'rmi_2',
      skillOrTopic: 'GraphQL & Apollo Client Caching',
      category: 'Skill Gap',
      priority: 'MEDIUM',
      recommendedAction: 'Complete tutorial on optimistic UI updates and cache normalized keys.',
      estimatedHours: 6,
      status: 'NOT_STARTED',
      resources: ['Apollo Client Official Tutorial']
    },
    {
      id: 'rmi_3',
      skillOrTopic: 'Behavioral STAR Story Refinement',
      category: 'Interview Prep',
      priority: 'HIGH',
      recommendedAction: 'Prepare 2 additional stories highlighting cross-functional design collaboration.',
      estimatedHours: 3,
      status: 'COMPLETED',
      resources: ['AI Career OS STAR Prep Framework']
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_101',
    title: 'Interview Invitation Detected!',
    message: 'AG-009 detected an interview invitation from recruiting@anthropic.com for Frontend Software Engineer.',
    type: 'INTERVIEW_ALERT',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/app/interviews/int_001'
  },
  {
    id: 'notif_2',
    userId: 'usr_101',
    title: 'Job Match Found (94% Fit)',
    message: 'AG-002 found "Frontend Software Engineer - AI Applications" at Anthropic matching your profile.',
    type: 'MATCH_ALERT',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/app/jobs/job_001'
  },
  {
    id: 'notif_3',
    userId: 'usr_101',
    title: 'Resume Analysis Completed',
    message: 'AG-001 extracted your structured profile from Sri_Saketh_Software_Engineer_Resume.pdf cleanly.',
    type: 'SYSTEM',
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/app/resume/analysis'
  }
];

export const INITIAL_AGENT_LOGS: AgentExecutionLog[] = [
  {
    id: 'log_1',
    agentId: 'AG-001',
    agentName: 'Resume Analysis Agent',
    timestamp: '2026-08-20T10:15:05Z',
    status: 'SUCCESS',
    inputSummary: 'File: Sri_Saketh_Software_Engineer_Resume.pdf (340 KB)',
    outputSummary: 'Extracted 15 skills, 2 education records, 2 work history entries, 92% profile completeness.',
    durationMs: 1240
  },
  {
    id: 'log_2',
    agentId: 'AG-002',
    agentName: 'Job Search Agent',
    timestamp: '2026-08-21T09:00:10Z',
    status: 'SUCCESS',
    inputSummary: 'Query: Frontend Software Engineer, Hybrid/Remote, SF',
    outputSummary: 'Discovered & ranked 4 high-match candidate jobs.',
    durationMs: 850
  },
  {
    id: 'log_3',
    agentId: 'AG-003',
    agentName: 'JD Analysis Agent',
    timestamp: '2026-08-21T09:05:12Z',
    status: 'SUCCESS',
    inputSummary: 'Job ID: job_001 (Anthropic Frontend Engineer)',
    outputSummary: 'Computed 88% Match Score, identified 2 skill gaps.',
    durationMs: 1100
  },
  {
    id: 'log_4',
    agentId: 'AG-009',
    agentName: 'Interview Invitation Detection Agent',
    timestamp: '2026-08-24T15:45:00Z',
    status: 'SUCCESS',
    inputSummary: 'Inbox Scan: Authorized read-scope OAuth',
    outputSummary: 'Detected interview invitation email from Anthropic with 98% confidence.',
    durationMs: 620
  },
  {
    id: 'log_5',
    agentId: 'AG-010',
    agentName: 'Company Research Agent',
    timestamp: '2026-08-24T16:05:00Z',
    status: 'SUCCESS',
    inputSummary: 'Company: Anthropic (ID: comp_anthropic)',
    outputSummary: 'Compiled overview, culture, recent news, and technical interview guidance.',
    durationMs: 1450
  },
  {
    id: 'log_6',
    agentId: 'AG-011',
    agentName: 'Interview Preparation Agent',
    timestamp: '2026-08-24T16:10:00Z',
    status: 'SUCCESS',
    inputSummary: 'Interview ID: int_001 (Anthropic)',
    outputSummary: 'Generated 3 technical focus areas, 3 practice questions, and prep checklist.',
    durationMs: 1320
  }
];
