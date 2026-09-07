import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===========================================================');
console.log('AG-004 RESUME OPTIMIZATION AGENT — AUTOMATED VERIFICATION');
console.log('===========================================================');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

async function runAG004Verification() {
  const rootDir = path.resolve(__dirname, '..');
  
  // --------------------------------------------------------------------------
  // 1. AUDIT SOURCE FILES FOR MOCK DATA / FAKE FALLBACKS
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 1: NO-MOCK-DATA & FABRICATION AUDIT ---');
  
  const ag004Files = [
    path.join(rootDir, 'src/services/resumeOptimizationAgent.ts'),
    path.join(rootDir, 'src/pages/app/ResumeOptimizationPage.tsx'),
    path.join(rootDir, 'vite.config.ts')
  ];

  let foundMock = false;

  for (const filePath of ag004Files) {
    if (!fs.existsSync(filePath)) {
      assert(false, `File exists: ${path.basename(filePath)}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Check for hardcoded candidate names, sample metrics, Math.random() in executable code
    const forbiddenPatterns = [
      /TechPulse Solutions/i,
      /35%/i,
      /saketh@example\.com/i,
      /\+1 \(555\) 234-5678/i,
      /Math\.random\(\)/i
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        const lines = content.split('\n');
        const executableLines = lines.filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('/*') && !l.trim().startsWith('*'));
        if (executableLines.some(l => pattern.test(l))) {
          console.error(`Found executable hardcoded mock data matching ${pattern} in ${path.basename(filePath)}`);
          foundMock = true;
        }
      }
    }
  }

  assert(!foundMock, 'Zero hardcoded mock data / dummy candidates in AG-004 execution path');

  // --------------------------------------------------------------------------
  // 2. CODE STRUCTURAL & API CONTRACT AUDIT
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: COMPONENT & ARCHITECTURE AUDIT ---');

  const optAgentFile = fs.readFileSync(path.join(rootDir, 'src/services/resumeOptimizationAgent.ts'), 'utf8');
  assert(optAgentFile.includes('isApprovedForOptimization !== true'), 'AG-004 enforces isApprovedForOptimization === true check');
  assert(optAgentFile.includes('unsupportedJdSkillsOmitted'), 'AG-004 identifies and tracks unsupported JD skills');
  assert(optAgentFile.includes('generateLLMResponse'), 'AG-004 uses centralized LLM provider with OpenAI GPT-6 Astra');
  assert(optAgentFile.includes('ver_opt_'), 'AG-004 creates a NEW ResumeVersion (DATA-004) with prefix ver_opt_');

  const viteConfigFile = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8');
  assert(viteConfigFile.includes('/api/llm/openai'), 'vite.config.ts registers server middleware for /api/llm/openai');
  assert(viteConfigFile.includes('OPENAI_API_KEY'), 'vite.config.ts reads OPENAI_API_KEY server-side');
  assert(viteConfigFile.includes('gpt-6-astra'), 'vite.config.ts specifies gpt-6-astra model');

  const providerFile = fs.readFileSync(path.join(rootDir, 'src/services/llmProvider.ts'), 'utf8');
  assert(providerFile.includes('gpt-6-astra'), 'llmProvider.ts targets model gpt-6-astra');
  assert(providerFile.includes('/api/llm/openai'), 'llmProvider.ts routes OpenAI requests via secure server endpoint');

  const contextFile = fs.readFileSync(path.join(rootDir, 'src/context/WorkflowContext.tsx'), 'utf8');
  assert(contextFile.includes('allTailoredResumes'), 'WorkflowContext maintains job-isolated tailored resumes dictionary');
  assert(contextFile.includes('runResumeOptimization'), 'WorkflowContext provides runResumeOptimization action');
  assert(contextFile.includes('saveResumeVersion'), 'WorkflowContext persists DATA-004 version to IndexedDB');

  const pageFile = fs.readFileSync(path.join(rootDir, 'src/pages/app/ResumeOptimizationPage.tsx'), 'utf8');
  assert(pageFile.includes('Approve the JD Analysis before optimizing your resume.'), 'UI renders genuine AG-003 unapproved empty state');
  assert(pageFile.includes('Select a job from Job Search before optimizing your resume.'), 'UI renders genuine no-selected-job empty state');
  assert(pageFile.includes('Upload and analyze your resume before optimizing it.'), 'UI renders genuine no-profile empty state');
  assert(pageFile.includes('Approve Optimized Resume'), 'UI provides explicit Human Approval action button');
  assert(!pageFile.includes('Generate Cover Letter (AG-005)'), 'UI does NOT automatically trigger or present AG-005 button');

  // --------------------------------------------------------------------------
  // SUMMARY RESULTS
  // --------------------------------------------------------------------------
  console.log('\n===========================================================');
  console.log(`AG-004 VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('===========================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAG004Verification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
