const express = require('express');
const router = express.Router();
const { getSellerStats, getSellerProducts, getSellerOrders } = require('../controllers/combinedController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('seller', 'admin'));

router.get('/stats', getSellerStats);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);

module.exports = router;
