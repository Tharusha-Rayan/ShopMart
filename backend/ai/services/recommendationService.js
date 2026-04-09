const Product = require('../../models/Product');
const AiEvent = require('../models/AiEvent');

const EVENT_WEIGHTS = {
  product_view: 1,
  add_to_cart: 3,
  purchase: 5
};

const normalizeLimit = (rawLimit) => {
  const parsed = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return 10;
  return Math.min(parsed, 30);
};

const buildUserProductScores = async ({ userId, sessionId }) => {
  const filter = { eventType: { $in: Object.keys(EVENT_WEIGHTS) } };

  if (userId) {
    filter.user = userId;
  } else if (sessionId) {
    filter.sessionId = sessionId;
  } else {
    return new Map();
  }

  const events = await AiEvent.find(filter, { eventType: 1, payload: 1 })
    .sort({ createdAt: -1 })
    .limit(600)
    .lean();

  const productScores = new Map();

  for (const event of events) {
    const productId = event.payload?.productId ? event.payload.productId.toString() : null;
    if (!productId) continue;

    const current = productScores.get(productId) || 0;
    const increment = EVENT_WEIGHTS[event.eventType] || 0;
    productScores.set(productId, current + increment);
  }

  return productScores;
};

const buildCategoryAffinity = async (productScores) => {
  if (productScores.size === 0) {
    return new Map();
  }

  const products = await Product.find(
    { _id: { $in: [...productScores.keys()] } },
    { category: 1 }
  ).lean();

  const categoryAffinity = new Map();
  for (const product of products) {
    const categoryId = product.category ? product.category.toString() : null;
    if (!categoryId) continue;

    const score = productScores.get(product._id.toString()) || 0;
    categoryAffinity.set(categoryId, (categoryAffinity.get(categoryId) || 0) + score);
  }

  return categoryAffinity;
};

const scoreCandidate = ({ candidate, targetProduct, userProductScores, categoryAffinity, popularityMap }) => {
  const productId = candidate._id.toString();
  let score = 0;

  score += (popularityMap.get(productId) || 0) * 0.8;
  score += Math.min((candidate.rating || 0) * 1.5, 7.5);
  score += Math.log10((candidate.sold || 0) + 1) * 1.2;

  const categoryId = candidate.category ? candidate.category.toString() : null;
  if (categoryId && categoryAffinity.has(categoryId)) {
    score += Math.min(categoryAffinity.get(categoryId) * 0.9, 20);
  }

  if (targetProduct) {nnn
    const targetCategory = targetProduct.category ? targetProduct.category.toString() : null;
    if (targetCategory && categoryId && targetCategory === categoryId) {
      score += 10;
    }

    const targetTags = new Set((targetProduct.tags || []).map((tag) => tag.toLowerCase()));
    const candidateTags = (candidate.tags || []).map((tag) => tag.toLowerCase());
    const tagOverlap = candidateTags.filter((tag) => targetTags.has(tag)).length;
    score += tagOverlap * 2;

    if (targetProduct.price && candidate.price) {
      const maxPrice = Math.max(targetProduct.price, candidate.price, 1);
      const priceDistance = Math.abs(targetProduct.price - candidate.price) / maxPrice;
      score += Math.max(0, (1 - priceDistance) * 4);
    }
  }

  if (userProductScores.has(productId)) {
    score -= 6;
  }

  return Number(score.toFixed(4));
};

const getPopularityMap = async () => {
  const rows = await AiEvent.aggregate([
    { $match: { eventType: { $in: Object.keys(EVENT_WEIGHTS) }, 'payload.productId': { $ne: null } } },
    {
      $group: {
        _id: '$payload.productId',
        weightedScore: {
          $sum: {
            $switch: {
              branches: [
                { case: { $eq: ['$eventType', 'purchase'] }, then: EVENT_WEIGHTS.purchase },
                { case: { $eq: ['$eventType', 'add_to_cart'] }, then: EVENT_WEIGHTS.add_to_cart },
                { case: { $eq: ['$eventType', 'product_view'] }, then: EVENT_WEIGHTS.product_view }
              ],
              default: 0
            }
          }
        }
      }
    }
  ]);

  const popularityMap = new Map();
  for (const row of rows) {
    if (row._id) {
      popularityMap.set(row._id.toString(), row.weightedScore || 0);
    }
  }

  return popularityMap;
};

const getRecommendations = async ({ userId, sessionId, productId, limit: rawLimit }) => {
  const limit = normalizeLimit(rawLimit);

  const [userProductScores, popularityMap] = await Promise.all([
    buildUserProductScores({ userId, sessionId }),
    getPopularityMap()
  ]);

  const categoryAffinity = await buildCategoryAffinity(userProductScores);

  let targetProduct = null;
  if (productId) {
    targetProduct = await Product.findById(productId, { category: 1, price: 1, tags: 1 }).lean();
  }

  const query = { status: 'active', stock: { $gt: 0 } };
  if (productId) {
    query._id = { $ne: productId };
  }

  const candidates = await Product.find(
    query,
    {
      name: 1,
      price: 1,
      images: 1,
      rating: 1,
      sold: 1,
      category: 1,
      tags: 1,
      seller: 1
    }
  )
    .populate('category', 'name slug')
    .populate('seller', 'name')
    .limit(600)
    .lean();

  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate({
        candidate,
        targetProduct,
        userProductScores,
        categoryAffinity,
        popularityMap
      })
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
};

module.exports = {
  getRecommendations
};
