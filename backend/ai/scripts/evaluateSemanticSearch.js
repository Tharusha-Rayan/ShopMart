const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../../models/Product');
const { semanticSearchProducts } = require('../services/semanticSearchService');

const LABELS_FILE = path.join(__dirname, '..', 'data', 'search_quality_labels.json');
const K = 10;

const precisionAtK = (recommendedIds, relevantIds, k) => {
  const top = recommendedIds.slice(0, k);
  if (!top.length) return 0;

  const relevant = new Set(relevantIds);
  const hits = top.filter((id) => relevant.has(id)).length;
  return hits / top.length;
};

const keywordSearchIds = async (query) => {
  const products = await Product.find(
    { status: 'active', $text: { $search: query } },
    { _id: 1 },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(K)
    .lean();

  return products.map((item) => item._id.toString());
};

const loadLabels = () => {
  if (!fs.existsSync(LABELS_FILE)) {
    throw new Error(`Label file not found at ${LABELS_FILE}. Create it from search_quality_labels.sample.json`);
  }

  const content = fs.readFileSync(LABELS_FILE, 'utf8');
  const parsed = JSON.parse(content);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Label file must be a non-empty array');
  }

  return parsed;
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  const labels = loadLabels();
  await mongoose.connect(process.env.MONGODB_URI);

  let semanticPrecisionSum = 0;
  let keywordPrecisionSum = 0;

  for (const row of labels) {
    const semantic = await semanticSearchProducts({ query: row.query, limit: K });
    const semanticIds = semantic.map((item) => item._id.toString());
    const keywordIds = await keywordSearchIds(row.query);

    semanticPrecisionSum += precisionAtK(semanticIds, row.relevantProductIds || [], K);
    keywordPrecisionSum += precisionAtK(keywordIds, row.relevantProductIds || [], K);
  }

  const semanticAvg = semanticPrecisionSum / labels.length;
  const keywordAvg = keywordPrecisionSum / labels.length;

  console.log('Semantic Search Evaluation');
  console.log(`Queries Evaluated: ${labels.length}`);
  console.log(`Semantic Precision@${K}: ${semanticAvg.toFixed(4)}`);
  console.log(`Keyword Precision@${K}: ${keywordAvg.toFixed(4)}`);
  console.log(`Delta: ${(semanticAvg - keywordAvg).toFixed(4)}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Semantic search evaluation failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
