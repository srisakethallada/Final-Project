// ============================================================================
// AI CAREER OS — ATS PDF GENERATOR & TEXT EXTRACTION SERVICE
// Generates valid, machine-readable PDF binary documents from DATA-004 resumes
// ============================================================================

import { jsPDF } from 'jspdf';
import { UserProfile } from '../types';

export interface GeneratedPdfResult {
  blob: Blob;
  fileName: string;
  pdfText: string;
  pageCount: number;
}

/**
 * Sanitizes candidate name and job title into a clean filename
 */
export function generatePdfFileName(candidateName: string, jobTitle: string): string {
  const cleanName = (candidateName || 'Candidate')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  const cleanRole = (jobTitle || 'Resume')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `${cleanName}_Resume_${cleanRole}.pdf`;
}

/**
 * Generates an ATS-friendly PDF Blob and extracts text for machine-readability audit
 */
export async function generateAtsPdfDocument(
  profileSnapshot: Partial<UserProfile>,
  jobTitle: string,
  candidateName: string,
  candidateEmail: string
): Promise<GeneratedPdfResult> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15; // 15mm margin
  const maxLineWidth = pageWidth - margin * 2;

  let y = margin;
  const linesExtracted: string[] = [];

  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // --------------------------------------------------------------------------
  // 1. CANDIDATE HEADER
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(candidateName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  linesExtracted.push(candidateName.toUpperCase());
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);

  const contactParts: string[] = [];
  if (profileSnapshot.location) contactParts.push(profileSnapshot.location);
  if (candidateEmail) contactParts.push(candidateEmail);
  if (profileSnapshot.phone) contactParts.push(profileSnapshot.phone);

  const contactLine = contactParts.join('  |  ');
  doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
  linesExtracted.push(contactLine);
  y += 5;

  if (jobTitle) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(0, 100, 180);
    doc.text(`TARGET ROLE: ${jobTitle.toUpperCase()}`, pageWidth / 2, y, { align: 'center' });
    linesExtracted.push(`TARGET ROLE: ${jobTitle.toUpperCase()}`);
    y += 6;
  }

  // Horizontal Rule
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Helper for Section Headings
  const renderSectionHeader = (title: string) => {
    checkNewPage(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    linesExtracted.push(title.toUpperCase());
    y += 1.5;

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4.5;
  };

  // --------------------------------------------------------------------------
  // 2. PROFESSIONAL SUMMARY
  // --------------------------------------------------------------------------
  if (profileSnapshot.bio && profileSnapshot.bio.trim()) {
    renderSectionHeader('Professional Summary');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);

    const summaryLines = doc.splitTextToSize(profileSnapshot.bio, maxLineWidth);
    checkNewPage(summaryLines.length * 4.5 + 4);
    doc.text(summaryLines, margin, y);
    summaryLines.forEach((l: string) => linesExtracted.push(l));
    y += summaryLines.length * 4.5 + 5;
  }

  // --------------------------------------------------------------------------
  // 3. TECHNICAL SKILLS
  // --------------------------------------------------------------------------
  const skills = profileSnapshot.technicalSkills || profileSnapshot.skills || [];
  if (skills.length > 0) {
    renderSectionHeader('Technical Skills');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);

    const skillsText = skills.join(', ');
    const skillLines = doc.splitTextToSize(skillsText, maxLineWidth);
    checkNewPage(skillLines.length * 4.5 + 4);
    doc.text(skillLines, margin, y);
    skillLines.forEach((l: string) => linesExtracted.push(l));
    y += skillLines.length * 4.5 + 5;
  }

  // --------------------------------------------------------------------------
  // 4. WORK EXPERIENCE
  // --------------------------------------------------------------------------
  const experience = profileSnapshot.experience || [];
  if (experience.length > 0) {
    renderSectionHeader('Work Experience');

    experience.forEach(exp => {
      checkNewPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);

      const titleLine = `${exp.role} — ${exp.company}`;
      doc.text(titleLine, margin, y);
      linesExtracted.push(titleLine);

      const dateLine = `${exp.startDate} – ${exp.endDate || 'Present'}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(dateLine, pageWidth - margin, y, { align: 'right' });
      linesExtracted.push(dateLine);
      y += 4.5;

      if (exp.highlights && exp.highlights.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.2);
        doc.setTextColor(40, 40, 40);

        exp.highlights.forEach(bullet => {
          const bulletLines = doc.splitTextToSize(`•  ${bullet}`, maxLineWidth - 3);
          checkNewPage(bulletLines.length * 4 + 1);
          doc.text(bulletLines, margin + 2, y);
          bulletLines.forEach((l: string) => linesExtracted.push(l));
          y += bulletLines.length * 4 + 1;
        });
      }
      y += 3;
    });
    y += 2;
  }

  // --------------------------------------------------------------------------
  // 5. PROJECTS
  // --------------------------------------------------------------------------
  const projects = profileSnapshot.projects || [];
  if (projects.length > 0) {
    renderSectionHeader('Key Projects');

    projects.forEach(proj => {
      checkNewPage(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.title, margin, y);
      linesExtracted.push(proj.title);
      y += 4.5;

      if (proj.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.2);
        doc.setTextColor(40, 40, 40);
        const descLines = doc.splitTextToSize(proj.description, maxLineWidth);
        checkNewPage(descLines.length * 4 + 1);
        doc.text(descLines, margin, y);
        descLines.forEach((l: string) => linesExtracted.push(l));
        y += descLines.length * 4 + 2;
      }

      if (proj.technologies && proj.technologies.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.8);
        doc.setTextColor(70, 70, 70);
        const techLine = `Technologies: ${proj.technologies.join(', ')}`;
        doc.text(techLine, margin, y);
        linesExtracted.push(techLine);
        y += 4.5;
      }
      y += 2;
    });
    y += 2;
  }

  // --------------------------------------------------------------------------
  // 6. EDUCATION
  // --------------------------------------------------------------------------
  const education = profileSnapshot.education || [];
  if (education.length > 0) {
    renderSectionHeader('Education');

    education.forEach(edu => {
      checkNewPage(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(15, 23, 42);
      const eduTitle = `${edu.degree} in ${edu.fieldOfStudy}`;
      doc.text(eduTitle, margin, y);
      linesExtracted.push(eduTitle);

      const dateLine = `${edu.startDate} – ${edu.endDate}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(dateLine, pageWidth - margin, y, { align: 'right' });
      linesExtracted.push(dateLine);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.2);
      doc.setTextColor(50, 50, 50);
      doc.text(edu.institution, margin, y);
      linesExtracted.push(edu.institution);
      y += 5.5;
    });
    y += 2;
  }

  // --------------------------------------------------------------------------
  // 7. CERTIFICATIONS
  // --------------------------------------------------------------------------
  const certifications = profileSnapshot.certifications || [];
  if (certifications.length > 0) {
    renderSectionHeader('Certifications');

    certifications.forEach(cert => {
      checkNewPage(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(cert.name, margin, y);
      linesExtracted.push(cert.name);

      const issuerLine = `${cert.issuer || ''} ${cert.issueDate || (cert as any).date ? `(${cert.issueDate || (cert as any).date})` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(issuerLine, pageWidth - margin, y, { align: 'right' });
      linesExtracted.push(issuerLine);
      y += 5;
    });
  }

  // Output PDF as Blob with explicit application/pdf MIME type
  const pdfBlob = doc.output('blob');
  const fileName = generatePdfFileName(candidateName, jobTitle);
  const pdfText = linesExtracted.join('\n');
  const pageCount = (doc as any).internal.getNumberOfPages();

  return {
    blob: pdfBlob,
    fileName,
    pdfText,
    pageCount
  };
}

export interface GenerateCoverLetterPdfOptions {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateLocation?: string;
  jobTitle: string;
  normalizedJobTitle?: string;
  companyName: string;
  coverLetterContent: string;
  dateStr?: string;
}

export function generateCoverLetterFileName(candidateName: string, companyName: string, jobTitle: string): string {
  const cleanCandidate = (candidateName || 'Candidate')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  const cleanCompany = (companyName || 'Company')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  const cleanRole = (jobTitle || 'Role')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `${cleanCandidate}_Cover_Letter_${cleanCompany}_${cleanRole}.pdf`;
}

/**
 * Generates an ATS-friendly, machine-readable binary PDF for AG-005 Cover Letters
 */
export async function generateCoverLetterPdfDocument(
  options: GenerateCoverLetterPdfOptions
): Promise<GeneratedPdfResult> {
  const {
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateLocation,
    jobTitle,
    companyName,
    coverLetterContent,
    dateStr
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18; // 18mm margin
  const maxLineWidth = pageWidth - margin * 2;

  let y = margin;
  const linesExtracted: string[] = [];

  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. CANDIDATE HEADER
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(candidateName.toUpperCase(), margin, y);
  linesExtracted.push(candidateName.toUpperCase());
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);

  const contactParts: string[] = [];
  if (candidateEmail) contactParts.push(candidateEmail);
  if (candidatePhone) contactParts.push(candidatePhone);
  if (candidateLocation) contactParts.push(candidateLocation);

  const contactLine = contactParts.join('  |  ');
  if (contactLine) {
    doc.text(contactLine, margin, y);
    linesExtracted.push(contactLine);
    y += 5;
  }

  // Horizontal Rule
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // 2. DATE & RECIPIENT BLOCK
  const todayStr = dateStr || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(todayStr, margin, y);
  linesExtracted.push(todayStr);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Hiring Team`, margin, y);
  linesExtracted.push('Hiring Team');
  y += 4.5;

  doc.text(companyName, margin, y);
  linesExtracted.push(companyName);
  y += 6;

  const displayRole = options.normalizedJobTitle || jobTitle;

  // 3. SUBJECT LINE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  const subjectLine = `SUBJECT: Application for ${displayRole}`;
  doc.text(subjectLine, margin, y);
  linesExtracted.push(subjectLine);
  y += 7;

  // 4. COVER LETTER BODY PARAGRAPHS
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);

  let bodyText = coverLetterContent
    .replace(/^Dear\s+.*?,?\n*/i, '')
    .replace(/Sincerely,?\s*[\s\S]*$/i, '')
    .trim();

  const salutation = `Dear ${companyName} Hiring Team,`;
  doc.setFont('helvetica', 'bold');
  doc.text(salutation, margin, y);
  linesExtracted.push(salutation);
  y += 6;

  doc.setFont('helvetica', 'normal');
  const rawParagraphs = bodyText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  rawParagraphs.forEach(p => {
    const wrappedLines = doc.splitTextToSize(p, maxLineWidth);
    checkNewPage(wrappedLines.length * 4.8 + 4);
    doc.text(wrappedLines, margin, y);
    wrappedLines.forEach((l: string) => linesExtracted.push(l));
    y += wrappedLines.length * 4.8 + 4;
  });

  // 5. CLOSING
  checkNewPage(14);
  y += 2;
  doc.setFont('helvetica', 'normal');
  doc.text('Sincerely,', margin, y);
  linesExtracted.push('Sincerely,');
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(candidateName, margin, y);
  linesExtracted.push(candidateName);

  const pdfBlob = doc.output('blob');
  const fileName = generateCoverLetterFileName(candidateName, companyName, displayRole);
  const pdfText = linesExtracted.join('\n');
  const pageCount = (doc as any).internal.getNumberOfPages();

  return {
    blob: pdfBlob,
    fileName,
    pdfText,
    pageCount
  };
}

