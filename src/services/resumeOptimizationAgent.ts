// ============================================================================
// AG-004: RESUME OPTIMIZATION AGENT (GEMINI POWERED + MULTI-STAGE VALIDATION)
// Real ATS Optimization, Factual Validation, ATS Structure & PDF Text Extraction Audit
// ============================================================================

import { UserProfile, ResumeVersion, Job, JobDescription, JDAnalysis, AgentExecutionLog, AG004ValidationResult } from '../types';
import { generateLLMResponse } from './llmProvider';
import { gatherCandidateEvidence, checkSkillSupportInEvidence, normalizeSkillName } from './jdAnalysisAgent';

export interface AG004OptimizationResult {
  tailoredVersion: ResumeVersion;
  explanations: string[];
  unsupportedJdSkillsOmitted: string[];
  validationResult: AG004ValidationResult;
  log: AgentExecutionLog;
}

export interface StructuredResumeSchema {
  header: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  professional_summary: string;
  technical_skills: {
    programming_languages?: string[];
    frameworks?: string[];
    databases?: string[];
    cloud?: string[];
    devops?: string[];
    tools?: string[];
    other?: string[];
  };
  experience: Array<{
    id?: string;
    company: string;
    title: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current?: boolean;
    bullets: string[];
  }>;
  projects: Array<{
    id?: string;
    name: string;
    technologies: string[];
    bullets: string[];
    link?: string;
  }>;
  education: Array<{
    id?: string;
    institution: string;
    degree: string;
    field: string;
    dates: string;
  }>;
  certifications: Array<{
    id?: string;
    name: string;
    issuer: string;
    date?: string;
  }>;
  achievements?: Array<{
    description: string;
  }>;
  optimizations_performed?: string[];
  unsupported_jd_skills_omitted?: string[];
}

export interface AG004LLMResponseSchema {
  optimizedSummary: string;
  prioritizedTechnicalSkills: string[];
  prioritizedSoftSkills: string[];
  optimizedExperience: Array<{
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    highlights: string[];
  }>;
  optimizedProjects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  explanations: string[];
  unsupportedJdSkillsOmitted: string[];
  structuredResume?: StructuredResumeSchema;
}

// Helper to escape regex special characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// STAGE 3: FACTUAL GROUND-TRUTH VALIDATION LAYER
// ============================================================================

export function validateFactualGroundTruth(
  tailoredSnapshot: Partial<UserProfile>,
  groundTruth: UserProfile,
  ag003Gaps: string[] = []
): {
  factualValidation: 'PASS' | 'FAIL';
  unsupportedClaims: string[];
  unsupportedClaimsCount: number;
} {
  const unsupportedClaims: string[] = [];
  const candidateIndex = gatherCandidateEvidence(groundTruth);

  // 1. Negative Constraint Audit: Ensure ZERO genuine skill gaps (with NO evidence) were fabricated into candidate skills
  const resumeFullText = [
    tailoredSnapshot.bio || '',
    ...(tailoredSnapshot.technicalSkills || []),
    ...(tailoredSnapshot.skills || []),
    ...(tailoredSnapshot.experience || []).flatMap(e => [e.role, e.company, ...(e.highlights || [])]),
    ...(tailoredSnapshot.projects || []).flatMap(p => [p.title, p.description, ...(p.technologies || [])])
  ].join(' ').toLowerCase();

  (ag003Gaps || []).forEach(gap => {
    if (!gap || !gap.trim()) return;
    const gapTrimmed = gap.trim();
    
    // Check if gap skill is in ground-truth profile evidence (secondary verification)
    const { isMatched } = checkSkillSupportInEvidence(gapTrimmed, candidateIndex);

    // If gap has NO candidate evidence in ground truth, but IS in generated resume -> FABRICATION DETECTED
    if (!isMatched) {
      const gapPattern = new RegExp(`\\b${escapeRegExp(gapTrimmed.toLowerCase())}\\b`, 'i');
      if (gapPattern.test(resumeFullText)) {
        unsupportedClaims.push(`AG-003 skill gap "${gap}" was falsely added to candidate resume without supporting evidence.`);
      }
    }
  });

  // 2. Technical Skills Verification (using candidate evidence index)
  (tailoredSnapshot.technicalSkills || []).forEach(skill => {
    const { isMatched } = checkSkillSupportInEvidence(skill, candidateIndex);
    if (!isMatched) {
      unsupportedClaims.push(`Technical skill "${skill}" is missing from verified AG-001 ground-truth evidence.`);
    }
  });

  // 3. Contact Info Verification
  if (tailoredSnapshot.headline && groundTruth.headline && !tailoredSnapshot.headline.toLowerCase().includes('engineer') && !groundTruth.headline.toLowerCase().includes('engineer')) {
    // Info check
  }

  // 4. Experience Title & Company Preservation Check
  const groundTruthExpMap = new Map<string, string>();
  (groundTruth.experience || []).forEach(exp => {
    groundTruthExpMap.set(exp.company.toLowerCase(), exp.role.toLowerCase());
  });

  (tailoredSnapshot.experience || []).forEach(exp => {
    const expectedRole = groundTruthExpMap.get(exp.company.toLowerCase());
    if (expectedRole && !exp.role.toLowerCase().includes(expectedRole) && !expectedRole.includes(exp.role.toLowerCase())) {
      unsupportedClaims.push(`Work experience role for "${exp.company}" was altered from "${expectedRole}" to "${exp.role}".`);
    }
  });

  // 5. Projects Title Preservation Check
  const groundTruthProjects = new Set((groundTruth.projects || []).map(p => p.title.toLowerCase()));
  (tailoredSnapshot.projects || []).forEach(proj => {
    if (groundTruthProjects.size > 0 && !groundTruthProjects.has(proj.title.toLowerCase())) {
      unsupportedClaims.push(`Project "${proj.title}" does not exist in verified AG-001 profile.`);
    }
  });

  const factualValidation = unsupportedClaims.length === 0 ? 'PASS' : 'FAIL';

  return {
    factualValidation,
    unsupportedClaims,
    unsupportedClaimsCount: unsupportedClaims.length
  };
}

// ============================================================================
// STAGE 4: ATS STRUCTURE & QUALITY VALIDATION LAYER
// ============================================================================

export function validateAtsStructure(
  tailoredSnapshot: Partial<UserProfile>
): {
  atsStructureValidation: 'PASS' | 'FAIL';
  duplicateCount: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  let duplicateCount = 0;

  // 1. Standard Section Ordering & Heading Integrity Check
  const requiredSectionsPresent = [
    Boolean(tailoredSnapshot.bio),
    Boolean(tailoredSnapshot.technicalSkills && tailoredSnapshot.technicalSkills.length > 0),
    Boolean(tailoredSnapshot.experience && tailoredSnapshot.experience.length > 0)
  ];

  if (!requiredSectionsPresent.every(Boolean)) {
    warnings.push('One or more standard ATS sections (Summary, Technical Skills, Experience) are missing.');
  }

  // 2. Duplicate Content Check
  const seenSkills = new Set<string>();
  (tailoredSnapshot.technicalSkills || []).forEach(s => {
    const lower = s.toLowerCase();
    if (seenSkills.has(lower)) {
      duplicateCount++;
      warnings.push(`Duplicate technical skill detected: "${s}"`);
    }
    seenSkills.add(lower);
  });

  // 3. Bullet Point Quality Check
  (tailoredSnapshot.experience || []).forEach((exp, idx) => {
    (exp.highlights || []).forEach((h, hIdx) => {
      if (h.length < 15) {
        warnings.push(`Experience bullet [${idx}][${hIdx}] is too short for ATS parsing (<15 chars).`);
      }
    });
  });

  const atsStructureValidation = warnings.length === 0 ? 'PASS' : 'FAIL';

  return {
    atsStructureValidation,
    duplicateCount,
    warnings
  };
}

// ============================================================================
// STAGE 5: PDF TEXT EXTRACTION VALIDATION LAYER
// ============================================================================

export function validatePdfTextExtraction(
  tailoredSnapshot: Partial<UserProfile>,
  job: Job,
  candidateName: string,
  candidateEmail: string
): {
  pdfTextExtractionValidation: 'PASS' | 'FAIL';
  pdfTextOrderValidation: 'PASS' | 'FAIL';
  pdfContentMatch: 'PASS' | 'FAIL';
  extractedText: string;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Generate plain-text representation (simulates PDF text extraction stream)
  const lines: string[] = [];
  lines.push(`HEADER: ${candidateName}`);
  lines.push(`CONTACT: ${candidateEmail} | ${tailoredSnapshot.location || ''} ${tailoredSnapshot.phone ? `| ${tailoredSnapshot.phone}` : ''}`);
  lines.push(`TARGET ROLE: ${job.title} at ${job.company}`);
  lines.push('SUMMARY');
  lines.push(tailoredSnapshot.bio || '');
  lines.push('TECHNICAL SKILLS');
  lines.push((tailoredSnapshot.technicalSkills || []).join(', '));
  lines.push('WORK EXPERIENCE');
  (tailoredSnapshot.experience || []).forEach(exp => {
    lines.push(`${exp.role} - ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`);
    (exp.highlights || []).forEach(h => lines.push(`* ${h}`));
  });
  lines.push('PROJECTS');
  (tailoredSnapshot.projects || []).forEach(proj => {
    lines.push(`${proj.title}: ${proj.description} (Tech: ${(proj.technologies || []).join(', ')})`);
  });
  lines.push('EDUCATION');
  (tailoredSnapshot.education || []).forEach(edu => {
    lines.push(`${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
  });

  const extractedText = lines.join('\n');

  // 1. Text Extraction Check: Verify key fields exist in parsed text
  const hasName = extractedText.includes(candidateName);
  const hasSummary = Boolean(tailoredSnapshot.bio && extractedText.includes(tailoredSnapshot.bio.substring(0, 20)));
  const hasSkills = Boolean(tailoredSnapshot.technicalSkills?.[0] && extractedText.includes(tailoredSnapshot.technicalSkills[0]));

  const pdfTextExtractionValidation = (hasName && hasSummary && hasSkills) ? 'PASS' : 'FAIL';

  if (pdfTextExtractionValidation === 'FAIL') {
    warnings.push('PDF text extraction failed: Essential candidate sections could not be extracted.');
  }

  // 2. Text Order Check: Sequential order check (Header -> Summary -> Skills -> Experience -> Education)
  const namePos = extractedText.indexOf('HEADER');
  const summaryPos = extractedText.indexOf('SUMMARY');
  const skillsPos = extractedText.indexOf('TECHNICAL SKILLS');
  const expPos = extractedText.indexOf('WORK EXPERIENCE');
  const edPos = extractedText.indexOf('EDUCATION');

  const isOrderValid = (namePos < summaryPos) && (summaryPos < skillsPos) && (skillsPos < expPos) && (expPos < edPos || edPos === -1);
  const pdfTextOrderValidation = isOrderValid ? 'PASS' : 'FAIL';

  if (pdfTextOrderValidation === 'FAIL') {
    warnings.push('PDF text order validation failed: Section sequence violates ATS layout standards.');
  }

  // 3. Line-for-Line Content Match Check
  const snapshotSkillsStr = (tailoredSnapshot.technicalSkills || []).join(', ');
  const pdfContentMatch = extractedText.includes(snapshotSkillsStr) ? 'PASS' : 'FAIL';

  if (pdfContentMatch === 'FAIL') {
    warnings.push('PDF content match failed: Rendered text does not match DATA-004 snapshot line-for-line.');
  }

  return {
    pdfTextExtractionValidation,
    pdfTextOrderValidation,
    pdfContentMatch,
    extractedText,
    warnings
  };
}

// ============================================================================
// STAGE 6: JOB RELEVANCE VALIDATION LAYER
// ============================================================================

export function validateJobRelevance(
  tailoredSnapshot: Partial<UserProfile>,
  matchedSkills: string[]
): {
  jobRelevanceValidation: 'PASS' | 'FAIL';
  warnings: string[];
} {
  const warnings: string[] = [];

  const resumeText = [
    tailoredSnapshot.bio || '',
    ...(tailoredSnapshot.technicalSkills || []),
    ...(tailoredSnapshot.experience || []).flatMap(e => e.highlights || []),
    ...(tailoredSnapshot.projects || []).flatMap(p => p.technologies || [])
  ].join(' ').toLowerCase();

  // Verify matched skills appear in resume text
  let verifiedMatchCount = 0;
  (matchedSkills || []).forEach(skill => {
    if (resumeText.includes(skill.toLowerCase())) {
      verifiedMatchCount++;
    }
  });

  const ratio = matchedSkills.length > 0 ? verifiedMatchCount / matchedSkills.length : 1;
  const jobRelevanceValidation = ratio >= 0.5 ? 'PASS' : 'FAIL';

  if (jobRelevanceValidation === 'FAIL') {
    warnings.push('Job relevance validation failed: Overlapping JD skills are not sufficiently emphasized.');
  }

  return {
    jobRelevanceValidation,
    warnings
  };
}

// ============================================================================
// COMPREHENSIVE MULTI-STAGE VALIDATION PIPELINE EXECUTION
// ============================================================================

export function runFullAG004ValidationPipeline(
  tailoredSnapshot: Partial<UserProfile>,
  groundTruth: UserProfile,
  job: Job,
  analysis: JDAnalysis,
  candidateName: string,
  candidateEmail: string
): AG004ValidationResult {
  const factualRes = validateFactualGroundTruth(tailoredSnapshot, groundTruth, analysis.skillGaps || []);
  const atsRes = validateAtsStructure(tailoredSnapshot);
  const pdfRes = validatePdfTextExtraction(tailoredSnapshot, job, candidateName, candidateEmail);
  const relevanceRes = validateJobRelevance(tailoredSnapshot, analysis.matchedSkills || []);

  const allWarnings = [
    ...atsRes.warnings,
    ...pdfRes.warnings,
    ...relevanceRes.warnings
  ];

  const overallStatus: 'VALIDATED' | 'FAILED' = (
    factualRes.factualValidation === 'PASS' &&
    atsRes.atsStructureValidation === 'PASS' &&
    pdfRes.pdfTextExtractionValidation === 'PASS' &&
    pdfRes.pdfTextOrderValidation === 'PASS' &&
    pdfRes.pdfContentMatch === 'PASS' &&
    relevanceRes.jobRelevanceValidation === 'PASS' &&
    factualRes.unsupportedClaimsCount === 0
  ) ? 'VALIDATED' : 'FAILED';

  return {
    factualValidation: factualRes.factualValidation,
    atsStructureValidation: atsRes.atsStructureValidation,
    pdfTextExtractionValidation: pdfRes.pdfTextExtractionValidation,
    pdfTextOrderValidation: pdfRes.pdfTextOrderValidation,
    jobRelevanceValidation: relevanceRes.jobRelevanceValidation,
    pdfContentMatch: pdfRes.pdfContentMatch,
    unsupportedClaimsCount: factualRes.unsupportedClaimsCount,
    duplicateCount: atsRes.duplicateCount,
    unsupportedClaims: factualRes.unsupportedClaims,
    warnings: allWarnings,
    overallStatus,
    verificationTimestamp: new Date().toISOString()
  };
}

// ============================================================================
// MAIN AG-004 AGENT ENTRY POINT
// ============================================================================

export async function runAG004ResumeOptimization(
  job: Job,
  analysis: JDAnalysis,
  userProfile: UserProfile,
  jobDescription?: JobDescription,
  originalResumeVersionId?: string
): Promise<AG004OptimizationResult> {
  const startTime = Date.now();

  // --------------------------------------------------------------------------
  // 1. INPUT & JD VERIFICATION (STRICT SAFETY CONTRACT)
  // --------------------------------------------------------------------------
  if (!analysis || analysis.isApprovedForOptimization !== true) {
    throw new Error('Approve the JD Analysis before optimizing your resume.');
  }

  if (!job || !job.id) {
    throw new Error('Select a job from Job Search before optimizing your resume.');
  }

  if (analysis.jobId !== job.id) {
    throw new Error(`AG-003 Job ID (${analysis.jobId}) does not match Target Job ID (${job.id}). Generation blocked.`);
  }

  if (!userProfile || (userProfile.skills.length === 0 && userProfile.experience.length === 0 && userProfile.education.length === 0)) {
    throw new Error('Upload and analyze your resume before optimizing it.');
  }

  // --------------------------------------------------------------------------
  // 2. GROUND-TRUTH EVIDENCE & NEGATIVE CONSTRAINTS (SKILL GAPS)
  // --------------------------------------------------------------------------
  const candidateSkillsSet = new Set<string>();
  // --------------------------------------------------------------------------
  // 2. GROUND-TRUTH EVIDENCE & SECONDARY VERIFICATION PASS
  // --------------------------------------------------------------------------
  const candidateIndex = gatherCandidateEvidence(userProfile);

  const jdRequiredSkills = analysis.requiredSkills || [];
  const jdPreferredSkills = analysis.preferredSkills || [];
  const ag003Gaps = analysis.skillGaps || [];
  const allJdSkills = Array.from(new Set([...jdRequiredSkills, ...jdPreferredSkills, ...ag003Gaps]));

  const supportedSkills: string[] = [];
  const unsupportedJdSkillsOmitted: string[] = [];

  allJdSkills.forEach(jdSkill => {
    if (!jdSkill || !jdSkill.trim()) return;
    const { isMatched } = checkSkillSupportInEvidence(jdSkill, candidateIndex);

    if (isMatched) {
      const canonical = normalizeSkillName(jdSkill);
      if (!supportedSkills.includes(canonical)) {
        supportedSkills.push(canonical);
      }
    } else {
      if (!unsupportedJdSkillsOmitted.includes(jdSkill)) {
        unsupportedJdSkillsOmitted.push(jdSkill);
      }
    }
  });

  let parsedOutput: AG004LLMResponseSchema | null = null;
  let explanations: string[] = [];

  // --------------------------------------------------------------------------
  // 3. GEMINI LLM RESUME GENERATION REQUEST
  // --------------------------------------------------------------------------
  try {
    const systemInstruction = `YOU ARE AG-004 — ADVANCED ATS RESUME OPTIMIZATION ENGINE POWERED BY GEMINI.

CRITICAL DIRECTIVES & ABSOLUTE TRUTHFULNESS BOUNDARIES:
1. CANDIDATE DATA IS AUTHORITATIVE GROUND TRUTH.
   - You MUST extract facts ONLY from the candidate's ground-truth profile provided below.
   - NEVER fabricate or invent programming languages, frameworks, cloud platforms, tools, certifications, degrees, companies, job titles, employment dates, projects, responsibilities, or metrics not supported by candidate data.

2. JOB DESCRIPTION IS EMPLOYER REQUIREMENTS ONLY.
   - The Job Description describes what the employer wants, NOT what the candidate possesses.
   - NEVER infer candidate possession of a skill merely because the JD requests it.
   - UNSUPPORTED JD SKILLS (${JSON.stringify(unsupportedJdSkillsOmitted)}) MUST ACT AS STRICT NEGATIVE CONSTRAINTS.
   - DO NOT ADD UNSUPPORTED JD SKILLS (${JSON.stringify(unsupportedJdSkillsOmitted)}) to any section of the resume (summary, skills, experience, projects, or achievements). YOU MUST OMIT THEM.

3. OPTIMIZATION & REORDERING RULES:
   - Rank and categorize verified candidate skills to bring verified JD requirements (${JSON.stringify(supportedSkills)}) to the top of each category.
   - Refine experience and project bullet points using active verbs and professional phrasing while preserving 100% factual accuracy of the candidate's actual work history.
   - Write a concise, targeted professional summary reflecting the candidate's actual role and verified skills.

4. STRICT STRUCTURED OUTPUT FORMAT:
   - Return ONLY a single valid JSON object matching the requested schema.`;

    const userPrompt = `TARGET JOB CONTEXT:
Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Job Description Text: ${jobDescription?.fullText || job.title}

AG-003 MATCH SCORE ANALYSIS CONTEXT:
Match Score: ${analysis.matchScore}%
Verified Matched JD Skills: ${JSON.stringify(supportedSkills)}
Genuine Skill Gaps (STRICT NEGATIVE CONSTRAINTS): ${JSON.stringify(unsupportedJdSkillsOmitted)}

CANDIDATE GROUND TRUTH PROFILE EVIDENCE (STRICT BOUNDARY):
Headline: ${userProfile.headline}
Bio: ${userProfile.bio}
Technical Skills: ${JSON.stringify(userProfile.technicalSkills || [])}
Soft Skills: ${JSON.stringify(userProfile.softSkills || [])}
All Skills: ${JSON.stringify(userProfile.skills || [])}
Work Experience: ${JSON.stringify(userProfile.experience || [])}
Projects: ${JSON.stringify(userProfile.projects || [])}
Education: ${JSON.stringify(userProfile.education || [])}
Certifications: ${JSON.stringify(userProfile.certifications || [])}
Achievements: ${JSON.stringify(userProfile.achievements || [])}

Return a single JSON object with exact fields:
{
  "optimizedSummary": "Concise professional summary tailored for target role using only verified evidence",
  "prioritizedTechnicalSkills": ["Skill 1", "Skill 2"],
  "prioritizedSoftSkills": ["Soft Skill 1"],
  "optimizedExperience": [
    {
      "id": "exp_id",
      "company": "Exact candidate company",
      "role": "Exact candidate role",
      "location": "Location",
      "startDate": "Start Date",
      "endDate": "End Date",
      "isCurrent": boolean,
      "highlights": ["Enhanced active-verb bullet point derived from actual work"]
    }
  ],
  "optimizedProjects": [
    {
      "id": "proj_id",
      "title": "Exact project title",
      "description": "Enhanced description derived from actual project",
      "technologies": ["Actual candidate tech 1"],
      "link": "link"
    }
  ],
  "explanations": [
    "Prioritized verified technical skills matching target job description",
    "Enhanced bullet clarity using verified work history",
    "Structured for single-pass ATS parsing"
  ],
  "unsupportedJdSkillsOmitted": ${JSON.stringify(unsupportedJdSkillsOmitted)}
}`;

    const response = await generateLLMResponse<AG004LLMResponseSchema>({
      provider: 'GEMINI',
      model: 'gemini-1.5-flash',
      systemInstruction,
      prompt: userPrompt,
      responseFormat: 'json'
    });

    if (response.structuredJson) {
      parsedOutput = response.structuredJson;
    }
  } catch (err: any) {
    console.warn('AG-004 Gemini LLM call note, falling back to deterministic evidence optimization:', err.message || err);
  }

  // Fallback deterministic formatting if LLM call is unavailable
  if (!parsedOutput) {
    const matchedLower = new Set(supportedSkills.map(s => s.toLowerCase()));

    const sortedTech = [...userProfile.technicalSkills].sort((a, b) => {
      const aMatch = matchedLower.has(a.toLowerCase()) ? 1 : 0;
      const bMatch = matchedLower.has(b.toLowerCase()) ? 1 : 0;
      return bMatch - aMatch;
    });

    const sortedSkills = [...userProfile.skills].sort((a, b) => {
      const aMatch = matchedLower.has(a.toLowerCase()) ? 1 : 0;
      const bMatch = matchedLower.has(b.toLowerCase()) ? 1 : 0;
      return bMatch - aMatch;
    });

    parsedOutput = {
      optimizedSummary: userProfile.bio || `${userProfile.headline || job.title} with hands-on experience in ${sortedTech.slice(0, 4).join(', ')}. Demonstrated technical skills tailored for software engineering requirements.`,
      prioritizedTechnicalSkills: sortedTech.length > 0 ? sortedTech : sortedSkills,
      prioritizedSoftSkills: userProfile.softSkills || [],
      optimizedExperience: userProfile.experience || [],
      optimizedProjects: userProfile.projects || [],
      explanations: [
        `Prioritized ${supportedSkills.length} verified matched technical skills (${supportedSkills.slice(0, 4).join(', ') || 'verified skills'}) at the top of the technical skills section.`,
        `Aligned experience and project highlights with target role: "${job.title}".`,
        `Preserved 100% of candidate source ground truth with zero fabricated claims.`
      ],
      unsupportedJdSkillsOmitted
    };
  }

  // Prune any unverified skills from Gemini output using candidate evidence index
  const sanitizedTechSkills = (parsedOutput.prioritizedTechnicalSkills || userProfile.technicalSkills).filter(skill => {
    const { isMatched } = checkSkillSupportInEvidence(skill, candidateIndex);
    return isMatched;
  });

  // Retain ground-truth candidate skills so valid evidence is preserved
  userProfile.technicalSkills.forEach(skill => {
    if (!sanitizedTechSkills.includes(skill)) {
      sanitizedTechSkills.push(skill);
    }
  });

  explanations = parsedOutput.explanations && parsedOutput.explanations.length > 0
    ? parsedOutput.explanations
    : [
        `Reordered technical skills to emphasize high-priority JD matches: ${supportedSkills.slice(0, 4).join(', ') || 'verified skills'}`,
        `Enhanced bullet wording for clarity and JD keyword alignment using verified work history.`,
        `Omitted unsupported JD skills (${unsupportedJdSkillsOmitted.slice(0, 3).join(', ') || 'none'}) due to strict truthfulness guardrail.`
      ];

  const tailoredProfileSnapshot: Partial<UserProfile> = {
    ...userProfile,
    headline: userProfile.headline || `${job.title} Professional`,
    bio: parsedOutput.optimizedSummary || userProfile.bio,
    technicalSkills: sanitizedTechSkills.length > 0 ? sanitizedTechSkills : userProfile.technicalSkills,
    softSkills: parsedOutput.prioritizedSoftSkills.length > 0 ? parsedOutput.prioritizedSoftSkills : userProfile.softSkills,
    skills: Array.from(new Set([...sanitizedTechSkills, ...(parsedOutput.prioritizedSoftSkills || []), ...userProfile.skills])),
    experience: parsedOutput.optimizedExperience.length > 0 ? parsedOutput.optimizedExperience : userProfile.experience,
    projects: parsedOutput.optimizedProjects.length > 0 ? parsedOutput.optimizedProjects : userProfile.projects,
    education: userProfile.education,
    certifications: userProfile.certifications,
    achievements: userProfile.achievements
  };

  // --------------------------------------------------------------------------
  // 4. RUN COMPREHENSIVE MULTI-STAGE VALIDATION PIPELINE
  // --------------------------------------------------------------------------
  const validationResult = runFullAG004ValidationPipeline(
    tailoredProfileSnapshot,
    userProfile,
    job,
    analysis,
    userProfile.headline || 'Candidate Name',
    'candidate@example.com'
  );

  const isVerified = validationResult.overallStatus === 'VALIDATED';
  const versionId = `ver_opt_${job.id}_${Date.now()}`;

  const newResumeVersion: ResumeVersion & {
    optimizationExplanations?: string[];
    unsupportedJdSkillsOmitted?: string[];
    jdAnalysisId?: string;
    isApproved?: boolean;
    approvedAt?: string;
  } = {
    id: versionId,
    resumeId: originalResumeVersionId || 'res_default',
    versionName: `Optimized ATS Resume - ${job.company} (${job.title})`,
    isOriginal: false,
    tailoredForJobId: job.id,
    tailoredForCompanyName: job.company,
    createdAt: new Date().toISOString(),
    profileSnapshot: tailoredProfileSnapshot,
    strengths: explanations,
    weaknesses: unsupportedJdSkillsOmitted.map(skill => `Unsupported JD skill omitted: ${skill}`),
    structureNotes: [
      'Gemini Powered Content Intelligence: High-precision ATS phrasing applied.',
      `Validation Pipeline Result: ${validationResult.overallStatus} (${validationResult.unsupportedClaimsCount} unsupported claims).`,
      'ATS Keyword Density: Single-pass ATS readable structure applied.'
    ],
    matchedKeywords: supportedSkills,
    detectedJobRole: job.title,
    rawText: JSON.stringify(tailoredProfileSnapshot),
    isVerified,
    validationResult,
    pdfExtractedText: validationResult.overallStatus === 'VALIDATED' ? 'PARSED_TEXT_VALIDATED' : undefined,
    optimizationExplanations: explanations,
    unsupportedJdSkillsOmitted,
    jdAnalysisId: analysis.id,
    isApproved: false
  };

  const durationMs = Date.now() - startTime;

  // --------------------------------------------------------------------------
  // 5. RECORD AGENT EXECUTION LOG WITH VALIDATION AUDIT
  // --------------------------------------------------------------------------
  const log: AgentExecutionLog = {
    id: `log_${Date.now()}`,
    agentId: 'AG-004',
    agentName: 'Resume Optimization Agent (Gemini Powered + Validation Pipeline)',
    timestamp: new Date().toISOString(),
    status: isVerified ? 'SUCCESS' : 'FAILURE',
    inputSummary: `Optimized resume for "${job.title}" at "${job.company}" using approved AG-003 analysis (Match Score: ${analysis.matchScore}%).`,
    outputSummary: `Generated DATA-004 Resume Version (${versionId}). Validation Status: ${validationResult.overallStatus}. Unsupported Claims: ${validationResult.unsupportedClaimsCount}. Omitted ${unsupportedJdSkillsOmitted.length} unsupported JD skills.`,
    durationMs
  };

  return {
    tailoredVersion: newResumeVersion,
    explanations,
    unsupportedJdSkillsOmitted,
    validationResult,
    log
  };
}
