// ============================================================================
// AG-003: JD ANALYSIS & MATCH SCORE AGENT (AI CAREER OS CORE AGENT)
// Comprehensive JD Requirement Extraction, Evidence-Based Profile Audit & Scoring
// ============================================================================

import { UserProfile, Job, JobDescription, JDAnalysis, ResponsibilityAlignmentItem } from '../types';

export interface JdRequirementLlmOutput {
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilitiesSummary: string[];
  qualifications: string[];
  requiredExperienceYears: number;
  requiredEducation: string;
  requiredCertifications: string[];
  strengths: string[];
  recommendations: string[];
}

// ============================================================================
// COMPREHENSIVE TECHNICAL TAXONOMY & SYNONYM DICTIONARY
// ============================================================================

interface TaxonomyCategory {
  category: string;
  skills: Array<{ canonical: string; synonyms: string[]; pattern?: RegExp }>;
}

const TECHNICAL_TAXONOMY: TaxonomyCategory[] = [
  {
    category: 'Programming Languages',
    skills: [
      { canonical: 'Python', synonyms: ['python', 'py'] },
      { canonical: 'JavaScript', synonyms: ['javascript', 'js', 'ecmascript'], pattern: /\b(javascript|js|ecmascript)\b/i },
      { canonical: 'TypeScript', synonyms: ['typescript', 'ts'], pattern: /\b(typescript|ts)\b/i },
      { canonical: 'Java', synonyms: ['java'], pattern: /\bjava\b/i },
      { canonical: 'C++', synonyms: ['c++', 'cpp'] },
      { canonical: 'C#', synonyms: ['c#', 'csharp', '.net', 'dotnet'], pattern: /\b(c#|csharp|\.net|dotnet)\b/i },
      { canonical: 'Go', synonyms: ['golang', 'go'], pattern: /\b(golang|\bgo\b)/i },
      { canonical: 'Rust', synonyms: ['rust'], pattern: /\brust\b/i },
      { canonical: 'Ruby', synonyms: ['ruby', 'ror'] },
      { canonical: 'PHP', synonyms: ['php'] },
      { canonical: 'Swift', synonyms: ['swift'] },
      { canonical: 'Kotlin', synonyms: ['kotlin'] },
      { canonical: 'Scala', synonyms: ['scala'] },
      { canonical: 'SQL', synonyms: ['sql', 'tsql', 'plsql'], pattern: /\b(sql|tsql|plsql)\b/i },
      { canonical: 'R', synonyms: ['r programming', 'r-lang'], pattern: /\b(r\s+programming|\br\b\s+analytics)\b/i },
      { canonical: 'Bash', synonyms: ['bash', 'shell script', 'shell scripting', 'zsh'], pattern: /\b(bash|shell\s+scripting|zsh)\b/i },
      { canonical: 'PowerShell', synonyms: ['powershell', 'pwsh'] }
    ]
  },
  {
    category: 'Frameworks & Libraries',
    skills: [
      { canonical: 'React', synonyms: ['react', 'react.js', 'reactjs'], pattern: /\b(react|react\.js|reactjs)\b/i },
      { canonical: 'Next.js', synonyms: ['next.js', 'nextjs', 'next'], pattern: /\b(next\.js|nextjs)\b/i },
      { canonical: 'Node.js', synonyms: ['node.js', 'nodejs', 'node'], pattern: /\b(node\.js|nodejs|\bnode\b)\b/i },
      { canonical: 'Express', synonyms: ['express.js', 'expressjs', 'express'], pattern: /\b(express\.js|expressjs|\bexpress\b)\b/i },
      { canonical: 'Angular', synonyms: ['angular', 'angularjs', 'angular.js'], pattern: /\b(angular|angularjs)\b/i },
      { canonical: 'Vue.js', synonyms: ['vue', 'vue.js', 'vuejs'], pattern: /\b(vue|vue\.js|vuejs)\b/i },
      { canonical: 'Django', synonyms: ['django'] },
      { canonical: 'Flask', synonyms: ['flask'] },
      { canonical: 'FastAPI', synonyms: ['fastapi', 'fast api'] },
      { canonical: 'Spring Boot', synonyms: ['spring boot', 'springboot', 'spring framework'], pattern: /\b(spring\s+boot|springboot|spring)\b/i },
      { canonical: 'ASP.NET', synonyms: ['asp.net', 'aspnet', '.net core'], pattern: /\b(asp\.net|aspnet|\.net\s+core)\b/i },
      { canonical: 'PyTorch', synonyms: ['pytorch'] },
      { canonical: 'TensorFlow', synonyms: ['tensorflow', 'tf'] },
      { canonical: 'Pandas', synonyms: ['pandas'] },
      { canonical: 'NumPy', synonyms: ['numpy'] },
      { canonical: 'Tailwind CSS', synonyms: ['tailwind', 'tailwindcss'] },
      { canonical: 'Bootstrap', synonyms: ['bootstrap'] },
      { canonical: 'GraphQL', synonyms: ['graphql'] },
      { canonical: 'REST APIs', synonyms: ['rest api', 'restful', 'rest apis', 'restful apis', 'rest'], pattern: /\b(rest|restful|rest\s+api|restful\s+apis)\b/i }
    ]
  },
  {
    category: 'Cloud Platforms & Services',
    skills: [
      { canonical: 'AWS', synonyms: ['aws', 'amazon web services', 'amazon cloud'], pattern: /\b(aws|amazon\s+web\s+services)\b/i },
      { canonical: 'Amazon EC2', synonyms: ['ec2', 'amazon ec2', 'aws ec2'], pattern: /\b(ec2|amazon\s+ec2)\b/i },
      { canonical: 'Amazon S3', synonyms: ['s3', 'amazon s3', 'aws s3'], pattern: /\b(s3|amazon\s+s3)\b/i },
      { canonical: 'Amazon RDS', synonyms: ['rds', 'amazon rds', 'aws rds'], pattern: /\b(rds|amazon\s+rds)\b/i },
      { canonical: 'AWS Lambda', synonyms: ['aws lambda', 'lambda'], pattern: /\b(aws\s+lambda|\blambda\b)\b/i },
      { canonical: 'Auto Scaling', synonyms: ['auto scaling', 'auto scaling groups', 'asg'], pattern: /\b(auto\s+scaling|asg)\b/i },
      { canonical: 'AWS CodePipeline', synonyms: ['aws codepipeline', 'codepipeline'], pattern: /\b(aws\s+codepipeline|codepipeline)\b/i },
      { canonical: 'AWS CodeBuild', synonyms: ['aws codebuild', 'codebuild'], pattern: /\b(aws\s+codebuild|codebuild)\b/i },
      { canonical: 'AWS CodeDeploy', synonyms: ['aws codedeploy', 'codedeploy'], pattern: /\b(aws\s+codedeploy|codedeploy)\b/i },
      { canonical: 'Amazon CloudWatch', synonyms: ['cloudwatch', 'aws cloudwatch', 'amazon cloudwatch'], pattern: /\b(cloudwatch|amazon\s+cloudwatch)\b/i },
      { canonical: 'Azure', synonyms: ['azure', 'microsoft azure'], pattern: /\b(azure|microsoft\s+azure)\b/i },
      { canonical: 'GCP', synonyms: ['gcp', 'google cloud', 'google cloud platform'], pattern: /\b(gcp|google\s+cloud|google\s+cloud\s+platform)\b/i },
      { canonical: 'Heroku', synonyms: ['heroku'] },
      { canonical: 'Cloudflare', synonyms: ['cloudflare'] },
      { canonical: 'DigitalOcean', synonyms: ['digitalocean', 'digital ocean'] }
    ]
  },
  {
    category: 'DevOps & Containerization',
    skills: [
      { canonical: 'Docker', synonyms: ['docker', 'containerization', 'containers', 'dockerfile', 'docker hub'], pattern: /\b(docker|containerization|dockerfile|docker\s+hub)\b/i },
      { canonical: 'Kubernetes', synonyms: ['kubernetes', 'k8s'], pattern: /\b(kubernetes|k8s)\b/i },
      { canonical: 'Terraform', synonyms: ['terraform', 'tf'], pattern: /\b(terraform|\btf\b)\b/i },
      { canonical: 'Ansible', synonyms: ['ansible'] },
      { canonical: 'Jenkins', synonyms: ['jenkins'] },
      { canonical: 'CircleCI', synonyms: ['circleci', 'circle ci'] },
      { canonical: 'GitHub Actions', synonyms: ['github actions', 'gh actions'], pattern: /\b(github\s+actions|gh\s+actions)\b/i },
      { canonical: 'GitLab CI', synonyms: ['gitlab ci', 'gitlab-ci'], pattern: /\b(gitlab\s+ci|gitlab-ci)\b/i },
      { canonical: 'Helm', synonyms: ['helm'] },
      { canonical: 'Puppet', synonyms: ['puppet'] },
      { canonical: 'Chef', synonyms: ['chef'] },
      { canonical: 'Nginx', synonyms: ['nginx'] },
      { canonical: 'Apache Tomcat', synonyms: ['apache tomcat', 'tomcat', 'apache'], pattern: /\b(apache\s+tomcat|\btomcat\b|\bapache\b)\b/i },
      { canonical: 'Linux', synonyms: ['linux', 'ubuntu', 'centos', 'rhel', 'debian', 'alpine'], pattern: /\b(linux|ubuntu|centos|rhel|debian)\b/i },
      { canonical: 'Unix', synonyms: ['unix'] },
      { canonical: 'CI/CD', synonyms: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'], pattern: /\b(ci\/cd|cicd|continuous\s+integration)\b/i }
    ]
  },
  {
    category: 'Databases & Storage',
    skills: [
      { canonical: 'PostgreSQL', synonyms: ['postgresql', 'postgres'], pattern: /\b(postgresql|postgres)\b/i },
      { canonical: 'MySQL', synonyms: ['mysql'] },
      { canonical: 'MongoDB', synonyms: ['mongodb', 'mongo'], pattern: /\b(mongodb|mongo)\b/i },
      { canonical: 'Redis', synonyms: ['redis'] },
      { canonical: 'Elasticsearch', synonyms: ['elasticsearch', 'elastic search'], pattern: /\b(elasticsearch|elastic\s+search)\b/i },
      { canonical: 'DynamoDB', synonyms: ['dynamodb', 'dynamo'] },
      { canonical: 'Cassandra', synonyms: ['cassandra'] },
      { canonical: 'Oracle', synonyms: ['oracle db', 'oracle database', 'oracle'], pattern: /\b(oracle\s+db|oracle\s+database|\boracle\b)\b/i },
      { canonical: 'SQL Server', synonyms: ['sql server', 'mssql'], pattern: /\b(sql\s+server|mssql)\b/i },
      { canonical: 'Snowflake', synonyms: ['snowflake'] },
      { canonical: 'BigQuery', synonyms: ['bigquery', 'big query'] },
      { canonical: 'Firebase', synonyms: ['firebase', 'firestore'] }
    ]
  },
  {
    category: 'Tools & AI',
    skills: [
      { canonical: 'Git', synonyms: ['git', 'github', 'gitlab', 'bitbucket'], pattern: /\b(git|github|gitlab|bitbucket)\b/i },
      { canonical: 'Jira', synonyms: ['jira'] },
      { canonical: 'Confluence', synonyms: ['confluence'] },
      { canonical: 'Postman', synonyms: ['postman'] },
      { canonical: 'VS Code', synonyms: ['vs code', 'vscode', 'visual studio code'], pattern: /\b(vs\s*code|vscode|visual\s+studio\s+code)\b/i },
      { canonical: 'Webpack', synonyms: ['webpack'] },
      { canonical: 'Vite', synonyms: ['vite'] },
      { canonical: 'LLMs & Generative AI', synonyms: ['llm', 'llms', 'groq', 'groq llm', 'generative ai', 'genai', 'langchain', 'openai'], pattern: /\b(llm|llms|groq|generative\s+ai|genai|langchain|openai)\b/i }
    ]
  },
  {
    category: 'Monitoring & Observability',
    skills: [
      { canonical: 'Prometheus', synonyms: ['prometheus'] },
      { canonical: 'Grafana', synonyms: ['grafana'] },
      { canonical: 'Datadog', synonyms: ['datadog'] },
      { canonical: 'Splunk', synonyms: ['splunk'] },
      { canonical: 'ELK Stack', synonyms: ['elk', 'elk stack', 'logstash', 'kibana'], pattern: /\b(elk|elk\s+stack|logstash|kibana)\b/i },
      { canonical: 'OpenTelemetry', synonyms: ['opentelemetry', 'otel'] }
    ]
  },
  {
    category: 'Architecture & Engineering',
    skills: [
      { canonical: 'Microservices', synonyms: ['microservices', 'microservice', 'microservices architecture'], pattern: /\b(microservices|microservice)\b/i },
      { canonical: 'Serverless', synonyms: ['serverless', 'aws lambda', 'cloud functions'], pattern: /\b(serverless|lambda)\b/i },
      { canonical: 'Agile', synonyms: ['agile', 'scrum', 'kanban'], pattern: /\b(agile|scrum|kanban)\b/i },
      { canonical: 'System Design', synonyms: ['system design', 'distributed systems'], pattern: /\b(system\s+design|distributed\s+systems)\b/i },
      { canonical: 'Unit Testing', synonyms: ['unit testing', 'jest', 'pytest', 'mocha', 'junit'], pattern: /\b(unit\s+testing|jest|pytest|junit)\b/i },
      { canonical: 'Security', synonyms: ['cybersecurity', 'owasp', 'oauth', 'jwt', 'iam'], pattern: /\b(security|cybersecurity|owasp|oauth|jwt|iam)\b/i }
    ]
  }
];

// Flat lookup map for synonym normalization
const SYNONYM_TO_CANONICAL: Record<string, string> = {};
TECHNICAL_TAXONOMY.forEach(cat => {
  cat.skills.forEach(skill => {
    skill.synonyms.forEach(syn => {
      SYNONYM_TO_CANONICAL[syn.toLowerCase()] = skill.canonical;
    });
    SYNONYM_TO_CANONICAL[skill.canonical.toLowerCase()] = skill.canonical;
  });
});

/**
 * Normalizes a single skill string or technology phrase into a standard canonical skill name
 */
export const normalizeSkillName = (rawSkill: string): string => {
  if (!rawSkill) return '';
  const trimmed = rawSkill.trim();
  const lower = trimmed.toLowerCase();
  
  if (SYNONYM_TO_CANONICAL[lower]) {
    return SYNONYM_TO_CANONICAL[lower];
  }

  // Check pattern matches across taxonomy
  for (const cat of TECHNICAL_TAXONOMY) {
    for (const skill of cat.skills) {
      if (skill.pattern && skill.pattern.test(trimmed)) {
        return skill.canonical;
      }
    }
  }

  return trimmed;
};

// ============================================================================
// RULE-BASED DETERMINISTIC JD REQUIREMENT EXTRACTOR
// ============================================================================

/**
 * Extracts structured requirements directly from full raw JD text without relying on LLM
 */
export const extractRequirementsFromJdText = (jdText: string): {
  requiredSkills: string[];
  preferredSkills: string[];
  requiredExperienceYears: number;
  requiredEducation: string;
  requiredCertifications: string[];
  responsibilities: string[];
} => {
  if (!jdText || jdText.trim().length === 0) {
    return {
      requiredSkills: [],
      preferredSkills: [],
      requiredExperienceYears: 0,
      requiredEducation: 'Not specified in job description.',
      requiredCertifications: [],
      responsibilities: []
    };
  }

  const text = jdText;

  // Split text into Required vs Preferred sections if section markers exist
  const lowerText = text.toLowerCase();
  const preferredSplitIndex = lowerText.search(/\b(preferred|nice to have|plusses|bonus|desired|plus)\b/i);

  let requiredText = text;
  let preferredText = '';

  if (preferredSplitIndex > 0) {
    requiredText = text.substring(0, preferredSplitIndex);
    preferredText = text.substring(preferredSplitIndex);
  }

  const foundRequiredSet = new Set<string>();
  const foundPreferredSet = new Set<string>();

  TECHNICAL_TAXONOMY.forEach(cat => {
    cat.skills.forEach(skill => {
      let reqMatch = false;
      let prefMatch = false;

      if (skill.pattern) {
        if (skill.pattern.test(requiredText)) reqMatch = true;
        if (preferredText && skill.pattern.test(preferredText)) prefMatch = true;
      } else {
        const regexes = skill.synonyms.map(syn => new RegExp(`\\b${escapeRegExp(syn)}\\b`, 'i'));
        reqMatch = regexes.some(r => r.test(requiredText));
        if (preferredText) {
          prefMatch = regexes.some(r => r.test(preferredText));
        }
      }

      if (reqMatch) {
        foundRequiredSet.add(skill.canonical);
      } else if (prefMatch) {
        foundPreferredSet.add(skill.canonical);
      }
    });
  });

  // Extract Experience Years
  let requiredExperienceYears = 0;
  const expMatch = text.match(/(\d+)\+?\s*(?:-\s*\d+)?\s*(?:years|yrs)\s*(?:of\s*)?(?:experience|exp|working)/i);
  if (expMatch && expMatch[1]) {
    requiredExperienceYears = parseInt(expMatch[1], 10);
  }

  // Extract Education Requirements
  let requiredEducation = 'Not specified in job description.';
  if (/\b(bachelor|b\.s\.|bs|b\.e\.|btech|b\.tech)\b/i.test(text)) {
    requiredEducation = "Bachelor's degree in Computer Science, Engineering, or related field";
  } else if (/\b(master|m\.s\.|ms|mtech|m\.tech)\b/i.test(text)) {
    requiredEducation = "Master's degree in Computer Science, Data Science, or related field";
  } else if (/\b(phd|doctorate)\b/i.test(text)) {
    requiredEducation = 'PhD in Computer Science or quantitative discipline';
  }

  // Extract Certification Requirements
  const certs: string[] = [];
  if (/\baws\s+certified\b/i.test(text)) certs.push('AWS Certified Solutions Architect / Developer');
  if (/\b(cka|kubernetes\s+certified)\b/i.test(text)) certs.push('CKA (Certified Kubernetes Administrator)');
  if (/\bcissp\b/i.test(text)) certs.push('CISSP Security Certification');
  if (/\bpmp\b/i.test(text)) certs.push('PMP Certification');
  if (/\bscrum\s+master|csm\b/i.test(text)) certs.push('Certified Scrum Master (CSM)');
  if (/\bazure\s+certified\b/i.test(text)) certs.push('Microsoft Azure Certification');

  // Extract key responsibilities bullets
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20);
  const responsibilities = lines.slice(0, 5);

  return {
    requiredSkills: Array.from(foundRequiredSet),
    preferredSkills: Array.from(foundPreferredSet),
    requiredExperienceYears,
    requiredEducation,
    requiredCertifications: certs,
    responsibilities
  };
};

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// CANDIDATE EVIDENCE GATHERER
// ============================================================================

export interface CandidateEvidenceIndex {
  skillsSet: Set<string>;
  fullEvidenceText: string;
  evidenceItems: Array<{ term: string; source: string; snippet: string }>;
}

/**
 * Compiles a searchable ground-truth evidence index from full AG-001 candidate profile
 */
export const gatherCandidateEvidence = (profile: UserProfile): CandidateEvidenceIndex => {
  const skillsSet = new Set<string>();
  const evidenceItems: Array<{ term: string; source: string; snippet: string }> = [];
  const textChunks: string[] = [];

  // 1. Explicit profile skills
  (profile.skills || []).forEach(s => {
    const canonical = normalizeSkillName(s);
    skillsSet.add(canonical.toLowerCase());
    skillsSet.add(s.toLowerCase());
    evidenceItems.push({ term: canonical, source: 'profile.skills', snippet: `Explicit skill: ${s}` });
  });

  (profile.technicalSkills || []).forEach(s => {
    const canonical = normalizeSkillName(s);
    skillsSet.add(canonical.toLowerCase());
    skillsSet.add(s.toLowerCase());
    evidenceItems.push({ term: canonical, source: 'profile.technicalSkills', snippet: `Technical skill: ${s}` });
  });

  // 2. Experience history
  (profile.experience || []).forEach((exp, idx) => {
    const roleTitle = exp.role || (exp as any).title || (exp as any).jobTitle || 'Role';
    const highlightsText = (exp.highlights || []).join(' ');
    const roleText = `${roleTitle} at ${exp.company}. ${highlightsText}`;
    textChunks.push(roleText);

    const expTechs = (exp as any).technologies || [];
    expTechs.forEach((t: string) => {
      const canonical = normalizeSkillName(t);
      skillsSet.add(canonical.toLowerCase());
      skillsSet.add(t.toLowerCase());
      evidenceItems.push({ term: canonical, source: `experience[${idx}]`, snippet: `${roleTitle} at ${exp.company} (${t})` });
    });
  });

  // 3. Projects
  (profile.projects || []).forEach((proj, idx) => {
    const projTitle = proj.title || (proj as any).name || 'Project';
    const projText = `${projTitle} - ${proj.description || ''} ${(proj.technologies || []).join(' ')}`;
    textChunks.push(projText);

    (proj.technologies || []).forEach(t => {
      const canonical = normalizeSkillName(t);
      skillsSet.add(canonical.toLowerCase());
      skillsSet.add(t.toLowerCase());
      evidenceItems.push({ term: canonical, source: `projects[${idx}]`, snippet: `Project: ${projTitle} (${t})` });
    });
  });

  // 4. Certifications
  (profile.certifications || []).forEach(c => {
    const certText = `${c.name} ${c.issuer || ''}`;
    textChunks.push(certText);
    skillsSet.add(c.name.toLowerCase());
    evidenceItems.push({ term: c.name, source: 'certifications', snippet: `Certification: ${c.name}` });
  });

  // 5. Education
  (profile.education || []).forEach(e => {
    const edText = `${e.degree} in ${e.fieldOfStudy} from ${e.institution}`;
    textChunks.push(edText);
  });

  const fullEvidenceText = textChunks.join(' ').toLowerCase();

  // 6. Deep Taxonomy Extraction Pass across entire candidate profile text (experience highlights, project titles & descriptions)
  TECHNICAL_TAXONOMY.forEach(cat => {
    cat.skills.forEach(skill => {
      let matched = false;
      if (skill.pattern) {
        matched = skill.pattern.test(fullEvidenceText);
      } else {
        matched = skill.synonyms.some(syn => new RegExp(`\\b${escapeRegExp(syn)}\\b`, 'i').test(fullEvidenceText));
      }

      if (matched) {
        skillsSet.add(skill.canonical.toLowerCase());
        skill.synonyms.forEach(syn => skillsSet.add(syn.toLowerCase()));
        evidenceItems.push({
          term: skill.canonical,
          source: 'fullEvidenceText',
          snippet: `Found candidate evidence for "${skill.canonical}" in profile text/projects`
        });
      }
    });
  });

  return {
    skillsSet,
    fullEvidenceText,
    evidenceItems
  };
};

/**
 * Checks whether candidate profile evidence supports a specific required skill
 */
export const checkSkillSupportInEvidence = (
  skill: string,
  candidateIndex: CandidateEvidenceIndex
): { isMatched: boolean; evidenceSnippet?: string } => {
  const canonical = normalizeSkillName(skill);
  const canonicalLower = canonical.toLowerCase();
  const rawLower = skill.toLowerCase();

  // 1. Direct match in candidate skills set
  if (candidateIndex.skillsSet.has(canonicalLower) || candidateIndex.skillsSet.has(rawLower)) {
    const foundItem = candidateIndex.evidenceItems.find(
      e => e.term.toLowerCase() === canonicalLower || e.term.toLowerCase() === rawLower
    );
    return {
      isMatched: true,
      evidenceSnippet: foundItem ? foundItem.snippet : `Verified skill: ${skill}`
    };
  }

  // 2. Strict word boundary check in full profile evidence text
  const synonyms = [skill, canonical];
  for (const cat of TECHNICAL_TAXONOMY) {
    for (const sk of cat.skills) {
      if (sk.canonical.toLowerCase() === canonicalLower) {
        synonyms.push(...sk.synonyms);
      }
    }
  }

  const uniqueSynonyms = Array.from(new Set(synonyms.map(s => s.toLowerCase()).filter(Boolean)));

  for (const syn of uniqueSynonyms) {
    const pattern = new RegExp(`\\b${escapeRegExp(syn)}\\b`, 'i');
    if (pattern.test(candidateIndex.fullEvidenceText)) {
      return {
        isMatched: true,
        evidenceSnippet: `Supported by experience/project evidence matching "${syn}"`
      };
    }
  }

  return { isMatched: false };
};

// ============================================================================
// RESPONSIBILITY ALIGNMENT AUDIT
// ============================================================================

export const computeResponsibilityAlignment = (
  responsibilities: string[],
  profile: UserProfile
): ResponsibilityAlignmentItem[] => {
  const candidateIndex = gatherCandidateEvidence(profile);

  return (responsibilities || []).map(resp => {
    const words = resp
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['and', 'with', 'for', 'the', 'that', 'from', 'this', 'have', 'will', 'your', 'their', 'work'].includes(w));

    if (words.length === 0) {
      return {
        responsibility: resp,
        alignmentLevel: 'PARTIAL',
        evidence: 'General responsibility statement.'
      };
    }

    let matchCount = 0;
    words.forEach(w => {
      if (candidateIndex.fullEvidenceText.includes(w)) matchCount++;
    });

    const ratio = matchCount / words.length;

    if (ratio >= 0.35) {
      return {
        responsibility: resp,
        alignmentLevel: 'STRONG',
        evidence: 'Supported by work experience highlights and project evidence in master profile.'
      };
    } else if (ratio >= 0.15) {
      return {
        responsibility: resp,
        alignmentLevel: 'PARTIAL',
        evidence: 'Partially supported by related profile highlights.'
      };
    } else {
      return {
        responsibility: resp,
        alignmentLevel: 'NO_EVIDENCE',
        evidence: 'No evidence found in current resume.'
      };
    }
  });
};

// ============================================================================
// DETERMINISTIC MATCH SCORE CALCULATION
// ============================================================================

export const calculateDeterministicMatchScore = (
  profile: UserProfile,
  requiredSkills: string[],
  preferredSkills: string[],
  requiredExperienceYears: number,
  requiredEducation: string,
  requiredCertifications: string[]
): {
  matchScore: number;
  scoreBreakdown: {
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    keywordMatch: number;
  };
  matchedSkills: string[];
  skillGaps: string[];
} => {
  const candidateIndex = gatherCandidateEvidence(profile);

  // 1. Required Technical Skill Match (40% Weight)
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];

  (requiredSkills || []).forEach(skill => {
    const { isMatched } = checkSkillSupportInEvidence(skill, candidateIndex);
    if (isMatched) {
      matchedRequired.push(skill);
    } else {
      missingRequired.push(skill);
    }
  });

  const reqTotal = requiredSkills ? requiredSkills.length : 0;
  const skillMatchScore = reqTotal > 0 ? Math.round((matchedRequired.length / reqTotal) * 100) : 75;

  // 2. Preferred Skill Density Match (20% Weight)
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];

  (preferredSkills || []).forEach(skill => {
    const { isMatched } = checkSkillSupportInEvidence(skill, candidateIndex);
    if (isMatched) {
      matchedPreferred.push(skill);
    } else {
      missingPreferred.push(skill);
    }
  });

  const prefTotal = preferredSkills ? preferredSkills.length : 0;
  const keywordMatchScore = prefTotal > 0 ? Math.round((matchedPreferred.length / prefTotal) * 100) : 85;

  // 3. Experience Alignment (25% Weight)
  const candidateExpYears = profile.experience?.length ? profile.experience.length * 1.5 : 1;
  let experienceMatchScore = 70;
  if (requiredExperienceYears === 0) {
    experienceMatchScore = 90;
  } else if (candidateExpYears >= requiredExperienceYears) {
    experienceMatchScore = 100;
  } else {
    experienceMatchScore = Math.round(Math.max(30, (candidateExpYears / requiredExperienceYears) * 100));
  }

  // 4. Education & Qualification Match (15% Weight)
  const hasEducation = profile.education && profile.education.length > 0;
  let educationMatchScore = hasEducation ? 85 : 50;
  if (requiredEducation && hasEducation) {
    const reqEdLower = requiredEducation.toLowerCase();
    const candidateDegree = (profile.education[0]?.degree || '').toLowerCase();
    const candidateField = (profile.education[0]?.fieldOfStudy || '').toLowerCase();
    if (candidateDegree.includes('bachelor') || candidateDegree.includes('master') || candidateField.includes('computer')) {
      educationMatchScore = 100;
    }
  }

  // Overall Weighted Score Computation
  const weightedScore = Math.round(
    skillMatchScore * 0.40 +
    keywordMatchScore * 0.20 +
    experienceMatchScore * 0.25 +
    educationMatchScore * 0.15
  );

  const finalMatchScore = Math.min(98, Math.max(15, weightedScore));

  const allMatchedSkills = Array.from(new Set([...matchedRequired, ...matchedPreferred]));
  const allGaps = Array.from(new Set([...missingRequired]));

  return {
    matchScore: finalMatchScore,
    scoreBreakdown: {
      skillMatch: skillMatchScore,
      experienceMatch: experienceMatchScore,
      educationMatch: educationMatchScore,
      keywordMatch: keywordMatchScore
    },
    matchedSkills: allMatchedSkills,
    skillGaps: allGaps
  };
};

// ============================================================================
// LLM EXTRACTION SERVICE WITH SERVER HOST RETRY FALLBACK
// ============================================================================

export const extractJdRequirementsWithLlm = async (
  jdText: string,
  profile: UserProfile
): Promise<JdRequirementLlmOutput> => {
  const promptText = `
You are AG-003, the JD Analysis Agent in AI Career Operating System.
Analyze the following complete Job Description. Extract all technical requirements, skills, qualifications, experience, education, and certifications requested by the employer.

Job Description:
${jdText.substring(0, 10000)}

Candidate Profile Summary:
- Role/Headline: ${profile.jobRole || profile.headline || 'Software Engineer'}
- Stated Skills: ${(profile.skills || []).join(', ')}

Instructions:
1. Extract REQUIRED technical skills (must-have skills/technologies mentioned in the JD).
2. Extract PREFERRED / NICE-TO-HAVE skills.
3. Summarize key job responsibilities (3-5 items).
4. Extract required qualifications.
5. Estimate required experience years (e.g. 2, 3, 5). Return 0 if unstated.
6. Extract required education (e.g. "Bachelor degree in CS").
7. Extract required or preferred certifications. Return [] if none.
8. Highlight key strengths of candidate against this JD based strictly on evidence.
9. Provide 2-3 recommendations for skill gap remediation. Zero fabrication.

Return ONLY a valid JSON object matching this schema:
{
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "responsibilitiesSummary": ["resp1", "resp2"],
  "qualifications": ["qual1", "qual2"],
  "requiredExperienceYears": 3,
  "requiredEducation": "Bachelor degree in technical field",
  "requiredCertifications": [],
  "strengths": ["Strong alignment with core developer skills"],
  "recommendations": ["Review missing specialized tool requirements"]
}
`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2000
    }
  };

  let response: Response | null = null;
  let lastErr: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const currentHost = attempt % 2 === 1 ? 'http://localhost:3000' : 'http://127.0.0.1:3000';
      const targetUrl = typeof window !== 'undefined' ? '/api/analyze-jd' : `${currentHost}/api/analyze-jd`;
      response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (response && response.ok) break;
    } catch (err: any) {
      lastErr = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }

  if (!response || !response.ok) {
    const errorText = response ? await response.text().catch(() => '') : '';
    let message = response ? `AG-003 LLM Service Error (${response.status})` : (lastErr?.message || 'LLM API request failed');
    try {
      if (errorText) {
        const errJson = JSON.parse(errorText);
        message = errJson?.error?.message || message;
      }
    } catch {}
    throw new Error(message);
  }

  const responseData = await response.json();
  const rawCandidateText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawCandidateText) {
    throw new Error('Gemini API returned an empty analysis payload.');
  }

  const cleanJsonText = rawCandidateText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const parsed: JdRequirementLlmOutput = JSON.parse(cleanJsonText);

  return {
    requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
    preferredSkills: Array.isArray(parsed.preferredSkills) ? parsed.preferredSkills : [],
    responsibilitiesSummary: Array.isArray(parsed.responsibilitiesSummary) ? parsed.responsibilitiesSummary : [],
    qualifications: Array.isArray(parsed.qualifications) ? parsed.qualifications : [],
    requiredExperienceYears: typeof parsed.requiredExperienceYears === 'number' ? parsed.requiredExperienceYears : 0,
    requiredEducation: parsed.requiredEducation || 'Not specified in job description.',
    requiredCertifications: Array.isArray(parsed.requiredCertifications) ? parsed.requiredCertifications : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
  };
};

// ============================================================================
// MAIN AG-003 ENTRY POINT
// ============================================================================

export const runJdAnalysisAgent = async (
  job: Job,
  jd: JobDescription,
  profile: UserProfile,
  activeResumeVersionId?: string
): Promise<JDAnalysis> => {
  const fullJdText = jd.fullText || `${job.title} at ${job.company}. ${job.location}.`;

  if (!fullJdText || fullJdText.trim().length < 10) {
    throw new Error('The selected job does not contain a usable job description.');
  }

  // 1. Rule-based extraction as baseline/validator
  const ruleExtraction = extractRequirementsFromJdText(fullJdText);

  let llmOutput: JdRequirementLlmOutput;

  try {
    const rawLlm = await extractJdRequirementsWithLlm(fullJdText, profile);
    // Combine LLM extraction with rule-based taxonomy extraction to ensure zero missed requirements
    const mergedRequired = Array.from(new Set([...rawLlm.requiredSkills, ...ruleExtraction.requiredSkills]));
    const mergedPreferred = Array.from(new Set([...rawLlm.preferredSkills, ...ruleExtraction.preferredSkills]))
      .filter(s => !mergedRequired.includes(s));

    llmOutput = {
      requiredSkills: mergedRequired,
      preferredSkills: mergedPreferred,
      responsibilitiesSummary: rawLlm.responsibilitiesSummary.length > 0 ? rawLlm.responsibilitiesSummary : ruleExtraction.responsibilities,
      qualifications: rawLlm.qualifications.length > 0 ? rawLlm.qualifications : ['Relevant technical experience or equivalent degree.'],
      requiredExperienceYears: rawLlm.requiredExperienceYears || ruleExtraction.requiredExperienceYears,
      requiredEducation: rawLlm.requiredEducation !== 'Not specified in job description.' ? rawLlm.requiredEducation : ruleExtraction.requiredEducation,
      requiredCertifications: Array.from(new Set([...rawLlm.requiredCertifications, ...ruleExtraction.requiredCertifications])),
      strengths: rawLlm.strengths,
      recommendations: rawLlm.recommendations
    };
  } catch (err) {
    console.warn('AG-003 LLM extraction unavailable, using deterministic rule-based NLP extraction:', err);
    // Deterministic rule-based extraction from ACTUAL JD text (NEVER copying candidate skills!)
    llmOutput = {
      requiredSkills: ruleExtraction.requiredSkills,
      preferredSkills: ruleExtraction.preferredSkills,
      responsibilitiesSummary: ruleExtraction.responsibilities.length > 0
        ? ruleExtraction.responsibilities
        : [`Key responsibilities for ${job.title} at ${job.company}.`],
      qualifications: ['Relevant practical experience or technical degree.'],
      requiredExperienceYears: ruleExtraction.requiredExperienceYears,
      requiredEducation: ruleExtraction.requiredEducation,
      requiredCertifications: ruleExtraction.requiredCertifications,
      strengths: [`Candidate background evaluated against ${job.title}`],
      recommendations: ['Review skill gap analysis and update profile highlights']
    };
  }

  // Safety fallback: if no required skills were extracted from a long JD text, perform emergency taxonomy extract
  if (llmOutput.requiredSkills.length === 0 && fullJdText.length > 50) {
    llmOutput.requiredSkills = ruleExtraction.requiredSkills.length > 0
      ? ruleExtraction.requiredSkills
      : ['Software Engineering', 'Technical Problem Solving'];
  }

  // 2. Compute evidence-based match score and audit gaps against candidate profile
  const { matchScore, scoreBreakdown, matchedSkills, skillGaps } = calculateDeterministicMatchScore(
    profile,
    llmOutput.requiredSkills,
    llmOutput.preferredSkills,
    llmOutput.requiredExperienceYears,
    llmOutput.requiredEducation,
    llmOutput.requiredCertifications
  );

  const candidateExpYears = profile.experience?.length ? profile.experience.length * 1.5 : 1;
  const candidateEd = profile.education?.length
    ? `${profile.education[0].degree} in ${profile.education[0].fieldOfStudy}`
    : 'No education recorded in current resume';

  const candidateCerts = profile.certifications?.map(c => c.name) || [];
  const responsibilityAlignment = computeResponsibilityAlignment(llmOutput.responsibilitiesSummary, profile);

  const analysis: JDAnalysis = {
    id: `jda_${job.id}_${Date.now()}`,
    jobId: job.id,
    userId: profile.userId || 'usr_current',
    createdAt: new Date().toISOString(),
    resumeVersionId: activeResumeVersionId,
    requiredSkills: llmOutput.requiredSkills,
    preferredSkills: llmOutput.preferredSkills,
    matchedSkills,
    skillGaps,
    responsibilitiesSummary: llmOutput.responsibilitiesSummary,
    responsibilityAlignment,
    matchScore,
    scoreBreakdown,
    experienceAlignment: {
      candidateYears: candidateExpYears,
      requiredYears: llmOutput.requiredExperienceYears,
      isAligned: candidateExpYears >= llmOutput.requiredExperienceYears,
      evidence: llmOutput.requiredExperienceYears === 0
        ? 'Not specified in job description.'
        : candidateExpYears >= llmOutput.requiredExperienceYears
        ? `Profile shows ${candidateExpYears} years across ${profile.experience.length} recorded roles matching requirement of ${llmOutput.requiredExperienceYears} years.`
        : `Profile records ${candidateExpYears} years across ${profile.experience.length} roles (requirement: ${llmOutput.requiredExperienceYears} years).`
    },
    educationAlignment: {
      candidateEducation: candidateEd,
      requiredEducation: llmOutput.requiredEducation,
      isAligned: profile.education.length > 0,
      evidence: llmOutput.requiredEducation.toLowerCase().includes('not specified')
        ? 'Not specified in job description.'
        : profile.education.length > 0
        ? `Profile records ${candidateEd}.`
        : 'No evidence found in current resume.'
    },
    certificationAlignment: {
      candidateCerts,
      requiredCerts: llmOutput.requiredCertifications,
      isAligned: llmOutput.requiredCertifications.length === 0 || candidateCerts.length > 0,
      evidence: llmOutput.requiredCertifications.length === 0
        ? 'Not specified in job description.'
        : candidateCerts.length > 0
        ? `Profile lists ${candidateCerts.join(', ')}.`
        : `Required certification — no evidence found in current resume.`
    },
    strengths: llmOutput.strengths,
    recommendations: llmOutput.recommendations,
    isApprovedForOptimization: false
  };

  return analysis;
};
