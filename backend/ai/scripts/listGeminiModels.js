require('dotenv').config();

const run = async () => {
  const key = process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.trim() : '';
  const base = (process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');

  if (!key) {
    throw new Error('GOOGLE_AI_API_KEY is missing');
  }

  const response = await fetch(`${base}/models?key=${encodeURIComponent(key)}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(payload));
  }

  const models = (payload.models || [])
    .filter((model) => (model.supportedGenerationMethods || []).includes('generateContent'))
    .map((model) => model.name);

  console.log('GENERATE_CONTENT_MODELS');
  console.log(JSON.stringify(models, null, 2));
};

run().catch((error) => {
  console.error('LIST_MODELS_ERROR:', error.message);
  process.exit(1);
});
