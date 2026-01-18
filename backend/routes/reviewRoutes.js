const express = require('express');
const router = express.Router();
const { createReview, getProductReviews } = require('../controllers/combinedController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
