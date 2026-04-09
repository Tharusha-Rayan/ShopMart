const Review = require('../../models/Review');
const Product = require('../../models/Product');

const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'love', 'fast', 'quality', 'perfect', 'nice', 'recommended', 'best', 'happy', 'satisfied', 'awesome', 'worth'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'poor', 'worst', 'slow', 'broken', 'hate', 'terrible', 'disappointed', 'refund', 'late', 'fake', 'defective', 'awful', 'problem', 'waste'
]);

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const analyzeReviewSentiment = ({ title, comment, rating }) => {
  const tokens = [...tokenize(title), ...tokenize(comment)];

  let positiveHits = 0;
  let negativeHits = 0;

  for (const token of tokens) {
    if (POSITIVE_WORDS.has(token)) positiveHits += 1;
    if (NEGATIVE_WORDS.has(token)) negativeHits += 1;
  }

  const lexicalScore = positiveHits - negativeHits;
  const ratingScore = Number(rating || 0) - 3;
  const rawScore = lexicalScore + ratingScore;
  const normalized = clamp(rawScore / 6, -1, 1);

  let label = 'neutral';
  if (normalized > 0.2) label = 'positive';
  if (normalized < -0.2) label = 'negative';

  return {
    score: Number(normalized.toFixed(4)),
    label,
    stats: {
      positiveHits,
      negativeHits
    }
  };
};

const recomputeReviewSentiment = async ({ productId } = {}) => {
  const filter = {};
  if (productId) {
    filter.product = productId;
  }

  const reviews = await Review.find(filter, { title: 1, comment: 1, rating: 1 }).lean();

  if (reviews.length === 0) {
    return {
      updated: 0,
      total: 0
    };
  }

  const bulkOps = reviews.map((review) => {
    const sentiment = analyzeReviewSentiment(review);
    return {
      updateOne: {
        filter: { _id: review._id },
        update: {
          $set: {
            sentimentLabel: sentiment.label,
            sentimentScore: sentiment.score,
            sentimentUpdatedAt: new Date()
          }
        }
      }
    };
  });

  await Review.bulkWrite(bulkOps, { ordered: false });

  return {
    updated: bulkOps.length,
    total: reviews.length
  };
};

const getSentimentSummary = async ({ sellerId, productId }) => {
  const reviewMatch = {};
  if (productId) {
    reviewMatch.product = productId;
  }

  if (sellerId) {
    const sellerProducts = await Product.find({ seller: sellerId }, { _id: 1 }).lean();
    reviewMatch.product = { $in: sellerProducts.map((item) => item._id) };
  }

  const pipeline = [
    { $match: reviewMatch },
    {
      $group: {
        _id: '$sentimentLabel',
        count: { $sum: 1 },
        avgScore: { $avg: '$sentimentScore' },
        avgRating: { $avg: '$rating' }
      }
    }
  ];

  const grouped = await Review.aggregate(pipeline);

  const summary = {
    positive: { count: 0, avgScore: 0 },
    neutral: { count: 0, avgScore: 0 },
    negative: { count: 0, avgScore: 0 },
    totalReviews: 0,
    overallAvgScore: 0,
    overallAvgRating: 0
  };

  let weightedScoreSum = 0;
  let weightedRatingSum = 0;

  for (const row of grouped) {
    const label = row._id || 'neutral';
    const count = row.count || 0;
    const avgScore = Number((row.avgScore || 0).toFixed(4));

    if (!summary[label]) {
      summary[label] = { count: 0, avgScore: 0 };
    }

    summary[label] = { count, avgScore };
    summary.totalReviews += count;
    weightedScoreSum += (row.avgScore || 0) * count;
    weightedRatingSum += (row.avgRating || 0) * count;
  }

  if (summary.totalReviews > 0) {
    summary.overallAvgScore = Number((weightedScoreSum / summary.totalReviews).toFixed(4));
    summary.overallAvgRating = Number((weightedRatingSum / summary.totalReviews).toFixed(2));
  }

  return summary;
};

module.exports = {
  analyzeReviewSentiment,
  recomputeReviewSentiment,
  getSentimentSummary
};
