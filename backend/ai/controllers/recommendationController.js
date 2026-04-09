const mongoose = require('mongoose');
const { getRecommendations } = require('../services/recommendationService');

exports.getRecommendations = async (req, res, next) => {
  try {
    const { productId, sessionId, limit } = req.query;

    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid productId'
      });
    }

    const recommendations = await getRecommendations({
      userId: req.user?.id,
      sessionId,
      productId,
      limit
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    return next(error);
  }
};
