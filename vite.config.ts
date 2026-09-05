import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Server-side API middleware plugin for AG-001 Resume Analysis Agent
function agentApiServerPlugin() {
  return {
    name: 'agent-api-server-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/analyze-resume', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            // Load environment variables server-side (including non-VITE_ server secrets)
            const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
            const apiKey = (
              env.GEMINI_API_KEY ||
              env.LLM_API_KEY ||
              process.env.GEMINI_API_KEY ||
              process.env.LLM_API_KEY ||
              ''
            ).trim();

            if (!apiKey || apiKey === 'your_gemini_api_key_here') {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      'Server-side Gemini API key required.\n\nPlease paste your Gemini API key into:\n.env.local\n\nVariable:\nGEMINI_API_KEY'
                  }
                })
              );
              return;
            }

            const parsedPayload = JSON.parse(body);

            const CANDIDATE_MODELS = [
              'gemini-2.0-flash',
              'gemini-flash-latest',
              'gemini-2.5-flash',
              'gemini-3.6-flash'
            ];

            let lastErrorText = '';
            let lastStatus = 500;
            let successResult: any = null;

            for (const model of CANDIDATE_MODELS) {
              const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
                apiKey
              )}`;

              for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                  const geminiResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(parsedPayload)
                  });

                  const responseText = await geminiResponse.text();

                  if (geminiResponse.ok) {
                    successResult = { status: 200, data: responseText };
                    break;
                  }

                  lastStatus = geminiResponse.status;
                  lastErrorText = responseText;

                  const isRetryable =
                    geminiResponse.status === 429 ||
                    geminiResponse.status === 503 ||
                    geminiResponse.status >= 500 ||
                    responseText.includes('high demand') ||
                    responseText.includes('RESOURCE_EXHAUSTED');

                  if (isRetryable && attempt < 3) {
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                    continue;
                  }

                  break;
                } catch (err: any) {
                  lastErrorText = err.message || 'Network request failed';
                  if (attempt < 3) {
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                  }
                }
              }

              if (successResult) {
                break;
              }
            }

            if (successResult) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(successResult.data);
            } else {
              res.statusCode = lastStatus || 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(lastErrorText || JSON.stringify({ error: { message: 'Gemini service is currently experiencing high demand. Please try again.' } }));
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: {
                  message: err.message || 'Server error executing AG-001 LLM analysis.'
                }
              })
            );
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), agentApiServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
