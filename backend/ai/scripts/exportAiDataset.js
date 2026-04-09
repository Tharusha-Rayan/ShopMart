const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const AiEvent = require('../models/AiEvent');

const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const INTERACTIONS_FILE = path.join(OUTPUT_DIR, 'interactions.csv');
const SEARCH_QUERIES_FILE = path.join(OUTPUT_DIR, 'search_queries.jsonl');

const ensureOutputDir = () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
};

const toCsvRow = (values) => values.map((value) => {
  const text = String(value ?? '');
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}).join(',');

const exportInteractionsCsv = async () => {
  const rows = await AiEvent.find(
    { eventType: { $in: ['product_view', 'add_to_cart', 'purchase'] } },
    { user: 1, sessionId: 1, eventType: 1, payload: 1, createdAt: 1 }
  )
    .sort({ createdAt: 1 })
    .lean();

  const header = toCsvRow(['userId', 'sessionId', 'eventType', 'productId', 'quantity', 'price', 'timestamp']);
  const lines = rows.map((row) => toCsvRow([
    row.user ? row.user.toString() : '',
    row.sessionId || '',
    row.eventType || '',
    row.payload?.productId ? row.payload.productId.toString() : '',
    row.payload?.quantity ?? '',
    row.payload?.price ?? '',
    row.createdAt ? new Date(row.createdAt).toISOString() : ''
  ]));

  fs.writeFileSync(INTERACTIONS_FILE, [header, ...lines].join('\n'), 'utf8');
  return rows.length;
};

const exportSearchQueriesJsonl = async () => {
  const rows = await AiEvent.find(
    { eventType: 'search', 'payload.query': { $exists: true, $ne: null } },
    { user: 1, sessionId: 1, payload: 1, metadata: 1, createdAt: 1 }
  )
    .sort({ createdAt: 1 })
    .lean();

  const lines = rows.map((row) => JSON.stringify({
    userId: row.user ? row.user.toString() : null,
    sessionId: row.sessionId || null,
    query: row.payload?.query || '',
    page: row.metadata?.page || null,
    timestamp: row.createdAt ? new Date(row.createdAt).toISOString() : null
  }));

  fs.writeFileSync(SEARCH_QUERIES_FILE, lines.join('\n'), 'utf8');
  return rows.length;
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  ensureOutputDir();

  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2
  });

  const interactionsCount = await exportInteractionsCsv();
  const searchCount = await exportSearchQueriesJsonl();

  console.log(`Export complete: ${interactionsCount} interaction rows, ${searchCount} search rows`);
  console.log(`Files:\n- ${INTERACTIONS_FILE}\n- ${SEARCH_QUERIES_FILE}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('AI dataset export failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
