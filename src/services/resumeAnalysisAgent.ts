// ============================================================================
// AG-001: RESUME ANALYSIS AGENT (AI CAREER OS CORE INTELLIGENCE ENGINE)
// Data-Driven Whole-Resume Extraction & Job Role Analyzer
// ============================================================================

import { UserProfile, Education, Experience, Project, Certification } from '../types';
import { ParsedDocument } from './resumeParser';

export interface AG001AnalysisResult {
  extractedProfile: Partial<UserProfile>;
  jobRole: string;
  jobRoleEvidence: string[];
  jobRoleConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  statedTitle?: string;
  strengths: string[];
  weaknesses: string[];
  structureNotes: string[];
  keywords: string[];
  rawText: string;
}

/**
 * Executes AG-001 Entire Resume Analysis via Server-Side Secure API Endpoint
 */
export const runAG001Analysis = async (doc: ParsedDocument): Promise<AG001AnalysisResult> => {
  const systemInstruction = `You are AG-001 Resume Analysis Agent, the primary intelligence engine of AI Career OS.
Your objective is to extract and structure complete, un-truncated information from an uploaded resume to build a single trusted, machine-readable career profile.

CRITICAL EXTRACTION DIRECTIVES:
1. NO MOCK DATA & NO FABRICATION: Extract ONLY facts supported by the actual resume content provided. Do NOT invent missing names, degrees, skills, companies, or projects. Leave missing fields empty or omit them.
2. COMPLETE SECTION EXTRACTION:
   - PROJECTS: Examine every project listed in the resume (under Projects, Personal Projects, Academic Projects, Portfolio, Systems Built). Extract title, description, technologies, and link for EVERY project present. DO NOT OMIT ANY PROJECT.
   - EXPERIENCE: Examine every work experience entry (under Experience, Work History, Employment, Internships). Extract company, role, location, startDate, endDate, isCurrent, and ALL highlight bullet points. DO NOT OMIT ANY ROLE.
   - EDUCATION: Examine every education entry (under Education, Degrees, Academic History). Extract institution, degree, fieldOfStudy, startDate, endDate, grade.
   - SKILLS & TECHNICAL SKILLS: Extract ALL technical skills, tools, programming languages, databases, frameworks, cloud platforms, and soft skills present in the resume.
3. ENTIRE RESUME JOB ROLE DETERMINATION: Analyze cumulative evidence across the ENTIRE resume (summary, work experience, responsibilities, projects, technical skills, tools, programming languages, education, certifications, achievements, keywords) to determine the user's MOST SUITABLE target job role.
   - Do NOT determine the role from only the headline, designation, first paragraph, or filename.
   - Base the job role decision strictly on cumulative evidence across the full resume.
   - Distinguish between stated title vs analyzed best-supported job role.

4. STRUCTURED JSON OUTPUT: Return ONLY valid JSON matching this schema:

{
  "personal_info": {
    "fullName": "Extracted full name if present",
    "email": "Extracted email if present",
    "phone": "Extracted phone if present",
    "location": "Extracted location if present",
    "bio": "Extracted professional summary/bio",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "job_role": "Best supported job role based on full resume evidence",
  "job_role_evidence": [
    "Evidence bullet 1 referencing actual resume experience/skills/projects",
    "Evidence bullet 2 referencing actual tools/education"
  ],
  "job_role_confidence": "HIGH" | "MEDIUM" | "LOW",
  "stated_title": "Current or previous job title as written in resume",
  "education": [
    {
      "institution": "University / College / Institute name",
      "degree": "Degree name (e.g. B.Tech, B.S., M.S.)",
      "fieldOfStudy": "Major / Major field of study",
      "startDate": "Start year/date",
      "endDate": "End year/date",
      "grade": "GPA or Grade if present"
    }
  ],
  "skills": ["All general and technical skills extracted"],
  "technical_skills": ["Specific technical skills, programming languages, frameworks, databases, tools"],
  "soft_skills": ["Soft skills, methodologies, leadership"],
  "experience": [
    {
      "company": "Company / Organization name",
      "role": "Role / Title",
      "location": "Location if present",
      "startDate": "Start date",
      "endDate": "End date",
      "isCurrent": false,
      "highlights": ["Extracted bullet point responsibility or achievement"]
    }
  ],
  "projects": [
    {
      "title": "Project name/title",
      "description": "Comprehensive project description",
      "technologies": ["Technologies / tools used"],
      "link": "Project URL if present"
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "issueDate": "Date issued",
      "credentialId": "ID if present"
    }
  ],
  "achievements": ["Key honors, awards, or achievements"],
  "keywords": ["Core career & domain keywords extracted from full document"],
  "structure_notes": ["Structure notes regarding section clarity, readability, missing sections"],
  "strengths": ["Evidence-supported key resume strengths"],
  "weaknesses": ["Evidence-supported resume development areas or gaps"]
}`;

  const promptText = `Analyze the following complete uploaded resume content:

File Name: ${doc.fileName}
File Type: ${doc.fileType}
File Size: ${doc.fileSize} bytes
Page Count: ${doc.pageCount || 1}

--- FULL EXTRACTED RESUME TEXT CONTENT START ---
${doc.rawText}
--- FULL EXTRACTED RESUME TEXT CONTENT END ---

Extract the complete structured profile JSON according to all instructions. Make sure ALL projects, work experience entries, and education entries present in the text are extracted into their respective array fields.`;

  // Build payload. Pass inline base64 object for PDF and IMAGE files so Gemini reads document structure natively
  let parts: any[] = [{ text: promptText }];

  if ((doc.fileType === 'PDF' || doc.fileType === 'IMAGE') && doc.base64Data) {
    parts = [
      {
        inline_data: {
          mime_type: doc.mimeType || (doc.fileType === 'PDF' ? 'application/pdf' : 'image/png'),
          data: doc.base64Data
        }
      },
      { text: promptText }
    ];
  }

  // Call Server-Side API endpoint
  let response: Response;
  try {
    response = await fetch('/api/analyze-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });
  } catch (netErr: any) {
    throw new Error(`AG-001 LLM Server Connection Failed: ${netErr.message || 'Network error reaching backend API server.'}`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    let message = `LLM Service Error (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      message = errJson?.error?.message || message;
    } catch {}
    throw new Error(`AG-001 Analysis Request Failed: ${message}`);
  }

  const jsonResult = await response.json();
  const textContent = jsonResult?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('AG-001 Received empty response from LLM Analysis service.');
  }

  let parsedJson: any;
  try {
    const cleanedText = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
    parsedJson = JSON.parse(cleanedText);
  } catch (parseErr) {
    throw new Error('AG-001 Failed to parse structured JSON response from LLM service.');
  }

  // Calculate Completeness Score based on real extracted fields
  let score = 0;
  if (parsedJson.personal_info?.fullName) score += 10;
  if (parsedJson.personal_info?.email) score += 10;
  if (parsedJson.personal_info?.phone) score += 5;
  if (parsedJson.personal_info?.location) score += 5;
  if (parsedJson.personal_info?.bio) score += 10;
  if (Array.isArray(parsedJson.education) && parsedJson.education.length > 0) score += 15;
  if (Array.isArray(parsedJson.skills) && parsedJson.skills.length > 0) score += 15;
  if (Array.isArray(parsedJson.experience) && parsedJson.experience.length > 0) score += 15;
  if (Array.isArray(parsedJson.projects) && parsedJson.projects.length > 0) score += 15;

  const completeness = Math.min(100, Math.max(20, score));

  // Build normalized UserProfile object
  const extractedProfile: Partial<UserProfile> = {
    headline: parsedJson.stated_title || parsedJson.job_role || 'Software Engineering Professional',
    phone: parsedJson.personal_info?.phone || '',
    location: parsedJson.personal_info?.location || '',
    bio: parsedJson.personal_info?.bio || '',
    completeness,
    jobRole: parsedJson.job_role || 'Software Engineer',
    jobRoleEvidence: Array.isArray(parsedJson.job_role_evidence) ? parsedJson.job_role_evidence : [],
    jobRoleConfidence: (parsedJson.job_role_confidence as any) || 'HIGH',
    jobRoleNeedsConfirmation: parsedJson.job_role_confidence === 'LOW',
    skills: Array.isArray(parsedJson.skills) ? parsedJson.skills : [],
    technicalSkills: Array.isArray(parsedJson.technical_skills) ? parsedJson.technical_skills : [],
    softSkills: Array.isArray(parsedJson.soft_skills) ? parsedJson.soft_skills : [],
    education: Array.isArray(parsedJson.education)
      ? parsedJson.education.map((e: any, idx: number) => ({
          id: `edu_${Date.now()}_${idx}`,
          institution: e.institution || '',
          degree: e.degree || '',
          fieldOfStudy: e.fieldOfStudy || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          grade: e.grade || undefined
        }))
      : [],
    experience: Array.isArray(parsedJson.experience)
      ? parsedJson.experience.map((exp: any, idx: number) => ({
          id: `exp_${Date.now()}_${idx}`,
          company: exp.company || '',
          role: exp.role || exp.title || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          isCurrent: Boolean(exp.isCurrent),
          highlights: Array.isArray(exp.highlights) ? exp.highlights : exp.summary ? [exp.summary] : []
        }))
      : [],
    projects: Array.isArray(parsedJson.projects)
      ? parsedJson.projects.map((proj: any, idx: number) => ({
          id: `proj_${Date.now()}_${idx}`,
          title: proj.title || proj.name || '',
          description: proj.description || '',
          technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
          link: proj.link || undefined
        }))
      : [],
    certifications: Array.isArray(parsedJson.certifications)
      ? parsedJson.certifications.map((cert: any, idx: number) => ({
          id: `cert_${Date.now()}_${idx}`,
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.issueDate || '',
          credentialId: cert.credentialId || undefined
        }))
      : [],
    achievements: Array.isArray(parsedJson.achievements) ? parsedJson.achievements : []
  };

  return {
    extractedProfile,
    jobRole: parsedJson.job_role || 'Software Engineer',
    jobRoleEvidence: Array.isArray(parsedJson.job_role_evidence) ? parsedJson.job_role_evidence : [],
    jobRoleConfidence: (parsedJson.job_role_confidence as any) || 'HIGH',
    statedTitle: parsedJson.stated_title,
    strengths: Array.isArray(parsedJson.strengths) ? parsedJson.strengths : [],
    weaknesses: Array.isArray(parsedJson.weaknesses) ? parsedJson.weaknesses : [],
    structureNotes: Array.isArray(parsedJson.structure_notes) ? parsedJson.structure_notes : [],
    keywords: Array.isArray(parsedJson.keywords) ? parsedJson.keywords : [],
    rawText: doc.rawText
  };
};
