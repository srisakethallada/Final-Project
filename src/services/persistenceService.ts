import { UserProfile, Resume, ResumeVersion, JDAnalysis, Job, JobDescription, CoverLetter } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const DB_NAME = 'AICareerOS_DB';
const DB_VERSION = 2;

const STORES = {
  PROFILES: 'user_profiles',
  RESUMES: 'resumes',
  VERSIONS: 'resume_versions',
  FILES: 'resume_files',
  JD_ANALYSES: 'jd_analyses'
};

export interface ResumeFileData {
  resumeId: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string;
  storedAt: string;
}

// ----------------------------------------------------------------------------
// IndexedDB Initialization & Management
// ----------------------------------------------------------------------------
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.warn('IndexedDB open error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.PROFILES)) {
        db.createObjectStore(STORES.PROFILES, { keyPath: 'userId' });
      }

      if (!db.objectStoreNames.contains(STORES.RESUMES)) {
        const resumeStore = db.createObjectStore(STORES.RESUMES, { keyPath: 'id' });
        resumeStore.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.VERSIONS)) {
        const versionStore = db.createObjectStore(STORES.VERSIONS, { keyPath: 'id' });
        versionStore.createIndex('userId', 'userId', { unique: false });
        versionStore.createIndex('resumeId', 'resumeId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.FILES)) {
        const fileStore = db.createObjectStore(STORES.FILES, { keyPath: 'resumeId' });
        fileStore.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.JD_ANALYSES)) {
        const jdStore = db.createObjectStore(STORES.JD_ANALYSES, { keyPath: 'jobId' });
        jdStore.createIndex('userId', 'userId', { unique: false });
      }
    };
  });
}

// Helpers for IndexedDB Operations
async function idbGet<T>(storeName: string, key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve((request.result as T) || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`IndexedDB read error on ${storeName}:`, err);
    return null;
  }
}

async function idbGetByIndex<T>(storeName: string, indexName: string, key: string): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise<T[]>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(key);
      request.onsuccess = () => resolve((request.result as T[]) || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`IndexedDB read by index error on ${storeName}:`, err);
    return [];
  }
}

async function idbPut<T>(storeName: string, item: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`IndexedDB write error on ${storeName}:`, err);
  }
}

// ----------------------------------------------------------------------------
// PERSISTENCE SERVICE IMPLEMENTATION (DATA-002, DATA-003, DATA-004)
// ----------------------------------------------------------------------------
export const persistenceService = {
  // --------------------------------------------------------------------------
  // DATA-002 USER PROFILE PERSISTENCE
  // --------------------------------------------------------------------------
  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (!profile || !profile.userId) return;

    // 1. IndexedDB Write
    await idbPut(STORES.PROFILES, profile);

    // 2. localStorage Backup
    try {
      localStorage.setItem(`user_profile_${profile.userId}`, JSON.stringify(profile));
      localStorage.setItem('active_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('localStorage profile backup write warning:', e);
    }

    // 3. Supabase Synchronization if configured
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_profiles')
          .upsert({
            id: profile.id,
            user_id: profile.userId,
            headline: profile.headline,
            phone: profile.phone,
            location: profile.location,
            bio: profile.bio,
            job_role: profile.jobRole,
            job_role_confidence: profile.jobRoleConfidence,
            completeness: profile.completeness,
            profile_data: profile,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Supabase profile sync note:', err);
      }
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;

    // 1. Try IndexedDB
    let profile = await idbGet<UserProfile>(STORES.PROFILES, userId);

    // 2. Fallback to localStorage
    if (!profile) {
      try {
        const raw = localStorage.getItem(`user_profile_${userId}`) || localStorage.getItem('active_user_profile');
        if (raw) {
          profile = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('localStorage profile backup read warning:', e);
      }
    }

    // 3. Fallback to Supabase if configured
    if (!profile && isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('profile_data')
          .eq('user_id', userId)
          .single();

        if (data?.profile_data) {
          profile = data.profile_data as UserProfile;
          // Re-persist locally for speed
          await this.saveUserProfile(profile);
        }
      } catch (err) {
        console.warn('Supabase profile fetch note:', err);
      }
    }

    return profile;
  },

  // --------------------------------------------------------------------------
  // DATA-003 RESUME PERSISTENCE
  // --------------------------------------------------------------------------
  async saveResume(resume: Resume): Promise<void> {
    if (!resume || !resume.id || !resume.userId) return;

    // 1. IndexedDB Write
    await idbPut(STORES.RESUMES, resume);

    // 2. localStorage Backup
    try {
      const existingResumes = await this.getResumes(resume.userId);
      const updated = [resume, ...existingResumes.filter(r => r.id !== resume.id)];
      localStorage.setItem(`user_resumes_${resume.userId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage resume backup write warning:', e);
    }

    // 3. Supabase Sync if configured
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('resumes')
          .upsert({
            id: resume.id,
            user_id: resume.userId,
            original_file_name: resume.originalFileName,
            file_type: resume.fileType,
            file_size: resume.fileSize,
            upload_date: resume.uploadDate,
            current_version_id: resume.currentVersionId
          });
      } catch (err) {
        console.warn('Supabase resume sync note:', err);
      }
    }
  },

  async getResumes(userId: string): Promise<Resume[]> {
    if (!userId) return [];

    // 1. Try IndexedDB
    let list = await idbGetByIndex<Resume>(STORES.RESUMES, 'userId', userId);

    // 2. Fallback to localStorage
    if (!list || list.length === 0) {
      try {
        const raw = localStorage.getItem(`user_resumes_${userId}`);
        if (raw) {
          list = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('localStorage resumes read warning:', e);
      }
    }

    return list || [];
  },

  // --------------------------------------------------------------------------
  // DATA-004 RESUME VERSION PERSISTENCE
  // --------------------------------------------------------------------------
  async saveResumeVersion(version: ResumeVersion, userId: string): Promise<void> {
    if (!version || !version.id) return;

    const record = {
      ...version,
      userId: userId || 'usr_current'
    };

    // 1. IndexedDB Write
    await idbPut(STORES.VERSIONS, record);

    // 2. localStorage Backup
    try {
      const existingVersions = await this.getResumeVersions(userId);
      const updated = [record, ...existingVersions.filter(v => v.id !== version.id)];
      localStorage.setItem(`user_versions_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage versions backup write warning:', e);
    }

    // 3. Supabase Sync if configured
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('resume_versions')
          .upsert({
            id: version.id,
            resume_id: version.resumeId,
            user_id: userId,
            version_name: version.versionName,
            is_original: version.isOriginal,
            created_at: version.createdAt,
            detected_job_role: version.detectedJobRole,
            raw_text: version.rawText,
            version_data: version
          });
      } catch (err) {
        console.warn('Supabase resume version sync note:', err);
      }
    }
  },

  async getResumeVersions(userId: string): Promise<ResumeVersion[]> {
    if (!userId) return [];

    // 1. Try IndexedDB
    let list = await idbGetByIndex<ResumeVersion>(STORES.VERSIONS, 'userId', userId);

    // 2. Fallback to localStorage
    if (!list || list.length === 0) {
      try {
        const raw = localStorage.getItem(`user_versions_${userId}`);
        if (raw) {
          list = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('localStorage versions read warning:', e);
      }
    }

    // Sort by createdAt descending
    return (list || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // --------------------------------------------------------------------------
  // RESUME FILE PERSISTENCE (RAW FILE DATA URL STORAGE)
  // --------------------------------------------------------------------------
  async saveResumeFile(resumeId: string, userId: string, fileData: { fileName: string; fileType: string; fileSize: number; dataUrl: string }): Promise<void> {
    if (!resumeId) return;

    const record: ResumeFileData = {
      resumeId,
      userId: userId || 'usr_current',
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileSize: fileData.fileSize,
      dataUrl: fileData.dataUrl,
      storedAt: new Date().toISOString()
    };

    // 1. IndexedDB Store
    await idbPut(STORES.FILES, record);

    // 2. localStorage Backup (if size allows)
    try {
      if (fileData.dataUrl.length < 2 * 1024 * 1024) {
        localStorage.setItem(`resume_file_${resumeId}`, JSON.stringify(record));
      }
    } catch (e) {
      console.warn('localStorage file backup skipped due to quota:', e);
    }
  },

  async getResumeFile(resumeId: string): Promise<ResumeFileData | null> {
    if (!resumeId) return null;

    // 1. Try IndexedDB
    let fileData = await idbGet<ResumeFileData>(STORES.FILES, resumeId);

    // 2. Fallback to localStorage
    if (!fileData) {
      try {
        const raw = localStorage.getItem(`resume_file_${resumeId}`);
        if (raw) {
          fileData = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('localStorage file read warning:', e);
      }
    }

    return fileData;
  },

  // --------------------------------------------------------------------------
  // AG-003 JD ANALYSIS PERSISTENCE (PER JOB ID)
  // --------------------------------------------------------------------------
  async saveJdAnalysis(analysis: JDAnalysis): Promise<void> {
    if (!analysis || !analysis.jobId) return;

    // 1. IndexedDB Store
    await idbPut(STORES.JD_ANALYSES, analysis);

    // 2. localStorage Backup
    try {
      const raw = localStorage.getItem(`user_jd_analyses_${analysis.userId}`) || '{}';
      const dict = JSON.parse(raw);
      dict[analysis.jobId] = analysis;
      localStorage.setItem(`user_jd_analyses_${analysis.userId}`, JSON.stringify(dict));
    } catch (e) {
      console.warn('localStorage JD analysis backup write warning:', e);
    }

    // 3. Supabase Sync if configured
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('jd_analyses')
          .upsert({
            id: analysis.id,
            job_id: analysis.jobId,
            user_id: analysis.userId,
            match_score: analysis.matchScore,
            is_approved: analysis.isApprovedForOptimization,
            analysis_data: analysis,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Supabase JD analysis sync note:', err);
      }
    }
  },

  async getAllJdAnalyses(userId: string): Promise<Record<string, JDAnalysis>> {
    if (!userId) return {};

    const dict: Record<string, JDAnalysis> = {};

    // 1. Try IndexedDB
    const list = await idbGetByIndex<JDAnalysis>(STORES.JD_ANALYSES, 'userId', userId);
    if (list && list.length > 0) {
      list.forEach(item => {
        if (item.jobId) dict[item.jobId] = item;
      });
      return dict;
    }

    // 2. Fallback to localStorage
    try {
      const raw = localStorage.getItem(`user_jd_analyses_${userId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('localStorage JD analyses read warning:', e);
    }

    return dict;
  },

  // --------------------------------------------------------------------------
  // AG-002 JOBS & JDS PERSISTENCE
  // --------------------------------------------------------------------------
  async saveJobs(jobs: Job[], userId: string): Promise<void> {
    if (!userId) return;
    try {
      localStorage.setItem(`user_jobs_${userId}`, JSON.stringify(jobs));
    } catch (e) {
      console.warn('localStorage jobs write warning:', e);
    }
  },

  async getJobs(userId: string): Promise<Job[]> {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`user_jobs_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('localStorage jobs read warning:', e);
    }
    return [];
  },

  async saveJds(jds: Record<string, JobDescription>, userId: string): Promise<void> {
    if (!userId) return;
    try {
      localStorage.setItem(`user_jds_${userId}`, JSON.stringify(jds));
    } catch (e) {
      console.warn('localStorage jds write warning:', e);
    }
  },

  async getJds(userId: string): Promise<Record<string, JobDescription>> {
    if (!userId) return {};
    try {
      const raw = localStorage.getItem(`user_jds_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('localStorage jds read warning:', e);
    }
    return {};
  },

  // --------------------------------------------------------------------------
  // AG-005 COVER LETTER PERSISTENCE (DATA-010)
  // --------------------------------------------------------------------------
  async saveCoverLetter(coverLetter: CoverLetter): Promise<void> {
    if (!coverLetter || !coverLetter.userId || !coverLetter.jobId) return;

    try {
      const existing = await this.getCoverLetters(coverLetter.userId);
      const dict: Record<string, CoverLetter> = {};
      existing.forEach(cl => { dict[cl.jobId] = cl; });
      dict[coverLetter.jobId] = coverLetter;

      localStorage.setItem(`user_cover_letters_${coverLetter.userId}`, JSON.stringify(dict));
    } catch (e) {
      console.warn('localStorage cover letter write warning:', e);
    }
  },

  async getCoverLetters(userId: string): Promise<CoverLetter[]> {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`user_cover_letters_${userId}`);
      if (raw) {
        const dict: Record<string, CoverLetter> = JSON.parse(raw);
        return Object.values(dict);
      }
    } catch (e) {
      console.warn('localStorage cover letters read warning:', e);
    }
    return [];
  },

  async getCoverLetterForJob(userId: string, jobId: string): Promise<CoverLetter | null> {
    if (!userId || !jobId) return null;
    try {
      const raw = localStorage.getItem(`user_cover_letters_${userId}`);
      if (raw) {
        const dict: Record<string, CoverLetter> = JSON.parse(raw);
        return dict[jobId] || null;
      }
    } catch (e) {
      console.warn('localStorage cover letter fetch warning:', e);
    }
    return null;
  }
};
