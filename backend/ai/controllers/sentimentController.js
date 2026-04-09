const mongoose = require('mongoose');
const {
  recomputeReviewSentiment,
  getSentimentSummary
} = require('../services/sentimentService');

exports.recomputeSentiment = async (req, res, next) => {
  try {
    const { productId } = req.body || {};

    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid productId'
      });
    }

    const result = await recomputeReviewSentiment({ productId });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const { productId, sellerId } = req.query;

    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid productId'
      });
    }

    if (sellerId && !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sellerId'
      });
    }

    let effectiveSellerId = sellerId || null;

    if (req.user?.role === 'seller') {
      effectiveSellerId = req.user.id;
    }

    const summary = await getSentimentSummary({
      sellerId: effectiveSellerId,
      productId
    });

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    return next(error);
  }
};
