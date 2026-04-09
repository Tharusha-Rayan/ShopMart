const mongoose = require('mongoose');
require('dotenv').config();

const Review = require('../../models/Review');
const { analyzeReviewSentiment } = require('../services/sentimentService');

const labelFromRating = (rating) => {
  if (rating >= 4) return 'positive';
  if (rating <= 2) return 'negative';
  return 'neutral';
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const reviews = await Review.find({}, { title: 1, comment: 1, rating: 1 }).lean();

  if (reviews.length === 0) {
    console.log('No reviews found for sentiment evaluation.');
    await mongoose.connection.close();
    return;
  }

  const labels = ['positive', 'neutral', 'negative'];
  const confusion = {
    positive: { positive: 0, neutral: 0, negative: 0 },
    neutral: { positive: 0, neutral: 0, negative: 0 },
    negative: { positive: 0, neutral: 0, negative: 0 }
  };

  for (const review of reviews) {
    const predicted = analyzeReviewSentiment(review).label;
    const actual = labelFromRating(review.rating || 0);
    confusion[actual][predicted] += 1;
  }

  const metrics = {};
  let macroF1Sum = 0;

  for (const label of labels) {
    const tp = confusion[label][label];
    const fp = labels.filter((l) => l !== label).reduce((sum, l) => sum + confusion[l][label], 0);
    const fn = labels.filter((l) => l !== label).reduce((sum, l) => sum + confusion[label][l], 0);

    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

    metrics[label] = {
      precision: Number(precision.toFixed(4)),
      recall: Number(recall.toFixed(4)),
      f1: Number(f1.toFixed(4))
    };

    macroF1Sum += f1;
  }

  const macroF1 = macroF1Sum / labels.length;

  console.log('Sentiment Evaluation (rating-derived labels as baseline)');
  console.log('Confusion Matrix:', JSON.stringify(confusion, null, 2));
  console.log('Class Metrics:', JSON.stringify(metrics, null, 2));
  console.log('Macro F1:', Number(macroF1.toFixed(4)));

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Sentiment evaluation failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
