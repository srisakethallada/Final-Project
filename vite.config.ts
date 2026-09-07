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
              'gemini-1.5-flash'
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

      // Endpoint: AG-002 Job Search Agent API Proxy
      server.middlewares.use('/api/search-jobs', async (req: any, res: any, next: any) => {
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
            const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
            const apiKey = (
              env.RAPIDAPI_KEY ||
              env.JSEARCH_API_KEY ||
              env.JOB_API_KEY ||
              process.env.RAPIDAPI_KEY ||
              process.env.JSEARCH_API_KEY ||
              process.env.JOB_API_KEY ||
              ''
            ).trim();

            if (!apiKey || apiKey === 'your_rapidapi_key_here' || apiKey === 'your_job_api_key_here') {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      'Server-side Job Search API key required.\n\nPlease paste your RapidAPI / JSearch API key into:\n.env.local\n\nVariable:\nRAPIDAPI_KEY'
                  }
                })
              );
              return;
            }

            const parsedPayload = JSON.parse(body || '{}');
            const searchQuery = (parsedPayload.query || 'Software Engineer').trim();
            const page = parsedPayload.page || 1;

            const endpoint = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(
              searchQuery
            )}&page=${page}&num_pages=1`;

            const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
              }
            });

            const responseData = await response.text();
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(responseData);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: {
                  message: err.message || 'Server error executing AG-002 Job Search request.'
                }
              })
            );
          }
        });
      });

      // Endpoint: AG-003 JD Analysis & Match Score LLM Proxy
      server.middlewares.use('/api/analyze-jd', async (req: any, res: any, next: any) => {
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

            const parsedPayload = JSON.parse(body || '{}');

            const CANDIDATE_MODELS = [
              'gemini-1.5-flash'
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
              res.end(
                lastErrorText ||
                  JSON.stringify({
                    error: { message: 'Gemini LLM service unavailable for AG-003 JD Analysis.' }
                  })
              );
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: {
                  message: err.message || 'Server error executing AG-003 LLM analysis.'
                }
              })
            );
          }
        });
      });

      // Endpoint: AG-004 Resume Optimization LLM Proxy
      server.middlewares.use('/api/optimize-resume', async (req: any, res: any, next: any) => {
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

            const parsedPayload = JSON.parse(body || '{}');

            const CANDIDATE_MODELS = [
              'gemini-1.5-flash'
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
              res.end(
                lastErrorText ||
                  JSON.stringify({
                    error: { message: 'Gemini LLM service unavailable for AG-004 Resume Optimization.' }
                  })
              );
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: {
                  message: err.message || 'Server error executing AG-004 LLM optimization.'
                }
              })
            );
          }
        });
      });

      // Endpoint: Centralized Experiential Labs GPT-6 Astra LLM Server Middleware
      server.middlewares.use('/api/llm/openai', async (req: any, res: any, next: any) => {
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
            const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
            const apiKey = (
              env.EXPLABS_API_KEY ||
              env.OPENAI_API_KEY ||
              process.env.EXPLABS_API_KEY ||
              process.env.OPENAI_API_KEY ||
              ''
            ).trim();

            if (
              !apiKey ||
              apiKey === 'your_experiential_labs_api_key_here' ||
              apiKey === 'your_openai_api_key_here' ||
              apiKey === 'PASTE_YOUR_OPENAI_API_KEY_HERE'
            ) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      'Server-side Experiential Labs API key required.\n\nPlease paste your Experiential Labs API key into:\n.env.local\n\nVariable:\nEXPLABS_API_KEY'
                  }
                })
              );
              return;
            }

            const parsedPayload = JSON.parse(body || '{}');
            const targetModel = parsedPayload.model || 'gpt-6-astra';

            const requestBody: Record<string, any> = {
              model: targetModel,
              messages: []
            };

            if (parsedPayload.systemInstruction) {
              requestBody.messages.push({
                role: 'system',
                content: parsedPayload.systemInstruction
              });
            }

            if (parsedPayload.prompt) {
              requestBody.messages.push({
                role: 'user',
                content: parsedPayload.prompt
              });
            }

            if (parsedPayload.responseFormat === 'json') {
              requestBody.response_format = { type: 'json_object' };
            }

            const explabsResponse = await fetch('https://api.experientiallabs.ai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify(requestBody)
            });

            const responseText = await explabsResponse.text();
            res.statusCode = explabsResponse.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(responseText);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: {
                  message: err.message || 'Server error executing Experiential Labs LLM request.'
                }
              })
            );
          }
        });
      });

      // Endpoint: Connection & Model Verification Test for Experiential Labs GPT-6 Astra
      server.middlewares.use('/api/llm/openai-test', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        try {
          const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
          const apiKey = (
            env.EXPLABS_API_KEY ||
            env.OPENAI_API_KEY ||
            process.env.EXPLABS_API_KEY ||
            process.env.OPENAI_API_KEY ||
            ''
          ).trim();

          if (
            !apiKey ||
            apiKey === 'your_experiential_labs_api_key_here' ||
            apiKey === 'your_openai_api_key_here' ||
            apiKey === 'PASTE_YOUR_OPENAI_API_KEY_HERE'
          ) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: {
                  message:
                    'Server-side Experiential Labs API key required.\n\nPlease paste your Experiential Labs API key into:\n.env.local\n\nVariable:\nEXPLABS_API_KEY'
                }
              })
            );
            return;
          }

          // Step 1: GET https://api.experientiallabs.ai/v1/models (Requirement 19 & 20)
          const modelsResponse = await fetch('https://api.experientiallabs.ai/v1/models', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`
            }
          });

          let modelsAuthPass = false;
          let gpt6AstraAvailable = false;
          let modelsData: any = null;

          if (modelsResponse.ok) {
            modelsAuthPass = true;
            modelsData = await modelsResponse.json();
            const modelsList: any[] = modelsData?.data || modelsData || [];
            gpt6AstraAvailable = modelsList.some(
              (m: any) => m.id === 'gpt-6-astra' || m.name === 'gpt-6-astra' || String(m).includes('gpt-6-astra')
            );
          }

          // Step 2: POST https://api.experientiallabs.ai/v1/chat/completions (Requirement 21)
          const testPayload = {
            model: 'gpt-6-astra',
            messages: [{ role: 'user', content: 'Respond with JSON: {"status": "ok"}' }],
            response_format: { type: 'json_object' }
          };

          const completionResponse = await fetch('https://api.experientiallabs.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(testPayload)
          });

          const responseText = await completionResponse.text();

          res.statusCode = completionResponse.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: completionResponse.ok,
              modelsAuthPass,
              gpt6AstraAvailable,
              status: completionResponse.status,
              gatewayEndpoint: 'https://api.experientiallabs.ai/v1/chat/completions',
              modelRequested: 'gpt-6-astra',
              rawResponse: responseText
            })
          );
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error: {
                message: err.message || 'Server error executing Experiential Labs connection test.'
              }
            })
          );
        }
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
