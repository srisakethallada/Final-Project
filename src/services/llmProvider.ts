// ============================================================================
// AI CAREER OS — CENTRALIZED LLM PROVIDER SERVICE
// Primary Provider: OpenAI GPT-6 Astra
// Secondary Provider: Gemini 2.0 Flash
// ============================================================================

export type LLMProviderType = 'OPENAI' | 'GEMINI';

export interface UnifiedLLMRequest {
  provider?: LLMProviderType;
  prompt: string;
  systemInstruction?: string;
  model?: string;
  responseFormat?: 'json' | 'text';
}

export interface UnifiedLLMResponse<T = any> {
  text: string;
  provider: LLMProviderType;
  model: string;
  structuredJson?: T;
}

/**
 * Centralized LLM Generation Service
 * Invokes the secure server-side API proxy (browser never sees API keys).
 */
export async function generateLLMResponse<T = any>(
  request: UnifiedLLMRequest
): Promise<UnifiedLLMResponse<T>> {
  const provider = request.provider || 'OPENAI';
  const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';

  if (provider === 'OPENAI') {
    const res = await fetch(`${baseUrl}/api/llm/openai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: request.prompt,
        systemInstruction: request.systemInstruction,
        model: request.model || 'gpt-6-astra',
        responseFormat: request.responseFormat || 'json'
      })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(
        errorJson?.error?.message ||
          `OpenAI GPT-6 Astra service error (HTTP ${res.status})`
      );
    }

    const data = await res.json();
    const text =
      data.choices?.[0]?.message?.content ||
      data.output_text ||
      data.text ||
      '';

    let structuredJson: T | undefined = undefined;
    if (text && request.responseFormat !== 'text') {
      try {
        const cleaned = text
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/g, '')
          .trim();
        structuredJson = JSON.parse(cleaned) as T;
      } catch (e) {
        console.warn('Failed to parse structured JSON from OpenAI response:', e);
      }
    }

    return {
      text,
      provider: 'OPENAI',
      model: data.model || request.model || 'gpt-6-astra',
      structuredJson
    };
  } else {
    // Gemini Provider (Server-Side Proxy with Server-Side Secret)
    let res: Response | null = null;
    let lastErr: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const currentHost = attempt % 2 === 1 ? 'http://localhost:3000' : 'http://127.0.0.1:3000';
        const targetUrl = typeof window !== 'undefined' ? '/api/optimize-resume' : `${currentHost}/api/optimize-resume`;
        res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: request.prompt
                  }
                ]
              }
            ],
            systemInstruction: request.systemInstruction
              ? {
                  parts: [{ text: request.systemInstruction }]
                }
              : undefined,
            generationConfig: {
              temperature: 0.1,
              ...(request.responseFormat === 'json' ? { responseMimeType: 'application/json' } : {})
            }
          })
        });
        if (res && res.ok) break;
      } catch (err: any) {
        lastErr = err;
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    if (!res || !res.ok) {
      const errorJson = res ? await res.json().catch(() => ({})) : {};
      throw new Error(
        errorJson?.error?.message || (res ? `Gemini LLM service error (HTTP ${res.status})` : (lastErr?.message || 'Gemini LLM network request failed'))
      );
    }

    const data = await res.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || '';

    let structuredJson: T | undefined = undefined;
    if (text && request.responseFormat !== 'text') {
      try {
        const cleaned = text
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/g, '')
          .trim();
        structuredJson = JSON.parse(cleaned) as T;
      } catch (e) {
        console.warn('Failed to parse structured JSON from Gemini response:', e);
      }
    }

    return {
      text,
      provider: 'GEMINI',
      model: 'gemini-3.6-flash',
      structuredJson
    };
  }
}

/**
 * Minimal server-side connection test for OpenAI GPT-6 Astra (Section 16 requirement)
 */
export async function testOpenAIConnection(): Promise<{
  success: boolean;
  message: string;
  model: string;
}> {
  const res = await fetch('/api/llm/openai-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson?.error?.message || `OpenAI connection test failed (HTTP ${res.status})`
    );
  }

  return await res.json();
}
