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
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(
              apiKey
            )}`;

            const geminiResponse = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(parsedPayload)
            });

            const responseData = await geminiResponse.text();
            res.statusCode = geminiResponse.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(responseData);
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
