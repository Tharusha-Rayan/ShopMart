const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../../models/Product');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'product_embeddings.json');
const STOP_WORDS = new Set(['a', 'an', 'the', 'for', 'with', 'in', 'on', 'to', 'and', 'or', 'of']);

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word));

const buildTfIdfEmbeddings = (products) => {
  const documents = products.map((product) => {
    const tokens = [
      ...tokenize(product.name),
      ...tokenize(product.description),
      ...(product.tags || []).flatMap((tag) => tokenize(tag))
    ];
    return {
      productId: product._id.toString(),
      tokens
    };
  });

  const docCount = documents.length;
  const df = new Map();

  for (const doc of documents) {
    const uniqueTokens = new Set(doc.tokens);
    for (const token of uniqueTokens) {
      df.set(token, (df.get(token) || 0) + 1);
    }
  }

  return documents.map((doc) => {
    const tf = new Map();
    for (const token of doc.tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    const embedding = {};
    for (const [token, count] of tf.entries()) {
      const termFrequency = count / Math.max(doc.tokens.length, 1);
      const inverseDocFrequency = Math.log((docCount + 1) / ((df.get(token) || 0) + 1)) + 1;
      embedding[token] = Number((termFrequency * inverseDocFrequency).toFixed(6));
    }

    return {
      productId: doc.productId,
      embedding
    };
  });
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const products = await Product.find(
    { status: 'active' },
    { name: 1, description: 1, tags: 1 }
  ).lean();

  const embeddings = buildTfIdfEmbeddings(products);

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalProducts: embeddings.length,
        embeddings
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`Embeddings generated for ${embeddings.length} products`);
  console.log(`Output: ${OUTPUT_FILE}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Embedding build failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
