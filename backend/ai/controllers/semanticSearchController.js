const mongoose = require('mongoose');
const { semanticSearchProducts } = require('../services/semanticSearchService');

exports.searchSemantic = async (req, res, next) => {
  try {
    const { q, limit, categoryId } = req.query;

    if (!q || !String(q).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter q is required'
      });
    }

    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid categoryId'
      });
    }

    const results = await semanticSearchProducts({
      query: q,
      limit,
      categoryId
    });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return next(error);
  }
};
