import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===========================================================');
console.log('EXPERIENTIAL LABS GPT-6 ASTRA — CONNECTION & SECURITY TEST');
console.log('===========================================================');

async function runExperientialLabsTest() {
  const rootDir = path.resolve(__dirname, '..');
  const envLocalPath = path.join(rootDir, '.env.local');

  if (!fs.existsSync(envLocalPath)) {
    console.error('[FAIL] .env.local file not found');
    process.exit(1);
  }

  // 1. Read EXPLABS_API_KEY server-side
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const match = envContent.match(/(?:EXPLABS_API_KEY|OPENAI_API_KEY)\s*=\s*(.+)/);
  const apiKey = match ? match[1].trim() : '';

  const isDetected = Boolean(
    apiKey &&
    apiKey !== 'your_experiential_labs_api_key_here' &&
    apiKey !== 'your_openai_api_key_here' &&
    apiKey !== 'PASTE_YOUR_OPENAI_API_KEY_HERE'
  );

  if (!isDetected) {
    console.error('[FAIL] EXPLABS_API_KEY not detected or still placeholder in .env.local');
    process.exit(1);
  }

  console.log('[PASS] EXPLABS_API_KEY detected server-side in .env.local');

  const baseUrl = 'https://api.experientiallabs.ai/v1';

  // 2. Requirement 19 & 20: Verify authentication and gpt-6-astra model availability via GET /v1/models
  console.log(`\n[STEP 1] Verifying authentication via GET ${baseUrl}/models...`);
  
  let modelsAuthPass = false;
  let gpt6AstraAvailable = false;
  let modelsStatus = 0;
  let modelsError = '';

  try {
    const modelsRes = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    modelsStatus = modelsRes.status;
    const modelsText = await modelsRes.text();

    if (modelsRes.ok) {
      modelsAuthPass = true;
      try {
        const parsed = JSON.parse(modelsText);
        const dataList = parsed.data || parsed.models || parsed || [];
        gpt6AstraAvailable = Array.isArray(dataList) && dataList.some((m) => {
          const id = typeof m === 'object' ? m.id || m.name : String(m);
          return id === 'gpt-6-astra' || id.includes('gpt-6-astra');
        });
      } catch (e) {
        // If text contains gpt-6-astra
        gpt6AstraAvailable = modelsText.includes('gpt-6-astra');
      }
    } else {
      modelsError = modelsText;
    }
  } catch (err) {
    modelsError = err.message || 'Models GET request failed';
  }

  console.log(`[INFO] GET /v1/models HTTP status: ${modelsStatus}`);
  console.log(`[INFO] Experiential /v1/models auth: ${modelsAuthPass ? 'PASS' : 'FAIL'}`);
  console.log(`[INFO] gpt-6-astra model available: ${gpt6AstraAvailable ? 'YES' : 'NO'}`);

  // 3. Requirement 21 & 22: ONE minimal real test completion using POST /v1/chat/completions with model gpt-6-astra
  console.log(`\n[STEP 2] Making 1 minimal test completion via POST ${baseUrl}/chat/completions...`);

  const requestedModel = 'gpt-6-astra';
  const requestBody = {
    model: requestedModel,
    messages: [
      { role: 'user', content: 'Respond with JSON: {"status": "connected"}' }
    ],
    response_format: { type: 'json_object' }
  };

  let completionStatus = 0;
  let completionSuccess = false;
  let completionText = '';
  let completionError = '';

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const compRes = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      completionStatus = compRes.status;
      completionText = await compRes.text();

      if (compRes.ok) {
        completionSuccess = true;
        break;
      } else {
        completionError = completionText;
        if (compRes.status === 429 && attempt < 3) {
          console.log(`[INFO] Attempt ${attempt} returned HTTP 429 (Rate Limit). Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        break;
      }
    } catch (err) {
      completionError = err.message || 'Completion request failed';
      break;
    }
  }

  console.log(`[INFO] POST /v1/chat/completions HTTP status: ${completionStatus}`);
  console.log(`[INFO] Test completion: ${completionSuccess ? 'PASS' : 'FAIL'}`);

  // 4. SECRET EXPOSURE AUDIT & GIT AUDIT
  console.log('\n--- SECRET EXPOSURE & GIT AUDIT ---');
  let secretLeaked = false;

  if (completionText.includes(apiKey) || modelsError.includes(apiKey) || completionError.includes(apiKey)) {
    console.error('[FAIL] CRITICAL: API key was exposed in API responses or error strings!');
    secretLeaked = true;
  }

  // Check frontend src files
  const srcFiles = fs.readdirSync(path.join(rootDir, 'src'), { recursive: true });
  let frontendExposed = false;
  for (const relativeFile of srcFiles) {
    const fullPath = path.join(rootDir, 'src', relativeFile);
    if (fs.statSync(fullPath).isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      const code = fs.readFileSync(fullPath, 'utf8');
      if (code.includes(apiKey)) {
        console.error(`[FAIL] CRITICAL: API key found in frontend source file ${relativeFile}!`);
        frontendExposed = true;
        secretLeaked = true;
      }
    }
  }

  // Check .gitignore
  const gitignorePath = path.join(rootDir, '.gitignore');
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const gitIgnored = gitignoreContent.includes('.env.local');

  console.log(`[INFO] Secret exposure audit: ${secretLeaked ? 'FAIL' : 'PASS'}`);
  console.log(`[INFO] Frontend exposure audit: ${frontendExposed ? 'FAIL' : 'PASS'}`);
  console.log(`[INFO] Git exposure audit (.env.local ignored): ${gitIgnored ? 'PASS' : 'FAIL'}`);

  // 5. SUMMARY OF TEST METRICS FOR FINAL REPORT
  console.log('\n===========================================================');
  console.log('SUMMARY METRICS FOR REPORT');
  console.log('===========================================================');
  console.log(`EXPLABS_API_KEY detected: ${isDetected ? 'YES' : 'NO'}`);
  console.log(`Experiential /v1/models authentication: ${modelsAuthPass ? 'PASS' : 'FAIL'}`);
  console.log(`gpt-6-astra available: ${gpt6AstraAvailable ? 'YES' : 'NO'}`);
  console.log(`Test completion: ${completionSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`HTTP status: ${completionStatus}`);
  console.log(`Gateway endpoint: ${baseUrl}/chat/completions`);
  console.log(`Model requested: ${requestedModel}`);
  console.log(`Model accepted: ${completionSuccess ? 'YES' : 'NO'}`);
  console.log(`Secret exposure: ${secretLeaked ? 'FAIL' : 'PASS'}`);
  console.log(`Frontend exposure: ${frontendExposed ? 'FAIL' : 'PASS'}`);
  console.log(`Git exposure: ${gitIgnored ? 'PASS' : 'FAIL'}`);
}

runExperientialLabsTest().catch(err => {
  console.error('Test script error:', err.message || err);
  process.exit(1);
});
