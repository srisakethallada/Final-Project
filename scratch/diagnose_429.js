import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===========================================================');
console.log('EXPERIENTIAL LABS 429 RESPONSE DIAGNOSIS');
console.log('===========================================================');

async function diagnose429() {
  const rootDir = path.resolve(__dirname, '..');
  const envLocalPath = path.join(rootDir, '.env.local');

  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const match = envContent.match(/(?:EXPLABS_API_KEY|OPENAI_API_KEY)\s*=\s*(.+)/);
  const apiKey = match ? match[1].trim() : '';

  const endpoint = 'https://api.experientiallabs.ai/v1/chat/completions';
  const requestBody = {
    model: 'gpt-6-astra',
    messages: [
      { role: 'user', content: 'Respond with JSON: {"status": "ok"}' }
    ],
    response_format: { type: 'json_object' }
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`[INFO] Response Status: ${res.status} ${res.statusText}`);

    // Extract all headers safely
    const headersObj = {};
    res.headers.forEach((value, key) => {
      // Redact sensitive headers if any
      if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('cookie') || key.toLowerCase().includes('key')) {
        headersObj[key] = '[REDACTED]';
      } else {
        headersObj[key] = value;
      }
    });

    console.log('\n--- HTTP RESPONSE HEADERS ---');
    console.log(JSON.stringify(headersObj, null, 2));

    const text = await res.text();
    
    // Redact apiKey from response text if present
    const safeText = apiKey ? text.replaceAll(apiKey, '[REDACTED_API_KEY]') : text;

    console.log('\n--- HTTP RESPONSE BODY ---');
    console.log(safeText);

  } catch (err) {
    console.error('Diagnosis request failed:', err.message || err);
  }
}

diagnose429().catch(err => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
