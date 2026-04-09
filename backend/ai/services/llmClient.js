const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const GOOGLE_BASE_URL = process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
const GOOGLE_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.0-flash';

const getProvider = () => {
  if (process.env.LLM_PROVIDER) {
    return process.env.LLM_PROVIDER.toLowerCase();
  }

  if (process.env.GOOGLE_AI_API_KEY) {
    return 'google';
  }

  return 'openai';
};

const isLlmConfigured = () => {
  const provider = getProvider();
  if (provider === 'google') {
    const key = process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.trim() : '';
    return Boolean(key);
  }

  return Boolean(process.env.OPENAI_API_KEY);
};

const parseJsonFromText = (text) => {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }

    return null;
  }
};

const generateWithOpenAi = async ({ systemPrompt, userPrompt, temperature }) => {
  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorBody}`);
  }

  const payload = await response.json();
  return payload?.choices?.[0]?.message?.content || '';
};

const generateWithGoogle = async ({ systemPrompt, userPrompt, temperature }) => {
  const rawKey = process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.trim() : '';
  const normalizedModel = GOOGLE_MODEL.startsWith('models/') ? GOOGLE_MODEL.slice(7) : GOOGLE_MODEL;
  const endpoint = `${GOOGLE_BASE_URL}/models/${normalizedModel}:generateContent?key=${encodeURIComponent(rawKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\n${userPrompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google LLM request failed: ${response.status} ${errorBody}`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
};

const generateStructuredResponse = async ({ systemPrompt, userPrompt, temperature = 0.2 }) => {
  if (!isLlmConfigured()) {
    throw new Error('LLM API key is not configured');
  }

  const provider = getProvider();
  const content = provider === 'google'
    ? await generateWithGoogle({ systemPrompt, userPrompt, temperature })
    : await generateWithOpenAi({ systemPrompt, userPrompt, temperature });

  const parsed = parseJsonFromText(content);
  if (!parsed) {
    throw new Error('LLM returned invalid JSON response');
  }

  return parsed;
};

module.exports = {
  getProvider,
  isLlmConfigured,
  generateStructuredResponse
};
