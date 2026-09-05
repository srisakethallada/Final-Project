// ============================================================================
// AG-001: RESUME ANALYSIS AGENT (AI CAREER OS CORE INTELLIGENCE ENGINE)
// Data-Driven Resume Extraction & Full-Resume Job Role Analyzer
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
Your objective is to extract and structure information from an uploaded resume to build a single trusted, machine-readable career profile.

CRITICAL MANDATES:
1. NO MOCK DATA. Extract ONLY facts supported by the actual resume content provided. Do NOT invent missing names, degrees, skills, or companies. Leave missing fields empty or omit them.
2. ENTIRE RESUME JOB ROLE DETERMINATION: You MUST analyze the ENTIRE resume (professional summary, work experience, responsibilities, projects, technical skills, tools, programming languages, frameworks, education, certifications, achievements, keywords) to determine the user's MOST SUITABLE target job role.
   - Do NOT determine the role from only the headline, designation, first paragraph, or filename.
   - Base the job role decision strictly on cumulative evidence across the full resume.
   - Distinguish between the user's stated title (if present) vs analyzed best-supported job role.
3. STRUCTURED JSON OUTPUT: Return ONLY valid JSON matching this schema:

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
  "job_role": "Best supported job role (e.g. Java Backend Engineer, ML Engineer, Full Stack Developer)",
  "job_role_evidence": [
    "Evidence bullet 1 referencing actual resume experience/skills",
    "Evidence bullet 2 referencing actual projects/tools"
  ],
  "job_role_confidence": "HIGH" | "MEDIUM" | "LOW",
  "stated_title": "Current or previous job title as written in resume",
  "education": [
    {
      "institution": "",
      "degree": "",
      "fieldOfStudy": "",
      "startDate": "",
      "endDate": "",
      "grade": ""
    }
  ],
  "skills": ["General & technical skills extracted"],
  "technical_skills": ["Specific technical skills, programming languages, tools"],
  "soft_skills": ["Soft skills, methodologies, communication"],
  "experience": [
    {
      "company": "",
      "role": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "isCurrent": false,
      "highlights": ["Bullet point responsibilities/achievements"]
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": ["Tech used"],
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "issueDate": "",
      "credentialId": ""
    }
  ],
  "achievements": ["Key achievements"],
  "keywords": ["Core keywords extracted"],
  "structure_notes": ["Structure notes regarding readability, missing sections, formatting"],
  "strengths": ["Evidence-supported key resume strengths"],
  "weaknesses": ["Evidence-supported resume gaps or areas for development"]
}`;

  const promptText = `Analyze the following complete uploaded resume content:

File Name: ${doc.fileName}
File Type: ${doc.fileType}
File Size: ${doc.fileSize} bytes

--- FULL EXTRACTED RESUME TEXT CONTENT START ---
${doc.rawText}
--- FULL EXTRACTED RESUME TEXT CONTENT END ---

Extract the complete structured profile JSON according to the instructions.`;

  // Build Gemini API payload
  let parts: any[] = [{ text: promptText }];

  // If file is an Image, pass inline base64 data to Gemini Vision capability
  if (doc.fileType === 'IMAGE' && doc.base64Data) {
    parts = [
      {
        inline_data: {
          mime_type: doc.mimeType || 'image/png',
          data: doc.base64Data
        }
      },
      { text: promptText }
    ];
  }

  // Call Server-Side API endpoint (keeps secret GEMINI_API_KEY on backend only)
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
    // Clean any residual markdown tags if present
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
  if (Array.isArray(parsedJson.experience) && parsedJson.experience.length > 0) score += 20;
  if (Array.isArray(parsedJson.projects) && parsedJson.projects.length > 0) score += 10;

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
          role: exp.role || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          isCurrent: Boolean(exp.isCurrent),
          highlights: Array.isArray(exp.highlights) ? exp.highlights : []
        }))
      : [],
    projects: Array.isArray(parsedJson.projects)
      ? parsedJson.projects.map((proj: any, idx: number) => ({
          id: `proj_${Date.now()}_${idx}`,
          title: proj.title || '',
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
