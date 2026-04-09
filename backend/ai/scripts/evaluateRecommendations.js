const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('../../models/Order');
const { getRecommendations } = require('../services/recommendationService');

const K = 10;

const precisionAtK = (recommendedIds, relevantIds, k) => {
  const recommendedTopK = recommendedIds.slice(0, k);
  if (recommendedTopK.length === 0) return 0;

  const relevantSet = new Set(relevantIds);
  const hitCount = recommendedTopK.filter((id) => relevantSet.has(id)).length;
  return hitCount / recommendedTopK.length;
};

const recallAtK = (recommendedIds, relevantIds, k) => {
  if (!relevantIds.length) return 0;

  const recommendedTopK = recommendedIds.slice(0, k);
  const relevantSet = new Set(relevantIds);
  const hitCount = recommendedTopK.filter((id) => relevantSet.has(id)).length;
  return hitCount / relevantIds.length;
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const orders = await Order.find({}, { user: 1, items: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .lean();

  const userPurchases = new Map();
  for (const order of orders) {
    const userId = order.user?.toString();
    if (!userId) continue;

    if (!userPurchases.has(userId)) {
      userPurchases.set(userId, []);
    }

    for (const item of order.items || []) {
      if (item.product) {
        userPurchases.get(userId).push(item.product.toString());
      }
    }
  }

  const eligibleUsers = [...userPurchases.entries()].filter(([, products]) => products.length >= 2);

  if (eligibleUsers.length === 0) {
    console.log('Not enough purchase data to evaluate recommendations.');
    await mongoose.connection.close();
    return;
  }

  let precisionSum = 0;
  let recallSum = 0;
  let evaluatedUsers = 0;

  for (const [userId, productHistory] of eligibleUsers) {
    const uniqueProducts = [...new Set(productHistory)];
    const relevantProducts = uniqueProducts.slice(0, Math.min(3, uniqueProducts.length));

    const recommendations = await getRecommendations({ userId, limit: K });
    const recommendedIds = recommendations.map((item) => item._id.toString());

    const pAtK = precisionAtK(recommendedIds, relevantProducts, K);
    const rAtK = recallAtK(recommendedIds, relevantProducts, K);

    precisionSum += pAtK;
    recallSum += rAtK;
    evaluatedUsers += 1;
  }

  const avgPrecision = precisionSum / evaluatedUsers;
  const avgRecall = recallSum / evaluatedUsers;

  console.log('Recommendation Offline Evaluation');
  console.log(`Users Evaluated: ${evaluatedUsers}`);
  console.log(`Precision@${K}: ${avgPrecision.toFixed(4)}`);
  console.log(`Recall@${K}: ${avgRecall.toFixed(4)}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Recommendation evaluation failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
