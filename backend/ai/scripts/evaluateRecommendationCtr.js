const mongoose = require('mongoose');
require('dotenv').config();

const AiEvent = require('../models/AiEvent');

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const recommendationViews = await AiEvent.find(
    {
      eventType: 'product_view',
      'metadata.placement': 'home_recommendations',
      'payload.productId': { $ne: null }
    },
    { user: 1, sessionId: 1, payload: 1, createdAt: 1 }
  ).lean();

  const purchaseEvents = await AiEvent.find(
    {
      eventType: 'purchase',
      'payload.productId': { $ne: null }
    },
    { user: 1, sessionId: 1, payload: 1, createdAt: 1 }
  ).lean();

  const purchaseIndex = new Map();
  for (const purchase of purchaseEvents) {
    const key = `${purchase.user ? purchase.user.toString() : ''}|${purchase.sessionId || ''}|${purchase.payload.productId.toString()}`;
    if (!purchaseIndex.has(key)) {
      purchaseIndex.set(key, []);
    }
    purchaseIndex.get(key).push(new Date(purchase.createdAt).getTime());
  }

  const totalImpressions = recommendationViews.length;
  const uniqueClicks = new Set(
    recommendationViews.map((row) =>
      `${row.user ? row.user.toString() : ''}|${row.sessionId || ''}|${row.payload.productId.toString()}`
    )
  ).size;

  let conversions = 0;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  for (const view of recommendationViews) {
    const key = `${view.user ? view.user.toString() : ''}|${view.sessionId || ''}|${view.payload.productId.toString()}`;
    const purchaseTimes = purchaseIndex.get(key) || [];
    const viewTime = new Date(view.createdAt).getTime();

    const converted = purchaseTimes.some((purchaseTime) => purchaseTime >= viewTime && purchaseTime - viewTime <= sevenDaysMs);
    if (converted) {
      conversions += 1;
    }
  }

  const ctr = totalImpressions === 0 ? 0 : uniqueClicks / totalImpressions;
  const conversionRate = totalImpressions === 0 ? 0 : conversions / totalImpressions;

  console.log('Recommendation Analytics');
  console.log(`Total recommendation impressions: ${totalImpressions}`);
  console.log(`Unique clicks: ${uniqueClicks}`);
  console.log(`CTR: ${ctr.toFixed(4)}`);
  console.log(`Conversion within 7d: ${conversions}`);
  console.log(`Conversion Rate: ${conversionRate.toFixed(4)}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Recommendation CTR evaluation failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
