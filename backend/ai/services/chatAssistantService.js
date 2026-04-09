const fs = require('fs');
const path = require('path');
const Order = require('../../models/Order');
const AiChatLog = require('../models/AiChatLog');
const { semanticSearchProducts } = require('./semanticSearchService');
const { isLlmConfigured, generateStructuredResponse } = require('./llmClient');

const ALLOWED_INTENTS = new Set(['greeting', 'product_search', 'order_tracking', 'return_policy', 'shipping_info', 'fallback']);

const HELP_KB_PATH = path.join(__dirname, '..', 'data', 'help_knowledge_base.json');

let helpKnowledgeBaseCache = null;

const loadHelpKnowledgeBase = () => {
  if (helpKnowledgeBaseCache) {
    return helpKnowledgeBaseCache;
  }

  try {
    const raw = fs.readFileSync(HELP_KB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    helpKnowledgeBaseCache = Array.isArray(parsed) ? parsed : [];
  } catch {
    helpKnowledgeBaseCache = [];
  }

  return helpKnowledgeBaseCache;
};

const tokenize = (text = '') =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const tokenOverlapScore = (query, content) => {
  const qTokens = new Set(tokenize(query));
  const cTokens = new Set(tokenize(content));
  if (qTokens.size === 0 || cTokens.size === 0) return 0;

  let overlap = 0;
  for (const token of qTokens) {
    if (cTokens.has(token)) overlap += 1;
  }

  return overlap / qTokens.size;
};

const detectIntent = (message = '') => {
  const text = message.toLowerCase();

  if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) {
    return { intent: 'greeting', confidence: 0.95 };
  }

  if (/\b(track|status|where.*order|my order|delivery)\b/.test(text)) {
    return { intent: 'order_tracking', confidence: 0.9 };
  }

  if (/\b(return|refund|exchange|cancel)\b/.test(text)) {
    return { intent: 'return_policy', confidence: 0.88 };
  }

  if (/\b(ship|shipping|delivery time|arrive)\b/.test(text)) {
    return { intent: 'shipping_info', confidence: 0.85 };
  }

  if (/\b(find|search|recommend|suggest|looking for|show me|need)\b/.test(text)) {
    return { intent: 'product_search', confidence: 0.8 };
  }

  return { intent: 'fallback', confidence: 0.35 };
};

const getRelevantHelpSnippets = (query, limit = 3) => {
  const kb = loadHelpKnowledgeBase();
  return kb
    .map((entry) => ({
      ...entry,
      score: tokenOverlapScore(query, `${entry.title} ${entry.content}`)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

const getRecentOrdersForContext = async (userId) => {
  if (!userId) return [];

  const orders = await Order.find(
    { user: userId },
    { status: 1, total: 1, createdAt: 1, items: 1 }
  )
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return orders;
};

const buildRagContext = async ({ message, userId }) => {
  const [products, orders] = await Promise.all([
    semanticSearchProducts({ query: message, limit: 5 }),
    getRecentOrdersForContext(userId)
  ]);

  const helpSnippets = getRelevantHelpSnippets(message, 3);

  const productsContext = products.length
    ? products
        .map((product, index) => `${index + 1}. ${product.name} | $${Number(product.price || 0).toFixed(2)} | rating: ${Number(product.rating || 0).toFixed(1)} | stock: ${product.stock ?? 'n/a'}`)
        .join('\n')
    : 'No highly relevant products found.';

  const ordersContext = orders.length
    ? orders
        .map((order, index) => `${index + 1}. Order ${order._id.toString().slice(-8)} | status: ${order.status} | total: $${Number(order.total || 0).toFixed(2)} | created: ${new Date(order.createdAt).toISOString()}`)
        .join('\n')
    : 'No user orders available.';

  const helpContext = helpSnippets.length
    ? helpSnippets
        .map((entry, index) => `${index + 1}. ${entry.title}: ${entry.content}`)
        .join('\n')
    : 'No matching help snippets found.';

  return {
    products,
    contextText: [
      '=== Product Context ===',
      productsContext,
      '',
      '=== Order Context ===',
      ordersContext,
      '',
      '=== Help Context ===',
      helpContext
    ].join('\n')
  };
};

const normalizeIntent = (intent, fallbackIntent) => (ALLOWED_INTENTS.has(intent) ? intent : fallbackIntent);

const toSuggestions = (rawSuggestions) => {
  if (!Array.isArray(rawSuggestions)) return [];
  return rawSuggestions
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 4);
};

const getRagResponse = async ({ message, userId, detectedIntent }) => {
  const ragContext = await buildRagContext({ message, userId });

  const systemPrompt = [
    'You are SmartShop Assistant for an e-commerce platform.',
    'Answer only using provided context where possible.',
    'If context is insufficient, be transparent and provide safe next steps.',
    'Return STRICT JSON with keys: intent, confidence, text, suggestions, unresolved.',
    'intent must be one of: greeting, product_search, order_tracking, return_policy, shipping_info, fallback.',
    'confidence must be a number from 0 to 1.',
    'suggestions must be an array of short actionable strings.'
  ].join(' ');

  const userPrompt = [
    `User message: ${message}`,
    `Detected intent hint: ${detectedIntent}`,
    '',
    'Retrieved context:',
    ragContext.contextText
  ].join('\n');

  const llmResult = await generateStructuredResponse({
    systemPrompt,
    userPrompt,
    temperature: 0.2
  });

  const intent = normalizeIntent(llmResult.intent, detectedIntent);
  const confidence = Number.isFinite(Number(llmResult.confidence))
    ? Math.max(0, Math.min(1, Number(llmResult.confidence)))
    : 0.5;

  const text = String(llmResult.text || 'Sorry, I could not determine the best answer right now.');
  const suggestions = toSuggestions(llmResult.suggestions);
  const unresolved = Boolean(llmResult.unresolved) || confidence < 0.6;

  return {
    intent,
    confidence: Number(confidence.toFixed(3)),
    text,
    suggestions,
    unresolved,
    source: 'llm_rag'
  };
};

const getOrderTrackingReply = async ({ userId }) => {
  if (!userId) {
    return {
      text: 'Please sign in first so I can show your latest order status.',
      suggestions: ['Login and open My Orders', 'Track order by order ID']
    };
  }

  const recentOrders = await Order.find({ user: userId }, { status: 1, total: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  if (recentOrders.length === 0) {
    return {
      text: 'I could not find any orders yet. Once you place an order, I can track it here.',
      suggestions: ['Browse products', 'View today deals']
    };
  }

  const lines = recentOrders.map((order, index) =>
    `${index + 1}. Order ${order._id.toString().slice(-8)} - ${order.status} - $${Number(order.total || 0).toFixed(2)}`
  );

  return {
    text: `Here are your latest orders:\n${lines.join('\n')}`,
    suggestions: ['Open Orders page', 'Ask about return policy']
  };
};

const getProductSearchReply = async ({ message }) => {
  const products = await semanticSearchProducts({ query: message, limit: 4 });

  if (products.length === 0) {
    return {
      text: 'I could not find a close match. Try adding a product type, brand, or category.',
      suggestions: ['Search: wireless earbuds', 'Search: office chair']
    };
  }

  const lines = products.map((product, index) =>
    `${index + 1}. ${product.name} - $${Number(product.price || 0).toFixed(2)} (score ${product.semanticScore})`
  );

  return {
    text: `Top matches:\n${lines.join('\n')}`,
    suggestions: ['Show more like #1', 'Filter by lower price']
  };
};

const getReturnPolicyReply = () => ({
  text: 'You can request a return from your order details page. Add a reason and proof image. Sellers review requests and refunds are processed after item receipt.',
  suggestions: ['Open My Orders', 'How long does approval take?']
});

const getShippingInfoReply = () => ({
  text: 'Delivery time depends on seller location and courier. Track live status in Orders: pending, processing, shipped, and delivered.',
  suggestions: ['Track my latest order', 'What is out for delivery?']
});

const getGreetingReply = () => ({
  text: 'Hi! I can help you find products, track orders, and explain returns.',
  suggestions: ['Find running shoes', 'Track my order', 'Return policy']
});

const getFallbackReply = () => ({
  text: 'I am not fully sure about that yet. I can help with product search, order tracking, shipping, and returns.',
  suggestions: ['Find gaming mouse', 'Track my order', 'How to return a product?']
});

const logConversation = async ({ userId, sessionId, query, intent, confidence, responseText, unresolved }) => {
  await AiChatLog.create({
    user: userId || null,
    sessionId: sessionId || null,
    query,
    intent,
    confidence,
    responsePreview: responseText?.slice(0, 300) || null,
    unresolved
  });
};

const askAssistant = async ({ message, userId, sessionId }) => {
  const trimmedMessage = String(message || '').trim();
  const { intent, confidence } = detectIntent(trimmedMessage);

  if (isLlmConfigured()) {
    try {
      const ragResponse = await getRagResponse({
        message: trimmedMessage,
        userId,
        detectedIntent: intent
      });

      await logConversation({
        userId,
        sessionId,
        query: trimmedMessage,
        intent: ragResponse.intent,
        confidence: ragResponse.confidence,
        responseText: ragResponse.text,
        unresolved: ragResponse.unresolved
      });

      return ragResponse;
    } catch {
      // Falls back to deterministic assistant below
    }
  }

  let response;
  if (intent === 'greeting') response = getGreetingReply();
  else if (intent === 'order_tracking') response = await getOrderTrackingReply({ userId });
  else if (intent === 'return_policy') response = getReturnPolicyReply();
  else if (intent === 'shipping_info') response = getShippingInfoReply();
  else if (intent === 'product_search') response = await getProductSearchReply({ message: trimmedMessage });
  else response = getFallbackReply();

  const unresolved = intent === 'fallback' || confidence < 0.6;

  await logConversation({
    userId,
    sessionId,
    query: trimmedMessage,
    intent,
    confidence,
    responseText: response.text,
    unresolved
  });

  return {
    intent,
    confidence,
    unresolved,
    source: 'deterministic_fallback',
    ...response
  };
};

module.exports = {
  askAssistant
};
