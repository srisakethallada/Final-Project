// ============================================================================
// AG-001 RESUME PARSER SERVICE
// Extracts readable text and structural content from PDF, DOC, DOCX, & Image files.
// ============================================================================

export interface ParsedDocument {
  rawText: string;
  fileType: 'PDF' | 'DOC' | 'DOCX' | 'IMAGE';
  fileName: string;
  fileSize: number;
  extractedAt: string;
  base64Data?: string;
  mimeType: string;
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
 * Extracts plain text from DOCX (ZIP archive containing word/document.xml)
 */
const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const rawString = textDecoder.decode(bytes);

    // Extract text between XML tags in word/document.xml or stream
    const xmlTagsRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let match;
    const extractedParagraphs: string[] = [];
    let currentLine = '';

    while ((match = xmlTagsRegex.exec(rawString)) !== null) {
      const textChunk = match[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      currentLine += textChunk;
      if (currentLine.length > 80 || textChunk.endsWith('.') || textChunk.endsWith(':')) {
        extractedParagraphs.push(currentLine.trim());
        currentLine = '';
      }
    }
    if (currentLine.trim()) {
      extractedParagraphs.push(currentLine.trim());
    }

    const docxText = extractedParagraphs.join('\n');
    if (docxText.length > 50) {
      return docxText;
    }
  } catch (err) {
    console.warn('DOCX XML stream extraction note:', err);
  }

  // Fallback text extraction for DOCX
  const text = await file.text();
  return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Extracts plain text content from PDF file streams
 */
const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('latin1');
    const rawContent = textDecoder.decode(bytes);

    const textPieces: string[] = [];
    
    // Match text within PDF streams (Tj, TJ commands and text objects)
    const tjRegex = /\(([^()]*)\)\s*Tj/g;
    let match;
    while ((match = tjRegex.exec(rawContent)) !== null) {
      if (match[1] && match[1].trim().length > 1) {
        textPieces.push(match[1]);
      }
    }

    // Match TJ array text streams
    const arrayTjRegex = /\[\s*\(([^()]*)\)\s*\]\s*TJ/g;
    while ((match = arrayTjRegex.exec(rawContent)) !== null) {
      if (match[1] && match[1].trim().length > 1) {
        textPieces.push(match[1]);
      }
    }

    const pdfText = textPieces.join(' ').replace(/\\\(|\x5C\)/g, '').replace(/\s+/g, ' ').trim();
    if (pdfText.length > 50) {
      return pdfText;
    }
  } catch (err) {
    console.warn('PDF stream extraction note:', err);
  }

  // Fallback string extraction
  const rawText = await file.text();
  const printable = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  return printable;
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
      // Strip data URL prefix if present
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

  if (fileType === 'DOCX') {
    rawText = await extractTextFromDocx(file);
  } else if (fileType === 'PDF') {
    rawText = await extractTextFromPdf(file);
  } else if (fileType === 'DOC') {
    const text = await file.text();
    rawText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  } else if (fileType === 'IMAGE') {
    rawText = `[Image Resume File: ${file.name}. Content sent via Multimodal Vision OCR to LLM Analysis pipeline.]`;
  }

  // Ensure minimum extracted text content length or structural metadata
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
    mimeType: file.type || (fileType === 'PDF' ? 'application/pdf' : fileType === 'IMAGE' ? 'image/png' : 'application/octet-stream')
  };
};
