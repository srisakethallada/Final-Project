// ============================================================================
// AG-001 RESUME PARSER SERVICE (HIGH PRECISION MULTI-FORMAT EXTRACTION)
// Extracts page-by-page readable text and structural content from PDF, DOC, DOCX, & Image files.
// ============================================================================

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  // Worker configuration fallback
}

export interface ParsedDocument {
  rawText: string;
  fileType: 'PDF' | 'DOC' | 'DOCX' | 'IMAGE';
  fileName: string;
  fileSize: number;
  extractedAt: string;
  base64Data?: string;
  mimeType: string;
  pageCount?: number;
}

export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file was provided.' };
  }

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds 10MB limit. Please upload a smaller resume file.' };
  }

  const fileNameLower = file.name.toLowerCase();
  const validExtensions = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp'];
  const isValidExtension = validExtensions.some(ext => fileNameLower.endsWith(ext));

  if (!isValidExtension) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PDF, DOC, DOCX, or Image (PNG, JPG, WEBP) resume.'
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The uploaded file appears to be empty or corrupted.' };
  }

  return { valid: true };
};

export const detectFileType = (fileName: string): 'PDF' | 'DOC' | 'DOCX' | 'IMAGE' => {
  const name = fileName.toLowerCase();
  if (name.endsWith('.pdf')) return 'PDF';
  if (name.endsWith('.docx')) return 'DOCX';
  if (name.endsWith('.doc')) return 'DOC';
  return 'IMAGE';
};

/**
 * High precision page-by-page PDF text extraction using PDF.js
 */
const extractTextFromPdf = async (file: File): Promise<{ text: string; pageCount: number }> => {
  let pageCount = 1;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    pageCount = pdfDoc.numPages;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items as any[]) {
        if (!item || typeof item.str !== 'string') continue;
        
        // Preserve vertical layout line breaks
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
          pageText += ' ';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }

      if (pageText.trim()) {
        pageTexts.push(`--- PAGE ${pageNum} OF ${pageCount} ---\n${pageText.trim()}`);
      }
    }

    const fullPdfText = pageTexts.join('\n\n');
    if (fullPdfText.length > 30) {
      return { text: fullPdfText, pageCount };
    }
  } catch (err) {
    console.warn('PDF.js extraction note, falling back to stream reader:', err);
  }

  // Fallback stream reader
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('latin1');
    const rawContent = textDecoder.decode(bytes);

    const textPieces: string[] = [];
    const tjRegex = /\(([^()]*)\)\s*Tj/g;
    let match;
    while ((match = tjRegex.exec(rawContent)) !== null) {
      if (match[1] && match[1].trim().length > 1) {
        textPieces.push(match[1]);
      }
    }

    const pdfText = textPieces.join(' ').replace(/\\\(|\x5C\)/g, '').replace(/\s+/g, ' ').trim();
    if (pdfText.length > 30) {
      return { text: pdfText, pageCount };
    }
  } catch (err) {
    console.warn('PDF fallback stream error:', err);
  }

  const rawText = await file.text();
  const printable = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  return { text: printable, pageCount };
};

/**
 * Extracts plain text from DOCX using Mammoth
 */
const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (result && result.value && result.value.trim().length > 20) {
      return result.value.trim();
    }
  } catch (err) {
    console.warn('Mammoth extraction note:', err);
  }

  const text = await file.text();
  return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Convert File object to Base64 String
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Main Document Parsing entry point
 */
export const parseResumeDocument = async (file: File): Promise<ParsedDocument> => {
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Failed to validate resume document file.');
  }

  const fileType = detectFileType(file.name);
  const base64Data = await fileToBase64(file);
  let rawText = '';
  let pageCount = 1;

  if (fileType === 'DOCX') {
    rawText = await extractTextFromDocx(file);
  } else if (fileType === 'PDF') {
    const pdfRes = await extractTextFromPdf(file);
    rawText = pdfRes.text;
    pageCount = pdfRes.pageCount;
  } else if (fileType === 'DOC') {
    const text = await file.text();
    rawText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  } else if (fileType === 'IMAGE') {
    rawText = `[Image Resume File: ${file.name}. Content sent via Multimodal Vision OCR to LLM Analysis pipeline.]`;
  }

  if (!rawText || rawText.trim().length === 0) {
    rawText = `Resume File: ${file.name}\nFile Size: ${file.size} bytes\nFormat: ${fileType}`;
  }

  return {
    rawText,
    fileType,
    fileName: file.name,
    fileSize: file.size,
    extractedAt: new Date().toISOString(),
    base64Data,
    mimeType: file.type || (fileType === 'PDF' ? 'application/pdf' : fileType === 'IMAGE' ? 'image/png' : 'application/octet-stream'),
    pageCount
  };
};
