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
    // Gemini Fallback / Secondary Provider
    const res = await fetch('/api/optimize-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${request.systemInstruction ? request.systemInstruction + '\n\n' : ''}${request.prompt}`
              }
            ]
          }
        ]
      })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(
        errorJson?.error?.message || `Gemini LLM service error (HTTP ${res.status})`
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
      model: 'gemini-2.0-flash',
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
